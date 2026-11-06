# SHOPEASE E-COMMERCE PLATFORM
## Comprehensive Project Specification & System Documentation
**Document Version:** 1.0.0  
**Prepared For:** Course Assignment / Final Project Submission  
**Technology Stack:** Next.js (TypeScript & Tailwind CSS) + Python (Django REST Framework)  
**Date:** November 2026  

---

# TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Technology Stack & System Architecture](#2-technology-stack--system-architecture)
3. [User Roles & Access Control Matrix](#3-user-roles--access-control-matrix)
4. [Detailed Functional Specifications](#4-detailed-functional-specifications)
   - 4.1 [User Authentication & Account Management](#41-user-authentication--account-management)
   - 4.2 [Product Catalog & Discovery Engine](#42-product-catalog--discovery-engine)
   - 4.3 [Product Details & Customer Review System](#43-product-details--customer-review-system)
   - 4.4 [Shopping Cart & Session Synchronization](#44-shopping-cart--session-synchronization)
   - 4.5 [Coupon & Promotional Discount Engine](#45-coupon--promotional-discount-engine)
   - 4.6 [Checkout & Multi-Payment Processing](#46-checkout--multi-payment-processing)
   - 4.7 [Order Lifecycle & Tracking](#47-order-lifecycle--tracking)
   - 4.8 [Administrator Dashboard & Store Management](#48-administrator-dashboard--store-management)
5. [Database Schema & Data Models](#5-database-schema--data-models)
6. [RESTful API Architecture & Endpoints](#6-restful-api-architecture--endpoints)
7. [Security & Data Integrity Mechanisms](#7-security--data-integrity-mechanisms)
8. [Testing Guide & Demo Verification](#8-testing-guide--demo-verification)

---

# 1. EXECUTIVE SUMMARY

The **ShopEase Platform** is an enterprise-grade, full-stack E-Commerce solution developed to deliver a seamless shopping experience for consumers and an intuitive control center for store owners. 

The application is structured into two autonomous, loosely coupled tiers:
- **A Client-Side Frontend Application** built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**, designed for speed, responsiveness, and accessibility.
- **A Server-Side Backend Application** built with **Python 3.14** and **Django REST Framework (DRF)**, providing secure cryptographic JSON Web Token (JWT) authentication, atomic database transactions, dynamic serialization, and strict Cross-Origin Resource Sharing (CORS) policies.

Key achievements of the platform include seamless guest-to-customer shopping cart migration, automated stock decrementation under concurrency, real-time star-rating calculations, coupon validation logic, and support for localized payment methods including Cash On Delivery (COD) and ABA KHQR mobile banking.

---

# 2. TECHNOLOGY STACK & SYSTEM ARCHITECTURE

## 2.1 Technology Overview

| Tier | Component | Technology / Library | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework | Next.js 14 (Pages Router) | Fast page transitions, SSR / SSG capabilities |
| | Language | TypeScript 5.6 | Strict static typing and code reliability |
| | Styling | Tailwind CSS 3.4 + PostCSS | Modern, utility-first responsive interface |
| | Icons | Lucide React | Clean, scalable vector UI icons |
| | HTTP Client | Axios 1.7 | REST API communication with interceptors |
| | State Management | React Context API | Global authentication, shopping cart, and toasts |
| **Backend** | Framework | Django 6.1 + Django REST Framework 3.18 | High-level Python web framework & REST APIs |
| | Language | Python 3.14 | Core backend language |
| | Authentication | SimpleJWT (JSON Web Tokens) | Stateless, cryptographic access/refresh tokens |
| | Image Processing | Pillow (PIL) 13.0 | Managing uploaded media files |
| | Database | SQLite (Dev) / PostgreSQL Ready | Relational data persistence with foreign keys |
| | CORS Management | django-cors-headers | Cross-origin requests from frontend port |

## 2.2 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            CLIENT BROWSER (PORT 3000)                             |
|                                                                                   |
|  [ Storefront ]       [ Shop Catalog ]       [ Cart & Checkout ]   [ Admin UI ]   |
|         |                     |                      |                   |        |
|  +-----------------------------------------------------------------------------+  |
|  |             React Context State (AuthContext, CartContext, ToastContext)    |  |
|  +-----------------------------------------------------------------------------+  |
|         |                     |                      |                   |        |
|  +-----------------------------------------------------------------------------+  |
|  |             Axios API Client (JWT Bearer Token + X-Session-Key Interceptor) |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (JSON)
                                           v
+-----------------------------------------------------------------------------------+
|                             BACKEND API (PORT 8000)                               |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |           Django Middleware (CorsMiddleware, AuthenticationMiddleware)       |  |
|  +-----------------------------------------------------------------------------+  |
|         |                     |                      |                   |        |
|  [ apps.accounts ]    [ apps.products ]      [ apps.cart ]       [ apps.orders ]  |
|  [ apps.categories ]  [ apps.coupons ]       [ apps.reviews ]    [ apps.payments ]|
|         |                     |                      |                   |        |
|  +-----------------------------------------------------------------------------+  |
|  |                Django ORM (Object-Relational Mapping Engine)                |  |
|  +-----------------------------------------------------------------------------+  |
|                                          |                                        |
|                                          v                                        |
|                        +-----------------------------------+                      |
|                        |     SQLite3 Database Engine       |                      |
|                        +-----------------------------------+                      |
+-----------------------------------------------------------------------------------+
```

---

# 3. USER ROLES & ACCESS CONTROL MATRIX

The system enforces Role-Based Access Control (RBAC) across both API endpoints and frontend routing:

| Feature / Action | Guest (Unauthenticated) | Customer (Authenticated) | Administrator (Staff) |
| :--- | :---: | :---: | :---: |
| Browse Catalog & Search Products | Yes | Yes | Yes |
| View Product Details & Reviews | Yes | Yes | Yes |
| Add Products to Cart (Session Key) | Yes | Yes | Yes |
| Apply Promo Coupons | Yes | Yes | Yes |
| Place Order (Guest Checkout) | Yes | Yes | Yes |
| Submit Customer Review | No | Yes | Yes |
| View Past Order History (`/orders`) | No | Yes | Yes |
| Manage Saved Delivery Addresses | No | Yes | Yes |
| Access Admin Dashboard (`/admin`) | No | No | Yes |
| Create / Edit / Delete Products | No | No | Yes |
| Change Order Fulfillment Status | No | No | Yes |
| Create Discount Promo Coupons | No | No | Yes |

---

# 4. DETAILED FUNCTIONAL SPECIFICATIONS

## 4.1 User Authentication & Account Management

### A. User Registration (`POST /api/accounts/register/`)
1. **Inputs:** `full_name`, `email`, `phone_number`, `password`, `confirm_password`.
2. **Business Rules:**
   - Password must be at least 6 characters long.
   - `password` and `confirm_password` must match exactly.
   - Email uniqueness is enforced; case-insensitive comparison prevents duplicates (e.g. `User@mail.com` and `user@mail.com`).
   - Emails are automatically trimmed of accidental whitespace.
3. **Outcome:** A new `User` record is created with hashed password (PBKDF2 SHA-256) and the user is automatically logged in.

### B. User Login (`POST /api/accounts/login/`)
1. **Inputs:** `email`, `password`.
2. **Business Rules:**
   - Case-insensitive email resolution via Django ORM `email__iexact`.
   - Automatic trimming of accidental whitespace.
   - Password verification using Django's secure `check_password()` method.
   - Verification that user account is active (`is_active=True`).
3. **Outputs:**
   - `access`: Short-term JWT access token (valid 7 days).
   - `refresh`: Long-term JWT refresh token (valid 30 days).
   - `user`: Serialized user object (ID, full name, email, avatar, admin flags).
4. **Convenience Feature:** Single-click demo buttons on `/auth/login` to auto-fill Administrator (`admin@shopease.com`) and Customer (`customer@shopease.com`) credentials.

### C. Address Management (`/api/accounts/addresses/`)
- Allows users to maintain multiple shipping profiles (Recipient Name, Phone, Street, City, State, Country, Postal Code).
- Enforces single-default rule: Setting an address as `is_default=True` automatically switches previous defaults to `False`.

---

## 4.2 Product Catalog & Discovery Engine

### A. Dynamic Search Bar
- Real-time search in frontend navigation and catalog page.
- Queries across multiple fields simultaneously: `Product.name`, `Product.description`, `Product.brand`, and `Product.sku`.

### B. Multi-Parametric Filtering
- **Category Filter:** View items by category slug with live count indicators.
- **Price Range Filter:** Input minimum and maximum values (`price__gte` and `price__lte`).
- **Featured Filter:** Filter items designated for homepage highlights (`is_featured=True`).
- **Inventory Filter:** Public users only view active, in-stock products (`is_active=True`).

### C. Intelligent Sorting
Users can re-order the catalog instantly:
- `newest`: Sort by creation date descending (`-created_at`).
- `price_asc`: Sort by price low-to-high (`price`).
- `price_desc`: Sort by price high-to-low (`-price`).
- `rating`: Sort by customer star score (`-rating`).
- `popular`: Sort by total customer reviews (`-reviews_count`).

---

## 4.3 Product Details & Customer Review System

### A. Media Gallery
- Displays primary product image with full-height zoom.
- Interactive thumbnail carousel enabling customers to inspect all supplementary angles uploaded in `ProductImage`.

### B. Inventory & Discount Indicators
- Visual in-stock indicator showing available quantity.
- Automated discount calculator comparing `price` with `compare_at_price`:
  $$\text{Discount Percentage} = \left(\frac{\text{Compare Price} - \text{Price}}{\text{Compare Price}}\right) \times 100$$
- Prevents adding quantities higher than the database stock value.

### C. Verified Reviews & Dynamic Rating Engine
- Authenticated customers can post reviews containing a 1 to 5-star score, review title, and written feedback.
- Reviews check whether the user has previously purchased the item to display a green **"Verified Purchase"** badge.
- **Automated Statistical Recalculation:** When a review is created or deleted, an ORM aggregation runs:
  $$Product.rating = \text{Average}(\text{Review.rating})$$
  $$Product.reviews\_count = \text{Count}(\text{Review.id})$$

---

## 4.4 Shopping Cart & Session Synchronization

### A. Dual Cart Modes
1. **Authenticated Users:** Cart is linked directly to `User` Foreign Key.
2. **Guest Visitors:** Cart is linked to an anonymous session token transmitted via custom header `X-Session-Key`.

### B. Automated Guest-to-Customer Cart Merging
When an anonymous visitor with items in their cart logs in or creates an account:
1. The backend locates the guest cart matching `X-Session-Key`.
2. It migrates all `CartItem` objects to the authenticated user's cart.
3. If an item already exists in both, their quantities are combined.
4. The temporary guest cart record is destroyed.

### C. Quick Cart Drawer & Full Cart View
- Slide-out drawer accessible from any page without navigation.
- Real-time quantity adjustment (`+` / `-`) with immediate subtotal updates.
- Free delivery threshold counter: Automatically grants \$0 shipping when subtotal exceeds \$50.

---

## 4.5 Coupon & Promotional Discount Engine

### A. Coupon Validation Rules
When a coupon code is entered, the engine validates:
1. **Existence:** Matches code case-insensitively (`WELCOME10`, `welcome10`).
2. **Active Status:** `Coupon.is_active == True`.
3. **Date Validity:** Current timestamp falls between `valid_from` and `valid_to`.
4. **Usage Limit:** `times_used < usage_limit` (if limit is configured).
5. **Minimum Spend:** Cart subtotal meets or exceeds `min_spend`.

### B. Discount Calculation Logic
- **Percentage Discount:** Calculates discount as a percentage of subtotal, constrained by `max_discount` if defined:
  $$\text{Discount} = \min\left(\frac{\text{Subtotal} \times \text{Discount Value}}{100}, \text{Max Discount}\right)$$
- **Fixed Amount Discount:** Deducts a flat currency amount from subtotal:
  $$\text{Discount} = \min(\text{Discount Value}, \text{Subtotal})$$

---

## 4.6 Checkout & Multi-Payment Processing

### A. Multi-Step Checkout Flow
1. Recipient shipping address (pre-filled from user profile).
2. Contact details (email and mobile number).
3. Delivery notes and instructions.
4. Selection of payment method.

### B. Supported Payment Gateways
- 💵 **Cash On Delivery (COD):** Order status set to `Pending`, Payment status set to `Unpaid`.
- 📱 **ABA KHQR / Mobile Banking:** Generates mobile banking payment transaction, sets Payment status to `Paid`.
- 💳 **Credit / Debit Card:** Supports Visa, Mastercard, and UnionPay.
- 🅿️ **PayPal:** Digital wallet integration.

### C. Atomic Inventory Deduction (`@transaction.atomic`)
To prevent overselling and race conditions:
1. The transaction locks the required product rows.
2. Checks that `Product.stock_quantity >= CartItem.quantity`.
3. Deducts `product.stock_quantity -= item.quantity`.
4. Increments coupon usage count `coupon.times_used += 1`.
5. Generates unique order number `ORD-XXXXXXXX` and payment record `TXN-XXXXXXXXXX`.
6. Empties the customer's cart.
7. If any step fails, the entire transaction rolls back cleanly.

---

## 4.7 Order Lifecycle & Tracking

Every order advances through a deterministic lifecycle state machine:

```
[ PENDING ] --------> [ PROCESSING ] --------> [ SHIPPED ] --------> [ DELIVERED ]
     |                      |                      |
     +----------------------+----------------------+-----------------> [ CANCELLED ]
```

- Customers can track live statuses in `/orders`.
- Each status displays an explanatory badge with color-coded alerts (Yellow for Pending, Blue for Processing, Sky for Shipped, Green for Delivered, Red for Cancelled).

---

## 4.8 Administrator Dashboard & Store Management

Accessible strictly by staff and administrators at `/admin`:

### A. Live Revenue & Store Analytics
- **Total Paid Revenue:** Real-time monetary sum of orders where `payment_status == 'paid'`.
- **Order Count:** Total volume of orders submitted.
- **Catalog Size:** Total inventory SKUs currently monitored.
- **Active Coupons:** Running promotional campaigns.

### B. Product Catalog CRUD
- Add new product with category selection, price, stock quantity, description, and image URL.
- Delete discontinued items.
- Monitor low-stock items.

### C. Order Fulfillment Control
- Live order queue displaying customer address, phone number, and items.
- Dropdown selector to transition order status (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- Action button to mark unpaid Cash on Delivery orders as **Paid**.

### D. Promotional Campaign Creator
- Modal to generate new promo codes (e.g. `FLASH30`, `SUMMER2026`).
- Configure percentage vs. fixed deduction, and minimum cart spend.

---

# 5. DATABASE SCHEMA & DATA MODELS

```
+-------------------+       +--------------------+       +--------------------+
|       User        |       |      Category      |       |      Product       |
+-------------------+       +--------------------+       +--------------------+
| id (PK)           |       | id (PK)            |       | id (PK)            |
| email (Unique)    |       | name (Unique)      |       | category_id (FK)   |
| password (Hashed) |       | slug (Unique)      |       | name               |
| full_name         |       | description        |       | slug (Unique)      |
| phone_number      |       | icon               |       | price (Decimal)    |
| is_admin_user     |       | image_url          |       | compare_at_price   |
| is_staff          |       | is_active          |       | stock_quantity     |
+-------------------+       +--------------------+       | sku (Unique)       |
          |                                              | rating (Decimal)   |
          | 1:N                                          | reviews_count      |
          v                                              | main_image_url     |
+-------------------+                                    +--------------------+
|      Address      |                                              |
+-------------------+                                              | 1:N
| id (PK)           |                                              v
| user_id (FK)      |                                    +--------------------+
| street_address    |                                    |    ProductImage    |
| city, state       |                                    +--------------------+
| postal_code       |                                    | id (PK)            |
| country           |                                    | product_id (FK)    |
| is_default        |                                    | image_url          |
+-------------------+                                    +--------------------+
          |
          | 1:N
          v
+-------------------+       +--------------------+       +--------------------+
|       Order       | 1:N   |     OrderItem      |       |       Review       |
+-------------------+------>+--------------------+       +--------------------+
| id (PK)           |       | id (PK)            |       | id (PK)            |
| order_number (UQ) |       | order_id (FK)      |       | product_id (FK)    |
| user_id (FK, Null)|       | product_id (FK)    |       | user_id (FK, Null) |
| status            |       | product_name       |       | rating (1 to 5)    |
| payment_status    |       | price              |       | comment            |
| payment_method    |       | quantity           |       | is_verified        |
| subtotal          |       | total_price        |       +--------------------+
| discount_amount   |       +--------------------+
| shipping_fee      |
| total_amount      |       +--------------------+       +--------------------+
| shipping_address  |       |        Cart        | 1:N   |      CartItem      |
+-------------------+       +--------------------+------>+--------------------+
          | 1:N             | id (PK)            |       | id (PK)            |
          v                 | user_id (FK, Null) |       | cart_id (FK)       |
+-------------------+       | session_key        |       | product_id (FK)    |
|      Payment      |       +--------------------+       | quantity           |
+-------------------+                                    +--------------------+
| id (PK)           |
| order_id (FK)     |                                    +--------------------+
| amount, status    |                                    |       Coupon       |
| transaction_id    |                                    +--------------------+
+-------------------+                                    | id (PK)            |
                                                         | code (Unique)      |
                                                         | discount_type      |
                                                         | discount_value     |
                                                         | min_spend          |
                                                         +--------------------+
```

---

# 6. RESTFUL API ARCHITECTURE & ENDPOINTS

| Module | Method | Endpoint | Access Level | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/accounts/register/` | Public | Create new account & return user info |
| | `POST` | `/api/accounts/login/` | Public | Authenticate & issue JWT access/refresh |
| | `POST` | `/api/accounts/refresh/` | Public | Renew expired access token |
| | `GET` | `/api/accounts/profile/` | Authenticated | Retrieve profile details of signed-in user |
| | `GET` | `/api/accounts/addresses/` | Authenticated | List saved shipping addresses |
| | `POST` | `/api/accounts/addresses/` | Authenticated | Save new shipping address profile |
| **Catalog** | `GET` | `/api/categories/` | Public | List categories with live product count |
| | `GET` | `/api/products/` | Public | Filterable, searchable, sorted products list |
| | `POST` | `/api/products/` | Admin Only | Create new product in catalog |
| | `GET` | `/api/products/<slug_or_id>/`| Public | Retrieve complete product specifications |
| | `DELETE`| `/api/products/<slug>/` | Admin Only | Delete product from catalog |
| **Cart** | `GET` | `/api/cart/` | Public / User | Fetch current cart items & computed subtotal |
| | `POST` | `/api/cart/add/` | Public / User | Add item to cart with stock validation |
| | `PUT` | `/api/cart/items/<id>/` | Public / User | Update item quantity in cart |
| | `DELETE`| `/api/cart/items/<id>/remove/`| Public / User | Remove item from cart |
| | `POST` | `/api/cart/clear/` | Public / User | Empty entire cart |
| **Coupons** | `POST` | `/api/coupons/validate/` | Public / User | Validate code against subtotal & compute savings |
| | `GET` | `/api/coupons/admin/` | Admin Only | List all store coupons and usage metrics |
| | `POST` | `/api/coupons/admin/` | Admin Only | Create new promotional discount code |
| **Orders** | `GET` | `/api/orders/` | Authenticated | List customer personal order history |
| | `POST` | `/api/orders/` | Public / User | Place order atomically & deduct inventory |
| | `GET` | `/api/orders/<number>/` | Public / User | Retrieve order receipt & tracking details |
| | `GET` | `/api/orders/admin/` | Admin Only | List all store orders for fulfillment |
| | `PATCH` | `/api/orders/admin/<id>/status/`| Admin Only | Update order fulfillment and payment status |
| **Reviews** | `GET` | `/api/reviews/product/<slug>/` | Public | List customer reviews for a product |
| | `POST` | `/api/reviews/product/<slug>/` | Authenticated | Post new star rating and written comment |

---

# 7. SECURITY & DATA INTEGRITY MECHANISMS

1. **Stateless JWT Security:** User sessions use cryptographic JSON Web Tokens. Access tokens expire automatically; secrets are guarded by standard environment keys.
2. **Password Hashing:** Passwords are never stored in plaintext. Django uses standard PBKDF2 with SHA-256 and salted iterations.
3. **Cross-Origin Resource Sharing (CORS):** Backend permits requests explicitly from authorized origins (`http://localhost:3000` and `http://127.0.0.1:3000`), with whitelisted custom headers including `X-Session-Key`.
4. **Race Condition Prevention:** Order placement uses database transactions (`@transaction.atomic`). Product quantities are checked immediately prior to deduction.
5. **SQL Injection & XSS Immunity:** Django ORM uses parameterized queries avoiding raw SQL injections. Next.js React JSX automatically escapes content preventing Cross-Site Scripting (XSS).

---

# 8. TESTING GUIDE & DEMO VERIFICATION

### Step 1: Launch Servers
- Double-click **`start_all.bat`** (or run `start_backend.bat` and `start_frontend.bat`).
- Frontend URL: `http://localhost:3000`
- Backend API URL: `http://127.0.0.1:8000/api/`

### Step 2: Verification Test Cases

| Test Case | Steps to Execute | Expected Result |
| :--- | :--- | :--- |
| **1. User Authentication** | Visit `/auth/login`, click **"Customer User"** button, click Sign In. | Signed in successfully, avatar displays in header. |
| **2. Search & Filter** | Visit `/shop`, type `"Sony"` in search bar, select `Electronics`. | Displays Sony WH-1000XM5 headphones with accurate price. |
| **3. Product Details** | Click the Sony product card. | Gallery thumbnails switch images; specs and reviews appear. |
| **4. Add to Cart** | Select quantity `2`, click **Add To Cart**. | Slide-out drawer opens, item count updates to `2`. |
| **5. Coupon Validation** | Navigate to `/cart`, type `SAVE15`, click Apply. | Instant \$15 discount applied to subtotal. |
| **6. Checkout & Stock** | Click Checkout, choose **ABA KHQR**, click Place Order. | Order confirmation screen displays reference `ORD-XXXXXXXX`; product stock decrements in DB. |
| **7. Order Tracking** | Navigate to `/orders`. | New order appears with `Processing` or `Pending` status. |
| **8. Admin Operations** | Sign out, sign in with **"Admin User"**, click **Admin Panel**. | View total store revenue, update order status, add new product. |

---
*End of Documentation — ShopEase E-Commerce Platform.*

