from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse

def root_api_index(request):
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>ShopEase Backend API</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
            .card { max-width: 600px; margin: auto; background: #1e293b; padding: 32px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border: 1px solid #334155; }
            h1 { color: #818cf8; margin-top: 0; font-size: 26px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .badge { display: inline-block; background: #064e3b; color: #34d399; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; }
            ul { list-style: none; padding: 0; margin: 20px 0; }
            li { margin-bottom: 10px; }
            a { color: #38bdf8; text-decoration: none; font-size: 14px; font-weight: 500; }
            a:hover { text-decoration: underline; }
            .btn { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 10px; font-size: 14px; }
            .btn:hover { background: #4338ca; color: white; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge">● Backend API Online</span>
            <h1>ShopEase Django REST API</h1>
            <p>The Python backend server is active and responding. Below are the endpoints and the link to open the frontend storefront:</p>
            
            <a href="http://localhost:3000" target="_blank" class="btn">🚀 Open Storefront (http://localhost:3000)</a>

            <h3 style="margin-top: 28px; font-size: 15px; color: #cbd5e1;">Available Endpoints:</h3>
            <ul>
                <li>📦 <a href="/api/products/">/api/products/</a> — Products catalog & search</li>
                <li>🏷️ <a href="/api/categories/">/api/categories/</a> — Categories list</li>
                <li>🛒 <a href="/api/cart/">/api/cart/</a> — Shopping cart</li>
                <li>🧾 <a href="/api/orders/">/api/orders/</a> — Customer orders</li>
                <li>🎟️ <a href="/api/coupons/admin/">/api/coupons/admin/</a> — Coupons</li>
                <li>🛡️ <a href="/admin/">/admin/</a> — Django Administration Panel</li>
            </ul>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('', root_api_index, name='api_root_index'),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/categories/', include('apps.categories.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/coupons/', include('apps.coupons.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
