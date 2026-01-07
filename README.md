# POS Backend API

A comprehensive Point of Sale (POS) backend system built with NestJS, PostgreSQL, and Prisma ORM.

## Features

- ✅ **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin & Kasir)
- ✅ **User Management**: Complete CRUD operations for user accounts
- ✅ **Product Management**: Menu/product management with categories and stock tracking
- ✅ **Transaction Processing**: Sales transactions with automatic stock deduction
- ✅ **Reporting**: Daily, weekly, and monthly sales reports with analytics
- ✅ **Receipt Generation**: WhatsApp and thermal printer receipt formats
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)

## Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd pos-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Database - Replace with your Neon PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Store Information (for receipts)
STORE_NAME="Your Store Name"
STORE_ADDRESS="Your Store Address"
STORE_PHONE="Your Phone Number"
STORE_EMAIL="your@email.com"
```

4. **Generate Prisma Client**

```bash
npx prisma generate
```

5. **Run database migrations**

```bash
npx prisma migrate dev --name init
```

6. **Seed the database** (optional, creates sample data)

```bash
npm run prisma:seed
```

This will create:
- Admin user: `admin@pos.com` / `admin123`
- Kasir user: `kasir@pos.com` / `kasir123`
- Sample categories and products

## Running the Application

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Register new user (Admin only)
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users` - List all users (Admin only)
- `GET /users/:id` - Get user details
- `POST /users` - Create user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Categories
- `GET /categories` - List all categories
- `GET /categories/:id` - Get category with products
- `POST /categories` - Create category (Admin only)
- `PATCH /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Menu/Products
- `GET /menu` - List all products (with filters)
- `GET /menu/:id` - Get product details
- `POST /menu` - Create product (Admin only)
- `PATCH /menu/:id` - Update product (Admin only)
- `PATCH /menu/:id/stock` - Update product stock (Admin only)
- `DELETE /menu/:id` - Delete product (Admin only)

### Transactions
- `POST /transactions` - Create new transaction
- `GET /transactions` - List transactions (with filters)
- `GET /transactions/:id` - Get transaction details
- `PATCH /transactions/:id/status` - Update transaction status (Admin only)

### Reports
- `GET /reports/daily?date=YYYY-MM-DD` - Daily sales report
- `GET /reports/weekly?startDate=YYYY-MM-DD` - Weekly sales report
- `GET /reports/monthly?month=YYYY-MM` - Monthly sales report
- `GET /reports/best-sellers?period=daily|weekly|monthly` - Best selling products
- `GET /reports/revenue-by-category?startDate&endDate` - Revenue by category

### Receipts
- `GET /receipts/:transactionId/whatsapp` - Get WhatsApp formatted receipt
- `GET /receipts/:transactionId/thermal` - Get thermal printer formatted receipt

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access

- **Admin**: Full access to all endpoints
- **Kasir**: Can create transactions, view products, and generate receipts

## Database Schema

The database includes the following main models:

- **User**: User accounts with roles (Admin/Kasir)
- **Category**: Product categories
- **Product**: Menu items/products with stock tracking
- **Transaction**: Sales transactions
- **TransactionItem**: Individual items in a transaction

## Development

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npm run prisma:seed
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
pos-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Seed data
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── categories/        # Category management
│   ├── menu/              # Product/menu management
│   ├── transactions/      # Transaction processing
│   ├── reports/           # Sales reports
│   ├── receipts/          # Receipt generation
│   ├── prisma/            # Prisma service
│   ├── common/            # Shared utilities
│   ├── app.module.ts      # Main app module
│   └── main.ts            # Application entry point
├── .env                   # Environment variables
├── .env.example           # Environment template
└── package.json
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `DATABASE_URL` with production database
3. Change `JWT_SECRET` to a strong, random value
4. Run migrations: `npx prisma migrate deploy`
5. Build the application: `npm run build`
6. Start the server: `npm run start:prod`

## Support

For issues or questions, please refer to the Swagger documentation at `/api` endpoint.

## License

UNLICENSED - Private project
# posbackend
