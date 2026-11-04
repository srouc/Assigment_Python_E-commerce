import json
from app import create_app

def run_tests():
    print("[*] Starting ShopEase Flask API Test Suite...")
    app = create_app()
    client = app.test_client()

    # 1. Test Root Dashboard
    res = client.get('/')
    assert res.status_code == 200, f"Root failed: {res.status_code}"
    print("[PASS] GET / -> 200 OK")

    # 2. Test Categories
    res = client.get('/api/categories/')
    assert res.status_code == 200, f"Categories failed: {res.status_code}"
    cats = res.get_json()
    assert len(cats) >= 5, f"Expected at least 5 categories, got {len(cats)}"
    print(f"[PASS] GET /api/categories/ -> 200 OK ({len(cats)} categories)")

    # 3. Test Products
    res = client.get('/api/products/')
    assert res.status_code == 200, f"Products failed: {res.status_code}"
    products = res.get_json()
    assert len(products) >= 9, f"Expected at least 9 products, got {len(products)}"
    first_product = products[0]
    first_slug = first_product['slug']
    print(f"[PASS] GET /api/products/ -> 200 OK ({len(products)} products)")

    # 4. Test Single Product Detail
    res = client.get(f'/api/products/{first_slug}/')
    assert res.status_code == 200, f"Product detail failed: {res.status_code}"
    detail = res.get_json()
    assert 'description' in detail, "Missing description in detail"
    assert 'images' in detail, "Missing images list in detail"
    print(f"[PASS] GET /api/products/{first_slug}/ -> 200 OK")

    # 5. Test Product Filtering & Sorting
    res = client.get('/api/products/?category=electronics&sort=price_desc')
    assert res.status_code == 200
    filtered = res.get_json()
    assert len(filtered) > 0
    print(f"[PASS] GET /api/products/?category=electronics&sort=price_desc -> 200 OK ({len(filtered)} items)")

    # 6. Test User Authentication
    login_data = {
        'email': 'customer@shopease.com',
        'password': 'customer123'
    }
    res = client.post('/api/accounts/login/', json=login_data)
    assert res.status_code == 200, f"Login failed: {res.get_json()}"
    auth_resp = res.get_json()
    access_token = auth_resp['access']
    headers = {'Authorization': f'Bearer {access_token}'}
    print("[PASS] POST /api/accounts/login/ -> 200 OK (Token received)")

    # 7. Test User Profile
    res = client.get('/api/accounts/profile/', headers=headers)
    assert res.status_code == 200
    profile = res.get_json()
    assert profile['email'] == 'customer@shopease.com'
    print(f"[PASS] GET /api/accounts/profile/ -> 200 OK ({profile['full_name']})")

    # 8. Test Cart Operations
    session_headers = {'X-Session-Key': 'test-session-suite-123'}
    res = client.post('/api/cart/add/', json={'product_id': first_product['id'], 'quantity': 2}, headers=session_headers)
    assert res.status_code == 200, f"Add to cart failed: {res.get_json()}"
    cart_data = res.get_json()['cart']
    assert cart_data['total_items'] >= 2
    print(f"[PASS] POST /api/cart/add/ -> 200 OK (Cart Total: ${cart_data['subtotal']})")

    # 9. Test Coupon Validation
    res = client.post('/api/coupons/validate/', json={'code': 'WELCOME10', 'subtotal': float(cart_data['subtotal'])})
    assert res.status_code == 200
    coupon_resp = res.get_json()
    assert coupon_resp['valid'] is True, f"Coupon invalid: {coupon_resp}"
    print(f"[PASS] POST /api/coupons/validate/ -> 200 OK (Discount: ${coupon_resp['coupon']['discount_amount']})")

    # 10. Test Checkout / Order Creation
    order_payload = {
        'shipping_name': 'Test Dara',
        'shipping_phone': '+85512345678',
        'shipping_address': 'St 271, Phnom Penh',
        'shipping_city': 'Phnom Penh',
        'payment_method': 'cod',
        'coupon_code': 'WELCOME10'
    }
    res = client.post('/api/orders/', json=order_payload, headers=session_headers)
    assert res.status_code == 201, f"Create order failed: {res.get_json()}"
    order = res.get_json()
    order_number = order['order_number']
    assert order['status'] == 'pending'
    print(f"[PASS] POST /api/orders/ -> 201 Created (Order #{order_number})")

    # 11. Test Order Detail
    res = client.get(f'/api/orders/{order_number}/')
    assert res.status_code == 200
    fetched_order = res.get_json()
    assert fetched_order['order_number'] == order_number
    print(f"[PASS] GET /api/orders/{order_number}/ -> 200 OK")

    # 12. Test Reviews
    res = client.get(f'/api/reviews/product/{first_slug}/')
    assert res.status_code == 200
    revs = res.get_json()
    assert len(revs) >= 1
    print(f"[PASS] GET /api/reviews/product/{first_slug}/ -> 200 OK ({len(revs)} reviews)")

    print("\n========================================================")
    print("  ALL 12 FLASK API TESTS PASSED WITH 100% SUCCESS!")
    print("========================================================")

if __name__ == '__main__':
    run_tests()
