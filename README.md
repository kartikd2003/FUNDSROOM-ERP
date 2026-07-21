# 📦 Fundsroom - Inventory Management System

Full-stack inventory management system built with **Node.js**, **Express**, **React**, **TypeScript**, and **Prisma** (MySQL). Features product management, category/warehouse CRUD, stock tracking, CSV import/export, image uploads, analytics dashboard, and audit logging.

---

## 🚀 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| **Frontend**  | React 18 + Vite + Recharts     |
| **Backend**   | Node.js + Express + TypeScript |
| **Database**  | MySQL (via Prisma ORM)         |
| **Validation**| Zod                              |
| **Auth**     | JWT + bcrypt                    |
| **Charts**   | Recharts (Pie, Bar, Line)       |
| **Uploads**  | Multer (CSV + Images)           |

---

## 📁 Project Structure

```
Fundsroom/
├── backend/                          # Express API Server
│   ├── prisma/
│   │   └── schema.prisma             # Database models
│   ├── src/
│   │   ├── app.ts                    # Express app setup
│   │   ├── server.ts                 # Entry point + admin seed
│   │   ├── config/
│   │   │   ├── db.ts                 # Prisma client
│   │   │   └── env.ts                # Environment config
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     # JWT auth
│   │   │   ├── role.middleware.ts     # Role-based access
│   │   │   ├── error.middleware.ts    # Error handler
│   │   │   └── notFound.middleware.ts # 404 handler
│   │   ├── modules/product/
│   │   │   ├── controllers/          # Route handlers
│   │   │   ├── services/             # Business logic
│   │   │   ├── repositories/         # Prisma queries
│   │   │   ├── validators/           # Zod schemas
│   │   │   ├── interfaces/           # TypeScript types
│   │   │   ├── routes/               # Express routes
│   │   │   ├── middleware/           # Multer upload config
│   │   │   └── utils/                # CSV helper
│   │   └── routes/index.ts           # Route aggregator
│   └── uploads/products/             # Uploaded images
│
├── frontend/                         # React SPA
│   ├── index.html
│   ├── vite.config.js                # Proxy to backend
│   └── src/
│       ├── App.jsx                   # Router + layout
│       ├── index.css                 # Global styles
│       ├── main.jsx                  # Entry point
│       ├── context/
│       │   └── AuthContext.jsx       # Auth state
│       ├── components/
│       │   └── Sidebar.jsx           # Navigation
│       └── pages/
│           ├── LoginPage.jsx
│           ├── InventoryDashboard.jsx
│           ├── Products.jsx
│           ├── AddProduct.jsx
│           ├── EditProduct.jsx
│           ├── Categories.jsx
│           ├── Warehouses.jsx
│           ├── StockManagement.jsx
│           ├── Analytics.jsx
│           └── AuditLogs.jsx
└── README.md
```

---

## 🔧 Prerequisites

- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** or **yarn**

---

## ⚙️ Backend Setup

### 1. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/fundsroom"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### 2. Create Database

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fundsroom;"
```

### 3. Run Migrations & Seed

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

The server will:
- Auto-run migrations
- Seed an admin user: `admin@erp.com` / `Admin@123`

Server starts on **http://localhost:5000**.

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173** — API calls are proxied to the backend automatically.

### Login

Use the seeded admin credentials:

| Field    | Value            |
|----------|------------------|
| Email    | `admin@erp.com` |
| Password | `Admin@123`     |

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| POST   | `/api/auth/login` | Login (returns JWT) |

### 📦 Products

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/products`                   | List with search/filter/sort/pagination |
| POST   | `/api/products`                   | Create product                 |
| GET    | `/api/products/:id`               | Get single product             |
| PUT    | `/api/products/:id`               | Update product                 |
| DELETE | `/api/products/:id`               | Soft delete product            |
| GET    | `/api/products/export`            | Export CSV                     |
| POST   | `/api/products/import`            | Import CSV                     |
| POST   | `/api/products/:id/stock/in`      | Stock IN (transactional)       |
| POST   | `/api/products/:id/stock/out`     | Stock OUT (transactional)      |
| POST   | `/api/products/:id/image`         | Upload product image           |

**Product Query Parameters:**
```
?page=1&limit=20&search=laptop&categoryId=1&warehouseId=2
&stockStatus=LOW&minPrice=100&maxPrice=5000
&sortBy=productName&order=asc
```

| Param        | Values                          |
|--------------|---------------------------------|
| `limit`      | 20, 50, 100 (default: 20)       |
| `stockStatus`| `LOW` (currentStock ≤ minimumStock), `OUT` (currentStock = 0) |
| `sortBy`     | productName, unitPrice, currentStock, createdAt |
| `order`      | asc, desc                       |

### 🏷️ Categories

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/categories`      | List with product count         |
| POST   | `/api/categories`      | Create category                 |
| GET    | `/api/categories/:id`  | Get single category             |
| PUT    | `/api/categories/:id`  | Update category                 |
| DELETE | `/api/categories/:id`  | Delete (blocked if products exist) |

### 🏭 Warehouses

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/warehouses`      | List with product count         |
| POST   | `/api/warehouses`      | Create warehouse                |
| GET    | `/api/warehouses/:id`  | Get single warehouse            |
| PUT    | `/api/warehouses/:id`  | Update warehouse                |
| DELETE | `/api/warehouses/:id`  | Delete (blocked if products exist) |

### 📋 Stock Movements

