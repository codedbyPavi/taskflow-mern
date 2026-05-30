# TaskFlow

TaskFlow is a full-stack task management app with a Kanban board, analytics, and a **Workflow Health Monitor** that scores how smoothly work is moving across your board.

## Live Demo

🌐 Frontend:
https://taskflow-mern-iota.vercel.app

⚙️ Backend Health Check:
https://taskflow-mern-wk1p.onrender.com/api/health

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

## Screenshots
register page 
<img width="2551" height="1469" alt="image" src="https://github.com/user-attachments/assets/17bcf1c3-f9ab-4eb5-b3a3-e21ed1ae99d3" />
sign page
<img width="2552" height="1473" alt="image" src="https://github.com/user-attachments/assets/7f9e7978-0bdf-4f2a-bfd9-7997f436751c" />
board page
<img width="2547" height="1461" alt="image" src="https://github.com/user-attachments/assets/1c4bf45c-da2c-4384-8b5b-1afa5a54ad7f" />
analytics page
<img width="2551" height="1463" alt="image" src="https://github.com/user-attachments/assets/7b1c0f0e-aabe-416b-bb0c-d637bc9ecb96" />

## Workflow Health Monitor

Workflow health measures operational friction on real tasks (onboarding/guide tasks are excluded from metrics).

| Signal | Rule |
|---------|---------|
| Blocked | Status is blocked (-5 points each) |
| Overdue | Due date before today and not done (-3 each) |
| Stuck | In Progress with no update for 3+ days (-2 each) |

**Score Formula**

```text
max(0, 100 - blocked*5 - overdue*3 - stuck*2)
```

### Interpretation

- 0 real tasks: score is N/A (not 100)
- Excellent: > 80
- Moderate: > 60
- Needs Attention: < 60

The score is exposed through:

```http
GET /api/tasks/workflow-health
```

and is displayed on both the Dashboard and Analytics pages.

---

## Tech Stack

| Layer | Technologies |
|---------|---------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios, @dnd-kit, Recharts, react-hot-toast, lucide-react |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, express-validator, CORS |
| Database | MongoDB Atlas (production); optional in-memory MongoDB for local development fallback |

---

## Installation

Clone the repository and work from the `task-manager` directory.

### Backend

```bash
cd server
npm install
cp .env.example .env

# Edit .env - see Environment Variables below

npm run dev
```

API default:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

Local development without Atlas:

- Omit `MONGO_URI`, or
- Use an unreachable URI

The server can fall back to an in-memory MongoDB instance. Data is lost on restart and should never be used in production.

### Frontend

```bash
cd client
npm install
cp .env.example .env

# Development:
# Leave VITE_API_URL empty to use the Vite proxy

npm run dev
```

App URL:

```text
http://localhost:5173
```

### Production Build

```bash
cd client
npm run build
```

Output:

