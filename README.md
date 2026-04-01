# E-Commerce API

A RESTful e-commerce API built with Node.js, Express, and MongoDB. Features JWT authentication, product management, shopping cart, and payment integration via PayMongo. Submission for Roadmap.sh: https://roadmap.sh/projects/ecommerce-api

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Payment Gateway:** PayMongo

## Features

- User registration and login with JWT authentication
- Role-based access control (user / admin)
- Product listing, search, and filtering
- Full product CRUD (admin only)
- Shopping cart management (add, update, remove items)
- Checkout with PayMongo payment link generation
- Order management and cancellation

## Project Structure

```
ecommerce-api/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.model.js
│   │   ├── products/
│   │   │   ├── products.routes.js
│   │   │   ├── products.controller.js
│   │   │   └── products.model.js
│   │   ├── cart/
│   │   │   ├── cart.routes.js
│   │   │   ├── cart.controller.js
│   │   │   └── cart.model.js
│   │   └── orders/
│   │       ├── orders.routes.js
│   │       ├── orders.controller.js
│   │       └── orders.model.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── config/
│   │   └── db.js
│   └── app.js
├── .env
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- PayMongo account (for test API keys)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-api.git
cd ecommerce-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
PAYMONGO_SECRET_KEY=sk_test_your_paymongo_key
ADMIN_SECRET=your_admin_secret
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PAYMONGO_SECRET_KEY` | PayMongo secret key (test or live) |
| `ADMIN_SECRET` | Secret key for registering admin accounts |

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | None |
| POST | `/api/auth/login` | Login and receive JWT | None |

**Register as admin** — include `adminSecret` in the request body matching your `ADMIN_SECRET` env variable.

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List all products | None |
| GET | `/api/products?search=name` | Search products by name | None |
| GET | `/api/products?category=name` | Filter products by category | None |
| GET | `/api/products/:id` | Get a single product | None |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |

### Cart

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/cart` | View current cart | User |
| POST | `/api/cart` | Add item to cart | User |
| DELETE | `/api/cart/:productId` | Remove item from cart | User |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders/checkout` | Checkout and get payment link | User |
| GET | `/api/orders` | View user's orders | User |
| POST | `/api/orders/:id/cancel` | Cancel an order | User |

## Authentication

This API uses Bearer token authentication. After logging in, include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## Payment

Checkout returns a `paymentUrl` from PayMongo. Redirect the user to this URL to complete payment.

For testing, use the following test card details on the PayMongo checkout page:

| Field | Value |
|---|---|
| Card Number | `4343434343434343` |
| Expiry | Any future date |
| CVC | Any 3 digits |

## Scripts

```bash
npm run dev    # Start with nodemon (development)
npm start      # Start normally (production)
```