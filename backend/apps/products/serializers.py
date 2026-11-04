from rest_framework import serializers
from .models import Product, ProductImage
from apps.categories.serializers import CategorySerializer

class ProductImageSerializer(serializers.ModelSerializer):
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'display_image', 'alt_text']

    def get_display_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    display_image = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'brand', 'short_description', 'price', 'compare_at_price',
            'discount_percentage', 'stock_quantity', 'is_in_stock',
            'sku', 'is_featured', 'is_active', 'rating', 'reviews_count',
            'main_image', 'main_image_url', 'display_image', 'created_at'
        ]

    def get_display_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        return obj.main_image_url or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    display_image = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'brand', 'short_description',
            'description', 'price', 'compare_at_price', 'discount_percentage',
            'stock_quantity', 'is_in_stock', 'sku', 'is_featured',
            'is_active', 'rating', 'reviews_count', 'main_image',
            'main_image_url', 'display_image', 'images', 'created_at', 'updated_at'
        ]

    def get_display_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        return obj.main_image_url or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"

