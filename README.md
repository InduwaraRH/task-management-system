# TaskFlow — Task Management System

A full-stack task management application with role-based access control, built as part of a technical assessment for Newnop.

## Live Demo

- **Frontend:** [https://task-management-system-ffxp.vercel.app/]
- **Backend API:** [https://task-management-system-production-c1a2.up.railway.app/]

### Demo Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@taskflow.dev     | admin123  |
| User  | jane@taskflow.dev      | user123   |
| User  | alex@taskflow.dev      | user123   |

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend  | Express.js, Node.js, TypeScript         |
| Database | MySQL, Prisma ORM                       |
| Auth     | JWT, bcryptjs                           |
| State    | TanStack React Query                    |
| Validation | Zod (frontend + backend)              |

---

## Features

### Core
- JWT authentication (register, login, protected routes)
- Role-based access control — Admin sees all tasks, Users see only their own
- Full task CRUD — create, read, update, delete
- Task fields: title, description, priority (Low/Medium/High), status, due date, assignee

### Bonus
- Four task statuses: Open, In Progress, Testing, Done
- Search tasks by title
- Filter by priority and status
- Inline status updates without opening the edit modal
- Priority sorting — High priority tasks surface first
- Overdue task detection with visual indicators
- Task detail page with full metadata
- Stats summary bar (total, active, high priority, due soon)
- Toast notifications for all actions
- Responsive layout (mobile + desktop)
- Seed data with demo users and sample tasks

## Local Setup

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd newnop-task-management
```

### 2. Set up the server
```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your MySQL credentials:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/taskflow"
JWT_SECRET=any_long_random_string
```

Run migrations and seed:
```bash
npx prisma migrate dev --name init
npm run seed
```

Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Set up the client
```bash
cd ../client
npm install
cp .env.example .env
```

Start the client:
```bash
npm run dev
```

Client runs on `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint        | Access  | Description        |
|--------|-----------------|---------|--------------------|
| POST   | /auth/register  | Public  | Register new user  |
| POST   | /auth/login     | Public  | Login              |
| GET    | /auth/me        | Private | Get current user   |
| GET    | /auth/users     | Private | List all users     |

### Tasks
| Method | Endpoint     | Access       | Description              |
|--------|--------------|--------------|--------------------------|
| GET    | /tasks       | Private      | List tasks (role-filtered)|
| GET    | /tasks/:id   | Private      | Get task detail          |
| POST   | /tasks       | Private      | Create task              |
| PUT    | /tasks/:id   | Owner/Admin  | Update task              |
| DELETE | /tasks/:id   | Owner/Admin  | Delete task              |

### Query Parameters (GET /tasks)
| Param       | Type   | Description            |
|-------------|--------|------------------------|
| search      | string | Filter by title        |
| priority    | enum   | LOW, MEDIUM, HIGH      |
| status      | enum   | OPEN, IN_PROGRESS, TESTING, DONE |
| assignedToId| string | Filter by assignee ID  |

---

## Architecture Notes

- **Service layer pattern** — controllers handle HTTP, services handle business logic
- **Role guard middleware** — `authenticate` verifies JWT, `authorize` checks role
- **Zod validation** — all inputs validated on both client and server
- **React Query** — server state management with automatic cache invalidation
- **Prisma ORM** — type-safe database access with auto-generated types