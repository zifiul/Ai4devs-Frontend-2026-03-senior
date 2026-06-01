# Dashboard Layout Spec

## Overview

A persistent shell layout for the LTI HRMS application consisting of a fixed dark sidebar (`SideNavBar`) and a top navigation bar (`TopNavBar`). The layout wraps all authenticated pages via a React Router nested route (`<Outlet>`). The Positions page and the Add Candidate page live as child routes inside this dashboard. This replaces the current flat route structure in `App.js`.

---

## Stack

- **Framework:** React 19, TypeScript (strict), `.tsx` files
- **Styling:** Tailwind CSS 3 only — no CSS files, no inline styles
- **Router:** React Router v7 (`react-router-dom`) — nested routes via `<Outlet>`
- **State:** `useState` for local state; no global store
- **API base URL:** `http://localhost:3010`
- **Build:** CRA (`react-scripts 5`)

---

## Design Guidelines Applied

No `design.md` exists in the project. All tokens are derived directly from the Figma frame (node `1:1051`, file `rNaPiLIAq9MmXnFL0Dv7uy`).

| Token (Tailwind arbitrary or class) | Value | Use |
|-------------------------------------|-------|-----|
| Sidebar bg | `bg-[#1a1c1c]` | SideNavBar background |
| Sidebar border | `border-[#5f5e5e]` | SideNavBar right border |
| Active nav bg | `bg-[#e4e2e1]` | Active nav link fill |
| Active nav accent | `border-l-4 border-[#004ccd]` | Active nav left border |
| Active nav text | `text-[#656464]` | Active link label |
| Inactive nav text | `text-[#e2e2e2]` | Inactive nav link label |
| Top nav bg | `bg-[#f9f9f9]` | TopNavBar background |
| Page bg | `bg-[#f9f9f9]` | Main content area bg |
| Page header bg | `bg-white` | Page header background |
| Card bg | `bg-white` | Stat card background |
| Border default | `border-[#e2e2e2]` | All dividing borders |
| Primary blue | `#004ccd` | Primary buttons, links, active accent |
| Text primary | `text-[#1a1c1c]` | Main body text |
| Text muted | `text-[#737687]` | Secondary / timestamp text |
| Table header text | `text-[#424656]` | Column header labels |
| Status OPEN bg | `bg-[#dbe1ff]` | OPEN badge fill |
| Status OPEN text | `text-[#003da9]` | OPEN badge label |
| Status PAUSED bg | `bg-[#e2e2e2]` | PAUSED badge fill |
| Status PAUSED text | `text-[#424656]` | PAUSED badge label |
| Stage bar track | `bg-[#e8e8e8]` | Progress bar track |
| Stage bar grey | `bg-[#737687]` | Screened / early stages |
| Stage bar light-blue | `bg-[#b4c5ff]` | Mid stages |
| Stage bar blue | `bg-[#004ccd]` | Final / advanced stages |
| Font | `font-['IBM_Plex_Sans:Regular']` etc. | IBM Plex Sans (all weights) |
| Logo text | `text-[20px] font-['IBM_Plex_Sans:Bold'] tracking-[-0.5px]` | "LTI HRMS" branding |

Primary button: `bg-[#004ccd] text-white px-4 py-2 rounded-[2px] flex items-center gap-2 text-sm`.

---

## Screens & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `DashboardLayout` | Shell — redirects to `/positions` |
| `/positions` | `PositionsDashboard` | Positions list with stats strip and data table |
| `/add-candidate` | `AddCandidate` (existing `AddCandidateForm.js`) | Add candidate form — rendered inside the dashboard shell |

`App.js` must be rewritten (as `App.tsx`) to use a nested route structure:
```
<Route path="/" element={<DashboardLayout />}>
  <Route index element={<Navigate to="/positions" replace />} />
  <Route path="positions" element={<PositionsDashboard />} />
  <Route path="add-candidate" element={<AddCandidate />} />
</Route>
```

Remove the Bootstrap import from `App.js`/`App.tsx` — Tailwind only from here on.

---

## Components

### `StatCard`

