# POS Backend — API Documentation

> Base URL: `http://localhost:3000`  
> Interactive Swagger UI: `http://localhost:3000/api`  
> Version: 1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Standard Response Format](#3-standard-response-format)
4. [Auth Endpoints](#4-auth-endpoints)
5. [Users Endpoints](#5-users-endpoints)
6. [Businesses Endpoints](#6-businesses-endpoints)
7. [Categories Endpoints](#7-categories-endpoints)
8. [Menu / Products Endpoints](#8-menu--products-endpoints)
9. [Transactions Endpoints](#9-transactions-endpoints)
10. [Reports Endpoints](#10-reports-endpoints)
11. [Receipts Endpoints](#11-receipts-endpoints)
12. [Upload Endpoints](#12-upload-endpoints)
13. [Data Models & Enums](#13-data-models--enums)
14. [Error Reference](#14-error-reference)

---

## 1. Overview

This is a multi-tenant Point of Sale (POS) REST API built with NestJS + PostgreSQL (Prisma ORM).

### Multi-tenancy
Every authenticated request is automatically scoped to the user's `businessId`.
FE/mobile clients do **not** need to pass a `businessId` — it is derived from the JWT token.

### Roles
| Role | Description |
|------|-------------|
| `ADMIN` | Platform-level super admin. Manages all businesses. |
| `BUSINESS_OWNER` | Owner of a business. Full access to their own business data. |
| `KASIR` | Cashier. Can create/view transactions and read products/categories. |

---

## 2. Authentication & Authorization

All protected endpoints require a Bearer JWT token in the `Authorization` header.

```
Authorization: Bearer <your_access_token>
```

The token is obtained from `POST /auth/login` or the OAuth sign-in endpoints.

### Optional header
| Header | Description |
|--------|-------------|
| `x-device-id` | Device identifier string. Used for single-session enforcement (new login from a different device invalidates the previous session). |

---

## 3. Standard Response Format

All responses are wrapped in a standard envelope:

**Success**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": { ... },
  "timestamp": "2026-07-23T10:00:00.000Z"
}
```

**Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-07-23T10:00:00.000Z"
}
```

---

## 4. Auth Endpoints

### POST /auth/login
Authenticate with email + password. Returns a JWT and user object.

**Auth required:** No

**Request body:**
```json
{
  "email": "admin@pos.com",
  "password": "admin123"
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx",
    "email": "admin@pos.com",
    "name": "Admin User",
    "role": "BUSINESS_OWNER",
    "businessId": "biz-id",
    "lastLoginAt": "2026-07-23T10:00:00.000Z"
  }
}
```

**Notes for mobile:** Pass the device UUID in `x-device-id` header. A new login invalidates any existing session on a different device.

---

### POST /auth/register
Create a new user and a new business in one transaction.

**Auth required:** Yes — `ADMIN` role only

**Request body:**
```json
{
  "email": "owner@shop.com",
  "password": "password123",
  "name": "John Doe",
  "businessName": "My Coffee Shop",
  "role": "BUSINESS_OWNER"
}
```

**Response `201`:**
```json
{
  "user": { "id": "...", "email": "owner@shop.com", "name": "John Doe", "role": "BUSINESS_OWNER" },
  "business": { "id": "...", "name": "My Coffee Shop" },
  "message": "User and Business registered successfully"
}
```

---

### GET /auth/profile
Get the currently authenticated user's profile, including their linked business.

**Auth required:** Yes

**Response `200`:**
```json
{
  "user": {
    "id": "clxxx",
    "email": "kasir@shop.com",
    "name": "Kasir User",
    "role": "KASIR",
    "businessId": "biz-id",
    "business": {
      "id": "biz-id",
      "name": "My Coffee Shop",
      "address": "Jl. Contoh No. 1",
      "phone": "081234567890"
    }
  }
}
```

---

### POST /auth/google
Sign in with Google OAuth.

**Auth required:** No

**Request body:**
```json
{ "idToken": "<google_id_token>" }
```

**Notes:** The Google account's email must already be registered in the system by an admin. This endpoint only links Google OAuth to an existing account.

---

### POST /auth/apple
Sign in with Apple OAuth.

**Auth required:** No

**Request body:**
```json
{ "idToken": "<apple_id_token>" }
```

**Notes:** Same restriction as Google — email must already exist.

---

### GET /auth/verify?token=xxx
Verify user email using the token sent via email.

**Auth required:** No

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `token` | string | The email verification token |

---

### POST /auth/forgot-password
Send a password reset link to the user's email.

**Auth required:** No

**Request body:**
```json
{ "email": "user@shop.com" }
```

**Response `200`:** Always returns success (does not reveal if the email exists).

---

### POST /auth/reset-password
Reset password using the token from the reset email.

**Auth required:** No

**Request body:**
```json
{
  "token": "<reset_token_from_email>",
  "newPassword": "newpassword123"
}
```

---

## 5. Users Endpoints

### Business-scoped (BUSINESS_OWNER role)

#### POST /users
Create a new user inside the authenticated user's business.

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body:**
```json
{
  "email": "kasir2@shop.com",
  "password": "password123",
  "name": "Kasir Dua",
  "role": "KASIR"
}
```

---

#### GET /users
Get all users in the current business.

**Auth required:** Yes — `BUSINESS_OWNER`

---

#### GET /users/:id
Get a user by ID (within the current business).

**Auth required:** Yes

---

#### PATCH /users/:id
Update a user (within the current business).

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body** (all optional):
```json
{
  "email": "new@email.com",
  "password": "newpass",
  "name": "New Name",
  "role": "KASIR",
  "isActive": true
}
```

---

#### DELETE /users/:id
Delete a user (within the current business).

**Auth required:** Yes — `BUSINESS_OWNER`

---

### Platform-admin routes (ADMIN role only)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users/admin/all` | Get all users across all businesses |
| `GET` | `/users/admin/by-role?role=KASIR` | Filter users by role globally |
| `GET` | `/users/admin/:id` | Get any user by ID |
| `PATCH` | `/users/admin/:id` | Update any user |
| `DELETE` | `/users/admin/:id` | Delete any user |

---

## 6. Businesses Endpoints

> All endpoints require `ADMIN` role.

#### POST /businesses
Create a new business.

**Request body:**
```json
{
  "name": "Kedai Kopi",
  "address": "Jl. Sudirman No. 123",
  "phone": "081234567890"
}
```

---

#### GET /businesses
List all businesses with user/product/transaction counts.

**Response `200`:**
```json
[
  {
    "id": "biz-id",
    "name": "Kedai Kopi",
    "address": "Jl. Sudirman No. 123",
    "phone": "081234567890",
    "_count": { "users": 3, "products": 98, "categories": 16, "transactions": 45 }
  }
]
```

---

#### GET /businesses/:id
Get a business by ID.

---

#### GET /businesses/:id/stats
Get business statistics.

**Response `200`:**
```json
{
  "business": { "id": "...", "name": "Kedai Kopi" },
  "stats": {
    "users": 3,
    "products": 98,
    "categories": 16,
    "transactions": 45,
    "totalRevenue": 1500000
  }
}
```

---

#### PATCH /businesses/:id
Update a business.

**Request body** (all optional):
```json
{ "name": "New Name", "address": "New Address", "phone": "08xxx" }
```

---

#### DELETE /businesses/:id
Delete a business and all its related data (users, products, transactions).


---

## 7. Categories Endpoints

All endpoints are scoped to the authenticated user's business.

#### POST /categories
Create a new category.

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body:**
```json
{
  "name": "Makanan",
  "description": "Menu makanan utama"
}
```

---

#### GET /categories
Get all categories in the current business.

**Auth required:** Yes

**Response `200`:**
```json
[
  {
    "id": "cat-id",
    "name": "Makanan",
    "description": "Menu makanan utama",
    "businessId": "biz-id",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

#### GET /categories/:id
Get a single category with its products.

**Auth required:** Yes

---

#### PATCH /categories/:id
Update a category.

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body** (all optional):
```json
{ "name": "Minuman", "description": "Aneka minuman" }
```

---

#### DELETE /categories/:id
Delete a category (cascade deletes products in the category).

**Auth required:** Yes — `BUSINESS_OWNER`

---

## 8. Menu / Products Endpoints

All endpoints are scoped to the authenticated user's business. All endpoints require JWT auth.

#### POST /menu
Create a new product. Supports image upload via `multipart/form-data`.

**Auth required:** Yes — `BUSINESS_OWNER`

**Content-Type:** `multipart/form-data`

**Form fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `price` | number | Yes | Selling price |
| `costPrice` | number | Yes | Cost / modal price (used for margin reports) |
| `stock` | integer | Yes | Current stock quantity |
| `categoryId` | string | Yes | Category ID |
| `description` | string | No | Product description |
| `imageUrl` | string | No | External image URL (alternative to file upload) |
| `status` | string | No | `AVAILABLE` or `OUT_OF_STOCK` |
| `file` | binary | No | Image file (jpg/png/gif/webp, max 5MB) |

**Response `201`:**
```json
{
  "id": "prod-id",
  "name": "Nasi Goreng",
  "description": "Nasi goreng spesial",
  "price": "25000.00",
  "costPrice": "17500.00",
  "stock": 50,
  "imageUrl": "https://ik.imagekit.io/...",
  "status": "AVAILABLE",
  "categoryId": "cat-id",
  "businessId": "biz-id"
}
```

---

#### GET /menu
Get all products. Supports optional filters.

**Auth required:** Yes

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `categoryId` | string | Filter by category |
| `search` | string | Search by product name |

---

#### GET /menu/:id
Get a single product by ID.

**Auth required:** Yes

---

#### PATCH /menu/:id
Update a product. Supports image upload via `multipart/form-data`.

**Auth required:** Yes — `BUSINESS_OWNER`

**Content-Type:** `multipart/form-data` — same fields as POST, all optional.

---

#### PATCH /menu/:id/stock
Update only the stock quantity of a product.

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body:**
```json
{ "stock": 100 }
```

---

#### DELETE /menu/:id
Delete a product.

**Auth required:** Yes — `BUSINESS_OWNER`


---

## 9. Transactions Endpoints

All endpoints are scoped to the authenticated user's business.

### Transaction Flow

```
1. Kasir adds items → POST /transactions          (status: PENDING)
2. Add more items to same table → POST /transactions (auto-appends if same tableNumber + PENDING)
3. Edit order → PATCH /transactions/:id
4. Finalize & pay → POST /transactions/:id/checkout (status: PENDING → COMPLETED)
```

---

#### POST /transactions
Create a new transaction. If a `tableNumber` is provided and there is already a `PENDING` transaction for that table, the items are appended to the existing bill instead of creating a new one.

**Auth required:** Yes

**Request body:**
```json
{
  "items": [
    { "productId": "prod-id-1", "quantity": 2 },
    { "productId": "prod-id-2", "quantity": 1 }
  ],
  "tableNumber": "Meja 1",
  "paymentMethod": "CASH",
  "paymentAmount": 100000,
  "status": "PENDING",
  "notes": "Tanpa bawang"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | array | Yes | Array of `{ productId, quantity }` |
| `tableNumber` | string | No | Table name/number |
| `paymentMethod` | string | No | `CASH`, `CARD`, `QRIS`, `TRANSFER`, `OTHER` |
| `paymentAmount` | number | No | Amount paid by customer |
| `status` | string | No | Default: `PENDING` |
| `notes` | string | No | Order notes |

**Response `201`:** Full transaction object (see below).

**Side effect:** Stock is decremented for each product.

---

#### POST /transactions/:id/checkout
Finalize a pending transaction — set payment info and mark as `COMPLETED`. Calculates change automatically.

**Auth required:** Yes

**Request body:**
```json
{
  "paymentMethod": "CASH",
  "paymentAmount": 100000,
  "notes": "Optional note"
}
```

**Response `200`:** Updated transaction with `status: COMPLETED` and `changeAmount`.

**Error:** `400` if `paymentAmount` is less than `totalAmount`.

---

#### GET /transactions
Get all transactions with optional filters.

**Auth required:** Yes

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `startDate` | string | Filter from date (YYYY-MM-DD) |
| `endDate` | string | Filter to date (YYYY-MM-DD) |
| `status` | string | `PENDING`, `COMPLETED`, `CANCELLED` |
| `userId` | string | Filter by cashier who created it |
| `tableNumber` | string | Filter by table number |

---

#### GET /transactions/:id
Get a single transaction by ID with all items and user info.

**Auth required:** Yes

**Response `200`:**
```json
{
  "id": "trx-id",
  "transactionNumber": "TRX-20260723-120000-AB12",
  "tableNumber": "Meja 1",
  "totalAmount": "75000.00",
  "paymentMethod": "CASH",
  "paymentAmount": "100000.00",
  "changeAmount": "25000.00",
  "status": "COMPLETED",
  "notes": "Tanpa bawang",
  "createdAt": "2026-07-23T12:00:00.000Z",
  "items": [
    {
      "id": "item-id",
      "productName": "Nasi Goreng",
      "quantity": 2,
      "price": "25000.00",
      "subtotal": "50000.00"
    }
  ],
  "user": { "id": "user-id", "name": "Kasir User", "email": "kasir@shop.com" }
}
```

---

#### PATCH /transactions/:id
Update transaction items and totals. Only `PENDING` transactions can be updated by `KASIR`. `BUSINESS_OWNER` can update any status.

**Auth required:** Yes

**Request body:**
```json
{
  "items": [
    {
      "productId": "prod-id",
      "productName": "Nasi Goreng",
      "quantity": 3,
      "price": 25000,
      "subtotal": 75000
    }
  ],
  "subtotal": 75000,
  "discount": 0,
  "tax": 7500,
  "total": 82500,
  "tableNumber": "Meja 1",
  "notes": "Updated note",
  "status": "PENDING",
  "paymentMethod": "CASH",
  "paymentAmount": 100000
}
```

---

#### PATCH /transactions/:id/status
Update only the transaction status.

**Auth required:** Yes — `BUSINESS_OWNER`

**Request body:**
```json
{ "status": "CANCELLED" }
```

---

#### DELETE /transactions/:id
Delete a transaction.

**Auth required:** Yes — `BUSINESS_OWNER`


---

## 10. Reports Endpoints

All endpoints are scoped to the authenticated user's business. All require JWT auth.

#### GET /reports/daily?date=2026-07-23
Get a sales report for a single day.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | No | YYYY-MM-DD format. Defaults to today. |

---

#### GET /reports/weekly?startDate=2026-07-21
Get a 7-day sales report starting from the given date.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | string | No | YYYY-MM-DD. Defaults to today. |

---

#### GET /reports/monthly?month=2026-07
Get a monthly sales report.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `month` | string | No | YYYY-MM format. Defaults to current month. |

---

#### GET /reports/custom?startDate=2026-07-01&endDate=2026-07-23
Get a report for a custom date range.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | string | Yes | YYYY-MM-DD |
| `endDate` | string | Yes | YYYY-MM-DD |

---

#### GET /reports/best-sellers?period=daily&limit=10
Get the best-selling products for a given period.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `period` | string | Yes | `daily`, `weekly`, or `monthly` |
| `limit` | number | No | Number of results. Defaults to 10. |

---

#### GET /reports/revenue-by-category?startDate=2026-07-01&endDate=2026-07-23
Get revenue broken down by product category.

---

#### GET /reports/margin?startDate=2026-07-01&endDate=2026-07-23
Get profit margin report (revenue vs cost price per product).

---

### PDF Export

#### GET /reports/export/pdf?type=daily&date=2026-07-23
Export a sales report as a downloadable PDF file.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `daily`, `weekly`, `monthly`, or `custom` |
| `date` | string | For `daily` | YYYY-MM-DD |
| `startDate` | string | For `weekly`/`custom` | YYYY-MM-DD |
| `endDate` | string | For `custom` | YYYY-MM-DD |
| `month` | string | For `monthly` | YYYY-MM |

**Response:** `application/pdf` binary file download.  
**Filename:** `laporan-{type}-{date}.pdf`

---

#### GET /reports/export/transactions?startDate=2026-07-01&endDate=2026-07-23
Export the transaction list as a PDF file for a date range.

**Response:** `application/pdf` binary file download.

---

## 11. Receipts Endpoints

All endpoints require JWT auth.

#### GET /receipts/:transactionId/whatsapp
Generate a WhatsApp-formatted text receipt for a transaction.

**Response `200`:**
```json
{
  "receipt": "=== STRUK PEMBAYARAN ===\nMeja 1\n...\nTotal: Rp 75.000\nBayar: Rp 100.000\nKembali: Rp 25.000"
}
```

**Mobile usage:** Use the `receipt` string directly in a WhatsApp share intent.

---

#### GET /receipts/:transactionId/thermal
Generate a thermal-printer-formatted receipt (ESC/POS style text).

**Response `200`:**
```json
{
  "receipt": "--------------------------------\n       STRUK PEMBAYARAN\n..."
}
```

**Mobile usage:** Send the `receipt` string to a paired Bluetooth thermal printer.

---

## 12. Upload Endpoints

#### POST /upload
Upload a product image directly to ImageKit CDN. Returns the hosted image URL.

**Auth required:** No

**Content-Type:** `multipart/form-data`

**Form fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | binary | Image file (jpg, jpeg, png, gif, webp — max 5MB) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "fileId": "imagekit-file-id",
    "imageUrl": "https://ik.imagekit.io/yourspace/filename.jpg",
    "filename": "filename.jpg",
    "size": 204800,
    "mimeType": "image/jpeg",
    "width": 800,
    "height": 600
  }
}
```

**Typical flow:** Upload image first → get `imageUrl` → use that URL in `POST /menu` or `PATCH /menu/:id`.

---

#### GET /upload/auth
Get ImageKit authentication parameters for direct client-side upload (if needed by mobile clients using the ImageKit SDK).

**Response `200`:**
```json
{
  "token": "...",
  "expire": 1721731200,
  "signature": "..."
}
```


---

## 13. Data Models & Enums

### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | Unique identifier |
| `email` | string | Unique email address |
| `name` | string | Display name |
| `role` | `UserRole` | See enum below |
| `businessId` | string | Linked business |
| `isEmailVerified` | boolean | Email verification status |
| `oauthProvider` | string? | `GOOGLE` or `APPLE` |
| `lastLoginAt` | DateTime? | Last login timestamp |
| `createdAt` | DateTime | |

### Business
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | |
| `name` | string | Business name |
| `address` | string? | |
| `phone` | string? | |

### Category
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | |
| `name` | string | Category name |
| `description` | string? | |
| `businessId` | string | Scoped to business |

### Product
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | |
| `name` | string | Product name |
| `description` | string? | |
| `price` | Decimal | Selling price |
| `costPrice` | Decimal | Cost/modal price |
| `stock` | integer | Current stock |
| `imageUrl` | string? | CDN image URL |
| `status` | `ProductStatus` | |
| `categoryId` | string | |
| `businessId` | string | |

### Transaction
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | |
| `transactionNumber` | string | e.g. `TRX-20260723-120000-AB12` |
| `tableNumber` | string? | Table identifier |
| `totalAmount` | Decimal | Sum of all items |
| `paymentMethod` | `PaymentMethod`? | |
| `paymentAmount` | Decimal? | Amount tendered |
| `changeAmount` | Decimal? | Change given |
| `status` | `TransactionStatus` | |
| `notes` | string? | |
| `userId` | string | Cashier who created it |
| `businessId` | string | |
| `items` | TransactionItem[] | Line items |

### TransactionItem
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (cuid) | |
| `transactionId` | string | |
| `productId` | string? | Nullable (product may be deleted) |
| `productName` | string | Snapshot of product name at time of sale |
| `quantity` | integer | |
| `price` | Decimal | Unit price at time of sale |
| `costPrice` | Decimal | Cost price at time of sale |
| `subtotal` | Decimal | price × quantity |

---

### Enums

#### UserRole
| Value | Description |
|-------|-------------|
| `ADMIN` | Platform super admin |
| `BUSINESS_OWNER` | Business owner / admin |
| `KASIR` | Cashier |

#### ProductStatus
| Value | Description |
|-------|-------------|
| `AVAILABLE` | In stock, can be ordered |
| `OUT_OF_STOCK` | No stock remaining |

#### TransactionStatus
| Value | Description |
|-------|-------------|
| `PENDING` | Order open, not yet paid |
| `COMPLETED` | Paid and closed |
| `CANCELLED` | Cancelled |

#### PaymentMethod
| Value | Description |
|-------|-------------|
| `CASH` | Cash payment |
| `CARD` | Debit/credit card |
| `QRIS` | QR Code Indonesian Standard |
| `TRANSFER` | Bank transfer |
| `OTHER` | Other method |

---

## 14. Error Reference

| HTTP Status | When it occurs |
|------------|----------------|
| `400` | Validation error, insufficient payment, item out of stock, bad request |
| `401` | Missing or invalid JWT token, invalid credentials, wrong OAuth token, expired session |
| `403` | Correct token but insufficient role for the endpoint |
| `404` | Resource not found (product, transaction, user, category) |
| `500` | Internal server error |

### Common 400 errors
- `"One or more products not found"` — a `productId` in the transaction does not exist in this business
- `"Product X is out of stock"` — product status is `OUT_OF_STOCK`
- `"Insufficient stock for X. Available: Y, Requested: Z"` — stock < requested quantity
- `"Insufficient payment. Total: X, Provided: Y"` — checkout with too little payment
- `"Only PENDING transactions can be updated by kasir"` — KASIR tried to update a non-PENDING transaction

### Common 401 errors
- `"Invalid credentials"` — wrong email or password
- `"This account uses OAuth sign-in"` — account was created via Google/Apple, cannot use password login
- `"Invalid or expired verification token"` — email verify or password reset token is stale

---

## Quick Reference — Endpoint Summary

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | `/auth/login` | No | — |
| POST | `/auth/register` | Yes | ADMIN |
| GET | `/auth/profile` | Yes | Any |
| POST | `/auth/google` | No | — |
| POST | `/auth/apple` | No | — |
| GET | `/auth/verify` | No | — |
| POST | `/auth/forgot-password` | No | — |
| POST | `/auth/reset-password` | No | — |
| POST | `/users` | Yes | BUSINESS_OWNER |
| GET | `/users` | Yes | BUSINESS_OWNER |
| GET | `/users/:id` | Yes | Any |
| PATCH | `/users/:id` | Yes | BUSINESS_OWNER |
| DELETE | `/users/:id` | Yes | BUSINESS_OWNER |
| GET | `/users/admin/all` | Yes | ADMIN |
| GET | `/users/admin/by-role` | Yes | ADMIN |
| POST | `/businesses` | Yes | ADMIN |
| GET | `/businesses` | Yes | ADMIN |
| GET | `/businesses/:id` | Yes | ADMIN |
| GET | `/businesses/:id/stats` | Yes | ADMIN |
| PATCH | `/businesses/:id` | Yes | ADMIN |
| DELETE | `/businesses/:id` | Yes | ADMIN |
| POST | `/categories` | Yes | BUSINESS_OWNER |
| GET | `/categories` | Yes | Any |
| GET | `/categories/:id` | Yes | Any |
| PATCH | `/categories/:id` | Yes | BUSINESS_OWNER |
| DELETE | `/categories/:id` | Yes | BUSINESS_OWNER |
| POST | `/menu` | Yes | BUSINESS_OWNER |
| GET | `/menu` | Yes | Any |
| GET | `/menu/:id` | Yes | Any |
| PATCH | `/menu/:id` | Yes | BUSINESS_OWNER |
| PATCH | `/menu/:id/stock` | Yes | BUSINESS_OWNER |
| DELETE | `/menu/:id` | Yes | BUSINESS_OWNER |
| POST | `/transactions` | Yes | Any |
| POST | `/transactions/:id/checkout` | Yes | Any |
| GET | `/transactions` | Yes | Any |
| GET | `/transactions/:id` | Yes | Any |
| PATCH | `/transactions/:id` | Yes | Any (KASIR: PENDING only) |
| PATCH | `/transactions/:id/status` | Yes | BUSINESS_OWNER |
| DELETE | `/transactions/:id` | Yes | BUSINESS_OWNER |
| GET | `/reports/daily` | Yes | Any |
| GET | `/reports/weekly` | Yes | Any |
| GET | `/reports/monthly` | Yes | Any |
| GET | `/reports/custom` | Yes | Any |
| GET | `/reports/best-sellers` | Yes | Any |
| GET | `/reports/revenue-by-category` | Yes | Any |
| GET | `/reports/margin` | Yes | Any |
| GET | `/reports/export/pdf` | Yes | Any |
| GET | `/reports/export/transactions` | Yes | Any |
| GET | `/receipts/:id/whatsapp` | Yes | Any |
| GET | `/receipts/:id/thermal` | Yes | Any |
| POST | `/upload` | No | — |
| GET | `/upload/auth` | No | — |


---

## 📊 Kasir Activity & Performance Endpoints (NEW!)

### GET /reports/kasir-activity
Get real-time activity for all kasir on a specific date.

**Auth required:** Yes

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | No | Date to check (YYYY-MM-DD). Defaults to today. |

**Response `200`:**
```json
{
  "date": "2026-09-05",
  "kasirs": [
    {
      "id": "kasir-id",
      "name": "Ipeh",
      "email": "ipeh@bebekfara.com",
      "firstLoginToday": "09:05",
      "lastActivity": "17:30",
      "workDuration": "8 jam 25 menit",
      "totalTransactions": 45,
      "totalRevenue": 1250000,
      "status": "ONLINE"
    },
    {
      "id": "kasir-id",
      "name": "Nessa",
      "email": "nessa@bebekfara.com",
      "firstLoginToday": "09:00",
      "lastActivity": "17:45",
      "workDuration": "8 jam 45 menit",
      "totalTransactions": 52,
      "totalRevenue": 1450000,
      "status": "OFFLINE"
    }
  ],
  "summary": {
    "totalKasir": 2,
    "totalTransactions": 97,
    "totalRevenue": 2700000
  }
}
```

**Use case:**
- Dashboard "Kasir Online Now"
- Monitor daily activity
- Real-time kasir status (ONLINE if last activity < 30 minutes)

---

### GET /reports/kasir-performance
Get performance metrics for all kasir over a date range.

**Auth required:** Yes

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | string | No | Start date (YYYY-MM-DD). Defaults to 30 days ago. |
| `endDate` | string | No | End date (YYYY-MM-DD). Defaults to today. |

**Response `200`:**
```json
{
  "period": {
    "startDate": "2026-08-05",
    "endDate": "2026-09-05"
  },
  "kasirs": [
    {
      "id": "kasir-id",
      "name": "Ipeh",
      "email": "ipeh@bebekfara.com",
      "workDays": 20,
      "totalTransactions": 850,
      "totalRevenue": 23500000,
      "totalCost": 16450000,
      "totalProfit": 7050000,
      "totalItemsSold": 1200,
      "avgTransactionPerDay": 42.5,
      "avgRevenuePerDay": 1175000,
      "avgTransactionValue": 27647
    },
    {
      "id": "kasir-id",
      "name": "Nessa",
      "email": "nessa@bebekfara.com",
      "workDays": 22,
      "totalTransactions": 980,
      "totalRevenue": 27300000,
      "totalCost": 19110000,
      "totalProfit": 8190000,
      "totalItemsSold": 1400,
      "avgTransactionPerDay": 44.5,
      "avgRevenuePerDay": 1240909,
      "avgTransactionValue": 27857
    }
  ],
  "summary": {
    "totalKasir": 2,
    "totalTransactions": 1830,
    "totalRevenue": 50800000,
    "totalProfit": 15240000
  }
}
```

**Use case:**
- Monthly performance review
- Compare kasir productivity
- Calculate payroll based on actual work days
- Identify top performers

---

## 💡 How to Use These Endpoints in Frontend

### Dashboard - Real-time Kasir Status
```typescript
// Fetch kasir activity for today
const response = await api.get('/reports/kasir-activity');

// Display who's online
const onlineKasirs = response.data.kasirs.filter(k => k.status === 'ONLINE');

// Show in dashboard card:
// "🟢 Ipeh - 45 transaksi hari ini"
// "🔴 Nessa - Offline"
```

### Reports Page - Performance Review
```typescript
// Fetch last 7 days performance
const response = await api.get('/reports/kasir-performance', {
  params: {
    startDate: '2026-08-29',
    endDate: '2026-09-05'
  }
});

// Show in table:
// | Name  | Days | Transactions | Revenue      | Avg/Day |
// |-------|------|--------------|--------------|---------|
// | Ipeh  |  7   |     65       | Rp 1.820.000 | 9.3     |
// | Nessa |  7   |     72       | Rp 2.016.000 | 10.3    |
```

---

## 🎯 Frontend Implementation Guide

### 1. Add Kasir Activity Component
Create `components/KasirActivityCard.tsx`:

```typescript
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function KasirActivityCard() {
  const [kasirActivity, setKasirActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await api.get('/reports/kasir-activity');
        setKasirActivity(response.data);
      } catch (error) {
        console.error('Failed to fetch kasir activity', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">🧑‍💼 Kasir Online</h2>
      
      {kasirActivity?.kasirs.map(kasir => (
        <div key={kasir.id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              kasir.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className="font-medium">{kasir.name}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            {kasir.totalTransactions} transaksi
          </div>
        </div>
      ))}
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600">
          Total Hari Ini: <span className="font-bold">
            Rp{kasirActivity?.summary.totalRevenue.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### 2. Add to Dashboard Page
In `app/dashboard/page.tsx`:

```typescript
import { KasirActivityCard } from '@/components/KasirActivityCard';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Existing cards... */}
      
      <KasirActivityCard />
    </div>
  );
}
```

### 3. Add Performance Report Page
Create `app/reports/kasir/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function KasirPerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const response = await api.get('/reports/kasir-performance', {
          params: { startDate, endDate }
        });
        setPerformance(response.data);
      } catch (error) {
        console.error('Failed to fetch performance', error);
      }
    }

    fetchPerformance();
  }, [startDate, endDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Performa Kasir</h1>
      
      {/* Date filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-4 py-2"
        />
      </div>

      {/* Performance table */}
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left">Nama</th>
            <th className="px-6 py-3 text-right">Hari Kerja</th>
            <th className="px-6 py-3 text-right">Transaksi</th>
            <th className="px-6 py-3 text-right">Revenue</th>
            <th className="px-6 py-3 text-right">Profit</th>
            <th className="px-6 py-3 text-right">Avg/Hari</th>
          </tr>
        </thead>
        <tbody>
          {performance?.kasirs.map(kasir => (
            <tr key={kasir.id} className="border-t">
              <td className="px-6 py-4 font-medium">{kasir.name}</td>
              <td className="px-6 py-4 text-right">{kasir.workDays}</td>
              <td className="px-6 py-4 text-right">{kasir.totalTransactions}</td>
              <td className="px-6 py-4 text-right">
                Rp{kasir.totalRevenue.toLocaleString('id-ID')}
              </td>
              <td className="px-6 py-4 text-right">
                Rp{kasir.totalProfit.toLocaleString('id-ID')}
              </td>
              <td className="px-6 py-4 text-right">
                {kasir.avgTransactionPerDay.toFixed(1)} trx
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ✅ Summary

**NEW Endpoints for Kasir Monitoring:**
1. **GET /reports/kasir-activity** - Real-time daily activity
2. **GET /reports/kasir-performance** - Historical performance metrics

**What You Get:**
- ✅ Real-time kasir online status
- ✅ Work duration tracking (first transaction to last transaction)
- ✅ Transaction count & revenue per kasir
- ✅ Performance comparison across date ranges
- ✅ Automatic calculation of work days, averages, and profits

**No Extra Setup Needed:**
- Works with existing login tracking
- No manual clock in/out required
- Kasirs just login and work normally
- Owner gets automatic reports

**Perfect for Bebek Fara:**
- Simple enough for 2-3 kasir
- Scalable if business grows
- Zero friction for kasirs
- Full visibility for owners


---

## 13. Shift Management Endpoints

Shift management allows kasir (cashiers) to track their work sessions, cash handling, and sales per shift.

### Key Concepts
- **One Active Shift Per Kasir**: A kasir can only have one OPEN shift at a time
- **Initial Cash**: Cash in drawer at shift start (modal awal)
- **Expected Cash**: Initial cash + total cash sales during shift
- **Final Cash**: Actual cash counted at shift end (cash yang disetor)
- **Cash Difference**: Final cash - Expected cash (selisih)
- **Sales Breakdown**: Transactions grouped by payment method

### Payment Method Categories
- **CASH**: Requires cash deposit - shows `expectedCashFromSales`
- **Non-Cash** (QRIS, DEBIT, GRABFOOD, SHOPEEFOOD, GOFOOD, OTHER): No cash deposit - shows sales report only

---

### 13.1. Start Shift

**Endpoint**: `POST /shifts/start`  
**Auth**: Required (JWT)  
**Role**: KASIR, BUSINESS_OWNER

Mulai shift kerja dengan modal awal (initial cash).

#### Request Body
```json
{
  "initialCash": 100000  // Optional, default: 0
}
```

#### Response
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "shiftId": "cmtocjc5k000053s3a054t5cl",
    "kasirName": "Ipeh",
    "startTime": "2026-09-05T12:15:43.622Z",
    "endTime": null,
    "status": "OPEN",
    "initialCash": 100000,
    "finalCash": null,
    "expectedCash": 0,
    "cashDifference": null,
    "notes": null,
    "salesByPaymentMethod": {
      "cash": {
        "totalSales": 0,
        "totalTransactions": 0,
        "expectedCashFromSales": 0
      },
      "qris": { "totalSales": 0, "totalTransactions": 0 },
      "debit": { "totalSales": 0, "totalTransactions": 0 },
      "grabfood": { "totalSales": 0, "totalTransactions": 0 },
      "shopeefood": { "totalSales": 0, "totalTransactions": 0 },
      "gofood": { "totalSales": 0, "totalTransactions": 0 },
      "other": { "totalSales": 0, "totalTransactions": 0 }
    },
    "summary": {
      "totalSales": 0,
      "totalTransactions": 0,
      "totalCashToDeposit": 100000,  // initialCash + expectedCashFromSales
      "actualCashInHand": null
    }
  }
}
```

#### Error Cases
- `400 Bad Request`: Already has an open shift
- `401 Unauthorized`: Invalid/missing token

---

### 13.2. Get Current Shift

**Endpoint**: `GET /shifts/current`  
**Auth**: Required (JWT)  
**Role**: KASIR, BUSINESS_OWNER

Melihat shift yang sedang aktif dengan laporan penjualan real-time.

#### Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "hasOpenShift": true,
    "shift": {
      "shiftId": "cmtocjc5k000053s3a054t5cl",
      "kasirName": "Ipeh",
      "startTime": "2026-09-05T12:15:43.622Z",
      "endTime": null,
      "status": "OPEN",
      "initialCash": 100000,
      "finalCash": null,
      "expectedCash": 0,
      "cashDifference": null,
      "notes": null,
      "salesByPaymentMethod": {
        "cash": {
          "totalSales": 35000,
          "totalTransactions": 2,
          "expectedCashFromSales": 35000  // Total cash yang harus ada dari penjualan
        },
        "qris": {
          "totalSales": 27000,
          "totalTransactions": 1
        },
        "grabfood": {
          "totalSales": 25000,
          "totalTransactions": 1
        },
        "debit": { "totalSales": 0, "totalTransactions": 0 },
        "shopeefood": { "totalSales": 0, "totalTransactions": 0 },
        "gofood": { "totalSales": 0, "totalTransactions": 0 },
        "other": { "totalSales": 0, "totalTransactions": 0 }
      },
      "summary": {
        "totalSales": 87000,  // Total semua penjualan
        "totalTransactions": 4,
        "totalCashToDeposit": 135000,  // 100000 (initial) + 35000 (cash sales)
        "actualCashInHand": null  // Akan diisi saat end shift
      }
    }
  }
}
```

If no active shift:
```json
{
  "success": true,
  "data": {
    "hasOpenShift": false
  }
}
```

---

### 13.3. End Shift

**Endpoint**: `POST /shifts/end`  
**Auth**: Required (JWT)  
**Role**: KASIR, BUSINESS_OWNER

Selesaikan shift dengan melaporkan jumlah cash yang disetor.

#### Request Body
```json
{
  "finalCash": 135000,  // Required: Total cash yang disetor
  "notes": "Shift normal, semua sesuai"  // Optional
}
```

#### Response
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "shiftId": "cmtocjc5k000053s3a054t5cl",
    "kasirName": "Ipeh",
    "startTime": "2026-09-05T12:15:43.622Z",
    "endTime": "2026-09-05T18:30:15.123Z",
    "status": "CLOSED",
    "initialCash": 100000,
    "finalCash": 135000,
    "expectedCash": 135000,  // initialCash + cash sales
    "cashDifference": 0,  // finalCash - expectedCash (0 = perfect match)
    "notes": "Shift normal, semua sesuai",
    "salesByPaymentMethod": {
      "cash": {
        "totalSales": 35000,
        "totalTransactions": 2,
        "expectedCashFromSales": 35000
      },
      "qris": { "totalSales": 27000, "totalTransactions": 1 },
      "grabfood": { "totalSales": 25000, "totalTransactions": 1 },
      "debit": { "totalSales": 0, "totalTransactions": 0 },
      "shopeefood": { "totalSales": 0, "totalTransactions": 0 },
      "gofood": { "totalSales": 0, "totalTransactions": 0 },
      "other": { "totalSales": 0, "totalTransactions": 0 }
    },
    "summary": {
      "totalSales": 87000,
      "totalTransactions": 4,
      "totalCashToDeposit": 135000,
      "actualCashInHand": 135000
    }
  }
}
```

#### Cash Difference Interpretation
| Difference | Meaning |
|------------|---------|
| `0` | Perfect match - cash sesuai |
| `> 0` (positive) | Cash lebih - ada kelebihan |
| `< 0` (negative) | Cash kurang - ada kekurangan |

Example:
- Expected: 135000
- Final: 138000
- Difference: **+3000** (cash lebih Rp 3.000)

#### Error Cases
- `404 Not Found`: No active shift to end
- `400 Bad Request`: Invalid finalCash value (must be >= 0)

---

### 13.4. Get Shift By ID

**Endpoint**: `GET /shifts/:shiftId`  
**Auth**: Required (JWT)  
**Role**: KASIR, BUSINESS_OWNER

Melihat detail shift history berdasarkan ID.

#### Response
Same structure as End Shift response.

#### Error Cases
- `404 Not Found`: Shift not found or doesn't belong to user

---

## 13.5. Frontend Integration Example

### Kasir Shift Flow

```typescript
// 1. Check if shift is already open when kasir opens app
const checkShift = async () => {
  const response = await fetch('/shifts/current', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { data } = await response.json();
  
  if (data.hasOpenShift) {
    // Show shift info and allow transactions
    console.log('Shift sudah aktif:', data.shift);
    return data.shift;
  } else {
    // Prompt kasir to start shift
    showStartShiftModal();
  }
};

// 2. Start shift
const startShift = async (initialCash: number) => {
  const response = await fetch('/shifts/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ initialCash })
  });
  
  const { data } = await response.json();
  console.log('Shift started:', data.shiftId);
};

// 3. Real-time shift monitoring (refresh every 30s or after each transaction)
const refreshShiftReport = async () => {
  const response = await fetch('/shifts/current', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { data } = await response.json();
  
  if (data.hasOpenShift) {
    updateDashboard({
      totalSales: data.shift.summary.totalSales,
      cashToDeposit: data.shift.summary.totalCashToDeposit,
      salesBreakdown: data.shift.salesByPaymentMethod
    });
  }
};

// 4. End shift
const endShift = async (finalCash: number, notes?: string) => {
  const response = await fetch('/shifts/end', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ finalCash, notes })
  });
  
  const { data } = await response.json();
  
  // Show shift summary
  showShiftSummary({
    kasirName: data.kasirName,
    startTime: data.startTime,
    endTime: data.endTime,
    initialCash: data.initialCash,
    finalCash: data.finalCash,
    expectedCash: data.expectedCash,
    cashDifference: data.cashDifference,
    salesByPaymentMethod: data.salesByPaymentMethod,
    summary: data.summary
  });
};
```

### Admin Dashboard - Monitor All Kasir

```typescript
// Use existing kasir-activity and kasir-performance endpoints
const response = await fetch('/reports/kasir-activity', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### 13.6. Important Notes

#### Transaction Association with Shifts
**Current Behavior**: Transactions are NOT automatically associated with shifts. The `shiftId` field in transactions is optional.

**For Full Integration**:
To associate transactions with shifts, you need to:
1. Get current shift ID when creating transaction
2. Include `shiftId` in transaction creation
3. Modify `TransactionsService.create()` to accept and store `shiftId`

Example modification needed in `transactions.service.ts`:
```typescript
// In create method, add:
const currentShift = await this.prisma.shift.findFirst({
  where: { userId, businessId, status: 'OPEN' }
});

// Then in transaction.create():
data: {
  // ... other fields
  shiftId: currentShift?.id,  // Associate with active shift
}
```

#### Payment Methods
| Method | Cash Deposit Required? | Shows in Report |
|--------|----------------------|-----------------|
| CASH | ✅ Yes | expectedCashFromSales + totalSales |
| QRIS | ❌ No | totalSales only |
| DEBIT | ❌ No | totalSales only |
| GRABFOOD | ❌ No | totalSales only |
| SHOPEEFOOD | ❌ No | totalSales only |
| GOFOOD | ❌ No | totalSales only |
| OTHER | ❌ No | totalSales only |

#### Best Practices
1. **Kasir App**: Check for open shift on app launch
2. **Force Shift Start**: Don't allow transactions without active shift (optional, depends on business rules)
3. **Shift Summary**: Show detailed breakdown when ending shift
4. **Cash Reconciliation**: Alert admin if `cashDifference` is significant (e.g., > Rp 5.000)
5. **Shift History**: Store shift reports for audit trail

---