| Method | Endpoint                     | Description          |
|--------|------------------------------|----------------------|
| GET    | `/api/stock`                 | All movements        |
| POST   | `/api/stock`                 | Create movement      |
| GET    | `/api/stock/:productId/history` | Product history   |

### 📊 Dashboard

| Method | Endpoint                                  | Description             |
|--------|-------------------------------------------|-------------------------|
| GET    | `/api/inventory-dashboard/summary`        | Summary cards           |
| GET    | `/api/inventory-dashboard/category-stock` | Stock by category (pie) |
| GET    | `/api/inventory-dashboard/stock-movement` | Monthly IN/OUT (bar)    |
| GET    | `/api/inventory-dashboard/activity`       | Recent activity feed    |
| GET    | `/api/inventory-dashboard/low-stock`      | Low stock alerts        |

### 📈 Analytics

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| GET    | `/api/analytics/monthly-movement?months=6` | Monthly IN/OUT chart |
| GET    | `/api/analytics/top-products?top=10`  | Top products by movement |
| GET    | `/api/analytics/category-stock`       | Category stock analysis  |

### 📝 Audit Logs

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/audit`      | All logs (filterable)    |

```
?action=CREATE|UPDATE|DELETE|STOCK_UPDATE
```

---

## 🗄️ Database Schema

### Product

```prisma
model Product {
  id              Int
  productName     String
  sku             String       (unique)
  unitPrice       Decimal
  currentStock    Int
  minimumStock    Int
  imageUrl        String?
  categoryId      Int          → Category
  warehouseId     Int          → Warehouse
  deletedAt       DateTime?
  createdAt       DateTime
  updatedAt       DateTime
}
```

### StockMovement

```prisma
model StockMovement {
  id          Int
  productId   Int          → Product
  warehouseId Int          → Warehouse
  quantity    Int
  type        StockMovementType  (IN / OUT)
  reason      String?
  userId      Int?
  createdAt   DateTime
}
```

---

## 📐 Architecture Pattern

```
React Frontend
      │
      ▼  Axios (proxy via Vite)
   Express API
      │
      ▼
   Controller   (req/res handling)
      │
      ▼
   Service      (business logic, transactions)
      │
      ▼
   Repository   (Prisma queries)
      │
      ▼
   Prisma ORM
      │
      ▼
   MySQL Database
```

---

## 🔒 Key Business Rules

| Rule | Implementation |
|------|---------------|
| **Unique SKU** | Checked in service before create/update |
| **Category exists** | Validated before product creation |
| **Warehouse exists** | Validated before product/stock operations |
| **Cannot delete category with products** | `prisma.product.count` check in service |
| **Cannot delete warehouse with products** | `prisma.product.count` check in service |
| **LOW stock detection** | `currentStock <= minimumStock` via raw SQL |
| **Insufficient stock prevention** | Checked in `$transaction` before stock OUT |
| **Atomic stock update** | Prisma `$transaction` ensures stock update + movement creation are atomic |

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

---

## 📄 NPM Scripts

### Backend

| Script       | Description                    |
|--------------|--------------------------------|
| `npm run dev`  | Start dev server (ts-node-dev) |
| `npm run build` | Compile TypeScript           |
| `npm start`   | Run compiled JS                |
| `npm test`    | Run tests                      |

### Frontend

| Script        | Description                |
|---------------|----------------------------|
| `npm run dev`   | Start Vite dev server      |
| `npm run build` | Build for production       |
| `npm run preview` | Preview production build |

---

## 🧩 Feature Summary

| Module            | Status |
|-------------------|--------|
| Product CRUD      | ✅     |
| Category CRUD     | ✅     |
| Warehouse CRUD    | ✅     |
| Stock IN/OUT APIs | ✅     |
| Search (name/SKU/category) | ✅ |
| Filter (category/warehouse/stock/price) | ✅ |
| Pagination (20/50/100) | ✅ |
| Sorting (name/price/stock/date) | ✅ |
| CSV Export        | ✅     |
| CSV Import        | ✅     |
| Product Images    | ✅     |
| Stock History     | ✅     |
| Transactional Safety | ✅ |
| Dashboard Summary | ✅     |
| Charts (Pie/Bar/Line) | ✅ |
| Analytics         | ✅     |
| Audit Logs        | ✅     |
| JWT Auth          | ✅     |
| Role-Based Access | ✅     |
| Delete Protection | ✅     |
| Image Upload      | ✅     |

---

## 📸 Pages Overview

**Login** → **Dashboard** (cards, charts, activity, low stock alerts)
**Products** → CRUD table with search → filter → sort → pagination → stock IN/OUT modals → image upload → CSV import/export
**Categories** → List with product count → add/edit modal → delete with protection
**Warehouses** → List with product count → add/edit modal → delete with protection
**Stock Movements** → All movements table → product-wise history filter
**Analytics** → Monthly line chart → top products bar chart → category stock bar chart
**Audit Logs** → Filterable action log (CREATE/UPDATE/DELETE/STOCK_UPDATE)

---

## 📬 Sample API Requests

### Search + Filter + Paginate Products

```http
GET /api/products?page=1&limit=20&search=laptop&categoryId=1&sortBy=unitPrice&order=desc
```

### Stock IN (Transactional)

```http
POST /api/products/1/stock/in
Content-Type: application/json

{
  "quantity": 50,
  "warehouseId": 1,
  "reason": "Supplier delivery",
  "userId": 1
}
```

### Create Category

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic items"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a pull request

---

## 📄 License

MIT © Fundsroom