- **Props:**
  ```ts
  type StatCardProps = {
    label: string;
    value: string;
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:** purely presentational
- **Design:**
  - Container: `bg-white border border-[#e2e2e2] rounded-[2px] p-[17px] flex flex-col gap-1`
  - Label: `text-[12px] font-medium text-[#737687] uppercase tracking-[0.6px] font-['IBM_Plex_Sans:Medium']`
  - Value: `text-[32px] text-[#1a1c1c] leading-[40px] font-['IBM_Plex_Sans:Regular']`

---

### `StatusBadge`

- **Props:**
  ```ts
  type StatusBadgeProps = {
    status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:**
  - `OPEN` → `bg-[#dbe1ff] text-[#003da9]`
  - `PAUSED` → `bg-[#e2e2e2] text-[#424656]`
  - `CLOSED` → `bg-[#e2e2e2] text-[#424656]`
  - `DRAFT` → `bg-[#f3f3f3] text-[#737687]`
- **Design:**
  - `px-2 py-0.5 rounded-[2px] text-[12px] font-medium uppercase tracking-[0.3px] font-['IBM_Plex_Sans:Medium']`

---

### `StageDistributionBar`

- **Props:**
  ```ts
  type StageSegment = {
    color: string;   // Tailwind bg class, e.g. 'bg-[#737687]'
    widthPx: number; // absolute pixel width of segment within the 160px track
  };

  type StageDistributionBarProps = {
    segments: StageSegment[];
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:**
  - Renders a horizontal segmented bar, `h-[8px] w-[160px] bg-[#e8e8e8] rounded-[2px] overflow-hidden flex`
  - Each segment is a `<div>` with its color class and pixel width
  - Segments stack left to right inside the track
- **Design:** track `bg-[#e8e8e8]`, segments use colors from the token table above

---

### `PositionRow`

- **Props:**
  ```ts
  type PositionRow = {
    id: number;
    title: string;
    department: string;
    location: string;
    hiringManager: string;
    applicants: number;
    stageSegments: StageSegment[];
    status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
    lastUpdated: string;
  };

  type PositionRowProps = {
    position: PositionRow;
    onViewProcess: (id: number) => void;
  };
  ```
- **State:** `hovered: boolean` (for showing the ⋮ button on row hover)
- **Children:** `StatusBadge`, `StageDistributionBar`
- **Behavior:**
  - Role Title is a clickable link (`text-[#004ccd] font-medium cursor-pointer`) — calls `onViewProcess(id)`
  - Applicants column is right-aligned, monospace font (`font-['IBM_Plex_Mono:Regular']`)
  - The three-dot (⋮) action button in the last cell is `opacity-0 group-hover:opacity-100` (use Tailwind `group` on the row `<tr>`)
  - `lastUpdated` is displayed as a pre-formatted relative string (e.g. "2 hrs ago") — no client-side formatting required
- **Design:**
  - Row: `border-b border-[#e2e2e2] text-[14px] text-[#1a1c1c]`
  - Cells: `px-4 py-[18.5px]` (single-line), `px-4 py-[8.5px]` (two-line cells)

---

### `PositionsFilters`

- **Props:**
  ```ts
  type PositionsFiltersProps = {
    search: string;
    department: string;
    location: string;
    status: string;
    onSearchChange: (v: string) => void;
    onDepartmentChange: (v: string) => void;
    onLocationChange: (v: string) => void;
    onStatusChange: (v: string) => void;
    onSort: () => void;
  };
  ```
- **State:** none (all state lifted to `PositionsDashboard`)
- **Children:** none
- **Behavior:**
  - Search input: filters by role title (client-side, case-insensitive)
  - Department, Location, Status: `<select>` dropdowns — values filter the table client-side
  - Sort button: triggers `onSort` callback (toggles ascending/descending by title)
- **Design:**
  - Container: `bg-[#f9f9f9] border-b border-[#e2e2e2] px-2 py-2 flex gap-2 items-center`
  - Search input: `bg-white border border-[#e2e2e2] rounded-[2px] w-64 h-[34px] flex items-center px-2 gap-2 text-[14px] text-[#6b7280]`
  - Dropdowns: `bg-white border border-[#e2e2e2] rounded-[2px] h-[32px] px-2 text-[14px] text-[#1a1c1c]`
  - Sort button: `text-[#004ccd] text-[14px] flex items-center gap-1 px-2 py-1` (no border, ghost style)

---

### `PositionsTable`

- **Props:**
  ```ts
  type PositionsTableProps = {
    positions: PositionRow[];
    onViewProcess: (id: number) => void;
  };
  ```
- **State:** none
- **Children:** `PositionRow` (one per position)
- **Behavior:** renders header row + body rows; empty state if `positions.length === 0`
- **Design:**
  - Outer: `w-full overflow-auto`
  - `<table className="w-full">` — no border-collapse issues; use `border-separate border-spacing-0`
  - Header row: `bg-[#f3f3f3] border-b border-[#e2e2e2]`
  - Header cells: `text-[12px] font-medium text-[#424656] px-4 py-[15.5px] font-['IBM_Plex_Sans:Medium'] whitespace-nowrap`
  - Column widths (match Figma): Role Title 143px, Department 106px, Location 86px, Hiring Manager 119px, Applicants 91px, Stage Distribution 192px, Status 95px, Last Updated 91px, Actions 50px

---

### `PositionsPagination`

- **Props:**
  ```ts
  type PositionsPaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:**
  - Shows "Showing {start}-{end} of {total} positions"
  - Prev button disabled when `page === 1` (`opacity-50 pointer-events-none`)
  - Next button disabled when on last page
- **Design:**
  - Container: `bg-[#f9f9f9] border-t border-[#e2e2e2] px-2 py-2 flex items-center justify-between`
  - Count text: `text-[14px] text-[#737687] font-['IBM_Plex_Sans:Regular']`
  - Prev/Next: icon-only chevron buttons, `p-1 rounded-[2px]`

---

### `SideNavBar`

- **Props:** none (reads `location` from `useLocation()` to determine active link)
- **State:** none
- **Children:** nav link items
- **Behavior:**
  - Uses `useLocation()` to highlight the active route
  - Active link: `bg-[#e4e2e1] border-l-4 border-[#004ccd] pl-[20px] text-[#656464]`
  - Inactive link: `px-[16px] text-[#e2e2e2] hover:bg-[#2a2c2c]`
  - Clicking a link navigates via `<Link>` (React Router)
  - Nav items: Dashboard (`/`), Positions (`/positions`), Applicants, Interviews, Teams, Analytics, Settings — non-implemented routes render the link but the page content will be empty for now
- **Design:**
  - Outer: `fixed top-0 left-0 w-[256px] h-full bg-[#1a1c1c] border-r border-[#5f5e5e] flex flex-col z-30`
  - Logo area: `h-[48px] bg-white border-b border-[#e2e2e2] flex items-center px-6` — text `LTI HRMS` in `text-[20px] font-bold text-[#1a1c1c] tracking-[-0.5px]`
  - Nav area: `flex-1 overflow-auto pt-4 px-4 flex flex-col gap-1`
  - Each nav item: `flex items-center gap-4 px-4 py-2 rounded-[2px] w-full text-[16px] cursor-pointer`
  - Icons are SVG placeholders (16–24px) — use Heroicons or simple `<svg>` stubs

---

### `TopNavBar`

- **Props:** none
- **State:** `search: string` (local, uncontrolled — no API call, purely UI)
- **Children:** none
- **Behavior:**
  - Search field is a controlled input (`value={search}` + `onChange`) — purely decorative for now (no filtering)
  - Notifications and help buttons have no action wired (phase 2)
  - User avatar renders a placeholder circle `rounded-full w-8 h-8 border border-[#e2e2e2] overflow-hidden`
- **Design:**
  - Outer: `fixed top-0 left-[256px] right-0 h-[48px] bg-[#f9f9f9] border-b border-[#e2e2e2] flex items-center justify-between px-6 z-20`
  - Search: `bg-white border border-[#e2e2e2] rounded-[2px] w-[256px] h-[34px] flex items-center px-2 gap-2 text-[14px] text-[#6b7280]`
  - Right cluster: `flex items-center gap-4`

---

### `DashboardLayout`

- **Props:** none
- **State:** none
- **Children:** `SideNavBar`, `TopNavBar`, `<Outlet />`
- **Behavior:**
  - Renders the persistent shell; child route content renders via `<Outlet />`
  - No data fetching at layout level
- **Design:**
  - Root: `min-h-screen bg-[#f9f9f9]`
  - Content area: `pl-[256px] pt-[48px]` — offset for fixed sidebar and top bar

---

### `PositionsDashboard`

- **Props:** none
- **State:**
  ```ts
  positions: PositionRow[]        // fetched from API, default []
  loading: boolean                // default true
  error: string | null            // default null
  search: string                  // filter state, default ''
  department: string              // filter state, default ''
  location: string                // filter state, default ''
  statusFilter: string            // filter state, default ''
  sortAsc: boolean                // sort toggle, default true
  page: number                    // current page, default 1
  pageSize: number                // rows per page, default 10
  ```
- **Children:** `StatCard` (×4), `PositionsFilters`, `PositionsTable`, `PositionsPagination`
- **Behavior:** see Behaviors section
- **Design:**
  - Page header: `bg-white border-b border-[#e2e2e2] px-6 pt-6 pb-[25px]`
  - Breadcrumb: `text-[12px] text-[#737687]` with `/` separator; current page `text-[#1a1c1c]`
  - Heading: `text-[32px] text-[#1a1c1c] font-['IBM_Plex_Sans:Regular'] leading-[32px]`
  - Content area: `px-6 pt-6 flex flex-col gap-6`
  - Stats strip: `grid grid-cols-4 gap-4`

---

## Data & API

Base URL: `http://localhost:3010`

```
GET /position
Request:  (none)
Response: Position[]
Errors:   { 500: server error }
```

The `/position` endpoint is documented in CLAUDE.md. Its response shape is not fully documented; infer from the Figma and existing mock data:

```ts
// Expected API response shape (inferred)
type PositionApiResponse = {
  id: number;
  title: string;           // "Senior Frontend Engineer"
  status: string;          // "OPEN" | "PAUSED" | "CLOSED" | "DRAFT"
  location: string;        // "Remote"
  applicationDeadline: string | null;
  companyName: string;
  // The following may not be present in the current API — use mock data for display if absent:
  department?: string;
  hiringManager?: string;
  applicants?: number;
  lastUpdated?: string;
};
```

**Note:** `GET /position` currently returns minimal data. Fields not present in the API response (`department`, `hiringManager`, `applicants`, `stageSegments`, `lastUpdated`) must be stubbed with empty/zero values and rendered gracefully. Do not fabricate data.

---

## Types

File location: `src/types/dashboard.ts`

```ts
type StageSegment = {
  color: string;
  widthPx: number;
};

type PositionRow = {
  id: number;
  title: string;
  department: string;
  location: string;
  hiringManager: string;
  applicants: number;
  stageSegments: StageSegment[];
  status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  lastUpdated: string;
};

type StatCardProps = {
  label: string;
  value: string;
};

type StatusBadgeProps = {
  status: PositionRow['status'];
};

type StageDistributionBarProps = {
  segments: StageSegment[];
};

type PositionRowProps = {
  position: PositionRow;
  onViewProcess: (id: number) => void;
};

type PositionsTableProps = {
  positions: PositionRow[];
  onViewProcess: (id: number) => void;
};

type PositionsFiltersProps = {
  search: string;
  department: string;
  location: string;
  status: string;
  onSearchChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSort: () => void;
};

type PositionsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};
```

---

## State Management

### Local state (in `PositionsDashboard`)
- `positions` — raw API data, set on fetch
- `loading` / `error` — fetch lifecycle
- `search`, `department`, `location`, `statusFilter` — filter inputs
- `sortAsc` — sort direction toggle
- `page` — current pagination page

### Derived (computed, not stored)
- `filteredPositions` — `positions` filtered by `search`, `department`, `location`, `statusFilter`, then sorted by `sortAsc`
- `paginatedPositions` — slice of `filteredPositions` for the current `page` and `pageSize`
- `total` — `filteredPositions.length`
- Available `department`, `location` options for dropdowns — derived from unique values in `positions`

### Lifted state
- Filter state lives in `PositionsDashboard` and is passed down to `PositionsFilters` as props — the two siblings (`PositionsFilters` and `PositionsTable`) share it.

---

## Validation & Constraints

*No constraints specified — validate at API boundary only.*

Filter and sort are client-side and operate on already-fetched data with no server round-trip.

---

## Behaviors

### Dashboard layout rendering
1. `DashboardLayout` mounts → renders `SideNavBar` + `TopNavBar` + `<Outlet />`
2. Child route (`PositionsDashboard` or `AddCandidate`) renders inside the outlet
3. `SideNavBar` reads `useLocation().pathname` — highlights the matching nav link
4. Navigating between routes does not re-mount the layout shell

### Positions data fetch
1. `PositionsDashboard` mounts → `loading = true`, calls `GET /position`
2. On success → `positions = data`, `loading = false`
3. On error → `error = message`, `loading = false`
4. While `loading`: render a centered spinner inside the content area, preserve page header and stats strip skeleton (or hide stats strip)
5. On `error`: render error block `<div className="rounded border border-red-300 bg-red-50 text-red-800 p-4">{error}</div>` in the content area

### Client-side filtering
1. User types in search → `search` updates → `filteredPositions` recomputes (case-insensitive match on `title`) → table re-renders → `page` resets to `1`
2. User changes department/location/status dropdown → same flow as above
3. Multiple filters are AND-combined

### Sort
1. User clicks Sort button → `sortAsc` toggles → `filteredPositions` re-sorted by `title` alphabetically
2. Sort applies after filtering

### Pagination
1. `paginatedPositions = filteredPositions.slice((page - 1) * pageSize, page * pageSize)`
2. "Showing X-Y of Z positions" label derived from `page`, `pageSize`, `total`
3. Prev disabled when `page === 1`; Next disabled when `page * pageSize >= total`
4. Any filter change resets `page` to `1`

### Navigate to position process
1. User clicks a role title in the table → `onViewProcess(id)` called → `navigate(`/positions/${id}`)` (route does not exist yet — implement navigate call, no 404 handling required)

---

## Accessibility

- `SideNavBar` links: use `<Link>` (native anchor semantics — no extra `tabIndex` needed). Add `aria-current="page"` on the active link.
- `TopNavBar` search: `<input type="search" aria-label="Global search" />`
- `PositionsFilters` search: `<input type="text" aria-label="Filter positions" />`
- Stat cards: wrap in `<article>` with `aria-label={label}` so screen readers announce "Open Roles, 24"
- Status badges: add `aria-label={status}` on the badge `<span>`
- Sort button: `aria-label="Sort positions"`, `aria-pressed={!sortAsc}`
- Pagination buttons: `aria-label="Previous page"` / `aria-label="Next page"`, `disabled` attribute when inactive
- Table: `<thead>` / `<tbody>` / `<th scope="col">` for column headers
- PositionRow three-dot button: `aria-label="More options for ${position.title}"`

---

## Edge Cases & Error States

| Case | How the UI handles it |
|------|-----------------------|
| Loading | Centered spinner inside content area; page header still visible |
| Empty list (no positions) | Table body shows one row: "No positions found." centered, muted text |
| No filter results | Same as empty list — "No positions match your filters." message |
| API error | Error block with message text below the stats strip; no retry button required |
| `department` / `hiringManager` not in API | Field renders as `—` (em dash) |
| Applicants not in API | Renders `0` |
| Stage segments empty | Bar renders as the grey track with no segments |
| Single-page result set | Pagination footer still renders; both Prev and Next are disabled |

---

## Implementation Order

1. `src/types/dashboard.ts` — all types
2. `src/services/positionService.ts` — `fetchPositions(): Promise<PositionRow[]>` using `fetch`, maps API shape to `PositionRow` (stub missing fields with defaults)
3. `src/components/dashboard/StatCard.tsx`
4. `src/components/dashboard/StatusBadge.tsx`
5. `src/components/dashboard/StageDistributionBar.tsx`
6. `src/components/dashboard/PositionRow.tsx`
7. `src/components/dashboard/PositionsFilters.tsx`
8. `src/components/dashboard/PositionsPagination.tsx`
9. `src/components/dashboard/PositionsTable.tsx`
10. `src/components/dashboard/PositionsDashboard.tsx`
11. `src/components/dashboard/SideNavBar.tsx`
12. `src/components/dashboard/TopNavBar.tsx`
13. `src/components/dashboard/DashboardLayout.tsx`
14. `src/App.tsx` — rewrite router with nested dashboard routes; remove Bootstrap import
