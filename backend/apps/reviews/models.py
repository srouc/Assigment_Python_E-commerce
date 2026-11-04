from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg
from apps.products.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reviewer_name = models.CharField(max_length=120)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_product_stats()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.update_product_stats()

    def update_product_stats(self):
        stats = Review.objects.filter(product=self.product).aggregate(
            avg_rating=Avg('rating'),
            count=models.Count('id')
        )
        avg = stats['avg_rating'] or 5.0
        self.product.rating = round(avg, 2)
        self.product.reviews_count = stats['count'] or 0
        self.product.save(update_fields=['rating', 'reviews_count'])

    def __str__(self):
        return f"{self.rating}★ by {self.reviewer_name} on {self.product.name}"

