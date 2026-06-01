Run the full Figma → Spec → Implement → Test pipeline for a feature.

Usage: /frontend-workflow <figma-file-url-or-key> [feature-name] [-- additional context]

Arguments: $ARGUMENTS

Additional context (everything after `--`) is passed verbatim to the spec agent. Use it for API endpoints, data schemas, field constraints, business rules, and behaviors that are not visible in the Figma design.

---

## Phase 1 — Pull design from Figma

1. Parse `$ARGUMENTS`:
   - First URL-like token → `figmaUrl`
   - Next non-URL token → `featureName` (optional)
   - Everything after `--` → `additionalContext` (optional)

2. If no Figma file URL is given, ask the user for one.

3. Extract `fileKey` and `nodeId` from the URL:
   - `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId

4. Pull the design using:
   ```
   mcp__figma__get_metadata        → file name, pages
   mcp__figma__get_design_context  → frames, components, layout, styles
   mcp__figma__get_variable_defs   → design tokens (colors, spacing, typography)
   mcp__figma__get_screenshot      → visual reference per frame
   mcp__figma__search_design_system → component library if available
   ```

5. Derive the feature name from `featureName`, or the Figma file/frame name. Slugify it.

---

## Phase 2 — Generate spec

Spawn a subagent using the instructions in `.claude/agents/spec-agent.md`.

Pass it:
- All Figma design data from Phase 1
- The feature name
- `additionalContext` verbatim — do not summarize or paraphrase it
- The contents of `design.md` if it exists
- Instruction: "Write the spec to `specs/<feature-name>.spec.md`"

Wait for the spec file to be written before continuing.

---

## Phase 3 — Implement

Spawn a subagent using the instructions in `.claude/agents/impl-agent.md`.

Pass it:
- The spec file path from Phase 2
- Instruction: "Read the spec, read `design.md` for visual guidelines, implement the feature fully, run the build command from `package.json` when done"

Wait for a clean build before continuing.

---

## Phase 4 — Review

Spawn a subagent using the instructions in `.claude/agents/review-agent.md`.

Pass it:
- The spec file path from Phase 2
- The list of files written in Phase 3
- Instruction: "Review the implemented files against the spec and project conventions. Run npm run build. Report PASS/FAIL with exact file:line fixes for every FAIL item."

If the review result is FAIL, surface the issues to the user and stop. The user must fix FAIL items before proceeding to testing.

If the review result is PASS or PASS WITH WARNINGS, continue to Phase 5.

---

## Phase 5 — Test

Discover the dev server URL from `package.json` start script or `CLAUDE.md`. Check it is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" <dev-server-url>
```

If not reachable, tell the user to start the dev server, then run `/test <spec-path>` to complete.

If reachable, spawn a subagent using `.claude/agents/test-agent.md`.

Pass it:
- The spec file path
- The dev server URL
- Instruction: "Test the feature described in the spec against the live dev server"

---

## Summary

Report: spec location, files created, review result, test result (PASS/FAIL), issues to address.
