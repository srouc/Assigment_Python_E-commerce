# ShopEase — Full-Stack E-Commerce Platform

ShopEase is a modern, full-stack E-Commerce web application built with **Next.js (TypeScript & Tailwind CSS)** for the frontend and **Python (Django REST Framework & JWT)** for the backend.

---

## 📁 Project Structure

```
shopease/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── ProductCard.tsx
│       │   ├── CartDrawer.tsx
│       │   └── RatingStars.tsx
│       ├── layouts/
│       │   ├── MainLayout.tsx
│       │   └── AdminLayout.tsx
│       ├── pages/
│       │   ├── home/
│       │   ├── shop/
│       │   ├── product/
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── auth/
│       │   ├── admin/
│       │   ├── orders/
│       │   └── _app.tsx
│       ├── services/
│       │   ├── api.ts
│       │   ├── authService.ts
│       │   ├── productService.ts
│       │   ├── cartService.ts
│       │   ├── orderService.ts
│       │   ├── couponService.ts
│       │   └── reviewService.ts
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   ├── CartContext.tsx
│       │   └── ToastContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useCart.ts
│       │   └── useDebounce.ts
│       ├── types/
│       │   └── index.ts
│       └── App.tsx
│
└── backend/
    ├── config/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── wsgi.py
    │   └── asgi.py
    ├── apps/
    │   ├── accounts/     # Custom User, Profile, JWT Auth, Address Book
    │   ├── categories/   # Product Categories with image and slug
    │   ├── products/     # Product Catalog, Stock, Gallery, Search & Filter
    │   ├── cart/         # Shopping Cart (Guest & Authenticated Sync)
    │   ├── orders/       # Order processing, status tracking, items
    │   ├── payments/     # Payment handling (COD, ABA KHQR, Card, PayPal)
    │   ├── reviews/      # Product reviews, star ratings & verified purchase
    │   └── coupons/      # Promo coupon validation & discounts
    ├── media/
    ├── manage.py
    └── requirements.txt
```

---

## ⚡ Quick Start Guide

### 1. Backend (Django REST Framework)

```powershell
# In terminal 1 (Backend):
cd d:\E-COM\shopease\backend

# Activate virtual environment
..\..\venv\Scripts\activate

# Run database migrations (already applied)
python manage.py migrate

# Populate sample products, categories, coupons, and demo accounts (already seeded)
python manage.py seed_data

# Start backend server
python manage.py runserver 127.0.0.1:8000
```
- API Base URL: `http://127.0.0.1:8000/api/`
- Django Admin: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend (Next.js & Tailwind CSS)

```powershell
# In terminal 2 (Frontend):
cd d:\E-COM\shopease\frontend

# Start Next.js development server
npm run dev
```
- Storefront URL: `http://localhost:3000`

---

## 🔑 Demo Accounts & Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@shopease.com` | `admin123` | Full Admin Dashboard & Storefront |
| **Customer** | `customer@shopease.com` | `customer123` | Storefront, Cart, Orders, Checkout |

*(You can also click the quick-login buttons on the `/auth/login` page to auto-fill these credentials)*

---

## 🎟️ Demo Promo Coupons

- `WELCOME10`: 10% discount on orders over $20
- `SAVE15`: $15 off on orders over $60
- `SUPER20`: 20% discount on orders over $100

---

## 🚀 Key Features

1. **Catalog & Shop Page**:
   - Filter by categories, price ranges, in-stock status
   - Dynamic real-time search with instant results
   - Sorting by Price (Low to High / High to Low), Highest Rating, Popularity, and Newest Arrivals
2. **Product Detail**:
   - Image gallery with interactive thumbnail switching
   - Stock counter & discount percentage badges
   - Customer Reviews submission & star rating calculation
   - Recommended related products
3. **Cart & Slide-out Drawer**:
   - Real-time quantity adjustment & instant removal
   - Subtotal calculations with coupon deduction
   - Session persistence for guest carts and automatic merging upon login
4. **Checkout & Multi-Payment**:
   - Shipping address management
   - Supports Cash on Delivery (COD), ABA KHQR / Mobile Banking, Credit Card, and PayPal
   - Stock deduction & payment transaction creation
5. **Customer Orders**:
   - Order history tracking with live fulfillment status (Pending, Processing, Shipped, Delivered)
6. **Admin Dashboard**:
   - Revenue and sales statistics
   - Add, edit, and delete products
   - Update order status and payment status
   - Create and manage discount coupons

