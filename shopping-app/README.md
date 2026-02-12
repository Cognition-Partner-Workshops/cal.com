# ShopHub - Shopping App

A full-featured, production-ready shopping application built with Next.js 15, SQLite, and Tailwind CSS.

## Architecture Overview

```
shopping-app/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # JWT authentication (login, signup, me)
│   │   │   ├── products/       # Product listing & details
│   │   │   ├── cart/           # Cart management
│   │   │   └── orders/         # Order creation & history
│   │   ├── products/[id]/      # Product detail page
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout with mock payment
│   │   ├── login/              # User login
│   │   ├── signup/             # User registration
│   │   ├── orders/             # Order history
│   │   └── page.tsx            # Home - product listing
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Database, auth, API helpers
│   └── store/                  # Zustand state management
├── tests/
│   ├── api/                    # Backend API tests (30+ tests)
│   ├── components/             # Frontend component tests (16 tests)
│   └── e2e/                    # End-to-end Playwright tests (6 tests)
├── setup.sh                    # One-command setup script
└── README.md
```

## Tech Stack Justification

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework with API routes, SSR, and optimized builds |
| **Language** | TypeScript | Type safety, better DX, fewer runtime errors |
| **Database** | SQLite (better-sqlite3) | Zero-config, file-based, fast for local development |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | Stateless, scalable authentication |
| **State** | Zustand | Lightweight, simple API, no boilerplate vs Redux |
| **Styling** | Tailwind CSS | Utility-first, rapid UI development, responsive by default |
| **Testing** | Vitest + Playwright | Fast unit tests + reliable E2E browser tests |

## Features

- **Product Listing** with grid layout and pagination
- **Search & Filters** by name, category, price range, and sort order
- **Product Detail** page with images, ratings, stock status
- **Shopping Cart** with quantity management
- **Checkout Flow** with shipping address and mock payment
- **JWT Authentication** with login and signup
- **Order History** with order details and status
- **Responsive Design** works on mobile, tablet, and desktop
- **Loading States** with skeleton animations
- **Error Handling** throughout the application

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm 9+

### Quick Start

```bash
chmod +x setup.sh
./setup.sh
```

This will install dependencies, set up the database with seed data, and show you how to run the app.

### Manual Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Seed the database
mkdir -p data
npx tsx src/lib/seed.ts

# Start the development server
npm run dev
```

The app runs at **http://localhost:3099**

### Demo Credentials

- **Email:** demo@shop.com
- **Password:** password123

## How to Run Tests

### Unit & API Tests

```bash
npm test
```

Runs 30+ backend API tests and 16 frontend component tests using Vitest.

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests (starts dev server automatically)
npm run test:e2e
```

Runs 6 E2E tests covering the full shopping flow using Playwright.

### Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| Products API | 10 | List, search, filter, sort, paginate, detail |
| Auth API | 10 | Signup, login, validation, JWT verification |
| Cart & Orders API | 12 | CRUD cart, checkout, order history |
| Frontend Components | 16 | ProductCard, SearchFilters rendering |
| E2E | 6 | Full checkout flow, search, signup, auth guard |

## How to Run the App Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register new user |
| POST | /api/auth/login | No | Login and get JWT |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/products | No | List products (search, filter, sort, paginate) |
| GET | /api/products/:id | No | Get product details |
| GET | /api/cart | Yes | Get cart items |
| POST | /api/cart | Yes | Add item to cart |
| PATCH | /api/cart/:id | Yes | Update cart item quantity |
| DELETE | /api/cart/:id | Yes | Remove cart item |
| DELETE | /api/cart | Yes | Clear entire cart |
| GET | /api/orders | Yes | List user orders |
| GET | /api/orders/:id | Yes | Get order details |
| POST | /api/orders | Yes | Create order from cart |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| JWT_SECRET | dev-secret-key | Secret for JWT token signing |
| DATABASE_URL | ./data/shop.db | SQLite database file path |
| NEXT_PUBLIC_APP_URL | http://localhost:3099 | App URL |

## Troubleshooting

### "Module not found" errors
Run `npm install` to ensure all dependencies are installed.

### Database issues
Delete `data/shop.db` and re-run `npx tsx src/lib/seed.ts` to recreate the database.

### Port 3099 already in use
Kill the existing process: `lsof -ti:3099 | xargs kill -9`

### Node.js version mismatch
Ensure Node.js 18+ is installed: `node -v`

### E2E tests failing
Install Playwright browsers: `npx playwright install chromium`
Ensure the dev server is running or let Playwright start it automatically.
