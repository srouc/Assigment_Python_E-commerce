from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
import uuid

def utc_now():
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(150), default='')
    phone_number = db.Column(db.String(30), nullable=True)
    avatar = db.Column(db.String(500), nullable=True)
    is_admin_user = db.Column(db.Boolean, default=False)
    is_staff = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    addresses = db.relationship('Address', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def name(self):
        return self.full_name or self.email.split('@')[0]

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'name': self.name,
            'phone_number': self.phone_number,
            'avatar': self.avatar,
            'is_admin_user': self.is_admin_user,
            'is_staff': self.is_staff or self.is_admin_user,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(30), nullable=False)
    street_address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), default='')
    postal_code = db.Column(db.String(30), default='')
    country = db.Column(db.String(100), default='Cambodia')
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'is_default': self.is_default
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, default='')
    image_url = db.Column(db.String(500), nullable=True)
    icon = db.Column(db.String(50), default='Layers')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image_url': self.image_url,
            'display_image': self.image_url or "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60",
            'icon': self.icon,
            'is_active': self.is_active,
            'products_count': len([p for p in (self.products or []) if p.is_active]),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(280), unique=True, nullable=False, index=True)
    brand = db.Column(db.String(100), default='')
    short_description = db.Column(db.String(500), default='')
    description = db.Column(db.Text, default='')
    price = db.Column(db.Float, nullable=False, default=0.0)
    compare_at_price = db.Column(db.Float, nullable=True)
    stock_quantity = db.Column(db.Integer, default=10)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=5.0)
    reviews_count = db.Column(db.Integer, default=0)
    main_image_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='product', lazy=True, cascade='all, delete-orphan')

    @property
    def discount_percentage(self):
        if self.compare_at_price and self.compare_at_price > self.price:
            return round(((self.compare_at_price - self.price) / self.compare_at_price) * 100)
        return 0

    def to_dict(self, detail=False):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category_id,
            'category_name': self.category.name if self.category else '',
            'category_slug': self.category.slug if self.category else '',
            'brand': self.brand or '',
            'short_description': self.short_description or '',
            'description': self.description or '',
            'price': f"{self.price:.2f}",
            'compare_at_price': f"{self.compare_at_price:.2f}" if (self.compare_at_price and self.compare_at_price > 0) else None,
            'discount_percentage': self.discount_percentage,
            'stock_quantity': self.stock_quantity,
            'is_in_stock': self.stock_quantity > 0,
            'sku': self.sku,
            'is_featured': self.is_featured,
            'is_active': self.is_active,
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'main_image_url': self.main_image_url,
            'display_image': self.main_image_url or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
            'images': [img.to_dict() for img in self.images] if self.images else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        return data

