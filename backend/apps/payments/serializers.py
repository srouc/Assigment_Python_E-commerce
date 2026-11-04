from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_method', 'amount', 'status', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProcessPaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)
    card_number = serializers.CharField(required=False, allow_blank=True)
    card_expiry = serializers.CharField(required=False, allow_blank=True)
    card_cvc = serializers.CharField(required=False, allow_blank=True)