```text
client/dist
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|---------|---------|---------|
| MONGO_URI | Yes (production) | MongoDB Atlas connection string |
| JWT_SECRET | Yes | Secret used to sign JWTs (32+ random characters recommended) |
| PORT | No | HTTP port (default 5000, Render sets automatically) |
| CLIENT_URL | Yes (production) | Frontend origin used by CORS |
| NODE_ENV | Recommended | Set to production on Render |
| DISABLE_MEMORY_MONGO | Recommended | Set to true in production |

See `server/.env.example` for a template.

### Frontend (`client/.env`)

| Variable | Required | Description |
|---------|---------|---------|
| VITE_API_URL | Production | API origin only (no trailing slash), e.g. https://taskflow-mern-wk1p.onrender.com |
| VITE_API_PROXY_TARGET | No | Development-only Vite proxy target |
| VITE_API_PROXY_ORIGIN | No | Development-only proxy origin |

Development:

Leave `VITE_API_URL` empty and Vite will proxy `/api` requests to the backend.

See `client/.env.example` for examples.

**Security Note**

Never commit `.env` files.

They are intentionally ignored through `.gitignore`.

Use `.env.example` files as documentation only.

---

## Deployment

### 1. MongoDB Atlas

1. Create a cluster and database user.
2. Configure Network Access to allow your Render service (or `0.0.0.0/0` for testing only).
3. Copy the connection string into Render as `MONGO_URI`.

### 2. Backend (Render)

- Root Directory: `server`
- Build Command:

```bash
npm install
```

- Start Command:

```bash
npm start
```

Set environment variables listed above.

Render automatically provides the `PORT` variable.

After deployment, note the public backend URL.

### 3. Frontend (Vercel)

- Root Directory: `client`
- Framework Preset: Vite
- Build Command:

```bash
npm run build
```

- Output Directory:

```text
dist
```

Environment Variable:

```text
VITE_API_URL=https://taskflow-mern-wk1p.onrender.com
```

`client/vercel.json` rewrites non-asset routes to `index.html` for React Router support.

### 4. Post Deployment

1. Set Render `CLIENT_URL` to your Vercel frontend URL.
2. Redeploy the backend if CORS settings change.
3. Open the application and verify registration, login, task operations, and health monitoring.

## License
Private / portfolio use only.

## Assumptions

- **Single-user context per account** — tasks are scoped to the logged-in user only; no team sharing or collaboration features are assumed in scope.
- **No email verification** — registration is immediate; a real production app would send a confirmation email before activating the account.
- **Due dates are optional** — tasks without a due date are valid and simply excluded from overdue calculations in the Workflow Health Monitor.
- **Onboarding/guide tasks are synthetic** — the Workflow Health Monitor intentionally excludes seeded demo tasks so metrics reflect only real user-created tasks.
- **MongoDB Atlas is the production database** — local development supports an in-memory MongoDB fallback, but this is not suitable for production use.

---

## Tradeoffs

| Decision | What I chose | What I gave up | Why |
|---|---|---|---|
| **JWT in localStorage** | Simple, works across tabs, easy to implement | Vulnerable to XSS attacks (httpOnly cookies would be safer) | Acceptable for a portfolio project; a production app would use httpOnly cookies with CSRF protection |
| **Client-side search** | Instant results, no extra API call | Doesn't scale beyond hundreds of tasks | Sufficient for the expected task volume; Mongo text index search would be the upgrade path |
| **Recharts for analytics** | Zero config, React-native, small bundle | Less customisable than D3 | Faster to ship; D3 would be overkill for bar/line charts |
| **`@dnd-kit` for drag-and-drop** | Accessible, lightweight, actively maintained | More verbose API than react-beautiful-dnd | react-beautiful-dnd is unmaintained; @dnd-kit is the community standard |
| **Separate `client/` and `server/` folders** | Clear separation of concerns, independent deployments | No shared code/types between frontend and backend | Matches real-world MERN project structure; simplifies Vercel + Render deployment |
| **In-memory MongoDB fallback for local dev** | Easier onboarding, no Atlas setup needed locally | Risk of masking Atlas connection failures in production | Mitigated by the `DISABLE_MEMORY_MONGO` env flag which should always be set in production |

---

## Technical Decisions

**Why MERN?**  
MongoDB's flexible document model suits tasks well — subtasks, metadata, and priorities can evolve without schema migrations. Express and Node give a lightweight, JavaScript-consistent API layer. React's component model maps cleanly to the Kanban board's drag-and-drop UI.

**Why Vite over Create React App?**  
Vite's dev server is significantly faster (native ESM, no bundling in dev mode) and its build output is leaner. CRA is effectively unmaintained.

**Why Tailwind CSS?**  
Utility-first CSS keeps styles colocated with components, eliminating dead CSS and reducing context switching. For a single-developer project, it's faster than maintaining a separate stylesheet architecture.

**Why Render for the backend?**  
Render's free tier supports persistent Node.js services with environment variable management and auto-deploy from GitHub — the same workflow a production team would use. Heroku's free tier was discontinued; Render is the natural replacement.

**Workflow Health Monitor design**  
The formula (`max(0, 100 − blocked×5 − overdue×3 − stuck×2)`) is weighted by severity: a blocked task is the most critical signal (completely stops progress), overdue tasks signal deadline failure, and stuck in-progress tasks signal inertia. Weights were chosen to make the score degrade meaningfully — three overdue tasks drop the score from 100 to 91, and a single blocked task from 100 to 95, reflecting real operational impact.

**JWT secret rotation**  
`JWT_SECRET` is injected via environment variable and never hardcoded. Rotating it invalidates all existing sessions — acceptable behaviour documented here so future maintainers understand the tradeoff.
