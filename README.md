# Screenline Ticket Pricing

Screenline is a simple full-stack cinema ticket pricing and booking application.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express.js, JavaScript, Zod
- Database: MongoDB with Mongoose
- Development seed hashing: Argon2id

There is no Prisma, PostgreSQL, SQL migration, payment gateway, Redis, Kafka, or microservice infrastructure in this project.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally, or a MongoDB deployment configured through `MONGODB_URI`

MongoDB transactions require a replica set or sharded deployment. Booking creation uses transactions when connected to a transaction-capable MongoDB deployment.

## Setup

```bash
cp .env.example .env
npm install
npm run seed
```

The root `.env` is loaded by the backend when commands are run from the repository root. Use clearly fake development values only.

## Run

```bash
npm run dev:backend
npm run dev:frontend
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173
- Health: http://localhost:4000/api/v1/health

Verify the health endpoint:

```bash
curl http://localhost:4000/api/v1/health
```

Expected response:

```json
{"success":true,"message":"API is running"}
```

## Environment

Required values are documented in `.env.example`:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `CLIENT_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `VITE_API_URL`

## Seed data

```bash
npm run seed
```

The seed creates development-only cinemas, screens, movies, shows, Silver/Gold/Recliner tiers, pricing policy data, availability including a sold-out tier, and one member user.

Development-only user:

- Email: `member.dev@example.test`
- Password: `DevelopmentOnly-ChangeMe-123!`

These credentials are development-only and must never be used outside development.

## Money and data design

Monetary fields are persisted as integer paise using Mongoose's BSON-compatible BigInt type. API responses serialize paise consistently as strings.

Booking creation and inventory updates use Mongoose `ClientSession` transactions. Transaction-safe booking requires MongoDB transaction support, such as a replica set.

## Current scope

Included:

- Express application and health endpoint
- Zod environment validation
- centralized errors and development request logging
- MongoDB connection and Mongoose models
- development seed script
- React/Vite/Tailwind application shell
- responsive React application shell and Axios client with credentials enabled
- signup, login, logout, current-user state, and protected routes
- show catalog and tier availability
- exact paise pricing with festival discount, membership discount, convenience fee, and GST
- CSV seat-class price import with accepted, duplicate, and rejected row reporting
- transactional booking creation and user booking history

Not included:

- payments, seat maps, admin roles, refresh-token systems, and external identity providers

## Price import

Authenticated users can import a CSV for a selected show through the ticket-selection screen. The CSV must contain `seatClass,price` columns. Prices accept documented INR-style values such as `150`, `150.00`, `₹150.00`, and `1,250.00`. Blank, negative, malformed, unknown, and repeated classes are reported per row. The first occurrence of a normalized class is accepted; later occurrences are reported as duplicates.
