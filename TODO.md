# Module 3 - Full Implementation Plan

## Phase 1: Backend Missing Steps

### Step 10: Dashboard Backend APIs (Inventory Dashboard)
- [ ] Create `controllers/dashboard.controller.ts` (inventory-specific dashboard)
- [ ] Create `services/dashboard.service.ts`
- [ ] Create `repositories/dashboard.repository.ts`
- [ ] Create `routes/dashboard.routes.ts`
- [ ] Register routes in app.ts

### Step 11: Low Stock Alerts
- [ ] Create alert APIs for InventoryAlert table
- [ ] Create alert service + repository
- [ ] Auto-generate alerts when stock is low

### Step 12: CSV Import/Export
- [ ] Install multer, csv-parser, json2csv
- [ ] Create upload middleware
- [ ] Create CSV helper
- [ ] Create import controller/service/repository/routes
- [ ] Create export service + controller + route
- [ ] Register routes

### Step 13: Product Images
- [ ] Add imageUrl field to schema (already done via AuditLog? No, need to add to Product)
- [ ] Create imageUpload middleware
- [ ] Create image controller/service/repository
- [ ] Create image routes
- [ ] Serve static /uploads
- [ ] Register routes

### Step 14: Audit Log
- [ ] Create audit controller/service/repository/routes
- [ ] Register routes

### Step 15: Analytics
- [ ] Create analytics controller/service/repository/routes
- [ ] Register routes

### Step 16: RBAC
- [ ] Already have roles in schema, auth middleware, role middleware
- [ ] Create permission middleware
- [ ] Apply to product routes

## Phase 2: Frontend (React + Vite)

### Setup
- [ ] Create Vite React app
- [ ] Install dependencies (axios, recharts, react-router-dom)
- [ ] Set up project structure

### Dashboard Page
- [ ] Summary cards (Total Products, Categories, Low Stock, Out of Stock, Inventory Value)
- [ ] Category stock chart (PieChart)
- [ ] Monthly stock movement chart (BarChart)
- [ ] Recent activity timeline
- [ ] Low stock alerts
- [ ] Quick actions

### Product Management
- [ ] Product list with search, filter, pagination, sorting
- [ ] Add product form
- [ ] Edit product form
- [ ] Delete product
- [ ] Stock IN/OUT actions
- [ ] Import CSV
- [ ] Export CSV
- [ ] Image upload

### Category Management
- [ ] Category list
- [ ] Add category
- [ ] Edit category
- [ ] Delete category

### Warehouse Management
- [ ] Warehouse list
- [ ] Add warehouse
- [ ] Edit warehouse
- [ ] Delete warehouse

### Stock Management
- [ ] Stock movement history
- [ ] All movements view

### Analytics Page
- [ ] Inventory value card
- [ ] Most/Least stocked product
- [ ] Low stock table
- [ ] Out of stock table
- [ ] Category report

### Audit Logs
- [ ] Activity timeline

### Auth
- [ ] Login page
- [ ] Token management
- [ ] Route protection
- [ ] Role-based UI

