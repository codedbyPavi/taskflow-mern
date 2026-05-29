# TaskFlow

TaskFlow is a full-stack task management app with a Kanban board, analytics, and a **Workflow Health Monitor** that scores how smoothly work is moving across your board.

## Features

- JWT authentication (register, login, protected routes)
- Kanban board with drag-and-drop (`@dnd-kit`)
- Task CRUD: title, description, priority, due date, status, block/unblock
- Subtask breakdown assistant (client-side keyword suggestions)
- Analytics dashboard with charts (Recharts)
- Real-time task search on the board
- Responsive layout (sidebar + mobile-friendly dashboard)
- API health check (`GET /api/health`)

## Workflow Health Monitor

Workflow health measures operational friction on **real tasks** (onboarding/guide tasks are excluded from metrics).

| Signal | Rule |
|--------|------|
| **Blocked** | Status is `blocked` (?5 points each) |
| **Overdue** | Due date before today and not `done` (?3 each) |
| **Stuck** | `in-progress` with no update for 3+ days (?2 each) |

**Score:** `max(0, 100 ? blocked�5 ? overdue�3 ? stuck�2)`

- **0 real tasks:** score is `N/A` (not 100).
- **Tones:** Excellent (?80), Moderate (?60), Needs attention (&lt;60).
- Exposed at `GET /api/tasks/workflow-health` and shown on the dashboard and analytics pages.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios, `@dnd-kit`, Recharts, react-hot-toast, lucide-react |
| **Backend** | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, express-validator, CORS |
| **Database** | MongoDB Atlas (production); optional in-memory MongoDB for local dev fallback |

## Installation

Clone the repo and work from the `task-manager` directory (this folder is the application root).

### Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env � see Environment Variables below
npm run dev
```

API default: `http://localhost:5000` � health: `http://localhost:5000/api/health`

**Local dev without Atlas:** omit `MONGO_URI` or use a unreachable URI; the server can fall back to in-memory MongoDB (data is lost on restart). Do **not** rely on this in production.

### Frontend

```bash
cd client
npm install
cp .env.example .env
# Dev: leave VITE_API_URL empty to use the Vite proxy (/api ? localhost:5000)
npm run dev
```

App default: `http://localhost:5173`

### Production build (local check)

```bash
cd client
npm run build
```

Output: `client/dist/`

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes (production) | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs (use 32+ random characters) |
| `PORT` | No | HTTP port (default `5000`; Render sets this automatically) |
| `CLIENT_URL` | Yes (production) | Frontend origin for CORS, e.g. `https://your-app.vercel.app` |
| `NODE_ENV` | Recommended | Set to `production` on Render |
| `DISABLE_MEMORY_MONGO` | Recommended | Set to `true` in production so Atlas failures are not masked |

See `server/.env.example` for a template.

### Frontend (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Production | API **origin only** (no trailing slash), e.g. `https://taskflow-api.onrender.com`. Requests use paths like `/api/auth/login`. |
| `VITE_API_PROXY_TARGET` | No | Dev only � Vite proxy target (default `http://localhost:5000`) |
| `VITE_API_PROXY_ORIGIN` | No | Dev only � Origin header sent through the proxy for CORS |

**Development:** leave `VITE_API_URL` empty; Vite proxies `/api` to the backend.

See `client/.env.example` for a template.

> **Security:** Never commit `.env` files. They are listed in `.gitignore`. Use `.env.example` as documentation only.

## Deployment Instructions

### 1. MongoDB Atlas

1. Create a cluster and database user.
2. Network Access ? allow your Render service (or `0.0.0.0/0` for testing only).
3. Copy the connection string into Render as `MONGO_URI`.

### 2. Backend � Render

- **Root Directory:** `server` (if the Git repo root is `task-manager`, use `server`; if the repo root *is* `task-manager`, same path relative to clone root)
- **Build Command:** `npm install`
- **Start Command:** `npm start` (`node server.js`)
- Set environment variables (see above). Render provides `PORT` automatically.

After deploy, note the public URL (e.g. `https://taskflow-api.onrender.com`).

### 3. Frontend � Vercel

- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment variable:** `VITE_API_URL` = your Render API origin (no trailing slash)

`client/vercel.json` rewrites non-asset routes to `index.html` for React Router.

### 4. Post-deploy

1. Set Render `CLIENT_URL` to your Vercel URL.
2. Redeploy the backend if CORS was blocking the frontend.
3. Open the Vercel site, register, and confirm `GET /api/health` returns `{ ok: true, db: "connected" }`.

## Repository layout

```
task-manager/
??? client/          # React + Vite frontend
??? server/          # Express API
??? .gitignore
??? README.md
```

## Scripts reference

| Location | Command | Purpose |
|----------|---------|---------|
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production static build ? `dist/` |
| `server/` | `npm run dev` | API with `--watch` |
| `server/` | `npm start` | Production API (`node server.js`) |

## License

Private / portfolio use � update as needed.
