from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer
from apps.products.models import Product

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            cart = Cart.objects.create(user=request.user)

        # Check if guest session cart exists to merge
        session_key = request.headers.get('X-Session-Key') or request.session.session_key
        if session_key:
            guest_carts = Cart.objects.filter(session_key=session_key, user__isnull=True)
            for guest_cart in guest_carts:
                for item in guest_cart.items.all():
                    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=item.product)
                    if not created:
                        cart_item.quantity += item.quantity
                    else:
                        cart_item.quantity = item.quantity
                    cart_item.save()
                guest_cart.delete()
        return cart
    else:
        session_key = request.headers.get('X-Session-Key')
        if not session_key:
            if not request.session.session_key:
                request.session.create()
            session_key = request.session.session_key
        cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
        if not cart:
            cart = Cart.objects.create(session_key=session_key)
        return cart

class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id or quantity <= 0:
            return Response({'error': 'Valid product_id and quantity are required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)

        if product.stock_quantity < quantity:
            return Response({'error': f'Only {product.stock_quantity} units available in stock.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            if product.stock_quantity < (cart_item.quantity + quantity):
                return Response({'error': f'Cannot add more. Current in cart: {cart_item.quantity}, Max stock: {product.stock_quantity}.'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'message': f'Added {product.name} to cart', 'cart': serializer.data})

class UpdateCartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request, item_id):
        quantity = int(request.data.get('quantity', 1))
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        if quantity <= 0:
            cart_item.delete()
            message = 'Item removed from cart.'
        else:
            if cart_item.product.stock_quantity < quantity:
                return Response({'error': f'Only {cart_item.product.stock_quantity} units available.'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save()
            message = 'Cart updated.'

        serializer = CartSerializer(cart, context={'request': request})
        return Response({'message': message, 'cart': serializer.data})

class RemoveCartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'message': 'Item removed from cart.', 'cart': serializer.data})

class ClearCartView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'message': 'Cart cleared.', 'cart': serializer.data})

