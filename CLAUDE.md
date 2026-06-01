# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LTI is a full-stack ATS (Applicant Tracking System) — React 19 frontend + Express 5 backend with Prisma ORM on PostgreSQL. The core UI is a Kanban board where recruiters move candidates through configurable interview stages.

## Development Commands

### Backend (`/backend`)
```bash
npm run dev              # ts-node-dev with hot reload on port 3010
npm run build            # tsc compile to dist/
npm test                 # Jest (ts-jest preset)
npm run prisma:generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev   # Run migrations (from /backend)
```

### Frontend (`/frontend`)
```bash
npm start    # CRA dev server on port 3000
npm run build
npm test     # Jest with jest.config.js
```

### Database
```bash
docker-compose up -d   # Start PostgreSQL (credentials from .env)
cd backend && ts-node prisma/seed.ts  # Seed sample data
```

Backend `.env` holds `DB_PASSWORD`, `DB_USER`, `DB_NAME`, `DB_PORT`. The hardcoded connection string in `prisma/schema.prisma` is the development default — prefer the env var form.

## Architecture

### Backend — layered DDD

```
src/
  index.ts                        # Express app, PrismaClient, middleware wiring
  routes/                         # Thin routers — delegate immediately to controllers
  presentation/controllers/       # Parse req, call service, send res
  application/services/           # Business logic, Prisma queries
  application/validator.ts        # Input validation (throws Error on bad data)
```

`PrismaClient` is instantiated once in `index.ts` and attached to every request as `req.prisma` via middleware. Controllers receive it from there — do not instantiate a new PrismaClient in services.

**Candidate is the aggregate root.** `POST /candidates` accepts a nested payload (educations, workExperiences, cv) and creates all related records in one transaction. `validateCandidateData` in `validator.ts` runs first; when `data.id` is present it skips validation (edit path).

### Frontend — React 19 + Tailwind + React Router v7

```
src/
  App.tsx / App.js        # Router setup (react-router-dom v7)
  components/             # Mix of .tsx and .js — new files should be .tsx
  services/               # Axios API calls (hardcoded base URL http://localhost:3010)
```

The frontend is in an early/starter state. `App.tsx` is still the CRA default; `App.js` likely has the actual router. `PositionBoard.tsx` is a stub. The component-level Kanban is not yet wired to the API.

New frontend work lives in `frontend/.claude/` — see slash commands `/frontend-workflow`, `/spec`, `/implement`, `/review`, `/test`, `/pr` for the design-to-code workflow.

### API Endpoints

Base URL: `http://localhost:3010`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/candidates` | Create candidate with nested educations, workExperiences, cv |
| GET | `/candidates/:id` | Get candidate with all relations |
| PUT | `/candidates/:id` | Update candidate stage (`currentInterviewStep`) |
| POST | `/upload` | Multipart file upload (multer), returns `{ filePath, fileType }` |
| GET | `/position` | List all positions |
| GET | `/position/:id/candidates` | Candidates for a position with their current stage |
| GET | `/position/:id/interviewflow` | InterviewFlow + ordered InterviewSteps for a position |

### Data model key relationships

`Position` → `InterviewFlow` → `InterviewStep[]` (ordered by `orderIndex`) → `InterviewType`

`Candidate` → `Application` → `InterviewStep` (current stage) + `Interview[]`

Moving a candidate on the Kanban = `PUT /candidates/:id` updating `currentInterviewStep` on the `Application`.

## Adding a New Backend Route

Follow the layered pattern: route file → controller → service. See `backend/src/prompts/CreateNewRoute.md` for the full step-by-step prompt used as a reference.

## Code Style

### Frontend
- Tailwind CSS only — no CSS files, no inline styles
- `const Component = () =>` arrow functions for all components
- Event handlers prefixed `handle` (e.g., `handleClick`, `handleKeyDown`)
- Early returns for guard clauses
- Accessibility: `tabIndex`, `aria-label`, keyboard handlers alongside click handlers
- New files: `.tsx` (migrate `.js` files when touching them)

### Backend
- Throw `Error` from validators/services; controllers catch and send appropriate HTTP status
- ESLint + Prettier (`backend/.prettierrc`, `backend/.eslintrc.js`)
