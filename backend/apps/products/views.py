from rest_framework import generics, permissions, filters
from django.db.models import Q
from .models import Product, ProductImage
from .serializers import ProductListSerializer, ProductDetailSerializer

class ProductListView(generics.ListCreateAPIView):
    serializer_class = ProductListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Product.objects.select_related('category').prefetch_related('images')
        
        # Admin can view inactive products; public only active
        is_admin_query = self.request.query_params.get('admin', 'false').lower() == 'true'
        if not (self.request.user and self.request.user.is_staff and is_admin_query):
            queryset = queryset.filter(is_active=True)

        # Category filter
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Search filter (name, description, brand, sku)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search) |
                Q(sku__icontains=search)
            )

        # Featured filter
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')

        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Ordering
        sort = self.request.query_params.get('sort', 'newest')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort == 'popular':
            queryset = queryset.order_by('-reviews_count')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH', 'POST']:
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        return Product.objects.all().select_related('category').prefetch_related('images')

    def get_object(self):
        lookup = self.kwargs.get('slug', '')
        if str(lookup).isdigit():
            obj = self.get_queryset().filter(id=int(lookup)).first()
            if obj:
                return obj
        return super().get_object()

class ProductByIdView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    permission_classes = [permissions.AllowAny]

