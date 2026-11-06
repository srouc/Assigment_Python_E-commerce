import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from decimal import Decimal
from apps.accounts.models import User
from apps.categories.models import Category
from apps.products.models import Product, ProductImage
from apps.coupons.models import Coupon
from apps.orders.models import Order
from apps.cart.models import Cart, CartItem

def run_specification_verification():
    print("=" * 70)
    print("  VERIFYING ALL SPECIFICATION TEST CASES ON DJANGO BACKEND")
    print("=" * 70)

    client = APIClient()

    # TEST CASE 1: User Authentication
    print("\n[TEST CASE 1] User Authentication:")
    login_res = client.post('/api/accounts/login/', {
        'email': 'customer@shopease.com',
        'password': 'customer123'
    }, format='json')
    assert login_res.status_code == 200, f"Login failed: {login_res.data}"
    customer_token = login_res.data['access']
    customer_headers = {'HTTP_AUTHORIZATION': f'Bearer {customer_token}'}
    print("  ✓ Customer login successful (JWT received)")

    admin_login = client.post('/api/accounts/login/', {
        'email': 'admin@shopease.com',
        'password': 'admin123'
    }, format='json')
    assert admin_login.status_code == 200
    admin_token = admin_login.data['access']
    admin_headers = {'HTTP_AUTHORIZATION': f'Bearer {admin_token}'}
    print("  ✓ Admin login successful (JWT received)")

    # TEST CASE 2: Search & Filter (Sony in Electronics)
    print("\n[TEST CASE 2] Search & Filter:")
    sony_res = client.get('/api/products/', {'search': 'Sony', 'category': 'electronics'})
    assert sony_res.status_code == 200
    sony_products = sony_res.data if isinstance(sony_res.data, list) else sony_res.data.get('results', [])
    assert len(sony_products) > 0, "Sony product not found in Electronics"
    sony_prod = sony_products[0]
    assert 'Sony' in sony_prod['name']
    print(f"  ✓ Found product: '{sony_prod['name']}' at ${sony_prod['price']}")

    # TEST CASE 3: Product Details & Gallery
    print("\n[TEST CASE 3] Product Details & Gallery:")
    detail_res = client.get(f"/api/products/{sony_prod['slug']}/")
    assert detail_res.status_code == 200
    detail = detail_res.data
    assert 'description' in detail
    assert 'images' in detail
    print(f"  ✓ Retrieved details for '{detail['name']}' with {len(detail['images'])} gallery images")

    # TEST CASE 4: Add to Cart (Quantity: 2)
    print("\n[TEST CASE 4] Add to Cart:")
    session_key = 'spec-test-session-12345'
    session_headers = {'HTTP_X_SESSION_KEY': session_key}
    
    # Empty cart first
    client.post('/api/cart/clear/', {}, format='json', **session_headers)
    
    add_res = client.post('/api/cart/add/', {
        'product_id': sony_prod['id'],
        'quantity': 2
    }, format='json', **session_headers)
    assert add_res.status_code == 200
    cart_data = add_res.data.get('cart', {})
    assert cart_data.get('total_items') == 2
    print(f"  ✓ Added 2 items to cart. Cart subtotal: ${cart_data.get('subtotal')}")

    # TEST CASE 5: Coupon Validation (SAVE15 -> $15 discount)
    print("\n[TEST CASE 5] Coupon Validation (SAVE15):")
    coupon_res = client.post('/api/coupons/validate/', {
        'code': 'SAVE15',
        'subtotal': float(cart_data['subtotal'])
    }, format='json', **session_headers)
    assert coupon_res.status_code == 200
    assert coupon_res.data['valid'] is True
    discount_val = coupon_res.data['coupon']['discount_amount']
    assert Decimal(discount_val) == Decimal('15.00')
    print(f"  ✓ Coupon SAVE15 applied successfully! Discount: ${discount_val}")

    # TEST CASE 6: Checkout & Stock Decrement (ABA KHQR)
    print("\n[TEST CASE 6] Checkout & Stock Decrement:")
    initial_stock = Product.objects.get(id=sony_prod['id']).stock_quantity
    order_res = client.post('/api/orders/', {
        'shipping_name': 'Dara Sok',
        'shipping_phone': '+85512345678',
        'shipping_address': 'St 271, Phnom Penh',
        'shipping_city': 'Phnom Penh',
        'payment_method': 'aba_khqr',
        'coupon_code': 'SAVE15'
    }, format='json', **session_headers)
    assert order_res.status_code == 201
    order_data = order_res.data
    order_number = order_data['order_number']
    assert order_number.startswith('ORD-')
    
    # Verify stock decremented by 2
    new_stock = Product.objects.get(id=sony_prod['id']).stock_quantity
    assert new_stock == initial_stock - 2
    print(f"  ✓ Order created successfully! Order Reference: {order_number}")
    print(f"  ✓ Inventory decremented atomically from {initial_stock} to {new_stock}")

    # TEST CASE 7: Order Tracking
    print("\n[TEST CASE 7] Order Tracking:")
    fetch_order_res = client.get(f"/api/orders/{order_number}/")
    assert fetch_order_res.status_code == 200
    assert fetch_order_res.data['order_number'] == order_number
    assert fetch_order_res.data['payment_method'] == 'aba_khqr'
    print(f"  ✓ Order {order_number} status: {fetch_order_res.data['status_display']}")

    # TEST CASE 8: Admin Operations
    print("\n[TEST CASE 8] Admin Operations:")
    admin_orders_res = client.get('/api/orders/admin/', **admin_headers)
    assert admin_orders_res.status_code == 200
    
    # Update order status to Processing
    status_update_res = client.patch(f"/api/orders/admin/{order_data['id']}/status/", {
        'status': 'processing',
        'payment_status': 'paid'
    }, format='json', **admin_headers)
    assert status_update_res.status_code == 200
    assert status_update_res.data['status'] == 'processing'
    assert status_update_res.data['payment_status'] == 'paid'
    print(f"  ✓ Admin updated order {order_number} to: Processing & Paid")

    print("\n" + "=" * 70)
    print("  ALL 8 SPECIFICATION TEST CASES PASSED WITH 100% SUCCESS!")
    print("  DJANGO BACKEND FULLY COMPLIANT WITH PROJECT SPECIFICATION!")
    print("=" * 70)

if __name__ == '__main__':
    run_specification_verification()

