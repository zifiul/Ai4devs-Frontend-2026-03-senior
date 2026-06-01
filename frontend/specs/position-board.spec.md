# Position Board Spec

## Overview
The Position Board is a Kanban-style view for a single open position. It displays the position's interview pipeline as columns (one per interview step) and organizes candidates into the column matching their current interview step. Recruiters can drag a candidate card from one column to another to advance or move the candidate through the pipeline; the move is persisted to the backend and confirmed with a toast notification.

## Stack
- **Framework:** React 19 with TypeScript (strict) — CRA / react-scripts 5
- **Styling:** Tailwind CSS 3 — no custom token extensions in `tailwind.config.js`; all color values written as hex literals (e.g. `text-[#1a1c1c]`, `bg-[#004ccd]`)
- **Router:** React Router v7 (`react-router-dom`) — nested under the existing `DashboardLayout` route
- **State:** `useState` + `useEffect` only (no external state library)
- **API base URL:** `http://localhost:3010` (hardcoded in service file)
- **Drag and drop:** HTML5 native API — no additional library

## Design Guidelines Applied
Rules from `DESIGN.md` applied to this feature:

- **Page background:** `bg-[#f9f9f9]` (surface)
- **Content containers / cards:** `bg-white border border-[#e2e2e2] rounded-[2px]`; Kanban cards use `rounded-[0px]` (square corners preferred per DESIGN.md shapes section)
- **Typography:** IBM Plex Sans throughout. Page heading uses `headline-lg` (32px, weight 400, `font-['IBM_Plex_Sans']`). Column headers use `headline-md` (20px, weight 400). Card candidate name uses `body-md` (14px, weight 400). Score label uses `label-sm` (12px, weight 500).
- **Primary color:** `#004ccd` — used for the back button (ghost style), drag-over column highlight ring (`ring-2 ring-[#004ccd]`), and spinner border
- **Spinner:** `w-8 h-8 border-4 border-[#004ccd] border-t-transparent rounded-full animate-spin`
- **Error feedback block:** `bg-[#ffdad6] border-l-4 border-[#ba1a1a] pl-5 pr-4 py-4 text-[#93000a]`
- **Toast success:** `bg-[#defbe6] border-l-4 border-[#24a148] pl-5 pr-4 py-4 text-[#0e6027]`
- **Toast error:** `bg-[#ffdad6] border-l-4 border-[#ba1a1a] pl-5 pr-4 py-4 text-[#93000a]`
- **Buttons — ghost style (back button):** `text-[#004ccd] px-4 py-2` (no bg/border)
- **Spacing:** 4px/8px grid. Use `gap-4` (16px) between columns, `p-4` (16px) for card padding, `px-6 pt-6` for page content wrapper (matching PositionsDashboard pattern).
- **Dividers / borders:** `border-[#e2e2e2]` for all structural borders
- **Column drag-over visual:** add `ring-2 ring-[#004ccd]` class to the column container while a card is dragged over it

## Screens & Routes

| Route | Screen | Description |
|-------|--------|-------------|
| `/positions/:id` | PositionBoard | Kanban board for a single position showing candidates organized by interview step |

The route must be added as a nested child of the `DashboardLayout` `<Route>` in `src/App.tsx`:
```tsx
<Route path="positions/:id" element={<PositionBoard />} />
```

## Components

List order: leaf components first, container last.

---

### `Toast`

- **File:** `src/components/PositionBoard/Toast.tsx`
- **Props:**
  ```ts
  type ToastProps = {
    message: string;
    variant: 'success' | 'error';
    onDismiss: () => void;
  };
  ```
- **State:** none (controlled entirely by parent)
- **Children:** none
- **Behavior:**
  - Renders a fixed-position notification in the bottom-right corner
  - Auto-dismisses: the parent starts a 3-second `setTimeout` on mount and calls `onDismiss` to clear the toast from state
  - The parent is responsible for the timer; this component only renders while it exists in state
- **Design:**
  - `fixed bottom-4 right-4 z-50`
  - Success variant: `bg-[#defbe6] border-l-4 border-[#24a148] pl-5 pr-4 py-4 text-[#0e6027] text-[14px] font-['IBM_Plex_Sans']`
  - Error variant: `bg-[#ffdad6] border-l-4 border-[#ba1a1a] pl-5 pr-4 py-4 text-[#93000a] text-[14px] font-['IBM_Plex_Sans']`
  - Minimum width: `min-w-[280px] max-w-[400px]`
  - Renders `message` as plain text inside a `<p>`

