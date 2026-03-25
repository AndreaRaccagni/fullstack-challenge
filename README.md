# Jewelry Catalog Take-Home Exercise

This repository contains a small full-stack take-home exercise for a Senior Full Stack / Backend profile with a primary focus on TypeScript, Node.js, SQL and clean backend architecture.

This exercise is intentionally scoped as a substantive take-home. A strong candidate may complete it in around 2 hours, but many candidates will spend longer, and that is completely fine.

## What This Project Includes

- A NestJS backend
- PostgreSQL via Docker Compose
- SQL migration and seed scripts
- A very small React + TypeScript frontend
- A lightweight test suite
- An intentionally seeded bug

## Architecture At A Glance

The backend is organized into these layers:

- `src/domain`
  - core product types
  - no NestJS, database, or framework imports
- `src/application`
  - use cases such as listing and creating products
  - depends on domain types and ports only
- `src/ports`
  - repository interfaces used by the application layer
- `src/adapters`
  - inbound HTTP adapter with NestJS controllers
  - outbound PostgreSQL adapter implementing the repository port
- `src/infrastructure`
  - Nest module wiring
  - database service/config/scripts
  - runtime-specific setup

## Your Tasks

Some parts of the app are intentionally incomplete or incorrect as part of the exercise.

Please complete the following:

1. Fix the current bug in `GET /products`.
2. Add support for the following filters:
   - backend: `GET /products?category=...&maxPrice=...`
   - frontend: keep the existing UI filter flow working end-to-end in a simple, pragmatic way (no extra polish expected)
3. Add a new field end-to-end: `stock` (`integer`)
   - add a migration
   - persist it in `POST /products`
   - return it in `GET /products`
   - show it in the frontend

## Getting Started

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Run migrations and seed data:

```bash
npm run db:setup
```

## Run The Project

Run backend and frontend together:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:api
npm run dev:web
```

Default URLs:

- backend: `http://localhost:3000`
- frontend: `http://localhost:5173`

## Run Tests

```bash
npm test
```

One test currently fails on purpose to expose the seeded bug in the products flow.

## Use Of AI Tools

You are welcome to use AI tools for this exercise. They are not only allowed, but encouraged if they help you work effectively.

Please be ready to explain your solution, the decisions you made, and any AI-assisted parts during follow-up discussion.

## Current Product API

### `GET /products`

Current behavior:

- returns products ordered by newest first
- intended to return only active products by default

Example:

```bash
curl "http://localhost:3000/products"
```

### `POST /products`

Example:

```bash
curl -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "North Star Ring",
    "category": "rings",
    "price": 149,
    "isActive": true
  }'
```

As part of the exercise, this payload will need to support the new `stock` field.

## Frontend Notes

The frontend is intentionally small. It exists only to provide a light full-stack signal and make the product flow visible from the UI.

Please keep frontend changes simple and proportional to the exercise. You do not need to over-polish the UI.

## Submission

Please complete the exercise in your own fork of this repository and share the final repository link with us when submitting.

Please also include a short `SOLUTION.md` (or similar) explaining:

- what you changed
- how you validated it
- what you would improve with more time
- what AI tools you used, if any, and how you used them
