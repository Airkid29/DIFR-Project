# ForensiGuard

ForensiGuard is a modern digital forensics investigation platform built as a full-stack MVP.
It combines a React + Vite frontend with a FastAPI backend, PostgreSQL persistence, Redis/Celery background processing, and YARA-based file triage.

## What was improved

- Backend authentication now uses JWT bearer tokens instead of a hardcoded fallback.
- Frontend login now calls `/api/auth/login` and stores the token in `localStorage`.
- A Vite `/api` proxy was added for local frontend/backend development.
- Protected routes now guard all internal application pages and redirect unauthenticated users to `/login`.
- The landing page navigation and section structure were cleaned up for a more consistent user experience.
- The incidents page now shows a friendly empty state when no matches appear.
- Frontend logout now removes the auth token from storage.

## Architecture

### Frontend

- Framework: React + TypeScript
- Bundler: Vite
- Styling: Tailwind CSS v4 with custom design tokens
- Routing: React Router DOM v7
- State: component state + React Query currently configured for future API calls

### Backend

- Framework: FastAPI
- Database ORM: SQLAlchemy
- Job queue: Celery + Redis
- Persistence: PostgreSQL
- Authentication: JWT bearer tokens
- Forensic processing: YARA signatures and cryptographic hashing

## Local development

### Prerequisites

- Docker Desktop or Docker Engine
- Node.js 20+ / npm 10+
- Python 3.11 if you want to run backend outside Docker

### Start backend services

From the repository root:

```bash
docker-compose up --build
```

This starts:

- `db` – PostgreSQL database
- `redis` – Redis broker/backend
- `api` – FastAPI backend
- `worker` – Celery worker for background tasks

The backend API is available at `http://localhost:8000`.

### Start frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend app will start on the Vite development server, typically at `http://localhost:5173`.
The app proxies `/api` requests to the backend automatically.

## Default credentials

- Email: `r.jenkins@forensiguard.com`
- Password: `securepassword123`
- MFA code: `123456` or `000000`

## Project structure

- `frontend/` – React application with pages, layout, and branding
- `backend/` – FastAPI application, models, schemas, tasks, and Docker setup
- `docker-compose.yml` – orchestration for PostgreSQL, Redis, API, and worker

## Notes for next steps

- Implement actual data-layer API calls in frontend pages for incidents, evidence, reports, and timeline.
- Add more form validation and server error handling on the frontend.
- Extend the backend with real RBAC, email verification, and secure MFA flows.
- Add end-to-end testing for UI flows, API authentication, and background task processing.

## Useful URLs

- Backend docs: `http://localhost:8000/docs`
- Frontend app: `http://localhost:5173`

---

If you want, I can now continue by wiring the frontend pages to the backend API endpoints and completing the remaining feature flows.