class ProductImage(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255), default='')

    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'display_image': self.image_url,
            'alt_text': self.alt_text
        }

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    session_key = db.Column(db.String(64), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items if item.product)

    @property
    def subtotal(self):
        return sum(item.product.price * item.quantity for item in self.items if item.product)

    def to_dict(self):
        return {
            'id': self.id,
            'items': [item.to_dict() for item in self.items if item.product],
            'total_items': self.total_items,
            'subtotal': f"{self.subtotal:.2f}",
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=utc_now)

    product = db.relationship('Product')

    @property
    def total_price(self):
        return (self.product.price if self.product else 0.0) * self.quantity

    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.to_dict() if self.product else None,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'total_price': f"{self.total_price:.2f}",
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Coupon(db.Model):
    __tablename__ = 'coupons'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    discount_type = db.Column(db.String(20), default='percentage') # percentage or fixed
    discount_value = db.Column(db.Float, nullable=False)
    min_spend = db.Column(db.Float, default=0.0)
    max_discount = db.Column(db.Float, nullable=True)
    usage_limit = db.Column(db.Integer, nullable=True)
    times_used = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    def is_valid(self, subtotal=0.0):
        if not self.is_active:
            return False, "This coupon is no longer active."
        if self.usage_limit and self.times_used >= self.usage_limit:
            return False, "This coupon has reached its usage limit."
        if subtotal < self.min_spend:
            return False, f"Minimum spend of ${self.min_spend:.2f} required for this coupon."
        return True, "Valid coupon"

    def calculate_discount(self, subtotal):
        if self.discount_type == 'percentage':
            discount = (subtotal * self.discount_value) / 100.0
            if self.max_discount and discount > self.max_discount:
                discount = self.max_discount
            return discount
        return min(self.discount_value, subtotal)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'discount_type': self.discount_type,
            'discount_value': self.discount_value,
            'min_spend': self.min_spend,
            'max_discount': self.max_discount,
            'times_used': self.times_used,
            'is_active': self.is_active
        }

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    guest_email = db.Column(db.String(120), nullable=True)
    guest_name = db.Column(db.String(150), nullable=True)
    status = db.Column(db.String(20), default='pending') # pending, processing, shipped, delivered, cancelled
    payment_status = db.Column(db.String(20), default='unpaid') # unpaid, paid, failed, refunded
    payment_method = db.Column(db.String(20), default='cod') # cod, card, aba_khqr, paypal
    shipping_name = db.Column(db.String(150), nullable=False)
    shipping_phone = db.Column(db.String(30), nullable=False)
    shipping_address = db.Column(db.String(255), nullable=False)
    shipping_city = db.Column(db.String(100), nullable=False)
    shipping_state = db.Column(db.String(100), default='')
    shipping_postal_code = db.Column(db.String(30), default='')
    shipping_country = db.Column(db.String(100), default='Cambodia')
    subtotal = db.Column(db.Float, default=0.0)
    discount_amount = db.Column(db.Float, default=0.0)
    shipping_fee = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, default=0.0)
    coupon_code = db.Column(db.String(50), nullable=True)
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('Payment', backref='order', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        method_names = {
            'cod': 'Cash On Delivery (COD)',
            'card': 'Credit/Debit Card',
            'aba_khqr': 'ABA KHQR / Mobile Banking',
            'paypal': 'PayPal'
        }
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user': self.user_id,
            'guest_email': self.guest_email,
            'guest_name': self.guest_name,
            'status': self.status,
            'status_display': self.status.capitalize(),
            'payment_status': self.payment_status,
            'payment_status_display': self.payment_status.capitalize(),
            'payment_method': self.payment_method,
            'payment_method_display': method_names.get(self.payment_method, self.payment_method.upper()),
            'shipping_name': self.shipping_name,
            'shipping_phone': self.shipping_phone,
            'shipping_address': self.shipping_address,
            'shipping_city': self.shipping_city,
            'shipping_state': self.shipping_state,
            'shipping_postal_code': self.shipping_postal_code,
            'shipping_country': self.shipping_country,
            'subtotal': f"{self.subtotal:.2f}",
            'discount_amount': f"{self.discount_amount:.2f}",
            'shipping_fee': f"{self.shipping_fee:.2f}",
            'tax_amount': f"{self.tax_amount:.2f}",
            'total_amount': f"{self.total_amount:.2f}",
            'coupon_code': self.coupon_code,
            'notes': self.notes,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_image = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    total_price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product_id,
            'product_name': self.product_name,
            'product_image': self.product_image or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
            'price': f"{self.price:.2f}",
            'quantity': self.quantity,
            'total_price': f"{self.total_price:.2f}"
        }

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, completed, failed
    transaction_id = db.Column(db.String(100), default='')
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'order': self.order_id,
            'payment_method': self.payment_method,
            'amount': f"{self.amount:.2f}",
            'status': self.status,
            'transaction_id': self.transaction_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reviewer_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), default='')
    comment = db.Column(db.Text, nullable=False)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    user = db.relationship('User')

    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product_id,
            'user': self.user_id,
            'reviewer_name': self.reviewer_name,
            'user_avatar': self.user.avatar if self.user else None,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'is_verified_purchase': self.is_verified_purchase,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
