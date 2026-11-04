import re
from database import db
from flask_models import User, Address, Category, Product, ProductImage, Coupon, Review

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def seed_database():
    print("[*] Seeding Flask ShopEase Database...")

    # 1. Create Superuser / Admin
    admin_user = User.query.filter_by(email='admin@shopease.com').first()
    if not admin_user:
        admin_user = User(
            email='admin@shopease.com',
            full_name='ShopEase Admin',
            phone_number='+85512345678',
            is_staff=True,
            is_admin_user=True
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        print("[+] Created admin: admin@shopease.com / admin123")

    # 2. Create Demo Customer
    customer = User.query.filter_by(email='customer@shopease.com').first()
    if not customer:
        customer = User(
            email='customer@shopease.com',
            full_name='Dara Sok',
            phone_number='+85598765432'
        )
        customer.set_password('customer123')
        db.session.add(customer)
        db.session.flush()

        address = Address(
            user_id=customer.id,
            full_name='Dara Sok',
            phone_number='+85598765432',
            street_address='#123, St 271, Sangkat Boeung Tumpun',
            city='Phnom Penh',
            state='Phnom Penh',
            postal_code='12000',
            country='Cambodia',
            is_default=True
        )
        db.session.add(address)
        print("[+] Created customer: customer@shopease.com / customer123")

    # 3. Seed Categories
    categories_data = [
        {
            'name': 'Electronics',
            'slug': 'electronics',
            'description': 'Latest gadgets, audio gear, smart devices and tech essentials.',
            'image_url': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
            'icon': 'Laptop'
        },
        {
            'name': 'Fashion & Apparel',
            'slug': 'fashion-apparel',
            'description': 'Trendy clothing, shoes, bags and stylish everyday wear.',
            'image_url': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
            'icon': 'Shirt'
        },
        {
            'name': 'Home & Living',
            'slug': 'home-living',
            'description': 'Modern furniture, kitchenware, decor and cozy home accessories.',
            'image_url': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop&q=80',
            'icon': 'Home'
        },
        {
            'name': 'Beauty & Health',
            'slug': 'beauty-health',
            'description': 'Premium skincare, wellness products and personal care.',
            'image_url': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
            'icon': 'Sparkles'
        },
        {
            'name': 'Sports & Fitness',
            'slug': 'sports-fitness',
            'description': 'Workout equipment, athletic wear and outdoor essentials.',
            'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
            'icon': 'Activity'
        }
    ]

    cat_map = {}
    for cdata in categories_data:
        cat = Category.query.filter_by(name=cdata['name']).first()
        if not cat:
            cat = Category(
                name=cdata['name'],
                slug=cdata['slug'],
                description=cdata['description'],
                image_url=cdata['image_url'],
                icon=cdata['icon']
            )
            db.session.add(cat)
            db.session.flush()
        cat_map[cdata['name']] = cat
    print(f"[+] Seeded {len(cat_map)} categories")

    # 4. Seed Products
    products_data = [
        {
            'name': 'Sony WH-1000XM5 Wireless Headphones',
            'category': 'Electronics',
            'brand': 'Sony',
            'short_description': 'Industry-leading noise canceling with two processors and 8 microphones.',
            'description': 'Experience next-level silence and unmatched sound quality with industry-leading noise cancellation powered by two processors and 8 microphones. Enjoy crystal clear hands-free calling and up to 30 hours of battery life with quick charging capability.',
            'price': 299.00,
            'compare_at_price': 399.00,
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
            'category': 'Electronics',
            'brand': 'Apple',
            'short_description': 'Rugged, capable 49mm titanium case with precision dual-frequency GPS.',
            'description': 'The most capable and rugged Apple Watch yet. Features a lightweight yet robust titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and the brightest display ever produced on an Apple smartwatch.',
            'price': 749.00,
            'compare_at_price': 799.00,
            'stock_quantity': 18,
            'is_featured': True,
            'main_image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
            ]
        },
        {
            'name': 'Keychron Q1 Pro Wireless Mechanical Keyboard',
            'category': 'Electronics',
            'brand': 'Keychron',
            'short_description': 'Full aluminum body with hot-swappable tactile switches and RGB backlighting.',
            'description': 'A fully customizable mechanical keyboard with premium double-gasket design, CNC machined aluminum body, screw-in stabilizers, QMK/VIA programmable keys, and wireless Bluetooth 5.1 connection.',
            'price': 189.00,
            'compare_at_price': 210.00,
            'stock_quantity': 30,
            'is_featured': True,
            'main_image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'Vintage Minimalist Leather Backpack',
            'category': 'Fashion & Apparel',
            'brand': 'UrbanCraft',
            'short_description': 'Handcrafted genuine top-grain leather backpack with dedicated 16" laptop sleeve.',
            'description': 'Constructed from premium full-grain Italian leather, this backpack seamlessly blends heritage vintage aesthetics with modern everyday utility. Features water-resistant canvas lining and reinforced brass hardware.',
            'price': 119.50,
            'compare_at_price': 159.00,
            'stock_quantity': 40,
            'is_featured': True,
            'main_image_url': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'Classic Heavyweight Oversized Cotton Hoodie',
            'category': 'Fashion & Apparel',
            'brand': 'AestheticWear',
            'short_description': '100% organic French terry cotton with relaxed dropped shoulders.',
            'description': 'Elevate your streetwear style with our signature heavy-gauge 480GSM fleece hoodie. Pre-shrunk for an enduring boxy fit with double-needle ribbed hems and cuffs.',
            'price': 65.00,
            'compare_at_price': 85.00,
            'stock_quantity': 50,
            'is_featured': False,
            'main_image_url': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'Ergonomic Mesh Executive Chair',
            'category': 'Home & Living',
            'brand': 'ErgoFlex',
            'short_description': 'Breathable Korean mesh with 4D armrests and dynamic lumbar support.',
            'description': 'Engineered for all-day comfort and healthy posture. Features breathable responsive mesh, adaptive lumbar curve support, synchro-tilt reclining mechanism, and smooth-rolling silent casters.',
            'price': 260.00,
            'compare_at_price': 320.00,
            'stock_quantity': 15,
            'is_featured': True,
            'main_image_url': 'https://images.unsplash.com/photo-1580481077190-7361356d11f1?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'Ceramic Pour-Over Coffee Dripper Set',
            'category': 'Home & Living',
            'brand': 'BaristaLab',
            'short_description': 'Handcrafted Japanese ceramic dripper with double-walled glass server.',
            'description': 'Brew clean, vibrant artisanal coffee right at home. The spiral ribbed interior guides optimal water flow and extraction for maximum floral aroma and rich flavor body.',
            'price': 42.00,
            'compare_at_price': 55.00,
            'stock_quantity': 35,
            'is_featured': False,
            'main_image_url': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'HydroBoost Rejuvenating Facial Serum',
            'category': 'Beauty & Health',
            'brand': 'GlowNatural',
            'short_description': 'Multi-molecular hyaluronic acid combined with vitamin C & niacinamide.',
            'description': 'An ultra-hydrating elixir that penetrates deeply to plump, brighten, and restore tired skin barrier. Dermatologically tested, vegan, fragrance-free, and cruelty-free.',
            'price': 34.00,
            'compare_at_price': 45.00,
            'stock_quantity': 60,
            'is_featured': True,
            'main_image_url': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        },
        {
            'name': 'Pro Eco-Friendly Non-Slip Yoga Mat',
            'category': 'Sports & Fitness',
            'brand': 'ZenMotion',
            'short_description': '6mm natural tree rubber with laser-etched alignment system.',
            'description': 'Unrivaled grip whether dry or sweaty. Made with sustainably harvested natural rubber, providing superior joint cushioning and stability for yoga, pilates, and floor routines.',
            'price': 48.00,
            'compare_at_price': 60.00,
            'stock_quantity': 45,
            'is_featured': False,
            'main_image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
            'gallery': []
        }
    ]

    for idx, pdata in enumerate(products_data, start=1):
        p_slug = slugify(pdata['name'])
        product = Product.query.filter_by(slug=p_slug).first()
        if not product:
            cat = cat_map.get(pdata['category'])
            product = Product(
                category_id=cat.id if cat else 1,
                name=pdata['name'],
                slug=p_slug,
                brand=pdata['brand'],
                short_description=pdata['short_description'],
                description=pdata['description'],
                price=pdata['price'],
                compare_at_price=pdata.get('compare_at_price'),
                stock_quantity=pdata['stock_quantity'],
                sku=f"SKU-{idx:04d}",
                is_featured=pdata.get('is_featured', False),
                is_active=True,
                rating=4.9,
                reviews_count=2,
                main_image_url=pdata['main_image_url']
            )
            db.session.add(product)
            db.session.flush()

            for img_url in pdata.get('gallery', []):
                img = ProductImage(
                    product_id=product.id,
                    image_url=img_url,
                    alt_text=product.name
                )
                db.session.add(img)

            rev1 = Review(
                product_id=product.id,
                reviewer_name='Alex Rivera',
                rating=5,
                title='Exceeded all expectations!',
                comment='Outstanding build quality and fast shipping. Highly recommend to everyone.',
                is_verified_purchase=True
            )
            rev2 = Review(
                product_id=product.id,
                reviewer_name='Sarah Johnson',
                rating=5,
                title='Great value for money',
                comment='Works exactly as advertised. Very happy with this purchase!',
                is_verified_purchase=True
            )
            db.session.add(rev1)
            db.session.add(rev2)

    print("[+] Seeded products and reviews")

    # 5. Seed Coupons
    coupons_data = [
        {'code': 'WELCOME10', 'discount_type': 'percentage', 'discount_value': 10.0, 'min_spend': 20.0, 'max_discount': 50.0},
        {'code': 'SUPER20', 'discount_type': 'percentage', 'discount_value': 20.0, 'min_spend': 100.0, 'max_discount': 200.0},
        {'code': 'SAVE15', 'discount_type': 'fixed', 'discount_value': 15.0, 'min_spend': 60.0, 'max_discount': None},
    ]

    for cdata in coupons_data:
        c = Coupon.query.filter_by(code=cdata['code']).first()
        if not c:
            c = Coupon(
                code=cdata['code'],
                discount_type=cdata['discount_type'],
                discount_value=cdata['discount_value'],
                min_spend=cdata['min_spend'],
                max_discount=cdata.get('max_discount'),
                is_active=True
            )
            db.session.add(c)
    print("[+] Seeded coupons: WELCOME10, SUPER20, SAVE15")

    db.session.commit()
    print("[+] ShopEase Flask database seeded successfully!")
