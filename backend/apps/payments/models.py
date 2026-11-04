from django.db import models

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('cod', 'Cash On Delivery (COD)'),
        ('card', 'Credit/Debit Card'),
        ('aba_khqr', 'ABA KHQR / Mobile Banking'),
        ('paypal', 'PayPal'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} for Order {self.order.order_number} ({self.status})"

