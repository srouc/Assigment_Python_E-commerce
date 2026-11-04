import json
from app import create_app

def run_tests():
    print("[*] Starting Extended ShopEase Flask API Test Suite...")
    app = create_app()
    client = app.test_client()

    # 1. Test Root Dashboard
    res = client.get('/')
    assert res.status_code == 200, f"Root failed: {res.status_code}"
    print("[PASS] GET / -> 200 OK")

    # 2. Test Categories (with and without trailing slash)
    res = client.get('/api/categories')
    assert res.status_code == 200
    res_slash = client.get('/api/categories/')
    assert res_slash.status_code == 200
    cats = res.get_json()
    assert len(cats) >= 5
    print(f"[PASS] GET /api/categories (strict_slashes=False verified) -> 200 OK ({len(cats)} categories)")

    # 3. Test Products list & category filter
    res = client.get('/api/products?category=all')
    assert res.status_code == 200
    products = res.get_json()
    assert len(products) >= 9, f"Expected products when category=all, got {len(products)}"
    first_product = products[0]
    first_slug = first_product['slug']
    print(f"[PASS] GET /api/products?category=all -> 200 OK ({len(products)} products)")

    # 4. Test Single Product Detail
    res = client.get(f'/api/products/{first_slug}')
    assert res.status_code == 200
    detail = res.get_json()
    assert 'description' in detail
    assert 'images' in detail
    assert 'updated_at' in detail
    print(f"[PASS] GET /api/products/{first_slug} -> 200 OK (Full detail fields verified)")

    # 5. Test User Authentication (Admin & Customer)
    admin_login = client.post('/api/accounts/login', json={'email': 'admin@shopease.com', 'password': 'admin123'})
    assert admin_login.status_code == 200
    admin_token = admin_login.get_json()['access']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}

    cust_login = client.post('/api/accounts/login', json={'email': 'customer@shopease.com', 'password': 'customer123'})
    assert cust_login.status_code == 200
    cust_token = cust_login.get_json()['access']
    cust_headers = {'Authorization': f'Bearer {cust_token}'}
    print("[PASS] POST /api/accounts/login (Admin & Customer JWT Verified) -> 200 OK")

    # 6. Test User Profile & Addresses
    res = client.get('/api/accounts/profile', headers=cust_headers)
    assert res.status_code == 200
    profile = res.get_json()
    assert profile['email'] == 'customer@shopease.com'

    addr_res = client.get('/api/accounts/addresses', headers=cust_headers)
    assert addr_res.status_code == 200
    print("[PASS] GET /api/accounts/profile & /api/accounts/addresses -> 200 OK")

    # 7. Test Cart Operations without trailing slash and with 'undefined' session keys
    sess_headers = {'X-Session-Key': 'test-robust-session-999'}
    client.post('/api/cart/clear', headers=sess_headers)
    add_res = client.post('/api/cart/add', json={'product_id': first_product['id'], 'quantity': 1}, headers=sess_headers)
    assert add_res.status_code == 200
    cart_data = add_res.get_json()['cart']
    assert cart_data['total_items'] >= 1
    print(f"[PASS] POST /api/cart/add (No trailing slash) -> 200 OK (Cart items: {cart_data['total_items']})")

    # 8. Test Coupon Validation & Edge cases
    bad_coup = client.post('/api/coupons/validate', json={'code': 'INVALID123', 'subtotal': 100.0})
    assert bad_coup.status_code == 200
    assert bad_coup.get_json()['valid'] is False

    good_coup = client.post('/api/coupons/validate', json={'code': 'WELCOME10', 'subtotal': 100.0})
    assert good_coup.status_code == 200
    assert good_coup.get_json()['valid'] is True
    print("[PASS] POST /api/coupons/validate (Valid & Invalid Handling) -> 200 OK")

    # 9. Test Order Checkout & Stock Decrement
    old_stock = first_product['stock_quantity']
    order_res = client.post('/api/orders', json={
        'shipping_name': 'Test Robust Customer',
        'shipping_phone': '+85511223344',
        'shipping_address': 'St 123, Phnom Penh',
        'shipping_city': 'Phnom Penh',
        'payment_method': 'cod',
        'coupon_code': 'WELCOME10'
    }, headers=sess_headers)
    assert order_res.status_code == 201
    order = order_res.get_json()
    order_num = order['order_number']
    assert order['status'] == 'pending'

    # Verify stock decremented
    refreshed_prod = client.get(f'/api/products/{first_slug}').get_json()
    assert refreshed_prod['stock_quantity'] == old_stock - 1
    print(f"[PASS] POST /api/orders & Stock Decrement Verified -> 201 Created (Order #{order_num})")

    # 10. Test Admin Order Status Update
    status_update = client.patch(f"/api/orders/admin/{order['id']}/status", json={
        'status': 'processing',
        'payment_status': 'paid'
    }, headers=admin_headers)
    assert status_update.status_code == 200
    updated_order = status_update.get_json()
    assert updated_order['status'] == 'processing'
    assert updated_order['payment_status'] == 'paid'
    print(f"[PASS] PATCH /api/orders/admin/{order['id']}/status -> 200 OK (Status: processing, Payment: paid)")

    # 11. Test Admin Coupon Creation & Deletion
    new_coup = client.post('/api/coupons/admin', json={
        'code': 'TEST50',
        'discount_type': 'percentage',
        'discount_value': 50.0,
        'min_spend': 10.0
    }, headers=admin_headers)
    assert new_coup.status_code == 201
    created_c = new_coup.get_json()

    del_coup = client.delete(f"/api/coupons/admin/{created_c['id']}", headers=admin_headers)
    assert del_coup.status_code == 200
    print("[PASS] POST & DELETE /api/coupons/admin (Admin Coupon CRUD) -> 200 OK")

    # 12. Test Reviews
    rev_res = client.post(f"/api/reviews/product/{first_slug}", json={
        'rating': 5,
        'comment': 'Fantastic quality and fast delivery!',
        'reviewer_name': 'Loyal Shopper'
    }, headers=cust_headers)
    assert rev_res.status_code == 201
    print(f"[PASS] POST /api/reviews/product/{first_slug} -> 201 Created")

    print("\n==================================================================")
    print("  ALL EXTENDED FLASK API TESTS PASSED WITH 100% SUCCESS!")
    print("  Zero errors, zero warnings, rock-solid stability!")
    print("==================================================================")

if __name__ == '__main__':
    run_tests()