---

### `ScoreDisplay`

- **File:** `src/components/PositionBoard/ScoreDisplay.tsx`
- **Props:**
  ```ts
  type ScoreDisplayProps = {
    score: number; // 0–5
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:**
  - Renders 5 star characters: filled star `★` for each point up to `score`, empty star `☆` for remaining
  - Score 0 renders 5 empty stars
  - Score 5 renders 5 filled stars
  - Non-integer scores are floored before rendering
- **Design:**
  - Wrapper: `flex items-center gap-[2px]`
  - Each star: `text-[12px] leading-none`
  - Filled star color: `text-[#f59e0b]` (amber/warning, visually distinct from muted text)
  - Empty star color: `text-[#c3c6d8]`

---

### `CandidateCard`

- **File:** `src/components/PositionBoard/CandidateCard.tsx`
- **Props:**
  ```ts
  type CandidateCardProps = {
    candidate: Candidate;
    onDragStart: (e: React.DragEvent, candidateId: number, applicationId: number, sourceStepName: string) => void;
  };
  ```
- **State:** none
- **Children:** `ScoreDisplay`
- **Behavior:**
  - `draggable="true"` on the root element
  - Calls `onDragStart(e, candidate.id, candidate.applicationId, candidate.currentInterviewStep)` on drag start
  - The `onDragStart` handler stores drag metadata in the drag event's `dataTransfer` object (see Behaviors section)
- **Design:**
  - Root: `bg-white border border-[#e2e2e2] rounded-[0px] p-4 mb-2 cursor-grab select-none`
  - Candidate name: `text-[14px] font-['IBM_Plex_Sans'] text-[#1a1c1c] font-normal leading-[20px] mb-1`
  - Score row: `flex items-center gap-2 mt-1`
  - Score label: `text-[12px] font-['IBM_Plex_Sans'] font-medium text-[#737687]` showing "Score:" prefix
  - `ScoreDisplay` renders immediately after the label

---

### `KanbanColumn`

- **File:** `src/components/PositionBoard/KanbanColumn.tsx`
- **Props:**
  ```ts
  type KanbanColumnProps = {
    step: InterviewStep;
    candidates: Candidate[];
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent, stepName: string) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent, targetStep: InterviewStep) => void;
    onCardDragStart: (e: React.DragEvent, candidateId: number, applicationId: number, sourceStepName: string) => void;
  };
  ```
- **State:** none (drag-over state is lifted to parent)
- **Children:** one `CandidateCard` per candidate in this column
- **Behavior:**
  - Calls `e.preventDefault()` in `onDragOver` to allow drop
  - Passes `step.name` as the column identifier in `onDragOver`
  - Calls `onDrop(e, step)` when a card is dropped
  - Shows candidate count in the header
  - Renders empty state text when no candidates assigned to this step
- **Design:**
  - Column wrapper: `flex flex-col min-w-[240px] w-[240px] bg-[#f3f3f3] border border-[#e2e2e2] rounded-[2px] p-3`
  - Drag-over state adds `ring-2 ring-[#004ccd]` to the wrapper (controlled by `isDragOver` prop)
  - Column header: `flex items-center justify-between mb-3`
  - Column title: `text-[20px] font-['IBM_Plex_Sans'] font-normal text-[#1a1c1c] leading-[26px]`
  - Candidate count badge: `ml-2 text-[12px] font-medium bg-[#e2e2e2] text-[#424656] rounded-full px-2 py-[1px]`
  - Card list area: `flex flex-col flex-1 min-h-[120px]`
  - Empty state: `text-[12px] text-[#737687] text-center py-4 font-['IBM_Plex_Sans']` with text "No candidates"

---

### `PositionBoard`

- **File:** `src/components/PositionBoard/PositionBoard.tsx`
- **Props:** none (reads `:id` from URL params)
- **State:**
  ```ts
  const [positionName, setPositionName] = useState<string>('');
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragOverStepName, setDragOverStepName] = useState<string | null>(null);
  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);
  const [draggedApplicationId, setDraggedApplicationId] = useState<number | null>(null);
  const [dragSourceStepName, setDragSourceStepName] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  ```
- **Children:** `KanbanColumn` (one per step), `Toast` (when `toast !== null`)
- **Behavior:** see Behaviors section
- **Design:**
  - Page wrapper: `min-h-screen bg-[#f9f9f9]`
  - Page header section: `bg-white border-b border-[#e2e2e2] px-6 pt-6 pb-[25px]`
  - Breadcrumb: `text-[12px] text-[#737687] mb-2` — "Home / Positions / {positionName}"
  - Back button: `text-[#004ccd] text-[14px] font-['IBM_Plex_Sans'] px-0 py-2 hover:underline cursor-pointer flex items-center gap-1 mb-2` — ghost style, no bg/border, renders "← Back to Positions"
  - Position name heading: `text-[32px] text-[#1a1c1c] font-normal font-['IBM_Plex_Sans'] leading-[32px]`
  - Content area: `px-6 pt-6`
  - Kanban columns row: `flex flex-row gap-4 overflow-x-auto pb-6`
  - Loading state: centered spinner (matching PositionsDashboard pattern) `flex justify-center py-12`
  - Error state: `bg-[#ffdad6] border-l-4 border-[#ba1a1a] pl-5 pr-4 py-4 text-[#93000a] rounded-[2px]`

## Data & API

Base URL: `http://localhost:3010`

---

```
GET /position/:id/interviewflow
Request:  (no body — id from URL param)
Response: {
  interviewFlow: {
    positionName: string,
    interviewFlow: {
      id: number,
      description: string,
      interviewSteps: [
        {
          id: number,
          interviewFlowId: number,
          interviewTypeId: number,
          name: string,
          orderIndex: number
        }
      ]
    }
  }
}
Errors:
  404 — position not found
  500 — server error
```

Access path in code:
- `data.interviewFlow.positionName` → position name string
- `data.interviewFlow.interviewFlow.interviewSteps` → array of steps (sort by `orderIndex` ascending before rendering)

---

```
GET /position/:id/candidates
Request:  (no body — id from URL param)
Response: [
  {
    id: number,
    applicationId: number,
    fullName: string,
    currentInterviewStep: string,   // step NAME (e.g. "Technical Interview")
    averageScore: number            // 0–5
  }
]
Errors:
  404 — position not found
  500 — server error
```

---

```
PUT /candidates/:id
  :id = candidate.id (NOT applicationId)
Request:  {
  applicationId: string,          // applicationId as string
  currentInterviewStep: string    // target interviewStep.id as string
}
Response: {
  message: string,
  data: {
    id: number,
    positionId: number,
    candidateId: number,
    applicationDate: string,
    currentInterviewStep: number,
    notes: null,
    interviews: []
  }
}
Errors:
  404 — candidate or application not found
  422 — validation error
  500 — server error
```

## Types

File location: `src/types/positionBoard.ts`

```ts
type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};

type InterviewFlowResponse = {
  interviewFlow: {
    positionName: string;
    interviewFlow: {
      id: number;
      description: string;
      interviewSteps: InterviewStep[];
    };
  };
};

type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string; // step name
  averageScore: number;
};

type UpdateStageRequest = {
  applicationId: string;
  currentInterviewStep: string; // target step id as string
};

type UpdateStageResponse = {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: null;
    interviews: unknown[];
  };
};

type ToastState = {
  message: string;
  variant: 'success' | 'error';
};
```

## State Management

**Local component state in `PositionBoard`:**
- `positionName: string` — display title fetched from interviewflow endpoint
- `steps: InterviewStep[]` — ordered array of interview steps (columns), fetched from interviewflow endpoint
- `candidates: Candidate[]` — all candidates for the position; mutated optimistically on drop
- `loading: boolean` — true until both API calls complete
- `error: string | null` — error message from either API call
- `dragOverStepName: string | null` — name of the column currently being dragged over; drives `isDragOver` prop on `KanbanColumn`
- `draggedCandidateId: number | null` — id of the candidate card currently being dragged
- `draggedApplicationId: number | null` — applicationId of the card being dragged
- `dragSourceStepName: string | null` — step name the drag originated from (used to revert on error)
- `toast: ToastState | null` — current toast notification; null when no toast is visible

**Derived values (not stored in state):**
- `candidatesInStep(stepName)` — `candidates.filter(c => c.currentInterviewStep === stepName)` — computed inline per column render, not stored

**No state lifting needed** — all state is local to `PositionBoard`; `KanbanColumn` and `CandidateCard` are fully controlled via props.

## Validation & Constraints

- The `:id` URL param must be a valid numeric string; if `parseInt(id)` is `NaN` the board should display the standard error state with message "Invalid position ID."
- `currentInterviewStep` sent to `PUT /candidates/:id` must be the `interviewStep.id` (a number) serialized as a string — not the step name. The mapping from step name to step id comes from `steps` state.
- `applicationId` sent to `PUT /candidates/:id` must be the `candidate.applicationId` serialized as a string.
- A candidate cannot be dropped onto the column they are already in. If `dragSourceStepName === targetStep.name`, do nothing on drop and do not call the API.

*No form inputs — no additional field-level validation required.*

## Behaviors

### 1. Initial Data Load

Both API calls run in parallel on mount:

```
1. Component mounts → setLoading(true)
2. In useEffect: call fetchInterviewFlow(id) and fetchCandidates(id) in parallel via Promise.all
3. On both resolved:
   - setPositionName(data.interviewFlow.positionName)
   - setSteps([...data.interviewFlow.interviewFlow.interviewSteps].sort((a,b) => a.orderIndex - b.orderIndex))
   - setCandidates(candidates array)
   - setLoading(false)
4. On any rejection:
   - setError(err.message or 'Failed to load position data')
   - setLoading(false)
```

### 2. Drag Start

```
1. User starts dragging a CandidateCard
2. handleCardDragStart(e, candidateId, applicationId, sourceStepName) fires
3. Store drag metadata:
   e.dataTransfer.setData('candidateId', String(candidateId))
   e.dataTransfer.setData('applicationId', String(applicationId))
   e.dataTransfer.setData('sourceStepName', sourceStepName)
4. setDraggedCandidateId(candidateId)
5. setDraggedApplicationId(applicationId)
6. setDragSourceStepName(sourceStepName)
```

### 3. Drag Over Column

```
1. User drags over a KanbanColumn → handleDragOver(e, stepName) fires
2. e.preventDefault() — required to allow drop
3. setDragOverStepName(stepName) → column shows ring-2 ring-[#004ccd] highlight
4. On drag leave from column → handleDragLeave() → setDragOverStepName(null)
```

### 4. Drop (Stage Update)

```
1. User drops card on a target column → handleDrop(e, targetStep) fires
2. setDragOverStepName(null)
3. Read candidateId, applicationId, sourceStepName from e.dataTransfer
4. Guard: if sourceStepName === targetStep.name → return early (no-op)
5. Guard: if candidateId is null → return early
6. Optimistic update:
   setCandidates(prev => prev.map(c =>
     c.id === candidateId
       ? { ...c, currentInterviewStep: targetStep.name }
       : c
   ))
7. Call updateCandidateStage(candidateId, { applicationId: String(applicationId), currentInterviewStep: String(targetStep.id) })
8. On success (response.ok):
   setToast({ message: response.message or 'Candidate stage updated successfully', variant: 'success' })
   startToastTimer() — setTimeout 3000ms → setToast(null)
9. On error:
   Revert optimistic update:
     setCandidates(prev => prev.map(c =>
       c.id === candidateId
         ? { ...c, currentInterviewStep: sourceStepName }
         : c
     ))
   setToast({ message: 'Failed to update candidate stage', variant: 'error' })
   startToastTimer() — setTimeout 3000ms → setToast(null)
10. Clear drag state: setDraggedCandidateId(null), setDraggedApplicationId(null), setDragSourceStepName(null)
```

### 5. Navigation — Back Button

```
1. User clicks "← Back to Positions" button
2. handleBack() → navigate('/positions')
```

### 6. Toast Timer Management

To avoid stale closure issues with multiple rapid drops, clear any existing timer before setting a new one. Store the timer ref using `useRef<ReturnType<typeof setTimeout> | null>`:

```
1. On each new toast: clearTimeout(timerRef.current)
2. timerRef.current = setTimeout(() => setToast(null), 3000)
3. On component unmount (useEffect cleanup): clearTimeout(timerRef.current)
```

## Accessibility

- The back button must be a native `<button>` element so it receives keyboard focus and Enter/Space activation natively. No extra `tabIndex` or `onKeyDown` needed.
- Each `KanbanColumn` heading is an `<h2>` with the step name text, so screen readers can navigate by heading.
- Each `CandidateCard` root element must include `aria-label={`Drag ${candidate.fullName} to another stage`}` and `role="button"` since it is not a native interactive element.
- `CandidateCard` must include `onKeyDown` to support keyboard-initiated drag: on `Enter` or `Space`, announce to the user that drag-and-drop requires a mouse (or provide an accessible alternative). At minimum: `aria-grabbed` attribute reflects drag state (`aria-grabbed={isDragging}`).
- The page `<h1>` renders the position name; screen readers announce it on navigation.
- Spinner has `role="status"` and `aria-label="Loading position board"`.
- Error container has `role="alert"` so screen readers announce errors immediately.
- Toast has `role="status"` (success) or `role="alert"` (error) to announce the notification.
- `ScoreDisplay` wraps stars in a `<span>` with `aria-label={`Score: ${score} out of 5`}` and `aria-hidden="true"` on individual star characters.

## Edge Cases & Error States

| Case | How the UI handles it |
|------|-----------------------|
| Loading (initial) | Full-page centered spinner (`w-8 h-8 border-4 border-[#004ccd] border-t-transparent rounded-full animate-spin`), layout chrome (header with back button placeholder) preserved |
| Either API call fails | Error feedback block (`bg-[#ffdad6] border-l-4 border-[#ba1a1a]`) replaces the column area; position name heading still shows if interviewflow succeeded, otherwise shows "Position Board" |
| Both API calls fail | Single error block shown; `error` state captures the first rejection message |
| Position has no candidates | Columns render normally; each column shows "No candidates" empty state text |
| Position has 0 interview steps | Columns area renders as empty; show message "No interview steps configured for this position." in place of the kanban board |
| Invalid `:id` param (non-numeric) | Immediately set error: "Invalid position ID." without making API calls |
| Candidate dropped on same column | No-op: guard in handleDrop detects `sourceStepName === targetStep.name` and returns early |
| Stage update API call fails | Optimistic update reverted (candidate moves back to original column); error toast shown for 3 seconds |
| Rapid multiple drops | Timer ref cleared and reset on each drop, preventing multiple toasts from stacking; only latest toast shows |
| Network timeout / no backend | Error toast shown after fetch rejects; optimistic update reverted |
| Score is 0 | All 5 stars render as empty `☆` in `text-[#c3c6d8]` |
| Score is 5 | All 5 stars render as filled `★` in `text-[#f59e0b]` |
| Many columns (overflow) | Kanban row uses `overflow-x-auto`; horizontal scrolling enabled |

## Implementation Order

1. **Types** — `src/types/positionBoard.ts`: define `InterviewStep`, `InterviewFlowResponse`, `Candidate`, `UpdateStageRequest`, `UpdateStageResponse`, `ToastState`
2. **Service** — `src/services/positionBoardService.ts`: implement `fetchInterviewFlow(id)`, `fetchCandidates(id)`, `updateCandidateStage(candidateId, body)`
3. **`ScoreDisplay`** — `src/components/PositionBoard/ScoreDisplay.tsx`: pure rendering, no state
4. **`Toast`** — `src/components/PositionBoard/Toast.tsx`: pure rendering, no state
5. **`CandidateCard`** — `src/components/PositionBoard/CandidateCard.tsx`: renders name + `ScoreDisplay`, handles `onDragStart`
6. **`KanbanColumn`** — `src/components/PositionBoard/KanbanColumn.tsx`: renders header + `CandidateCard` list, handles drag-over/drop events
7. **`PositionBoard`** — `src/components/PositionBoard/PositionBoard.tsx`: orchestrates all state, fetches data, handles drag logic, renders columns + toast
8. **Route registration** — `src/App.tsx`: add `<Route path="positions/:id" element={<PositionBoard />} />` inside the `DashboardLayout` route
