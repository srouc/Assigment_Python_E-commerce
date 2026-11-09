import json
import uuid
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from database import db

def utc_now():
    return datetime.now(timezone.utc)

def parse_json(val, default=None):
    if val is None:
        return default
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return default

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, default='')
    image = db.Column(db.String(500), nullable=True)
    icon = db.Column(db.String(50), default='Tag')
    product_count = db.Column(db.Integer, default=0)

    def __init__(self, **kwargs):
        if 'image_url' in kwargs and 'image' not in kwargs:
            self.image = kwargs.pop('image_url')
        if 'id' not in kwargs:
            self.id = str(uuid.uuid4())[:8]
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description or '',
            'image': self.image,
            'image_url': self.image,
            'display_image': self.image or "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500",
            'icon': self.icon or 'Tag',
            'is_active': True,
            'products_count': self.product_count or 0,
            'created_at': None
        }

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, default='')
    full_description = db.Column(db.Text, default='')
    category = db.Column(db.String(100), nullable=False)
    category_slug = db.Column(db.String(100), index=True)
    brand = db.Column(db.String(100), default='')
    price = db.Column(db.Numeric(10, 2), nullable=False, default=0.0)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    discount = db.Column(db.Integer, default=0)
    rating = db.Column(db.Numeric(3, 2), default=5.0)
    review_count = db.Column(db.Integer, default=0)
    stock = db.Column(db.Integer, default=10)
    images = db.Column(db.Text, default='[]')
    colors = db.Column(db.Text, default='[]')
    sizes = db.Column(db.Text, default='[]')
    specifications = db.Column(db.Text, default='{}')
    reviews_list = db.Column(db.Text, default='[]')
    is_featured = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=False)
    is_best_seller = db.Column(db.Boolean, default=False)
    is_flash_sale = db.Column(db.Boolean, default=False)
    ranking = db.Column(db.Integer, default=99)
    warranty = db.Column(db.String(255), default='')
    shipping_info = db.Column(db.String(255), default='')
    return_policy = db.Column(db.String(255), default='')
    tags = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=utc_now)

    def __init__(self, **kwargs):
        if 'id' not in kwargs:
            self.id = str(uuid.uuid4())[:8]
        if 'stock_quantity' in kwargs:
            self.stock = kwargs.pop('stock_quantity')
        if 'compare_at_price' in kwargs:
            self.original_price = kwargs.pop('compare_at_price')
        if 'short_description' in kwargs:
            self.description = kwargs.pop('short_description')
        if 'description' in kwargs and 'full_description' not in kwargs:
            self.full_description = kwargs.get('description')
        if 'reviews_count' in kwargs:
            self.review_count = kwargs.pop('reviews_count')
        if 'category_id' in kwargs:
            kwargs.pop('category_id')
        if 'is_active' in kwargs:
            kwargs.pop('is_active')
        if 'sku' in kwargs:
            kwargs.pop('sku')
        if 'main_image_url' in kwargs:
            m_img = kwargs.pop('main_image_url')
            if ('images' not in kwargs or not kwargs['images']) and m_img:
                self.images = json.dumps([m_img])
        if 'category' not in kwargs:
            self.category = 'Fashion'
        super().__init__(**kwargs)

    def to_dict(self, detail=False):
        parsed_imgs = parse_json(self.images, [])
        img_list = []
        if isinstance(parsed_imgs, list):
            for idx, u in enumerate(parsed_imgs):
                img_url = u if isinstance(u, str) else u.get('image_url', '')
                img_list.append({
                    'id': idx + 1,
                    'image_url': img_url,
                    'display_image': img_url,
                    'alt_text': self.name
                })
        
        main_img = img_list[0]['image_url'] if img_list else "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
        price_flt = float(self.price or 0.0)
        orig_price_flt = float(self.original_price) if self.original_price else None

        parsed_colors = parse_json(self.colors, [])
        normalized_colors = []
        if isinstance(parsed_colors, list):
            hex_map = {
                'black': '#111827', 'midnight black': '#0f172a', 'obsidian black': '#020617', 'triple black': '#000000',
                'white': '#ffffff', 'pure white': '#ffffff',
                'silver': '#cbd5e1', 'platinum silver': '#e2e8f0', 'gray': '#64748b', 'grey': '#64748b',
                'navy': '#1e3a8a', 'deep navy': '#0f172a', 'blue': '#2563eb',
                'brown': '#78350f', 'cognac brown': '#9a3412', 'espresso': '#451a03',
                'red': '#dc2626', 'crimson': '#991b1b', 'gold': '#f59e0b', 'champagne': '#fef08a',
                'green': '#16a34a', 'olive': '#4d7c0f', 'beige': '#f5f5dc', 'cream': '#fef9c3',
                'rose': '#fb7185', 'pink': '#f472b6', 'purple': '#9333ea', 'indigo': '#4f46e5'
            }
            for c in parsed_colors:
                if isinstance(c, dict):
                    name = c.get('name') or c.get('color') or 'Standard'
                    hex_val = c.get('hex') or c.get('code') or '#111827'
                    normalized_colors.append({'name': name, 'hex': hex_val})
                elif isinstance(c, str):
                    c_lower = c.lower()
                    found_hex = None
                    for k, v in hex_map.items():
                        if k in c_lower:
                            found_hex = v
                            break
                    normalized_colors.append({'name': c, 'hex': found_hex or '#475569'})

        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category_slug or self.category,
            'category_name': self.category,
            'category_slug': self.category_slug or '',
            'brand': self.brand or '',
            'short_description': self.description or '',
            'description': self.full_description or self.description or '',
            'price': f"{price_flt:.2f}",
            'compare_at_price': f"{orig_price_flt:.2f}" if (orig_price_flt and orig_price_flt > 0) else None,
            'discount_percentage': int(self.discount or 0),
            'stock_quantity': int(self.stock or 0),
            'is_in_stock': int(self.stock or 0) > 0,
            'sku': f"SKU-{self.id}",
            'is_featured': bool(self.is_featured),
            'is_active': True,
            'rating': float(self.rating or 5.0),
            'reviews_count': int(self.review_count or 0),
            'main_image_url': main_img,
            'display_image': main_img,
            'images': img_list,
            'colors': normalized_colors,
            'sizes': parse_json(self.sizes, []),
            'specifications': parse_json(self.specifications, {}),
            'warranty': self.warranty or '',
            'shipping_info': self.shipping_info or '',
            'return_policy': self.return_policy or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.created_at.isoformat() if self.created_at else None
        }
        return data

