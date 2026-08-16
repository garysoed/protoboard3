---
name: commit
description: >-
  Standard workflow for committing changes in Protoboard. Use when committing, creating a change,
  or preparing to finalize a task. Runs lint, executes all unit and E2E tests with visual goldens,
  sets the Jujutsu commit description if missing (with suggestion in editor), and prompts /learn.
---

# Commit Workflow

This skill outlines the mandatory validation and commit procedure for all Protoboard changes.

## Steps

### 1. Code Quality & Formatting

Run ESLint and Prettier to ensure zero lint errors and consistent formatting:

```bash
npm run lint
npm run format
```

### 2. Full Test Suite & Visual Golden Verification

Run the complete test suite across both unit tests (Chromium) and End-to-End tests (Chromium, Firefox, WebKit):

```bash
npm test
```

- Ensure all DOM functional tests and visual golden screenshot assertions pass with zero failures.
- If golden screenshots need updating due to intentional visual changes, run:
  ```bash
  npx playwright test --update-snapshots
  ```

### 3. Jujutsu Commit Description

Check the status of the current working copy in Jujutsu (`jj`):

```bash
jj status
```

- Inspect whether a commit description is already set for `@`:
  ```bash
  jj log -r @ --no-graph -T description
  ```
- If no description is set (or it indicates `(no description set)`):
  - Draft a concise, descriptive commit summary following conventional commits style (e.g. `feat: ...`, `fix: ...`, `chore: ...`).
  - Set the description or launch the editor with the suggested message:
    ```bash
    jj describe -m "<suggested description>"
    ```

### 4. Continuous Learning (`/learn`)

After completing the commit sequence:

- Evaluate whether any new patterns, workflow corrections, or project-specific gotchas were encountered during the task.
- Proactively suggest running `/learn` to persist lessons for future tasks.
