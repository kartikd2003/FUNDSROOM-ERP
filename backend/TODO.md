# Backend Fixes - TODO

## ✅ Step 1: Fix LOW stock filter and limit validation in product.repository.ts

- [x] Fix LOW stock filter to check `currentStock <= minimumStock` using raw query
- [x] Add limit validation restricting to [20, 50, 100]

## ✅ Step 2: Add getAllMovements to stock.service.ts

- [x] Add service method exposing repository method

## ✅ Step 3: Add getAllMovements to stock.controller.ts

- [x] Add controller method

## ✅ Step 4: Add GET / route in stock.routes.ts

- [x] Add route for all movements

