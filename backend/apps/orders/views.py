from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.cart.views import get_or_create_cart
from apps.coupons.models import Coupon
from apps.payments.models import Payment

class OrderListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required to view orders.'}, status=status.HTTP_401_UNAUTHORIZED)
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = get_or_create_cart(request)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check stock availability
        for item in cart_items:
            if item.product.stock_quantity < item.quantity:
                return Response({
                    'error': f'"{item.product.name}" has only {item.product.stock_quantity} left in stock.'
                }, status=status.HTTP_400_BAD_REQUEST)

        subtotal = cart.subtotal
        shipping_fee = Decimal('0.00') if subtotal >= Decimal('50.00') else Decimal('5.00')
        tax_amount = Decimal('0.00')
        discount_amount = Decimal('0.00')
        coupon_code = data.get('coupon_code', '').strip().upper()

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code)
                is_valid, _ = coupon.is_valid(subtotal)
                if is_valid:
                    discount_amount = coupon.calculate_discount(subtotal)
                    coupon.times_used += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass

        total_amount = max(Decimal('0.00'), subtotal - discount_amount + shipping_fee + tax_amount)

        # Create Order
        user = request.user if request.user.is_authenticated else None
        order = Order.objects.create(
            user=user,
            guest_email=data.get('guest_email', request.user.email if request.user.is_authenticated else ''),
            guest_name=data.get('shipping_name'),
            shipping_name=data['shipping_name'],
            shipping_phone=data['shipping_phone'],
            shipping_address=data['shipping_address'],
            shipping_city=data['shipping_city'],
            shipping_state=data.get('shipping_state', ''),
            shipping_postal_code=data.get('shipping_postal_code', ''),
            shipping_country=data.get('shipping_country', 'Cambodia'),
            payment_method=data.get('payment_method', 'cod'),
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_fee=shipping_fee,
            tax_amount=tax_amount,
            total_amount=total_amount,
            coupon_code=coupon_code or None,
            notes=data.get('notes', '')
        )

        # Create OrderItems and deduct stock
        for item in cart_items:
            product = item.product
            img_url = product.main_image_url
            if product.main_image:
                try:
                    img_url = product.main_image.url
                except Exception:
                    pass

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=img_url,
                price=product.price,
                quantity=item.quantity
            )
            # Deduct stock
            product.stock_quantity = max(0, product.stock_quantity - item.quantity)
            product.save()

        # Create Initial Payment record
        payment_status = 'pending'
        if order.payment_method == 'cod':
            payment_status = 'pending'
        else:
            # Simulated instant payment success for card/ABA
            payment_status = 'completed'
            order.payment_status = 'paid'
            order.save()

        Payment.objects.create(
            order=order,
            payment_method=order.payment_method,
            amount=total_amount,
            status=payment_status,
            transaction_id=f"TXN-{order.order_number}"
        )

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        order_identifier = self.kwargs['order_number']
        if order_identifier.isdigit():
            order = get_object_or_404(Order, id=int(order_identifier))
        else:
            order = get_object_or_404(Order, order_number=order_identifier)
        return order

class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

class AdminOrderUpdateStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get('status')
        new_payment_status = request.data.get('payment_status')

        if new_status:
            order.status = new_status
        if new_payment_status:
            order.payment_status = new_payment_status
            payment = order.payments.first()
            if payment:
                payment.status = 'completed' if new_payment_status == 'paid' else new_payment_status
                payment.save()

        order.save()
        return Response(OrderSerializer(order).data)

