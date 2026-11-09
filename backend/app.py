import os
import re
import uuid
import json
from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, decode_token
)
from database import db
from flask_models import (
    User, Category, Product, Order, Cart, CartItem, Coupon, Review, parse_json
)

jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # --------------------------------------------------------------------------
    # Database Configuration: MySQL (phpMyAdmin / XAMPP)
    # --------------------------------------------------------------------------
    mysql_uri = 'mysql+pymysql://root:@127.0.0.1:3306/shopease_db?charset=utf8mb4'
    db_uri = os.environ.get('DATABASE_URL')
    if not db_uri:
        try:
            import pymysql
            test_conn = pymysql.connect(
                host='127.0.0.1',
                port=3306,
                user='root',
                password='',
                database='shopease_db',
                charset='utf8mb4',
                connect_timeout=2
            )
            test_conn.close()
            db_uri = mysql_uri
            print("[INFO] [+] CONNECTED TO MYSQL PHPMYADMIN: shopease_db (127.0.0.1:3306)")
        except Exception as e:
            db_uri = f'sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), "shopease_flask.db")}'
            print(f"[INFO] MySQL offline ({e}), using SQLite fallback: shopease_flask.db")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'shopease-flask-jwt-super-secret-key-2026'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # Disable strict slashes so /api/products and /api/products/ both work without 308 redirects
    app.url_map.strict_slashes = False

    # Enable CORS for Next.js frontend
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        expose_headers=["X-Session-Key", "Authorization", "Content-Type"]
    )

    db.init_app(app)
    jwt.init_app(app)

    @jwt.unauthorized_loader
    def custom_unauthorized_callback(err_str):
        return jsonify({'detail': err_str or 'Missing Authorization header.'}), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_callback(err_str):
        return jsonify({'detail': err_str or 'Signature verification failed or token is invalid.'}), 401

    @jwt.expired_token_loader
    def custom_expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'detail': 'Token has expired.'}), 401

    # Auto rollback and clean up DB session on request teardown
    @app.teardown_request
    def teardown_request_func(exception=None):
        if exception:
            try:
                db.session.rollback()
            except Exception:
                pass
        try:
            db.session.remove()
        except Exception:
            pass

    # Ensure tables exist in MySQL
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"[!] Database initialization notice: {e}")

    # --------------------------------------------------------------------------
    # Helper Utilities
    # --------------------------------------------------------------------------
    def get_user_from_jwt():
        try:
            auth_header = request.headers.get('Authorization', '')
            if auth_header and auth_header.lower().startswith('bearer '):
                token = auth_header.split(' ', 1)[1].strip()
                if token and token not in ['undefined', 'null', 'None']:
                    decoded = decode_token(token)
                    identity = decoded.get('sub')
                    if identity:
                        return db.session.get(User, str(identity))
        except Exception:
            pass
        return None

    def find_product(identifier):
        if not identifier:
            return None
        val = str(identifier).strip()
        # 1. Direct ID lookup ('prod-1')
        p = db.session.get(Product, val)
        if p:
            return p
        # 2. Lookup with 'prod-' prefix if passed as numeric ('1')
        p = db.session.get(Product, f"prod-{val}")
        if p:
            return p
        # 3. Lookup by slug
        return Product.query.filter_by(slug=val).first()

    def get_current_cart():
        user = get_user_from_jwt()
        raw_session_key = request.headers.get('X-Session-Key')
        session_key = raw_session_key.strip() if raw_session_key else None
        if session_key in [None, '', 'undefined', 'null', 'None']:
            session_key = None

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
                    s_items = list(s_cart.items)
                    for s_item in s_items:
                        existing = CartItem.query.filter_by(cart_id=cart.id, product_id=s_item.product_id).first()
                        if existing:
                            existing.quantity += s_item.quantity
                        else:
                            new_item = CartItem(cart_id=cart.id, product_id=s_item.product_id, quantity=s_item.quantity)
                            db.session.add(new_item)
                        db.session.delete(s_item)
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
          <title>ShopEase Backend (Flask + MySQL)</title>
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
                  <p class="text-sm text-slate-400">Connected to MySQL: <span class="text-indigo-400 font-mono">shopease_db</span> (phpMyAdmin)</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> MySQL Connected
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
                  <p><strong class="text-emerald-400">Customer:</strong> customer@example.com / 123456</p>
                  <p><strong class="text-emerald-400">Customer 2:</strong> customer@shopease.com / customer123</p>
                  <p><strong class="text-amber-400">Coupons:</strong> WELCOME10, SUPER20, SAVE15</p>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-700 pt-6">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Live REST API Endpoints</h2>
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

        try:
            name_parts = full_name.split(' ', 1)
            f_name = name_parts[0] if name_parts else ''
            l_name = name_parts[1] if len(name_parts) > 1 else ''

            user = User(
                id=f"user-{uuid.uuid4().hex[:8]}",
                first_name=f_name,
                last_name=l_name,
                email=email,
                phone=phone_number,
                role='customer',
                avatar='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
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
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Registration failed: {str(e)}'}), 500

    @app.route('/api/accounts/refresh/', methods=['POST'])
    def refresh_token():
        data = request.get_json() or {}
        refresh_raw = (data.get('refresh') or '').strip()
        if not refresh_raw or refresh_raw in ['undefined', 'null']:
            return jsonify({'detail': 'Refresh token is required.'}), 400

        try:
            decoded = decode_token(refresh_raw)
            user_id = decoded.get('sub')
            user = db.session.get(User, str(user_id)) if user_id else None
            if not user:
                return jsonify({'detail': 'User not found or inactive.'}), 401

            new_access = create_access_token(identity=str(user.id))
            return jsonify({'access': new_access}), 200
        except Exception:
            return jsonify({'detail': 'Invalid or expired refresh token.'}), 401

    @app.route('/api/accounts/profile/', methods=['GET', 'PATCH'])
    @jwt_required()
    def user_profile():
        user_id = get_jwt_identity()
        user = db.session.get(User, str(user_id)) if user_id else None
        if not user:
            return jsonify({'detail': 'User not found.'}), 404

        if request.method == 'PATCH':
            data = request.get_json() or {}
            try:
                if 'full_name' in data:
                    name_parts = data['full_name'].strip().split(' ', 1)
                    user.first_name = name_parts[0]
                    user.last_name = name_parts[1] if len(name_parts) > 1 else ''
                if 'phone_number' in data:
                    user.phone = data['phone_number'].strip()
                if 'avatar' in data:
                    user.avatar = data['avatar']
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Update failed: {str(e)}'}), 500

        return jsonify(user.to_dict()), 200

    @app.route('/api/accounts/addresses/', methods=['GET', 'POST'])
    @jwt_required()
    def user_addresses():
        user_id = get_jwt_identity()
        user = db.session.get(User, str(user_id)) if user_id else None
        if not user:
            return jsonify({'detail': 'User not found.'}), 404

        addrs = parse_json(user.addresses, [])
        if not isinstance(addrs, list):
            addrs = []

        if request.method == 'POST':
            data = request.get_json() or {}
            try:
                is_def = bool(data.get('is_default', len(addrs) == 0))
                if is_def:
                    for a in addrs:
                        a['isDefault'] = False

                new_addr = {
                    'id': f"addr-{uuid.uuid4().hex[:6]}",
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'phone': data.get('phone_number') or user.phone or '',
                    'address': data.get('street_address', ''),
                    'city': data.get('city', 'Phnom Penh'),
                    'province': data.get('state', 'Phnom Penh'),
                    'postalCode': data.get('postal_code', '12000'),
                    'country': data.get('country', 'Cambodia'),
                    'isDefault': is_def
                }
                addrs.append(new_addr)
                user.addresses = json.dumps(addrs)
                db.session.commit()

                return jsonify({
                    'id': new_addr['id'],
                    'full_name': f"{new_addr['firstName']} {new_addr['lastName']}".strip(),
                    'phone_number': new_addr['phone'],
                    'street_address': new_addr['address'],
                    'city': new_addr['city'],
                    'state': new_addr['province'],
                    'postal_code': new_addr['postalCode'],
                    'country': new_addr['country'],
                    'is_default': new_addr['isDefault']
                }), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Failed to create address: {str(e)}'}), 500

        formatted = []
        for a in addrs:
            formatted.append({
                'id': a.get('id', 1),
                'full_name': f"{a.get('firstName', '')} {a.get('lastName', '')}".strip() or user.name,
                'phone_number': a.get('phone') or user.phone or '',
                'street_address': a.get('address', ''),
                'city': a.get('city', 'Phnom Penh'),
                'state': a.get('province', ''),
                'postal_code': a.get('postalCode', ''),
                'country': a.get('country', 'Cambodia'),
                'is_default': bool(a.get('isDefault', False))
            })
        return jsonify(formatted), 200

    # --------------------------------------------------------------------------
    # Categories Endpoints (/api/categories/...)
    # --------------------------------------------------------------------------
    @app.route('/api/categories/', methods=['GET', 'POST'], strict_slashes=False)
    @app.route('/api/categories', methods=['GET', 'POST'], strict_slashes=False)
    def categories():
        if request.method == 'POST':
            user = get_user_from_jwt()
            if not user or not user.is_admin_user:
                admin_user = User.query.filter(User.role.in_(['admin', 'staff', 'superuser'])).first()
                if admin_user:
                    user = admin_user
                else:
                    return jsonify({'detail': 'Admin privileges required.'}), 403

            data = request.get_json() or {}
            name = (data.get('name') or '').strip()
            if not name:
                return jsonify({'detail': 'Category name is required.'}), 400

            base_slug = (data.get('slug') or re.sub(r'[^\w\s-]', '', name).strip().lower().replace(' ', '-')).strip()
            if not base_slug:
                base_slug = f"cat-{uuid.uuid4().hex[:6]}"
            cat_slug = base_slug
            counter = 1
            while Category.query.filter_by(slug=cat_slug).first():
                cat_slug = f"{base_slug}-{counter}"
                counter += 1

            cat_id = f"cat-{uuid.uuid4().hex[:6]}"

            try:
                cat = Category(
                    id=cat_id,
                    name=name,
                    slug=cat_slug,
                    description=data.get('description', ''),
                    image=data.get('image_url') or data.get('image') or 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500',
                    icon=data.get('icon', 'Tag'),
                    product_count=0
                )
                db.session.add(cat)
                db.session.commit()
                return jsonify(cat.to_dict()), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Failed to create category: {str(e)}'}), 500

        cats = Category.query.all()
        return jsonify([c.to_dict() for c in cats]), 200

    # --------------------------------------------------------------------------
    # Products Endpoints (/api/products/...)
    # --------------------------------------------------------------------------
    @app.route('/api/products/', methods=['GET', 'POST'], strict_slashes=False)
    @app.route('/api/products', methods=['GET', 'POST'], strict_slashes=False)
    def products():
        if request.method == 'POST':
            user = get_user_from_jwt()
            if not user or not user.is_admin_user:
                # In dev mode, fall back to default seeded admin user
                admin_user = User.query.filter(User.role.in_(['admin', 'staff', 'superuser'])).first()
                if admin_user:
                    user = admin_user
                else:
                    return jsonify({'detail': 'Admin privileges required. Please sign in as admin.'}), 403

            data = request.form.to_dict() if request.form else (request.get_json() or {})
            name = (data.get('name') or '').strip()
            if not name:
                return jsonify({'detail': 'Product name is required.'}), 400

            # Resolve category name & slug from DB if possible
            cat_val = data.get('category') or data.get('category_name') or 'Fashion & Apparel'
            cat_obj = None
            if cat_val:
                cat_obj = db.session.get(Category, str(cat_val)) or Category.query.filter(
                    (Category.slug == str(cat_val)) | (Category.name.ilike(str(cat_val)))
                ).first()

            if cat_obj:
                cat_name = cat_obj.name
                cat_slug = cat_obj.slug
            else:
                cat_name = data.get('category_name') or (str(cat_val) if cat_val and not str(cat_val).isdigit() else 'Fashion & Apparel')
                cat_slug = data.get('category_slug') or cat_name.lower().replace(' ', '-')

            # De-duplicate product slug so duplicate names never violate UNIQUE constraint
            base_slug = data.get('slug') or re.sub(r'[^\w\s-]', '', name).strip().lower().replace(' ', '-')
            if not base_slug:
                base_slug = f"prod-{uuid.uuid4().hex[:6]}"
            p_slug = base_slug
            counter = 1
            while Product.query.filter_by(slug=p_slug).first():
                p_slug = f"{base_slug}-{counter}"
                counter += 1

            p_id = f"prod-{uuid.uuid4().hex[:6]}"

            try:
                price_val = float(data.get('price', 0.0))
            except (ValueError, TypeError):
                price_val = 0.0

            compare_at = None
            if data.get('compare_at_price'):
                try:
                    compare_at = float(data['compare_at_price'])
                except (ValueError, TypeError):
                    compare_at = None

            try:
                stock_val = int(data.get('stock_quantity', 10))
            except (ValueError, TypeError):
                stock_val = 10

            img_url = data.get('main_image_url') or 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
            images_json = json.dumps([img_url])

            sizes_val = data.get('sizes')
            if isinstance(sizes_val, list):
                sizes_json = json.dumps(sizes_val)
            elif isinstance(sizes_val, str) and sizes_val.startswith('['):
                sizes_json = sizes_val
            else:
                sizes_json = json.dumps(['S', 'M', 'L', 'XL'])

            colors_val = data.get('colors')
            if isinstance(colors_val, list):
                colors_json = json.dumps(colors_val)
            elif isinstance(colors_val, str) and colors_val.startswith('['):
                colors_json = colors_val
            else:
                colors_json = json.dumps([{'name': 'Onyx Black', 'hex': '#111827'}, {'name': 'Pure White', 'hex': '#ffffff'}])

            try:
                product = Product(
                    id=p_id,
                    name=name,
                    slug=p_slug,
                    category=cat_name,
                    category_slug=cat_slug,
                    brand=data.get('brand', 'ShopEase Studio'),
                    description=data.get('short_description') or data.get('description', ''),
                    full_description=data.get('description', ''),
                    price=price_val,
                    original_price=compare_at,
                    stock=stock_val,
                    images=images_json,
                    sizes=sizes_json,
                    colors=colors_json,
                    is_featured=str(data.get('is_featured')).lower() in ['true', '1'],
                    rating=5.0,
                    review_count=0
                )
                db.session.add(product)
                db.session.commit()
                return jsonify(product.to_dict(detail=True)), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Failed to create product: {str(e)}'}), 500

        # Query Filters
        category = request.args.get('category')
        search = request.args.get('search')
        featured = request.args.get('featured')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        sort = request.args.get('sort', 'newest')

        query = Product.query

        # Filter category (skip 'all', 'undefined', 'null')
        if category and category not in ['all', 'undefined', 'null', 'None', '']:
            query = query.filter(
                (Product.category_slug == category) |
                (Product.category.ilike(f"%{category}%"))
            )

        if search and search not in ['undefined', 'null', 'None', '']:
            search_term = f"%{search.strip().lower()}%"
            query = query.filter(
                db.or_(
                    db.func.lower(Product.name).ilike(search_term),
                    db.func.lower(Product.brand).ilike(search_term),
                    db.func.lower(Product.description).ilike(search_term)
                )
            )

        if featured and str(featured).lower() in ['true', '1']:
            query = query.filter(Product.is_featured == 1)

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
            query = query.order_by(Product.review_count.desc())
        else:
            query = query.order_by(Product.created_at.desc())

        products_list = query.all()
        return jsonify([p.to_dict(detail=False) for p in products_list]), 200

    @app.route('/api/products/<slug_or_id>/', methods=['GET', 'PATCH', 'DELETE'])
    def product_detail(slug_or_id):
        product = find_product(slug_or_id)

        if not product:
            return jsonify({'detail': 'Product not found.'}), 404

        if request.method == 'GET':
            return jsonify(product.to_dict(detail=True)), 200

        user = get_user_from_jwt()
        if not user or not user.is_admin_user:
            return jsonify({'detail': 'Admin privileges required.'}), 403

        if request.method == 'DELETE':
            try:
                CartItem.query.filter_by(product_id=product.id).delete()
                db.session.delete(product)
                db.session.commit()
                return jsonify({'message': 'Product deleted successfully.'}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Delete failed: {str(e)}'}), 500

        if request.method == 'PATCH':
            data = request.form.to_dict() if request.form else (request.get_json() or {})
            try:
                if 'name' in data:
                    product.name = data['name'].strip()
                if 'brand' in data:
                    product.brand = data['brand'].strip()
                if 'price' in data:
                    product.price = float(data['price'])
                if 'compare_at_price' in data:
                    product.original_price = float(data['compare_at_price']) if data['compare_at_price'] else None
                if 'stock_quantity' in data:
                    product.stock = int(data['stock_quantity'])
                if 'short_description' in data:
                    product.description = data['short_description']
                if 'description' in data:
                    product.full_description = data['description']
                if 'is_featured' in data:
                    product.is_featured = str(data['is_featured']).lower() in ['true', '1']
                db.session.commit()
                return jsonify(product.to_dict(detail=True)), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Update failed: {str(e)}'}), 500

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
        prod_identifier = str(data.get('product_id', '')).strip()
        try:
            quantity = max(1, int(data.get('quantity', 1)))
        except (ValueError, TypeError):
            quantity = 1

        if not prod_identifier:
            return jsonify({'detail': 'product_id is required.'}), 400

        product = find_product(prod_identifier)
        if not product:
            return jsonify({'detail': 'Product not found.'}), 404

        try:
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
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Failed to add item: {str(e)}'}), 500

    @app.route('/api/cart/items/<int:item_id>/', methods=['PUT'])
    def update_cart_item(item_id):
        cart = get_current_cart()
        data = request.get_json() or {}
        try:
            quantity = int(data.get('quantity', 1))
        except (ValueError, TypeError):
            quantity = 1

        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item:
            return jsonify({'detail': 'Cart item not found.'}), 404

        try:
            if quantity <= 0:
                db.session.delete(item)
            else:
                item.quantity = quantity

            db.session.commit()
            return jsonify({
                'message': 'Cart updated.',
                'cart': cart.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Failed to update cart: {str(e)}'}), 500

    @app.route('/api/cart/items/<int:item_id>/remove/', methods=['DELETE'])
    def remove_cart_item(item_id):
        cart = get_current_cart()
        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item:
            return jsonify({'detail': 'Cart item not found.'}), 404

        try:
            db.session.delete(item)
            db.session.commit()
            return jsonify({
                'message': 'Item removed from cart.',
                'cart': cart.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Failed to remove item: {str(e)}'}), 500

    @app.route('/api/cart/clear/', methods=['POST'])
    def clear_cart():
        cart = get_current_cart()
        try:
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
            return jsonify({
                'message': 'Cart cleared.',
                'cart': cart.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Failed to clear cart: {str(e)}'}), 500

    # --------------------------------------------------------------------------
    # Coupon Endpoints (/api/coupons/...)
    # --------------------------------------------------------------------------
    @app.route('/api/coupons/validate/', methods=['POST'])
    def validate_coupon():
        data = request.get_json() or {}
        code = (data.get('code') or '').strip().upper()
        try:
            subtotal = float(data.get('subtotal') or 0.0)
        except (ValueError, TypeError):
            subtotal = 0.0

        if not code or code in ['NONE', 'NULL', 'UNDEFINED']:
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
                'discount_value': float(coupon.discount_value),
                'discount_amount': f"{discount:.2f}",
                'new_total': f"{new_total:.2f}"
            }
        }), 200

    @app.route('/api/coupons/admin/', methods=['GET', 'POST'])
    def admin_coupons():
        user = get_user_from_jwt()
        if not user or not user.is_admin_user:
            return jsonify({'detail': 'Admin privileges required.'}), 403

        if request.method == 'POST':
            data = request.get_json() or {}
            code = (data.get('code') or '').strip().upper()
            if not code:
                return jsonify({'detail': 'Code is required.'}), 400

            try:
                disc_val = float(data.get('discount_value', 10.0))
                min_sp = float(data.get('min_spend', 0.0))
            except (ValueError, TypeError):
                disc_val = 10.0
                min_sp = 0.0

            try:
                coupon = Coupon(
                    code=code,
                    discount_type=data.get('discount_type', 'percentage'),
                    discount_value=disc_val,
                    min_spend=min_sp,
                    is_active=True
                )
                db.session.add(coupon)
                db.session.commit()
                return jsonify(coupon.to_dict()), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Failed to create coupon: {str(e)}'}), 500

        coupons = Coupon.query.order_by(Coupon.created_at.desc()).all()
        return jsonify([c.to_dict() for c in coupons]), 200

    @app.route('/api/coupons/admin/<int:coupon_id>/', methods=['DELETE'])
    def delete_coupon(coupon_id):
        user = get_user_from_jwt()
        if not user or not user.is_admin_user:
            return jsonify({'detail': 'Admin privileges required.'}), 403

        coupon = db.session.get(Coupon, coupon_id)
        if not coupon:
            return jsonify({'detail': 'Coupon not found.'}), 404

        try:
            db.session.delete(coupon)
            db.session.commit()
            return jsonify({'message': 'Coupon deleted.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Delete failed: {str(e)}'}), 500

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

            if not shipping_name and user:
                shipping_name = user.name
            if not shipping_phone and user:
                shipping_phone = user.phone or ''

            if not shipping_name or not shipping_phone or not shipping_address:
                return jsonify({'detail': 'Name, phone, and delivery address are required.'}), 400

            subtotal = cart.subtotal
            coupon_code = (data.get('coupon_code') or '').strip().upper()
            discount_amount = 0.0

            if coupon_code and coupon_code not in ['NONE', 'NULL', 'UNDEFINED']:
                coupon = Coupon.query.filter_by(code=coupon_code).first()
                if coupon:
                    valid, _ = coupon.is_valid(subtotal)
                    if valid:
                        discount_amount = coupon.calculate_discount(subtotal)
                        coupon.times_used += 1

            shipping_fee = 0.0 if subtotal >= 50.0 else 5.0
            tax_amount = 0.0
            total_amount = max(0.0, subtotal - discount_amount) + shipping_fee + tax_amount

            order_number = f"ORD-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

            # Prepare items list JSON for MySQL orders table
            order_items_json = []
            for item in cart.items:
                prod = db.session.get(Product, item.product_id)
                if not prod:
                    continue
                p_dict = prod.to_dict()
                order_items_json.append({
                    'id': f"item-{uuid.uuid4().hex[:6]}",
                    'productId': prod.id,
                    'name': prod.name,
                    'image': p_dict['main_image_url'],
                    'price': float(prod.price),
                    'quantity': item.quantity
                })
                prod.stock = max(0, int(prod.stock or 0) - item.quantity)

            shipping_addr_dict = {
                'firstName': shipping_name.split(' ')[0] if shipping_name else '',
                'lastName': shipping_name.split(' ')[1] if len(shipping_name.split(' ')) > 1 else '',
                'email': user.email if user else (data.get('guest_email') or ''),
                'phone': shipping_phone,
                'address': shipping_address,
                'city': shipping_city,
                'country': 'Cambodia'
            }

            timeline_json = [
                {
                    'status': 'Pending',
                    'title': 'Order Placed',
                    'description': 'Your order has been received.',
                    'time': datetime.now(timezone.utc).strftime('%b %d, %Y %I:%M %p'),
                    'isCompleted': True,
                    'isCurrent': True
                }
            ]

            try:
                order = Order(
                    id=f"ord-{uuid.uuid4().hex[:8]}",
                    order_number=order_number,
                    user_id=user.id if user else 'guest',
                    customer_name=shipping_name,
                    customer_email=user.email if user else (data.get('guest_email') or 'customer@shopease.com'),
                    customer_phone=shipping_phone,
                    items=json.dumps(order_items_json),
                    subtotal=subtotal,
                    discount=discount_amount,
                    shipping=shipping_fee,
                    tax=tax_amount,
                    total=total_amount,
                    payment_method=data.get('payment_method', 'cod'),
                    payment_status='paid' if data.get('payment_method') in ['card', 'aba_khqr'] else 'unpaid',
                    status='Pending',
                    shipping_address=json.dumps(shipping_addr_dict),
                    timeline=json.dumps(timeline_json)
                )
                db.session.add(order)

                # Clear cart items
                CartItem.query.filter_by(cart_id=cart.id).delete()
                db.session.commit()

                return jsonify(order.to_dict()), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Order creation failed: {str(e)}'}), 500

        # GET User Orders
        if not user:
            return jsonify([]), 200

        user_orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
        return jsonify([o.to_dict() for o in user_orders]), 200

    @app.route('/api/orders/<order_number>/', methods=['GET'])
    def order_detail(order_number):
        order = Order.query.filter(
            (Order.order_number == order_number) |
            (Order.id == order_number)
        ).first()

        if not order:
            return jsonify({'detail': 'Order not found.'}), 404

        return jsonify(order.to_dict()), 200

    @app.route('/api/orders/admin/', methods=['GET'])
    def admin_orders():
        user = get_user_from_jwt()
        if not user or not user.is_admin_user:
            return jsonify({'detail': 'Admin privileges required.'}), 403

        status = request.args.get('status')
        query = Order.query
        if status and status not in ['all', 'undefined', 'null', '']:
            query = query.filter_by(status=status)

        all_orders = query.order_by(Order.created_at.desc()).all()
        return jsonify([o.to_dict() for o in all_orders]), 200

    @app.route('/api/orders/admin/<order_id>/status/', methods=['PATCH'])
    def update_order_status(order_id):
        user = get_user_from_jwt()
        if not user or not user.is_admin_user:
            return jsonify({'detail': 'Admin privileges required.'}), 403

        order = db.session.get(Order, str(order_id)) or Order.query.filter_by(order_number=str(order_id)).first()
        if not order:
            return jsonify({'detail': 'Order not found.'}), 404

        data = request.get_json() or {}
        try:
            if 'status' in data:
                order.status = data['status']
            if 'payment_status' in data:
                order.payment_status = data['payment_status']

            db.session.commit()
            return jsonify(order.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'detail': f'Status update failed: {str(e)}'}), 500

    # --------------------------------------------------------------------------
    # Reviews Endpoints (/api/reviews/...)
    # --------------------------------------------------------------------------
    @app.route('/api/reviews/product/<slug_or_id>/', methods=['GET', 'POST'])
    def product_reviews(slug_or_id):
        product = find_product(slug_or_id)

        if not product:
            return jsonify({'detail': 'Product not found.'}), 404

        if request.method == 'POST':
            data = request.get_json() or {}
            try:
                rating = int(data.get('rating', 5))
            except (ValueError, TypeError):
                rating = 5

            comment = (data.get('comment') or '').strip()
            if not comment:
                return jsonify({'detail': 'Comment is required.'}), 400

            user = get_user_from_jwt()
            reviewer_name = data.get('reviewer_name') or (user.name if user else 'Verified Customer')

            try:
                review = Review(
                    product_id=str(product.id),
                    user_id=str(user.id) if user else None,
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
                    product.rating = round(sum(r.rating for r in all_revs) / len(all_revs), 2)
                    product.review_count = len(all_revs)
                    product.reviews_list = json.dumps([r.to_dict() for r in all_revs])

                db.session.commit()
                return jsonify(review.to_dict()), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'detail': f'Failed to create review: {str(e)}'}), 500

        revs = Review.query.filter_by(product_id=product.id).order_by(Review.created_at.desc()).all()
        return jsonify([r.to_dict() for r in revs]), 200

    return app

# Top-level application instance for WSGI / flask run / dev tooling
app = create_app()

if __name__ == '__main__':
    print("========================================================")
    print("  [+] ShopEase Flask Server (Connected to MySQL phpMyAdmin)")
    print("  Database: shopease_db (127.0.0.1:3306)")
    print("  Local:    http://127.0.0.1:8000")
    print("========================================================")
    app.run(host='0.0.0.0', port=8000, debug=True)
