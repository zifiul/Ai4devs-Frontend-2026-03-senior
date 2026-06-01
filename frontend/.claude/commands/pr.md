Create a pull request for the current branch using the GitHub CLI.

Usage: /pr [base-branch]

Arguments: $ARGUMENTS

---

## Steps

1. Determine the base branch:
   - Use the branch from `$ARGUMENTS` if provided
   - Otherwise default to `main`

2. Gather context for the PR description:
   ```bash
   git log <base-branch>...HEAD --oneline
   git diff <base-branch>...HEAD --stat
   ```

3. Read any spec files that were added or modified in this branch:
   ```bash
   git diff <base-branch>...HEAD --name-only | grep "specs/"
   ```
   If spec files exist, read them for feature context.

4. Derive a concise PR **title** (under 70 characters) from the commits and changed files.

5. Write a PR **description** following these rules:
   - Under 1000 characters total
   - Use bullet points (`-`) for the body — no prose paragraphs
   - Three sections:
     - **What** — what changed (components added, routes added, APIs called)
     - **Why** — which spec or feature this implements
     - **How to test** — minimal steps to verify the change manually

6. Check that the branch is pushed:
   ```bash
   git status
   ```
   If the remote tracking branch is missing, push first:
   ```bash
   git push -u origin HEAD
   ```

7. Create the PR:
   ```bash
   gh pr create --base <base-branch> --title "<title>" --body "<description>"
   ```

8. Output the PR URL.
