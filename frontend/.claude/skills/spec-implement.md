---
name: spec-implement
description: Implement a frontend feature from a spec file. Reads CLAUDE.md for project conventions and design.md for visual guidelines. Discovers the project file structure from existing code. Use when the user has a spec and wants to build the feature.
---

Implement a frontend feature from a spec file, respecting the project's conventions and design guidelines.

## Steps

### 1. Gather context

If no spec path was provided, list files in `specs/` and ask the user to pick one.

Read in this order:
1. The spec file completely
2. `CLAUDE.md` — conventions, file structure, API base URL, type patterns, styling rules
3. `design.md` — visual guidelines: typography, color tokens, spacing, component shapes, interaction patterns. All UI output must use the defined tokens. Never hardcode visual values that belong in the design system.
4. `package.json` — build command and framework
5. Existing source files — scan to understand where types, services, and components actually live

### 2. Build order

Follow the Implementation Order from the spec. If absent, build bottom-up:
types → services → leaf components → container

### 3. Implement

- Match the component declaration style in the existing codebase
- Prefix all event handlers with `handle`
- Early returns for loading and error states before the happy-path render
- Accessible markup: roles, labels, keyboard handlers on interactive elements that aren't native buttons or links
- No comments unless the WHY is non-obvious
- No placeholder TODOs — implement it or omit it
- Use design tokens from `design.md` for all visual properties

### 4. Verify

Run the build command from `package.json`. Fix all type and compilation errors before finishing.

### 5. Report

Files created, components built, any intentional deviations from the spec with reasons.
