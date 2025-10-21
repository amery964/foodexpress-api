# FoodExpress API

Express-based REST API with JWT auth, input validation (Joi), file-backed JSON database (lowdb), Swagger docs, and Jest tests.

## Quick start

```bash
# Node 18+ recommended (uses ES modules)
npm install
npm run dev
# API runs on http://localhost:3000
# Swagger docs at http://localhost:3000/docs
```

## Environment

Create a `.env` (optional). These env vars also accept defaults:
- PORT=5000
- JWT_SECRET=supersecretchangeit
- DB_FILE=./data/db.json

## Endpoints summary

- **/users**
  - POST /users (create account, public)
  - POST /users/login (login → JWT)
  - GET /users (admin only, list users)
  - GET /users/me (self profile)
  - GET /users/:id (admin or self only)
  - PATCH /users/:id (admin or self only)
  - DELETE /users/:id (admin or self only)

- **/restaurants**
  - GET /restaurants (public, pagination & sorting)
  - GET /restaurants/:id (public)
  - POST /restaurants (admin only)
  - PATCH /restaurants/:id (admin only)
  - DELETE /restaurants/:id (admin only; cascades menus)

- **/menus**
  - GET /menus (public, pagination & sorting)
  - GET /menus/:id (public)
  - POST /menus (admin only)
  - PATCH /menus/:id (admin only)
  - DELETE /menus/:id (admin only)

## Tests

```bash
npm test
```

## Notes
- Persistence is file-based through `lowdb` under `./data/db.json`. The file is created on first run.
- Passwords are hashed with bcryptjs. Tokens are JWT (HS256).
- Validation with Joi via `validate()` middleware.