# Server - Task Management System

Backend scaffold with Express, TypeScript, and Prisma.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Run migrations: `npx prisma migrate dev --name init`
5. Seed database: `npm run seed`

## Scripts

- `npm run dev` - start development server with ts-node-dev
- `npm run build` - compile TypeScript
- `npm run start` - run compiled JS
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run migrations
- `npm run seed` - run seed script

## Notes

- Business logic should live in `src/services/*`.
- Controllers are thin and only handle request/response.
- Validation uses Zod and lives in `src/validations`.
