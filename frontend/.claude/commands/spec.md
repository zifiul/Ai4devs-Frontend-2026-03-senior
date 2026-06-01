Pull a design from Figma and generate an implementation spec. Accepts additional context inline — endpoints, data schemas, constraints, behaviors — that cannot be inferred from the visual design alone.

Usage:
  /spec <figma-url> [feature-name]
  /spec <figma-url> [feature-name] -- <additional context>

Arguments: $ARGUMENTS

Additional context can include anything the implementation agent needs to know:
- API endpoints and their request/response shapes
- Data schemas and field-level constraints (required, max length, formats)
- Business rules and validation logic
- State machine descriptions or flow constraints
- Backend behaviors (side effects, async sequences, error codes)
- Any requirement that is not visible in the Figma frames

---

Read `.claude/agents/spec-agent.md` for the output format and rules.

## Steps

1. Parse `$ARGUMENTS`:
   - First token that looks like a URL or Figma key → `figmaUrl`
   - First non-URL token after it → `featureName` (optional)
   - Everything after `--` → `additionalContext` (optional free-form text)
   - If no `--` separator is used, treat any text after the feature name as `additionalContext`

2. If no Figma URL is given, ask the user for one. If they explicitly say there is no Figma design, skip the Figma steps and proceed with the additional context alone.

3. Pull the design from Figma (skip if no URL):
   ```
   mcp__figma__get_metadata        → file name, pages
   mcp__figma__get_design_context  → frames, components, layout, styles
   mcp__figma__get_variable_defs   → design tokens (colors, spacing, typography)
   mcp__figma__get_screenshot      → visual reference per frame
   mcp__figma__search_design_system → component library if available
   ```
   Extract `fileKey` and `nodeId` from the URL:
   `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId

4. Read `design.md` if it exists. Cross-reference with Figma tokens — the spec must be consistent with both.

5. Read `CLAUDE.md` for project conventions (stack, file structure, API base URL, type patterns).

6. Read existing service files in `src/services/` to understand API call patterns already in use.

7. Derive `featureName` from user input, the Figma file name, or the context. Slugify it (lowercase, hyphens).

8. Create `specs/` if it doesn't exist.

9. Pass everything to the spec-agent format defined in `.claude/agents/spec-agent.md`:
   - Figma design data (visual structure, layout, tokens)
   - `additionalContext` verbatim — do not summarize or paraphrase it; include all details as-is
   - Contents of `design.md`
   - Contents of `CLAUDE.md`

10. Write the spec to `specs/<feature-name>.spec.md`.

11. Print the spec path and a one-line summary: frames captured, endpoints documented, constraints recorded.
