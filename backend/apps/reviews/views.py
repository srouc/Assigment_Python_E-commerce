from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.products.models import Product

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_slug_or_id = self.kwargs['product_id']
        if str(product_slug_or_id).isdigit():
            return Review.objects.filter(product_id=int(product_slug_or_id)).order_by('-created_at')
        return Review.objects.filter(product__slug=product_slug_or_id).order_by('-created_at')

    def perform_create(self, serializer):
        product_slug_or_id = self.kwargs['product_id']
        if str(product_slug_or_id).isdigit():
            product = get_object_or_404(Product, id=int(product_slug_or_id))
        else:
            product = get_object_or_404(Product, slug=product_slug_or_id)

        user = self.request.user if self.request.user.is_authenticated else None
        reviewer_name = self.request.data.get('reviewer_name')
        if not reviewer_name:
            if user:
                reviewer_name = user.name
            else:
                reviewer_name = 'Anonymous Customer'

        serializer.save(product=product, user=user, reviewer_name=reviewer_name)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

