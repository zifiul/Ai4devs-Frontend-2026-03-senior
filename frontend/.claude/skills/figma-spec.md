---
name: figma-spec
description: Pull a design from Figma and generate an implementation-ready spec file. Use when the user shares a Figma URL or asks to generate a spec from a Figma design. Reads project conventions from CLAUDE.md and visual guidelines from design.md.
---

Pull a design from Figma and write a structured implementation spec.

## Steps

### 1. Discover project context

Read in the current directory:
- `CLAUDE.md` — stack, file structure, API base URL, type conventions, styling rules
- `design.md` — visual and interaction guidelines (if present)
- `package.json` — framework and scripts

### 2. Pull the Figma design

The user must provide a Figma file URL. Extract the `fileKey` and `nodeId` from the URL:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId

Use these tools to extract the design:

```
mcp__figma__get_metadata        → file name, last modified, pages
mcp__figma__get_design_context  → frames, components, layout, styles
mcp__figma__get_variable_defs   → design tokens (colors, spacing, typography)
mcp__figma__get_screenshot      → visual reference for each frame
mcp__figma__search_design_system → component library entries if available
```

### 3. Derive the feature name

Use the name provided by the user, or derive it from the Figma file/frame name. Slugify (lowercase, hyphens).

### 4. Write the spec

Create `specs/` in the current directory if it doesn't exist. Write `specs/<feature-name>.spec.md`:

```
# <Feature Name> Spec

## Overview
What this feature does and why.

## Stack
From CLAUDE.md — framework, styling, router, state approach.

## Design Guidelines Applied
Key rules from design.md cross-referenced with Figma variable definitions.
List exact token names (colors, spacing, typography) used in this feature.

## Screens & Routes
Each frame with its route path.

## Components
For each component:
- Name (PascalCase)
- Props (typed per project convention)
- Local state
- Children
- Behavior: interactions, transitions, loading/error/empty states

## Data & API
- Base URL (from CLAUDE.md or existing service files)
- Endpoints: method, path, request shape, response shape
- Data transformations

## Types
Type definitions for all data models, following the project's convention.

## State Management
What lives locally vs what needs to be shared.

## Accessibility
ARIA roles, labels, keyboard interactions, focus management.

## Edge Cases & Error States
Each failure mode and how the UI handles it.

## Implementation Order
Components listed with dependencies first.
```

### 5. Report

Print the spec path and a summary: frames captured, components identified, design tokens noted, API endpoints noted.
