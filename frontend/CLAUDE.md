# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Frontend — LTI Recruitment App

React 19 + TypeScript (strict) + Tailwind CSS 3 + React Router v7. CRA (react-scripts 5) build tooling.

## Commands

```bash
npm start        # Dev server on port 3000
npm run build    # Production build (also type-checks)
npm test         # Jest via jest.config.js
```

## Design-to-Code Workflow

This frontend uses a Figma → Spec → Implement → Test pipeline. Design screens in Figma first, then hand the project ID to a slash command:

**Feature pipeline** (run in order, or use `/frontend-workflow` to chain automatically):

| Command | Purpose |
|---------|---------|
| `/frontend-workflow <figma-url>` | Full pipeline: Figma → spec → implement → review → test |
| `/spec <figma-url>` | Pull Figma design, write `specs/<name>.spec.md` |
| `/implement [spec-path]` | Implement from a spec file |
| `/review [spec-path]` | Review code against spec, conventions, and design tokens |
| `/test [spec-path]` | Run Playwright tests against localhost:3000 |

**On-demand** (run independently, not part of the pipeline):

| Command | Purpose |
|---------|---------|
| `/audit [mobile\|desktop]` | Lighthouse audit — performance, accessibility, best-practices, SEO |
| `/pr [base-branch]` | Create a GitHub PR with auto-generated title and description |

Agent personas for each phase are in `.claude/agents/`.

## Architecture

```
src/
  App.js / App.tsx         # Router — App.js has actual routes, App.tsx is CRA default stub
  components/              # Mix of .tsx and .js — write new files as .tsx
  services/candidateService.js  # Axios calls to backend (http://localhost:3010)
specs/                     # Generated spec files from /spec command
```

The app is in a starter state. `PositionBoard.tsx` is a stub awaiting Kanban implementation. New features should be built using the `/frontend-workflow` pipeline.

## Code Style

### Components

Always arrow functions assigned to const. Use `React.FC` for typed components:

```tsx
const Positions: React.FC = () => { ... }         // typed (preferred)
const RecruiterDashboard = () => { ... }           // untyped (.js files only)
```

Split a component when it exceeds ~100 lines or contains two distinct UI sections. Leaf components first, container last.

### TypeScript

Define types at the top of the file or in `src/types/<feature>.ts`. Use `type`, not `interface`. Never use `any`.

```tsx
type Position = {
  id: number;
  title: string;
  status: string;
  location: string;
  applicationDeadline: string | null;
  companyName: string;
};
```

### State

Use `useState` for all local state. Declare all state at the top of the component, before any derived values or effects. Keep state as close to where it's used as possible — lift only when two siblings genuinely share it.

Standard loading/error state pattern (always both):

```tsx
const [data, setData] = useState<Position[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Data fetching

Fetch inside `useEffect` with an inner async function. Always handle loading and error. Always set `loading = false` in `finally`:

```tsx
useEffect(() => {
  const fetchPositions = async () => {
    try {
      const response = await fetch('http://localhost:3010/position');
      if (!response.ok) throw new Error('Failed to fetch positions');
      setData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  fetchPositions();
}, []);
```

Use native `fetch`, not axios. Guard every response with `if (!response.ok)`.

### Early returns for loading and error

Return early for loading and error states before the main render. Keeps the happy-path JSX clean:

```tsx
if (loading) return <Spinner />;
if (error) return <ErrorBanner message={error} />;
```

### Event handlers

Always prefix with `handle`. `e.preventDefault()` on all form submits. Define handlers as named consts, not inline lambdas on complex logic:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  ...
};

// inline lambdas are fine for simple one-liners
onClick={() => handleViewProcess(position.id)}
```

### Forms

All inputs are controlled (value + onChange). Separate `error` and `successMessage` state. Reset them on each new submission attempt:

```tsx
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
```

Error and success feedback render inline below the submit button, never as alerts or modals unless the spec requires it.

### Conditional rendering

`&&` for single-branch, ternary for two-branch:

```tsx
{error && <div className="...">{error}</div>}
{loading ? <Spinner /> : <Content />}
```

Avoid nested ternaries.

### Lists

Always `key={item.id}`. Use index as key only for dynamic lists with no stable ID (e.g., unsaved education entries):

```tsx
{positions.map((position) => (
  <PositionCard key={position.id} position={position} />
))}
```

### Routing

`Link` for declarative navigation, `useNavigate` for programmatic (after form submit, on button click):

```tsx
const navigate = useNavigate();
const handleViewProcess = (id: number) => navigate(`/positions/${id}`);
```

### Tailwind

Use only Tailwind classes — no CSS files, no inline styles. Use the custom tokens defined in `tailwind.config.js` instead of raw hex or arbitrary values:

| Token | Value | Use for |
|-------|-------|---------|
| `bg-primary` / `text-primary` | `#2563eb` | Primary actions, links |
| `bg-primary-dark` | `#1d4ed8` | Hover state on primary |
| `text-success` / `bg-success` | `#16a34a` | Success messages |
| `text-warning` / `bg-warning` | `#f59e0b` | Warnings |
| `text-danger` / `bg-danger` | `#dc2626` | Errors, destructive actions |
| `text-muted` | `#6b7280` | Secondary text |

Standard feedback block patterns:

```tsx
// Error
<div className="rounded border border-red-300 bg-red-50 text-red-800 p-4">{error}</div>

// Success
<div className="rounded border border-green-300 bg-green-50 text-green-800 p-3 text-sm">{successMessage}</div>
```

### Accessibility

Every interactive element needs `tabIndex={0}`, `aria-label`, and a keyboard handler alongside the click handler:

```tsx
<div
  role="button"
  tabIndex={0}
  aria-label="View position process"
  onClick={handleViewProcess}
  onKeyDown={(e) => e.key === 'Enter' && handleViewProcess()}
>
```

Native `<button>` and `<a>` elements handle keyboard natively — no extra handlers needed on those.

### File conventions

- New files: `.tsx`. Migrate `.js` files to `.tsx` when touching them.
- Types: top of the file, or `src/types/<feature>.ts` when shared across components.
- Services: `src/services/<feature>Service.ts` — only API call logic, no JSX, no state.
- Backend base URL: `http://localhost:3010` (hardcoded in services; no env var yet).
