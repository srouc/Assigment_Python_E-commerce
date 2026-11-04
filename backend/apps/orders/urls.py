from django.urls import path
from .views import OrderListCreateView, OrderDetailView, AdminOrderListView, AdminOrderUpdateStatusView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('admin/', AdminOrderListView.as_view(), name='admin_order_list'),
    path('admin/<int:pk>/status/', AdminOrderUpdateStatusView.as_view(), name='admin_order_update_status'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order_detail'),
]

