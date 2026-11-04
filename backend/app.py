import os
import uuid
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, decode_token
)
from database import db
from flask_models import (
    User, Address, Category, Product, ProductImage,
    Cart, CartItem, Order, OrderItem, Payment, Review, Coupon
)
from flask_seed import seed_database, slugify

def create_app():
    app = Flask(__name__)

    # Configuration
    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, 'shopease_flask.db').replace('\\', '/')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'shopease-flask-jwt-super-secret-key-2026'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # Enable CORS for Next.js frontend
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        expose_headers=["X-Session-Key", "Authorization", "Content-Type"]
    )

    db.init_app(app)
    jwt = JWTManager(app)

    # Auto create tables and seed demo data
    with app.app_context():
        db.create_all()
        # Seed if empty
        if Category.query.count() == 0 or User.query.count() == 0:
            seed_database()

    # --------------------------------------------------------------------------
    # Helper Utilities
    # --------------------------------------------------------------------------
    def get_user_from_jwt():
        try:
            auth_header = request.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ', 1)[1]
                decoded = decode_token(token)
                identity = decoded.get('sub')
                if identity:
                    return User.query.get(int(identity))
        except Exception:
            pass
        return None

    def get_current_cart():
        user = get_user_from_jwt()
        session_key = request.headers.get('X-Session-Key')

        if user:
            cart = Cart.query.filter_by(user_id=user.id).first()
            if not cart:
                cart = Cart(user_id=user.id)
                db.session.add(cart)
                db.session.commit()

            # Merge anonymous session cart items if session_key exists
            if session_key:
                s_cart = Cart.query.filter_by(session_key=session_key).first()
                if s_cart and s_cart.id != cart.id:
                    for s_item in s_cart.items:
                        existing = CartItem.query.filter_by(cart_id=cart.id, product_id=s_item.product_id).first()
                        if existing:
                            existing.quantity += s_item.quantity
                        else:
                            new_item = CartItem(cart_id=cart.id, product_id=s_item.product_id, quantity=s_item.quantity)
                            db.session.add(new_item)
                    db.session.delete(s_cart)
                    db.session.commit()
            return cart

        if session_key:
            cart = Cart.query.filter_by(session_key=session_key).first()
            if not cart:
                cart = Cart(session_key=session_key)
                db.session.add(cart)
                db.session.commit()
            return cart

        new_sess = "sess_" + uuid.uuid4().hex
        cart = Cart(session_key=new_sess)
        db.session.add(cart)
        db.session.commit()
        return cart

    # --------------------------------------------------------------------------
    # Root Dashboard Route
    # --------------------------------------------------------------------------
    @app.route('/', methods=['GET'])
    def root_dashboard():
        html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ShopEase Backend (Flask REST API)</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6">
          <div class="max-w-3xl w-full bg-slate-800/90 backdrop-blur rounded-2xl border border-slate-700 shadow-2xl p-8">
            <div class="flex items-center justify-between pb-6 border-b border-slate-700">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/30">
                  🛍️
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-white tracking-tight">ShopEase Flask API</h1>
                  <p class="text-sm text-slate-400">High-Performance Python Flask Backend</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Running
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                <div class="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Frontend Application</div>
                <div class="text-lg font-semibold text-white mb-2">Next.js Storefront</div>
                <a href="http://localhost:3000" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-md shadow-indigo-600/30">
                  Open Storefront &rarr;
                </a>
              </div>

              <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                <div class="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Test Credentials</div>
                <div class="text-xs space-y-1 text-slate-300">
                  <p><strong class="text-indigo-400">Admin:</strong> admin@shopease.com / admin123</p>
                  <p><strong class="text-emerald-400">Customer:</strong> customer@shopease.com / customer123</p>
                  <p><strong class="text-amber-400">Coupons:</strong> WELCOME10, SUPER20, SAVE15</p>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-700 pt-6">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Core REST API Endpoints</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <a href="/api/categories/" target="_blank" class="p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-700/50 border border-slate-700/40 transition block">
                  <span class="text-emerald-400 font-mono font-bold">GET</span> /api/categories/
                </a>
                <a href="/api/products/" target="_blank" class="p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-700/50 border border-slate-700/40 transition block">
                  <span class="text-emerald-400 font-mono font-bold">GET</span> /api/products/
                </a>
                <a href="/api/cart/" target="_blank" class="p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-700/50 border border-slate-700/40 transition block">
                  <span class="text-emerald-400 font-mono font-bold">GET</span> /api/cart/
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
        """
        return render_template_string(html)

    # --------------------------------------------------------------------------
    # Authentication Endpoints (/api/accounts/...)
    # --------------------------------------------------------------------------
    @app.route('/api/accounts/login/', methods=['POST'])
    def login():
        data = request.get_json() or {}
        raw_email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not raw_email or not password:
            return jsonify({'detail': 'Email and password are required.'}), 400

        user = User.query.filter(db.func.lower(User.email) == raw_email).first()
        if not user or not user.check_password(password):
            return jsonify({'detail': 'Invalid email or password.'}), 401

        if not user.is_active:
            return jsonify({'detail': 'This account has been deactivated.'}), 403

        access = create_access_token(identity=str(user.id))
        refresh = create_refresh_token(identity=str(user.id))

        return jsonify({
            'access': access,
            'refresh': refresh,
            'user': user.to_dict()
        }), 200

    @app.route('/api/accounts/register/', methods=['POST'])
    def register():
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        full_name = (data.get('full_name') or '').strip()
        phone_number = (data.get('phone_number') or '').strip()

        if not email or not password:
            return jsonify({'detail': 'Email and password are required.'}), 400

        if len(password) < 6:
            return jsonify({'detail': 'Password must be at least 6 characters.'}), 400

        if User.query.filter(db.func.lower(User.email) == email).first():
            return jsonify({'detail': 'A user with this email already exists.'}), 400

        user = User(
            email=email,
            full_name=full_name,
            phone_number=phone_number
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        access = create_access_token(identity=str(user.id))
        refresh = create_refresh_token(identity=str(user.id))

        return jsonify({
            'message': 'Account registered successfully.',
            'user': user.to_dict(),
            'access': access,
            'refresh': refresh
        }), 201

    @app.route('/api/accounts/refresh/', methods=['POST'])
    def refresh_token():
        data = request.get_json() or {}
        refresh_raw = data.get('refresh')
        if not refresh_raw:
            return jsonify({'detail': 'Refresh token is required.'}), 400

        try:
            decoded = decode_token(refresh_raw)
            user_id = decoded.get('sub')
            user = User.query.get(int(user_id))
            if not user or not user.is_active:
                return jsonify({'detail': 'User not found or inactive.'}), 401

            new_access = create_access_token(identity=str(user.id))
            return jsonify({'access': new_access}), 200
        except Exception:
            return jsonify({'detail': 'Invalid or expired refresh token.'}), 401

    @app.route('/api/accounts/profile/', methods=['GET', 'PATCH'])
    @jwt_required()
    def user_profile():
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'detail': 'User not found.'}), 404

        if request.method == 'PATCH':
            data = request.get_json() or {}
            if 'full_name' in data:
                user.full_name = data['full_name'].strip()
            if 'phone_number' in data:
                user.phone_number = data['phone_number'].strip()
            if 'avatar' in data:
                user.avatar = data['avatar']
            db.session.commit()

        return jsonify(user.to_dict()), 200

    @app.route('/api/accounts/addresses/', methods=['GET', 'POST'])
    @jwt_required()
    def user_addresses():
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'detail': 'User not found.'}), 404

        if request.method == 'POST':
            data = request.get_json() or {}
            if data.get('is_default'):
                for addr in user.addresses:
                    addr.is_default = False

            address = Address(
                user_id=user.id,
                full_name=data.get('full_name', user.name),
                phone_number=data.get('phone_number', user.phone_number or ''),
                street_address=data.get('street_address', ''),
                city=data.get('city', 'Phnom Penh'),
                state=data.get('state', ''),
                postal_code=data.get('postal_code', ''),
                country=data.get('country', 'Cambodia'),
                is_default=bool(data.get('is_default', len(user.addresses) == 0))
            )
            db.session.add(address)
            db.session.commit()
            return jsonify(address.to_dict()), 201

        return jsonify([addr.to_dict() for addr in user.addresses]), 200

    # --------------------------------------------------------------------------
    # Categories Endpoints (/api/categories/...)
    # --------------------------------------------------------------------------
    @app.route('/api/categories/', methods=['GET', 'POST'])
    def categories():
        if request.method == 'POST':
            user = get_user_from_jwt()
            if not user or not (user.is_admin_user or user.is_staff):
                return jsonify({'detail': 'Admin privileges required.'}), 403

            data = request.get_json() or {}
            name = (data.get('name') or '').strip()
            if not name:
                return jsonify({'detail': 'Category name is required.'}), 400

            cat_slug = data.get('slug') or slugify(name)
            cat = Category(
                name=name,
                slug=cat_slug,
                description=data.get('description', ''),
                image_url=data.get('image_url'),
                icon=data.get('icon', 'Layers')
            )
            db.session.add(cat)
            db.session.commit()
            return jsonify(cat.to_dict()), 201

        cats = Category.query.filter_by(is_active=True).all()
        return jsonify([c.to_dict() for c in cats]), 200

    # --------------------------------------------------------------------------
    # Products Endpoints (/api/products/...)
    # --------------------------------------------------------------------------
    @app.route('/api/products/', methods=['GET', 'POST'])
    def products():
        if request.method == 'POST':
            user = get_user_from_jwt()
            if not user or not (user.is_admin_user or user.is_staff):
                return jsonify({'detail': 'Admin privileges required.'}), 403

            data = request.form.to_dict() if request.form else (request.get_json() or {})
            name = (data.get('name') or '').strip()
            if not name:
                return jsonify({'detail': 'Product name is required.'}), 400

            cat_id = data.get('category') or data.get('category_id')
            p_slug = data.get('slug') or slugify(name)
            sku = data.get('sku') or f"SKU-{uuid.uuid4().hex[:6].upper()}"

            product = Product(
                name=name,
                slug=p_slug,
                category_id=int(cat_id) if cat_id else 1,
                brand=data.get('brand', ''),
                short_description=data.get('short_description', ''),
                description=data.get('description', ''),
                price=float(data.get('price', 0.0)),
                compare_at_price=float(data['compare_at_price']) if data.get('compare_at_price') else None,
                stock_quantity=int(data.get('stock_quantity', 10)),
                sku=sku,
                is_featured=str(data.get('is_featured')).lower() in ['true', '1'],
                main_image_url=data.get('main_image_url') or 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
            )
            db.session.add(product)
            db.session.commit()
            return jsonify(product.to_dict(detail=True)), 201

        # Query Filters
        category = request.args.get('category')
        search = request.args.get('search')
        featured = request.args.get('featured')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        sort = request.args.get('sort', 'newest')
        is_admin = request.args.get('admin')

        query = Product.query
        if str(is_admin).lower() not in ['true', '1']:
            query = query.filter_by(is_active=True)

        if category:
            cat = Category.query.filter(
                (Category.slug == category) |
                (Category.id == int(category) if category.isdigit() else False)
            ).first()
            if cat:
                query = query.filter(Product.category_id == cat.id)

        if search:
            search_term = f"%{search.strip().lower()}%"
            query = query.filter(
                db.or_(
                    db.func.lower(Product.name).ilike(search_term),
                    db.func.lower(Product.brand).ilike(search_term),
                    db.func.lower(Product.short_description).ilike(search_term)
                )
            )

        if featured and str(featured).lower() in ['true', '1']:
            query = query.filter_by(is_featured=True)

        if min_price:
            try:
                query = query.filter(Product.price >= float(min_price))
            except ValueError:
                pass

        if max_price:
            try:
                query = query.filter(Product.price <= float(max_price))
            except ValueError:
                pass

        # Sorting
        if sort == 'price_asc':
            query = query.order_by(Product.price.asc())
        elif sort == 'price_desc':
            query = query.order_by(Product.price.desc())
        elif sort == 'rating':
            query = query.order_by(Product.rating.desc())
        elif sort == 'popular':
            query = query.order_by(Product.reviews_count.desc())
        else:
            query = query.order_by(Product.created_at.desc())

        products_list = query.all()
        return jsonify([p.to_dict(detail=False) for p in products_list]), 200

    @app.route('/api/products/<slug_or_id>/', methods=['GET', 'PATCH', 'DELETE'])
    def product_detail(slug_or_id):
        product = Product.query.filter(
            (Product.slug == slug_or_id) |
            (Product.id == int(slug_or_id) if slug_or_id.isdigit() else False)
        ).first()

        if not product:
            return jsonify({'detail': 'Product not found.'}), 404

        if request.method == 'GET':
            return jsonify(product.to_dict(detail=True)), 200

        user = get_user_from_jwt()
        if not user or not (user.is_admin_user or user.is_staff):
            return jsonify({'detail': 'Admin privileges required.'}), 403

        if request.method == 'DELETE':
            db.session.delete(product)
            db.session.commit()
            return jsonify({'message': 'Product deleted successfully.'}), 200

        if request.method == 'PATCH':
            data = request.form.to_dict() if request.form else (request.get_json() or {})
            if 'name' in data:
                product.name = data['name'].strip()
            if 'brand' in data:
                product.brand = data['brand'].strip()
            if 'price' in data:
                product.price = float(data['price'])
            if 'compare_at_price' in data:
                product.compare_at_price = float(data['compare_at_price']) if data['compare_at_price'] else None
            if 'stock_quantity' in data:
                product.stock_quantity = int(data['stock_quantity'])
            if 'short_description' in data:
                product.short_description = data['short_description']
            if 'description' in data:
                product.description = data['description']
            if 'is_featured' in data:
                product.is_featured = str(data['is_featured']).lower() in ['true', '1']
            if 'main_image_url' in data:
                product.main_image_url = data['main_image_url']
            db.session.commit()
            return jsonify(product.to_dict(detail=True)), 200

    # --------------------------------------------------------------------------
    # Cart Endpoints (/api/cart/...)
    # --------------------------------------------------------------------------
    @app.route('/api/cart/', methods=['GET'])
    def view_cart():
        cart = get_current_cart()
        return jsonify(cart.to_dict()), 200

    @app.route('/api/cart/add/', methods=['POST'])
    def add_to_cart():
        cart = get_current_cart()
        data = request.get_json() or {}
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))

        if not product_id:
            return jsonify({'detail': 'product_id is required.'}), 400

        product = Product.query.get(int(product_id))
        if not product or not product.is_active:
            return jsonify({'detail': 'Product not found or inactive.'}), 404

        item = CartItem.query.filter_by(cart_id=cart.id, product_id=product.id).first()
        if item:
            item.quantity += quantity
        else:
            item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
            db.session.add(item)

        db.session.commit()
        return jsonify({
            'message': f"Added {product.name} to cart.",
            'cart': cart.to_dict()
        }), 200

    @app.route('/api/cart/items/<int:item_id>/', methods=['PUT'])
    def update_cart_item(item_id):
        cart = get_current_cart()
        data = request.get_json() or {}
        quantity = int(data.get('quantity', 1))

        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item:
            return jsonify({'detail': 'Cart item not found.'}), 404

        if quantity <= 0:
            db.session.delete(item)
        else:
            item.quantity = quantity

        db.session.commit()
        return jsonify({
            'message': 'Cart updated.',
            'cart': cart.to_dict()
        }), 200

    @app.route('/api/cart/items/<int:item_id>/remove/', methods=['DELETE'])
    def remove_cart_item(item_id):
        cart = get_current_cart()
        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item:
            return jsonify({'detail': 'Cart item not found.'}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({
            'message': 'Item removed from cart.',
            'cart': cart.to_dict()
        }), 200

    @app.route('/api/cart/clear/', methods=['POST'])
    def clear_cart():
        cart = get_current_cart()
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()
        return jsonify({
            'message': 'Cart cleared.',
            'cart': cart.to_dict()
        }), 200

    # --------------------------------------------------------------------------
    # Coupon Endpoints (/api/coupons/...)
    # --------------------------------------------------------------------------
    @app.route('/api/coupons/validate/', methods=['POST'])
    def validate_coupon():
        data = request.get_json() or {}
        code = (data.get('code') or '').strip().upper()
        subtotal = float(data.get('subtotal', 0.0))

        if not code:
            return jsonify({'valid': False, 'message': 'Coupon code is required.'}), 400

        coupon = Coupon.query.filter_by(code=code).first()
        if not coupon:
            return jsonify({'valid': False, 'message': 'Invalid coupon code.'}), 200

        is_valid, msg = coupon.is_valid(subtotal)
        if not is_valid:
            return jsonify({'valid': False, 'message': msg}), 200

        discount = coupon.calculate_discount(subtotal)
        new_total = max(0.0, subtotal - discount)

        return jsonify({
            'valid': True,
            'message': f"Coupon applied: ${discount:.2f} savings!",
            'coupon': {
                'id': coupon.id,
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'discount_value': coupon.discount_value,
                'discount_amount': f"{discount:.2f}",
                'new_total': f"{new_total:.2f}"
            }
        }), 200

    @app.route('/api/coupons/admin/', methods=['GET', 'POST'])
    def admin_coupons():
        user = get_user_from_jwt()
        if not user or not (user.is_admin_user or user.is_staff):
            return jsonify({'detail': 'Admin privileges required.'}), 403

        if request.method == 'POST':
            data = request.get_json() or {}
            code = (data.get('code') or '').strip().upper()
            if not code:
                return jsonify({'detail': 'Code is required.'}), 400

            coupon = Coupon(
                code=code,
                discount_type=data.get('discount_type', 'percentage'),
                discount_value=float(data.get('discount_value', 10.0)),
                min_spend=float(data.get('min_spend', 0.0)),
                max_discount=float(data['max_discount']) if data.get('max_discount') else None,
                usage_limit=int(data['usage_limit']) if data.get('usage_limit') else None,
                is_active=bool(data.get('is_active', True))
            )
            db.session.add(coupon)
            db.session.commit()
            return jsonify(coupon.to_dict()), 201

        coupons = Coupon.query.order_by(Coupon.created_at.desc()).all()
        return jsonify([c.to_dict() for c in coupons]), 200

    @app.route('/api/coupons/admin/<int:coupon_id>/', methods=['DELETE'])
    def delete_coupon(coupon_id):
        user = get_user_from_jwt()
        if not user or not (user.is_admin_user or user.is_staff):
            return jsonify({'detail': 'Admin privileges required.'}), 403

        coupon = Coupon.query.get_or_404(coupon_id)
        db.session.delete(coupon)
        db.session.commit()
        return jsonify({'message': 'Coupon deleted.'}), 200

    # --------------------------------------------------------------------------
    # Orders Endpoints (/api/orders/...)
    # --------------------------------------------------------------------------
    @app.route('/api/orders/', methods=['GET', 'POST'])
    def orders():
        user = get_user_from_jwt()

        if request.method == 'POST':
            cart = get_current_cart()
            if not cart or not cart.items:
                return jsonify({'detail': 'Your shopping cart is empty.'}), 400

            data = request.get_json() or {}
            shipping_name = (data.get('shipping_name') or '').strip()
            shipping_phone = (data.get('shipping_phone') or '').strip()
            shipping_address = (data.get('shipping_address') or '').strip()
            shipping_city = (data.get('shipping_city') or 'Phnom Penh').strip()

            if not shipping_name or not shipping_phone or not shipping_address:
                return jsonify({'detail': 'Name, phone, and delivery address are required.'}), 400

            subtotal = cart.subtotal
            coupon_code = (data.get('coupon_code') or '').strip().upper()
            discount_amount = 0.0

            if coupon_code:
                coupon = Coupon.query.filter_by(code=coupon_code).first()
                if coupon:
                    valid, _ = coupon.is_valid(subtotal)
                    if valid:
                        discount_amount = coupon.calculate_discount(subtotal)
                        coupon.times_used += 1

            # Free shipping over $50, else $5.00
            shipping_fee = 0.0 if subtotal >= 50.0 else 5.0
            tax_amount = 0.0
            total_amount = max(0.0, subtotal - discount_amount) + shipping_fee + tax_amount

            order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

            order = Order(
                order_number=order_number,
                user_id=user.id if user else None,
                guest_email=data.get('guest_email') if not user else None,
                guest_name=shipping_name if not user else None,
                status='pending',
                payment_status='paid' if data.get('payment_method') in ['card', 'aba_khqr'] else 'unpaid',
                payment_method=data.get('payment_method', 'cod'),
                shipping_name=shipping_name,
                shipping_phone=shipping_phone,
                shipping_address=shipping_address,
                shipping_city=shipping_city,
                shipping_state=data.get('shipping_state', ''),
                shipping_postal_code=data.get('shipping_postal_code', ''),
                shipping_country=data.get('shipping_country', 'Cambodia'),
                subtotal=subtotal,
                discount_amount=discount_amount,
                shipping_fee=shipping_fee,
                tax_amount=tax_amount,
                total_amount=total_amount,
                coupon_code=coupon_code if discount_amount > 0 else None,
                notes=data.get('notes', '')
            )
            db.session.add(order)
            db.session.flush()

            # Create OrderItems and decrement stock
            for item in cart.items:
                if not item.product:
                    continue
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item.product.id,
                    product_name=item.product.name,
                    product_image=item.product.main_image_url,
                    price=item.product.price,
                    quantity=item.quantity,
                    total_price=item.total_price
                )
                db.session.add(order_item)
                item.product.stock_quantity = max(0, item.product.stock_quantity - item.quantity)

            # Create Payment record
            payment = Payment(
                order_id=order.id,
                payment_method=order.payment_method,
                amount=order.total_amount,
                status='completed' if order.payment_status == 'paid' else 'pending',
                transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}"
            )
            db.session.add(payment)

            # Clear cart
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()

            return jsonify(order.to_dict()), 201

        # GET User Orders
        if not user:
            return jsonify([]), 200

        user_orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
        return jsonify([o.to_dict() for o in user_orders]), 200

    @app.route('/api/orders/<order_number>/', methods=['GET'])
    def order_detail(order_number):
        order = Order.query.filter(
            (Order.order_number == order_number) |
            (Order.id == int(order_number) if order_number.isdigit() else False)
        ).first()

        if not order:
            return jsonify({'detail': 'Order not found.'}), 404

        return jsonify(order.to_dict()), 200

    @app.route('/api/orders/admin/', methods=['GET'])
    def admin_orders():
        user = get_user_from_jwt()
        if not user or not (user.is_admin_user or user.is_staff):
            return jsonify({'detail': 'Admin privileges required.'}), 403

        status = request.args.get('status')
        query = Order.query
        if status:
            query = query.filter_by(status=status)

        all_orders = query.order_by(Order.created_at.desc()).all()
        return jsonify([o.to_dict() for o in all_orders]), 200

    @app.route('/api/orders/admin/<int:order_id>/status/', methods=['PATCH'])
    def update_order_status(order_id):
        user = get_user_from_jwt()
        if not user or not (user.is_admin_user or user.is_staff):
            return jsonify({'detail': 'Admin privileges required.'}), 403

        order = Order.query.get_or_404(order_id)
        data = request.get_json() or {}

        if 'status' in data:
            order.status = data['status']
        if 'payment_status' in data:
            order.payment_status = data['payment_status']

        db.session.commit()
        return jsonify(order.to_dict()), 200

    # --------------------------------------------------------------------------
    # Reviews Endpoints (/api/reviews/...)
    # --------------------------------------------------------------------------
    @app.route('/api/reviews/product/<slug_or_id>/', methods=['GET', 'POST'])
    def product_reviews(slug_or_id):
        product = Product.query.filter(
            (Product.slug == slug_or_id) |
            (Product.id == int(slug_or_id) if slug_or_id.isdigit() else False)
        ).first()

        if not product:
            return jsonify({'detail': 'Product not found.'}), 404

        if request.method == 'POST':
            data = request.get_json() or {}
            rating = int(data.get('rating', 5))
            comment = (data.get('comment') or '').strip()

            if not comment:
                return jsonify({'detail': 'Comment is required.'}), 400

            user = get_user_from_jwt()
            reviewer_name = data.get('reviewer_name') or (user.name if user else 'Verified Customer')

            review = Review(
                product_id=product.id,
                user_id=user.id if user else None,
                reviewer_name=reviewer_name,
                rating=min(5, max(1, rating)),
                title=data.get('title', ''),
                comment=comment,
                is_verified_purchase=True
            )
            db.session.add(review)
            db.session.flush()

            # Recalculate product rating
            all_revs = Review.query.filter_by(product_id=product.id).all()
            if all_revs:
                product.rating = round(sum(r.rating for r in all_revs) / len(all_revs), 1)
                product.reviews_count = len(all_revs)

            db.session.commit()
            return jsonify(review.to_dict()), 201

        revs = Review.query.filter_by(product_id=product.id).order_by(Review.created_at.desc()).all()
        return jsonify([r.to_dict() for r in revs]), 200

    return app

if __name__ == '__main__':
    app = create_app()
    print("========================================================")
    print("  [+] ShopEase Flask Server Started Successfully!")
    print("  Local:   http://127.0.0.1:8000")
    print("  Network: http://localhost:8000")
    print("========================================================")
    app.run(host='0.0.0.0', port=8000, debug=True)
