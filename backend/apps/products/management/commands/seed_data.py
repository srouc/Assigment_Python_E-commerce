from django.core.management.base import BaseCommand
from apps.accounts.models import User, Address
from apps.categories.models import Category
from apps.products.models import Product, ProductImage
from apps.coupons.models import Coupon
from apps.reviews.models import Review
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds initial e-commerce data including admin, categories, products, and coupons'

    def handle(self, *args, **options):
        self.stdout.write("Seeding ShopEase database...")

        # 1. Create Superuser / Admin
        admin_user, created = User.objects.get_or_create(
            email='admin@shopease.com',
            defaults={
                'full_name': 'ShopEase Admin',
                'is_staff': True,
                'is_superuser': True,
                'is_admin_user': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created admin: admin@shopease.com / admin123"))

        # Create Demo Customer
        customer, created = User.objects.get_or_create(
            email='customer@shopease.com',
            defaults={
                'full_name': 'Dara Sok',
                'phone_number': '+85512345678'
            }
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            Address.objects.create(
                user=customer,
                full_name='Dara Sok',
                phone_number='+85512345678',
                street_address='#123, St 271, Sangkat Boeung Tumpun',
                city='Phnom Penh',
                state='Phnom Penh',
                postal_code='12000',
                country='Cambodia',
                is_default=True
            )
            self.stdout.write(self.style.SUCCESS("Created customer: customer@shopease.com / customer123"))

        # 2. Categories
        categories_data = [
            {
                'name': 'Electronics',
                'description': 'Latest gadgets, audio gear, smart devices and tech essentials.',
                'image_url': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
                'icon': 'Laptop'
            },
            {
                'name': 'Fashion & Apparel',
                'description': 'Trendy clothing, shoes, bags and stylish everyday wear.',
                'image_url': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
                'icon': 'Shirt'
            },
            {
                'name': 'Home & Living',
                'description': 'Modern furniture, kitchenware, decor and cozy home accessories.',
                'image_url': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop&q=80',
                'icon': 'Home'
            },
            {
                'name': 'Beauty & Health',
                'description': 'Premium skincare, wellness products and personal care.',
                'image_url': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
                'icon': 'Sparkles'
            },
            {
                'name': 'Sports & Fitness',
                'description': 'Workout equipment, athletic wear and outdoor essentials.',
                'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
                'icon': 'Activity'
            }
        ]

        cat_map = {}
        for cdata in categories_data:
            cat, _ = Category.objects.get_or_create(
                name=cdata['name'],
                defaults={
                    'description': cdata['description'],
                    'image_url': cdata['image_url'],
                    'icon': cdata['icon']
                }
            )
            cat_map[cdata['name']] = cat
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(cat_map)} categories"))

        # 3. Products
        products_data = [
            {
                'name': 'Sony WH-1000XM5 Wireless Headphones',
                'category': cat_map['Electronics'],
                'brand': 'Sony',
                'short_description': 'Industry-leading noise canceling with two processors and 8 microphones.',
                'description': 'Experience next-level silence and unmatched sound quality with industry-leading noise cancellation powered by two processors and 8 microphones. Enjoy crystal clear hands-free calling and up to 30 hours of battery life with quick charging capability.',
                'price': Decimal('299.00'),
                'compare_at_price': Decimal('399.00'),
                'stock_quantity': 25,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
                ]
            },
            {
                'name': 'Apple Watch Ultra 2 Titanium GPS',
                'category': cat_map['Electronics'],
                'brand': 'Apple',
                'short_description': 'Rugged, capable 49mm titanium case with precision dual-frequency GPS.',
                'description': 'The most capable and rugged Apple Watch yet. Features a lightweight yet robust titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and the brightest display ever produced on an Apple smartwatch.',
                'price': Decimal('749.00'),
                'compare_at_price': Decimal('799.00'),
                'stock_quantity': 18,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
                ]
            },
            {
                'name': 'Keychron Q1 Pro Wireless Mechanical Keyboard',
                'category': cat_map['Electronics'],
                'brand': 'Keychron',
                'short_description': 'Full aluminum body with hot-swappable tactile switches and RGB backlighting.',
                'description': 'A fully customizable mechanical keyboard with premium double-gasket design, CNC machined aluminum body, screw-in stabilizers, QMK/VIA programmable keys, and wireless Bluetooth 5.1 connection.',
                'price': Decimal('189.00'),
                'compare_at_price': Decimal('210.00'),
                'stock_quantity': 30,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'Vintage Minimalist Leather Backpack',
                'category': cat_map['Fashion & Apparel'],
                'brand': 'UrbanCraft',
                'short_description': 'Handcrafted genuine top-grain leather backpack with dedicated 16" laptop sleeve.',
                'description': 'Constructed from premium full-grain Italian leather, this backpack seamlessly blends heritage vintage aesthetics with modern everyday utility. Features water-resistant canvas lining and reinforced brass hardware.',
                'price': Decimal('119.50'),
                'compare_at_price': Decimal('159.00'),
                'stock_quantity': 40,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'Classic Heavyweight Oversized Cotton Hoodie',
                'category': cat_map['Fashion & Apparel'],
                'brand': 'AestheticWear',
                'short_description': '100% organic French terry cotton with relaxed dropped shoulders.',
                'description': 'Elevate your streetwear style with our signature heavy-gauge 480GSM fleece hoodie. Pre-shrunk for an enduring boxy fit with double-needle ribbed hems and cuffs.',
                'price': Decimal('65.00'),
                'compare_at_price': Decimal('85.00'),
                'stock_quantity': 50,
                'is_featured': False,
                'main_image_url': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'Ergonomic Mesh Executive Chair',
                'category': cat_map['Home & Living'],
                'brand': 'ErgoFlex',
                'short_description': 'Breathable Korean mesh with 4D armrests and dynamic lumbar support.',
                'description': 'Engineered for all-day comfort and healthy posture. Features breathable responsive mesh, adaptive lumbar curve support, synchro-tilt reclining mechanism, and smooth-rolling silent casters.',
                'price': Decimal('260.00'),
                'compare_at_price': Decimal('320.00'),
                'stock_quantity': 15,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1580481077190-7361356d11f1?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'Ceramic Pour-Over Coffee Dripper Set',
                'category': cat_map['Home & Living'],
                'brand': 'BaristaLab',
                'short_description': 'Handcrafted Japanese ceramic dripper with double-walled glass server.',
                'description': 'Brew clean, vibrant artisanal coffee right at home. The spiral ribbed interior guides optimal water flow and extraction for maximum floral aroma and rich flavor body.',
                'price': Decimal('42.00'),
                'compare_at_price': Decimal('55.00'),
                'stock_quantity': 35,
                'is_featured': False,
                'main_image_url': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'HydroBoost Rejuvenating Facial Serum',
                'category': cat_map['Beauty & Health'],
                'brand': 'GlowNatural',
                'short_description': 'Multi-molecular hyaluronic acid combined with vitamin C & niacinamide.',
                'description': 'An ultra-hydrating elixir that penetrates deeply to plump, brighten, and restore tired skin barrier. Dermatologically tested, vegan, fragrance-free, and cruelty-free.',
                'price': Decimal('34.00'),
                'compare_at_price': Decimal('45.00'),
                'stock_quantity': 60,
                'is_featured': True,
                'main_image_url': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            },
            {
                'name': 'Pro Eco-Friendly Non-Slip Yoga Mat',
                'category': cat_map['Sports & Fitness'],
                'brand': 'ZenMotion',
                'short_description': '6mm natural tree rubber with laser-etched alignment system.',
                'description': 'Unrivaled grip whether dry or sweaty. Made with sustainably harvested natural rubber, providing superior joint cushioning and stability for yoga, pilates, and floor routines.',
                'price': Decimal('48.00'),
                'compare_at_price': Decimal('60.00'),
                'stock_quantity': 45,
                'is_featured': False,
                'main_image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
                'gallery': []
            }
        ]

        for pdata in products_data:
            gallery = pdata.pop('gallery', [])
            p, created = Product.objects.get_or_create(
                name=pdata['name'],
                defaults=pdata
            )
            if created:
                for img_url in gallery:
                    ProductImage.objects.create(product=p, image_url=img_url)

                # Seed sample reviews
                Review.objects.create(
                    product=p,
                    reviewer_name='Alex Rivera',
                    rating=5,
                    title='Exceeded all expectations!',
                    comment='Outstanding build quality and fast shipping. Highly recommend to everyone.',
                    is_verified_purchase=True
                )
                Review.objects.create(
                    product=p,
                    reviewer_name='Sarah Johnson',
                    rating=4,
                    title='Great value for money',
                    comment='Works exactly as advertised. Very happy with this purchase!',
                    is_verified_purchase=True
                )

        self.stdout.write(self.style.SUCCESS("Seeded products and customer reviews"))

        # 4. Coupons
        coupons_data = [
            {'code': 'WELCOME10', 'discount_type': 'percentage', 'discount_value': Decimal('10.00'), 'min_spend': Decimal('20.00')},
            {'code': 'SUPER20', 'discount_type': 'percentage', 'discount_value': Decimal('20.00'), 'min_spend': Decimal('100.00')},
            {'code': 'SAVE15', 'discount_type': 'fixed', 'discount_value': Decimal('15.00'), 'min_spend': Decimal('60.00')},
        ]
        for c in coupons_data:
            Coupon.objects.get_or_create(code=c['code'], defaults=c)
        self.stdout.write(self.style.SUCCESS("Seeded coupons: WELCOME10, SUPER20, SAVE15"))

        self.stdout.write(self.style.SUCCESS("ShopEase database seeding completed successfully!"))

