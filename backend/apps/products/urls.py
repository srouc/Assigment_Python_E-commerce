from django.urls import path
from .views import ProductListView, ProductDetailView, ProductByIdView

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list_create'),
    path('id/<int:pk>/', ProductByIdView.as_view(), name='product_detail_by_id'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
]

