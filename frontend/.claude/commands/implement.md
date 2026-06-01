Implement a feature from a spec file.

Usage: /implement [spec-file-path]

Arguments: $ARGUMENTS

---

Read `.claude/agents/impl-agent.md` for implementation rules and process.

## Steps

1. If no spec path is given, list files in `specs/` and ask the user to pick one.

2. Read the spec completely.

3. Read `CLAUDE.md` for project conventions.

4. Read `design.md` if it exists in the current directory. All UI must respect these visual guidelines — typography, spacing, color tokens, component shapes, interaction patterns.

5. Scan existing source files to understand the actual file structure: where types, services, and components live.

6. Follow the implementation process in `.claude/agents/impl-agent.md`:
   - Types first
   - Service functions
   - Leaf components
   - Container with state and data wiring

7. Run the build command from `package.json`. Fix all errors before finishing.

8. Report: files created, component names, deviations from spec (with reasons).
