from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Payment
from .serializers import PaymentSerializer, ProcessPaymentSerializer
from apps.orders.models import Order
import uuid

class ProcessPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ProcessPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_id = serializer.validated_data['order_id']
        method = serializer.validated_data['payment_method']

        order = get_object_or_404(Order, id=order_id)
        txn_id = f"TXN-{uuid.uuid4().hex[:10].upper()}"

        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={
                'payment_method': method,
                'amount': order.total_amount,
                'status': 'completed' if method != 'cod' else 'pending',
                'transaction_id': txn_id
            }
        )

        if method != 'cod':
            payment.status = 'completed'
            payment.transaction_id = txn_id
            payment.save()
            order.payment_status = 'paid'
            order.status = 'processing'
            order.save()

        return Response({
            'success': True,
            'message': 'Payment processed successfully',
            'payment': PaymentSerializer(payment).data
        })

class PaymentDetailView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]

