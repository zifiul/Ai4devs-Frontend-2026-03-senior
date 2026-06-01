---
name: code-review
description: Reviews implemented frontend code against a spec, CLAUDE.md conventions, and design.md tokens. Produces a structured PASS/FAIL checklist with exact file-and-line fixes.
---

Review frontend implementation code.

## Setup

1. Identify changed files: `git diff --name-only HEAD` or the files the user references
2. Read each changed file
3. Read `CLAUDE.md` — conventions are law
4. Read `design.md` — token violations are FAIL items
5. Read the spec file if one is provided

## What to check

**Spec compliance** — every screen, component, type, and edge case in the spec must exist in code

**TypeScript** — no `any`; `type` not `interface`; `if (!response.ok) throw` on every fetch

**Component style** — `const Component: React.FC`, ≤100 lines per component, no TODOs

**State** — `loading`/`error` paired; `finally` sets `loading = false`; inner async in `useEffect`

**Handlers** — `handle` prefix; `e.preventDefault()` on submits

**Tailwind / design tokens** — no hex, no inline styles, no arbitrary values; use tokens from `design.md`

**Accessibility** — non-native interactives get `tabIndex`, `aria-label`, `onKeyDown`

**Build** — run `npm run build` and report the result

## Report format

```
# Code Review: <Feature>

## Result: PASS / FAIL / PASS WITH WARNINGS

## Issues to Fix
- <file>:<line> — <what is wrong> → <correct code>

## Checklist
- [ ] Spec compliance: PASS/FAIL
- [ ] TypeScript: PASS/FAIL
- [ ] Component style: PASS/FAIL
- [ ] State / data fetching: PASS/FAIL
- [ ] Event handlers: PASS/FAIL
- [ ] Tailwind / design tokens: PASS/FAIL
- [ ] Accessibility: PASS/FAIL
- [ ] Build: PASS/FAIL
```
