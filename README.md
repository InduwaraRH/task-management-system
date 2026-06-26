# Task Management System

Monorepo scaffold for a Task Management System technical assessment.

This repository contains two main apps:
- `client` – React + Vite + TypeScript frontend
- `server` – Node + Express + TypeScript backend with Prisma + MySQL

See individual README sections in `client/` and `server/` for run instructions.

## Quick Start

1. Install dependencies for client and server:

```
cd client
npm install

cd ../server
npm install
```

2. Configure environment variables. See `server/.env.example`.

3. Run database migrations and seed (server):

```
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4. Start both apps in development:

```
cd server && npm run dev
cd ../client && npm run dev
```

