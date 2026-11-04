from django.urls import path
from .views import ProductReviewListCreateView, ReviewDetailView

urlpatterns = [
    path('product/<str:product_id>/', ProductReviewListCreateView.as_view(), name='product_reviews'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
]

