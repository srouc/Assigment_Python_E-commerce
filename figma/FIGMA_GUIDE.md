# ShopEase Figma Design System & Import Guide

This directory contains the complete **Figma UI/UX Design System assets** for the **ShopEase E-Commerce Platform**.

```
shopease/figma/
│
├── 01_storefront_home.svg       # Figma Frame: Storefront Homepage (1440x1200)
├── 02_product_detail.svg        # Figma Frame: Product Details & Gallery (1440x960)
├── 03_cart_drawer.svg           # Figma Frame: Slide-Out Cart & Coupon Engine (1440x900)
├── 04_checkout_khqr.svg         # Figma Frame: Multi-Payment & ABA KHQR Scan (1440x920)
├── 05_admin_dashboard.svg       # Figma Frame: Admin Metrics & Orders Table (1440x900)
├── shopease-figma-tokens.json   # Figma Design Tokens (Tokens Studio & Variables)
└── FIGMA_GUIDE.md               # Step-by-Step Figma Import Instructions
```

---

## Method 1: Direct Drag-and-Drop into Figma (Recommended & Fastest)

Figma natively opens and parses SVG files into **100% editable vector layers, frames, colors, and typography**:

1. Open your **Figma Desktop App** or visit **[figma.com](https://figma.com)** in your browser and create a New Design File.
2. Open Windows File Explorer and navigate to:
   ```
   d:\E-COM\shopease\figma\
   ```
3. Simply **drag and drop** the `.svg` files directly onto your Figma canvas:
   - `01_storefront_home.svg` ➜ Imports the complete desktop storefront with hero banner, categories, product grid, and trust badges.
   - `02_product_detail.svg` ➜ Imports the split gallery, specs, star ratings, and quantity stepper.
   - `03_cart_drawer.svg` ➜ Imports the slide-out cart drawer with the free shipping progress meter and coupon discount.
   - `04_checkout_khqr.svg` ➜ Imports the multi-step checkout form and Cambodian ABA KHQR payment scanner.
   - `05_admin_dashboard.svg` ➜ Imports the store manager portal with 4 revenue KPI metric cards and orders data table.
4. Each element (Text, Buttons, Badges, Vectors, Cards) will be grouped into individual editable Figma layers!

---

## Method 2: Import Figma Design Tokens via "Tokens Studio"

To apply standardized global color styles, typography styles, and spacing variables to your Figma document:

1. In Figma, open the **Plugins** menu and search for **"Tokens Studio for Figma"** (or Figma Local Variables).
2. Click **Load / Import Tokens**.
3. Select the file:
   ```
   d:\E-COM\shopease\figma\shopease-figma-tokens.json
   ```
4. All design tokens (`brand-primary-600`, `success-emerald`, `dark-slate-950`, spacing, shadows, and radii) will be loaded automatically into your Figma file!

---

## Method 3: 1-Click Convert Live Running Web Pages into Figma (html.to.design)

Since our Next.js frontend is fully running on `http://localhost:3000`:

1. In Figma, install and open the popular free plugin: **"html.to.design"**.
2. Start the ShopEase frontend by double-clicking `start_frontend.bat` (or `start_all.bat`).
3. In the plugin, enter any of the local URLs:
   - `http://localhost:3000` (Home)
   - `http://localhost:3000/shop` (Catalog with filters)
   - `http://localhost:3000/design-system` (UI/UX Design System Showcase)
   - `http://localhost:3000/orders` (Order Tracking)
4. Click **Import**. The plugin will automatically convert the live React/Tailwind web page into Figma Auto-Layout components with real images and fonts!
