from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, RemoveCartItemView, ClearCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart_view'),
    path('add/', AddToCartView.as_view(), name='cart_add'),
    path('items/<int:item_id>/', UpdateCartItemView.as_view(), name='cart_update'),
    path('items/<int:item_id>/remove/', RemoveCartItemView.as_view(), name='cart_remove'),
    path('clear/', ClearCartView.as_view(), name='cart_clear'),
]

