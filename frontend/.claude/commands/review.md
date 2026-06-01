Review implemented frontend code for spec compliance, conventions, and design system correctness.

Usage: /review [spec-file-path]

Arguments: $ARGUMENTS

---

Read `.claude/agents/review-agent.md` for the full review checklist and report format.

## Steps

1. Identify the files to review:
   - If a spec path is given, read it to understand intended behavior
   - Run `git diff --name-only HEAD` to find recently changed source files
   - If no git changes are visible, ask the user which files to review

2. Read each changed file in full.

3. Read `CLAUDE.md` for project conventions.

4. Read `design.md` for visual guidelines and token rules.

5. Run the build to check for errors:
   ```bash
   npm run build
   ```

6. Apply the full checklist from `.claude/agents/review-agent.md` across all reviewed files.

7. Output the structured report: Result, Issues to Fix (with file:line and corrected code), and the per-category checklist.

8. If the result is FAIL, list issues grouped by severity so the user knows what to fix first. Do not fix anything — report only.
