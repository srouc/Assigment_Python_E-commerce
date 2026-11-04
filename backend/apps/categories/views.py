from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer

class CategoryListView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Category.objects.all().order_by('name')
        return Category.objects.filter(is_active=True).order_by('name')

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Category.objects.all()

