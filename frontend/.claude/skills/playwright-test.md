---
name: playwright-test
description: Test a frontend feature using Playwright MCP against the live dev server, then write a @playwright/test spec file to lock behavior in CI. Use when the user wants to verify a feature or add E2E test coverage.
---

Test a frontend feature using Playwright browser automation, then write a permanent spec file.

## Phase 1 — MCP verification

### 1. Discover project context
- `CLAUDE.md` — dev server URL and port
- `package.json` — infer port from `start` script if not in CLAUDE.md
- Router file (`App.js`, `App.tsx`) — all existing routes for regression checks
- Spec file (if provided) — features, edge cases, error states

### 2. Confirm dev server is running
```bash
curl -s -o /dev/null -w "%{http_code}" <dev-server-url>
```
If not reachable, stop and tell the user to start the dev server.

### 3. Run with Playwright MCP

**Smoke check** — navigate to root, screenshot, check console errors via `mcp__playwright__browser_console_messages`

**Golden path** — primary happy-path journey, screenshot each state change

**Edge cases** — every case from the spec's "Edge Cases & Error States" section

**Design compliance** — spot-check against `design.md` if it exists: color tokens, typography, spacing

**Regressions** — every route from the router file, confirm no errors

### 4. Produce MCP report
```
# Test Report: <Feature>

## Result: PASS / FAIL

## Golden Path
- [ ] <step>: PASS / FAIL — screenshot: <filename>

## Edge Cases
- [ ] <case>: PASS / FAIL — notes

## Design Compliance
- [ ] <check>: PASS / FAIL — notes

## Regressions
- [ ] <route>: PASS / FAIL

## Console Errors
## Issues Found
```

---

## Phase 2 — Write @playwright/test spec file (only on PASS)

Write `src/tests/<feature-name>.spec.ts`. Import from `./helpers`.

Rules:
- One `test.describe` block per feature
- Cover: page load, golden path, each edge case, key regression routes
- `data-testid` selectors where available; fall back to roles and labels
- `page.waitForLoadState('networkidle')` after navigations
- Tests must be fully independent

```ts
import { test, expect } from '@playwright/test';
import { goto, expectNoConsoleErrors } from './helpers';

test.describe('<Feature Name>', () => {
  test('loads without errors', async ({ page }) => {
    await goto(page, '/<route>');
    await expectNoConsoleErrors(page);
    await expect(page.getByRole('heading', { name: /title/i })).toBeVisible();
  });

  test('golden path: <primary action>', async ({ page }) => {
    await goto(page, '/<route>');
    // ...
    await expect(page.getByText('<expected outcome>')).toBeVisible();
  });

  test('edge case: <case>', async ({ page }) => {
    // ...
  });
});
```

Verify it compiles: `npx tsc --noEmit src/tests/<feature-name>.spec.ts`

Report the file path and cases covered.
