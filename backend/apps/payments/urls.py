from django.urls import path
from .views import ProcessPaymentView, PaymentDetailView

urlpatterns = [
    path('process/', ProcessPaymentView.as_view(), name='process_payment'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment_detail'),
]

