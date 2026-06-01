Test the frontend using Playwright browser automation against the live dev server.

Usage: /test [spec-file-path]

Arguments: $ARGUMENTS

---

Read `.claude/agents/test-agent.md` for the testing approach and report format.

## Steps

1. Discover the dev server URL: read `package.json` start script or `CLAUDE.md`.

2. Verify it is reachable:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" <dev-server-url>
   ```
   If not reachable, tell the user to start the dev server first.

3. If a spec path is given, read it for features, edge cases, and error states to test.

4. Read the router file (e.g., `App.js`, `App.tsx`) to discover all existing routes for regression checks.

5. Run the full test suite per `.claude/agents/test-agent.md`: smoke check → golden path → edge cases → regression.

6. Output the structured PASS/FAIL report.

7. If bugs are found, describe them with reproduction steps so `/implement` can fix them.
