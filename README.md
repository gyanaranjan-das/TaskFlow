# TaskFlow — Task Management System

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

![TaskFlow](https://img.shields.io/badge/TaskFlow-v1.0.0-6366f1?style=for-the-badge)

## Features

- **JWT Authentication** with refresh token rotation
- **Email verification** and password reset
- **Kanban board** with drag-and-drop (powered by @hello-pangea/dnd)
- **Task management** — CRUD, filters, sort, pagination, soft delete
- **Project management** — CRUD, member invitations, role-based access
- **Labels** — color-coded, user-scoped
- **Comments** — threaded under tasks
- **Subtasks** — with progress tracking
- **File uploads** — via Cloudinary
- **Dark mode** — system-aware with manual toggle
- **Responsive design** — works on desktop, tablet, and mobile
- **Skeleton loaders** — shimmer animations on all async views
- **Toast notifications** — stacked, animated, color-coded

## Tech Stack

### Backend
- **Runtime**: Node.js 20 + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt + refresh token rotation
- **Validation**: Zod
- **Uploads**: Multer + Cloudinary
- **Email**: Nodemailer
- **Logging**: Winston
- **Security**: Helmet, CORS, rate limiting, mongo-sanitize, HPP

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v3
- **State**: TanStack React Query (server) + Zustand (client)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **DnD**: @hello-pangea/dnd
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/gyanaranjan-das/Task-Management-System.git
cd Task-Management-System
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env   # Edit with your values
npm install
npm run dev             # Starts on port 5000
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev             # Starts on port 5173
```

### 4. Environment Variables

See `server/.env.example` for all required variables:
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 10 chars) |
| `CLIENT_URL` | Frontend URL for CORS + email links |
| `SMTP_HOST/PORT/USER/PASS` | SMTP credentials for emails |
| `CLOUDINARY_*` | Cloudinary credentials for file uploads |

## Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Access:
# - Frontend: http://localhost
# - API: http://localhost:5000
# - MongoDB: localhost:27017
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with filters) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/stats` | Task statistics |
| GET | `/api/tasks/:id` | Get task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Soft delete task |
| PATCH | `/api/tasks/bulk` | Bulk update |
| PATCH | `/api/tasks/reorder` | Reorder (kanban) |
| POST | `/api/tasks/:id/subtasks` | Add subtask |
| PATCH | `/api/tasks/:id/subtasks/:sid` | Toggle subtask |
| POST | `/api/tasks/:id/attachments` | Upload attachment |
| GET | `/api/tasks/:tid/comments` | Get comments |
| POST | `/api/tasks/:tid/comments` | Add comment |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Invite member |
| PATCH | `/api/projects/:id/members/:uid` | Change role |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PATCH | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar |
| PATCH | `/api/users/password` | Change password |
| GET | `/api/users/search` | Search users |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Project Structure

```
Task-Management-System/
├── server/                 # Backend API
│   ├── config/             # DB, env, cloudinary config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── utils/              # Helpers, constants, logger
│   ├── validations/        # Zod schemas
│   └── server.js           # Entry point
├── client/                 # Frontend SPA
│   ├── src/
│   │   ├── api/            # Axios API functions
│   │   ├── components/     # UI, layout, task, auth components
│   │   ├── hooks/          # React Query hooks
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── utils/          # Constants, helpers
│   │   └── styles/         # Tailwind CSS
│   └── nginx.conf          # Production nginx config
├── docker-compose.yml
└── .github/workflows/      # CI/CD pipeline
```

## License

MIT
