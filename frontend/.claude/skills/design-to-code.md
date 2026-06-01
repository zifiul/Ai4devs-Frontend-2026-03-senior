---
name: design-to-code
description: Full pipeline — pulls a design from Figma, generates a spec, implements the feature, and verifies with Playwright. Use when the user shares a Figma URL and wants working code. Reads CLAUDE.md and design.md for project and visual conventions.
---

Run the complete design-to-code pipeline: Figma → Spec → Implement → Test.

## Phase 1 — Discover project context

Read before doing anything:
- `CLAUDE.md` — stack, conventions, file structure, API URL, dev server port
- `design.md` — visual guidelines all generated UI must follow (if present)
- `package.json` — build command, start script, framework

## Phase 2 — Pull Figma design

The user must provide a Figma file URL. Extract `fileKey` and `nodeId`:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId

Use these tools:

```
mcp__figma__get_metadata        → file name, pages
mcp__figma__get_design_context  → frames, components, layout, styles
mcp__figma__get_variable_defs   → design tokens (colors, spacing, typography)
mcp__figma__get_screenshot      → visual reference per frame
mcp__figma__search_design_system → component library if available
```

Derive the feature name from user input or the Figma file/frame name (slugified).

## Phase 3 — Generate spec

Spawn a subagent. Give it:
- The Figma design data
- The contents of `CLAUDE.md`
- The contents of `design.md` (if present)
- Instruction: "Write `specs/<feature-name>.spec.md`. Cross-reference Figma variable definitions with design.md token names. The spec must be consistent with both."

Wait for the spec to be written. Confirm the file exists before proceeding.

## Phase 4 — Implement

Spawn a subagent. Give it:
- The spec file path
- Instruction: "Read the spec. Read `design.md` for visual guidelines — all UI must comply with the design tokens. Read `CLAUDE.md` for conventions. Implement bottom-up. Run the build command from `package.json` when done."

Wait for a clean build before proceeding.

## Phase 5 — Test

Discover the dev server URL from `package.json` or `CLAUDE.md`. Check it is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" <dev-server-url>
```

If not reachable: tell the user to start the dev server, then run `/playwright-test` with the spec path.

If reachable, spawn a subagent. Give it:
- The spec file path
- The dev server URL
- The router file path
- Instruction: "Run the full test suite: smoke check, golden path, edge cases, design compliance, regressions. Produce a PASS/FAIL report."

## Summary

Report:
- Spec: `specs/<feature-name>.spec.md`
- Files created (types, services, components)
- Build: PASS / FAIL
- Tests: PASS / FAIL
- Issues to address (if any)
