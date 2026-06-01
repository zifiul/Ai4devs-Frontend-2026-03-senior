Run a Lighthouse audit against the live dev server and report scores with actionable fixes.

Usage: /audit [mobile|desktop]

Arguments: $ARGUMENTS

---

## Steps

1. Determine device target from `$ARGUMENTS` — default to `desktop` if not specified.

2. Confirm the dev server is reachable:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
   ```
   If not reachable, tell the user to start the dev server first (`npm start`).

3. Run the full audit on both the root and any key routes discovered from the router file (`App.js` / `App.tsx`):

   For each URL, call:
   ```
   mcp__lighthouse__run_audit
     url: <url>
     device: <device>
     throttling: true
     categories: ["performance", "accessibility", "best-practices", "seo"]
   ```

   At minimum audit:
   - `http://localhost:3000` (root / dashboard)
   - Up to 2 additional routes if they are distinct page types (e.g., list page, detail page)

4. Produce the report below.

---

## Report Format

```
# Lighthouse Audit — <device>

## Scores

| Route | Performance | Accessibility | Best Practices | SEO |
|-------|-------------|---------------|----------------|-----|
| /     |     ##      |      ##       |      ##        | ##  |

## Issues

For each score below 90, list the top failing audits with:
- Audit name
- Current value / what Lighthouse found
- How to fix it (specific, actionable)

## Accessibility Failures
List every accessibility audit that did not pass — these are always worth fixing regardless of score.

## Summary
- Highest priority fix: <one sentence>
- Quick wins (low effort, high impact): bullet list
```

Score thresholds for context:
- 90–100: Good
- 50–89: Needs improvement
- 0–49: Poor