class ProductImage(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255), default='')

    def __init__(self, **kwargs):
        if 'image_url' in kwargs and 'image' not in kwargs:
            self.image = kwargs.pop('image_url')
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'image': self.image,
            'image_url': self.image,
            'display_image': self.image,
            'alt_text': self.alt_text or ''
        }

class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True)
    full_name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(50), nullable=False)
    street_address = db.Column(db.String(500), nullable=False)
    city = db.Column(db.String(100), default='Phnom Penh')
    state = db.Column(db.String(100), default='Phnom Penh')
    postal_code = db.Column(db.String(20), default='12000')
    country = db.Column(db.String(100), default='Cambodia')
    is_default = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'is_default': self.is_default
        }

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(100), default='')
    last_name = db.Column(db.String(100), default='')
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(50), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='customer') # 'admin' or 'customer'
    avatar = db.Column(db.String(500), nullable=True)
    addresses = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=utc_now)

    def __init__(self, **kwargs):
        if 'full_name' in kwargs:
            fn = kwargs.pop('full_name')
            parts = fn.split(' ', 1)
            self.first_name = parts[0]
            self.last_name = parts[1] if len(parts) > 1 else ''
        if 'phone_number' in kwargs:
            self.phone = kwargs.pop('phone_number')
        is_adm = kwargs.pop('is_admin_user', None)
        is_stf = kwargs.pop('is_staff', None)
        if is_adm or is_stf:
            self.role = 'admin'
        if 'id' not in kwargs:
            self.id = str(uuid.uuid4())[:8]
        super().__init__(**kwargs)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        # Check plain-text (for legacy phpMyAdmin demo users)
        if self.password_hash == password:
            return True
        # Check secure hash
        try:
            return check_password_hash(self.password_hash, password)
        except Exception:
            return False

    @property
    def full_name(self):
        parts = [self.first_name, self.last_name]
        name = " ".join([p for p in parts if p]).strip()
        return name or self.email.split('@')[0]

    @property
    def name(self):
        return self.full_name

    @property
    def is_admin_user(self):
        return self.role in ['admin', 'staff', 'superuser']

    @is_admin_user.setter
    def is_admin_user(self, val):
        if val:
            self.role = 'admin'

    @property
    def is_staff(self):
        return self.is_admin_user

    @is_staff.setter
    def is_staff(self, val):
        if val:
            self.role = 'admin'

    @property
    def is_active(self):
        return True

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'name': self.name,
            'phone_number': self.phone,
            'avatar': self.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            'is_admin_user': self.is_admin_user,
            'is_staff': self.is_staff,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.String(50), primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.String(50), nullable=True, index=True)
    customer_name = db.Column(db.String(150), nullable=False)
    customer_email = db.Column(db.String(150), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=True)
    items = db.Column(db.Text, nullable=False, default='[]')
    subtotal = db.Column(db.Numeric(10, 2), default=0.0)
    discount = db.Column(db.Numeric(10, 2), default=0.0)
    shipping = db.Column(db.Numeric(10, 2), default=0.0)
    tax = db.Column(db.Numeric(10, 2), default=0.0)
    total = db.Column(db.Numeric(10, 2), default=0.0)
    payment_method = db.Column(db.String(50), default='cod')
    payment_status = db.Column(db.String(50), default='unpaid')
    status = db.Column(db.String(50), default='pending')
    shipping_address = db.Column(db.Text, default='{}')
    timeline = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        method_names = {
            'cod': 'Cash On Delivery (COD)',
            'card': 'Credit/Debit Card',
            'aba_khqr': 'ABA KHQR / Mobile Banking',
            'paypal': 'PayPal'
        }
        parsed_items = parse_json(self.items, [])
        formatted_items = []
        if isinstance(parsed_items, list):
            for idx, itm in enumerate(parsed_items):
                p_price = float(itm.get('price', 0.0))
                p_qty = int(itm.get('quantity', 1))
                formatted_items.append({
                    'id': itm.get('id', idx + 1),
                    'product': itm.get('productId') or itm.get('product_id'),
                    'product_name': itm.get('name') or itm.get('product_name', 'Item'),
                    'product_image': itm.get('image') or itm.get('product_image') or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                    'price': f"{p_price:.2f}",
                    'quantity': p_qty,
                    'total_price': f"{(p_price * p_qty):.2f}"
                })

        parsed_addr = parse_json(self.shipping_address, {})
        if isinstance(parsed_addr, dict):
            street = parsed_addr.get('address') or parsed_addr.get('street_address', '')
            city = parsed_addr.get('city', 'Phnom Penh')
            state = parsed_addr.get('province') or parsed_addr.get('state', '')
            postal = parsed_addr.get('postalCode') or parsed_addr.get('postal_code', '')
            country = parsed_addr.get('country', 'Cambodia')
        else:
            street = str(self.shipping_address or '')
            city = 'Phnom Penh'
            state = ''
            postal = ''
            country = 'Cambodia'

        subtotal_flt = float(self.subtotal or 0.0)
        disc_flt = float(self.discount or 0.0)
        ship_flt = float(self.shipping or 0.0)
        tax_flt = float(self.tax or 0.0)
        total_flt = float(self.total or 0.0)

        return {
            'id': self.id,
            'order_number': self.order_number,
            'user': self.user_id,
            'guest_email': self.customer_email,
            'guest_name': self.customer_name,
            'status': self.status.lower(),
            'status_display': self.status.capitalize(),
            'payment_status': self.payment_status.lower(),
            'payment_status_display': self.payment_status.capitalize(),
            'payment_method': self.payment_method.lower(),
            'payment_method_display': method_names.get(self.payment_method.lower(), self.payment_method.upper()),
            'shipping_name': self.customer_name,
            'shipping_phone': self.customer_phone or '',
            'shipping_address': street,
            'shipping_city': city,
            'shipping_state': state,
            'shipping_postal_code': postal,
            'shipping_country': country,
            'subtotal': f"{subtotal_flt:.2f}",
            'discount_amount': f"{disc_flt:.2f}",
            'shipping_fee': f"{ship_flt:.2f}",
            'tax_amount': f"{tax_flt:.2f}",
            'total_amount': f"{total_flt:.2f}",
            'coupon_code': None,
            'notes': '',
            'items': formatted_items,
            'timeline': parse_json(self.timeline, []),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.created_at.isoformat() if self.created_at else None
        }

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True, index=True)
    session_key = db.Column(db.String(64), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items)

    @property
    def subtotal(self):
        total = 0.0
        for item in self.items:
            prod = db.session.get(Product, item.product_id)
            if prod:
                total += float(prod.price) * item.quantity
        return total

    def to_dict(self):
        return {
            'id': self.id,
            'items': [item.to_dict() for item in self.items],
            'total_items': self.total_items,
            'subtotal': f"{self.subtotal:.2f}",
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        prod = db.session.get(Product, self.product_id)
        unit_price = float(prod.price) if prod else 0.0
        return {
            'id': self.id,
            'product': prod.to_dict() if prod else None,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'total_price': f"{(unit_price * self.quantity):.2f}",
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Coupon(db.Model):
    __tablename__ = 'coupons'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    discount_type = db.Column(db.String(20), default='percentage')
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    min_spend = db.Column(db.Numeric(10, 2), default=0.0)
    max_discount = db.Column(db.Numeric(10, 2), nullable=True)
    times_used = db.Column(db.Integer, default=0)
    usage_limit = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    def is_valid(self, subtotal=0.0):
        if not self.is_active:
            return False, "This coupon is no longer active."
        if self.usage_limit and self.times_used >= self.usage_limit:
            return False, "This coupon has reached its usage limit."
        min_sp = float(self.min_spend or 0.0)
        if subtotal < min_sp:
            return False, f"Minimum spend of ${min_sp:.2f} required for this coupon."
        return True, "Valid coupon"

    def calculate_discount(self, subtotal):
        val = float(self.discount_value or 0.0)
        max_d = float(self.max_discount) if self.max_discount else None
        if self.discount_type == 'percentage':
            discount = (subtotal * val) / 100.0
            if max_d and discount > max_d:
                discount = max_d
            return discount
        return min(val, subtotal)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_spend': float(self.min_spend or 0.0),
            'max_discount': float(self.max_discount) if self.max_discount else None,
            'times_used': self.times_used,
            'is_active': bool(self.is_active)
        }

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String(50), nullable=False, index=True)
    user_id = db.Column(db.String(50), nullable=True)
    reviewer_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=5)
    title = db.Column(db.String(200), default='')
    comment = db.Column(db.Text, nullable=False)
    is_verified_purchase = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        user = db.session.get(User, str(self.user_id)) if self.user_id else None
        return {
            'id': self.id,
            'product': self.product_id,
            'user': self.user_id,
            'reviewer_name': self.reviewer_name,
            'user_avatar': user.avatar if user else None,
            'rating': self.rating,
            'title': self.title or '',
            'comment': self.comment or '',
            'is_verified_purchase': bool(self.is_verified_purchase),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
