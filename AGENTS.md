# Protoboard Project Guidelines

## Testing Conventions

- **Unit Tests**:
  - Located in `src/`, co-located in the same directory as the module or component being tested (e.g. `src/pieces/d1-piece.test.ts`).
  - Target browser: **Chromium** only.
- **End-to-End (E2E) Tests**:
  - Located in the top-level `e2e/` directory (e.g. `e2e/smoke.test.ts`).
  - Target browsers: **Chromium**, **Firefox**, and **WebKit**.
- **File Naming**: All test files must be named `<name>.test.ts`.
- **Visual Golden Screenshots**:
  - Visual snapshot baselines must be stored in a subfolder named `goldens/` in the same directory as the test file (e.g. `src/**/goldens/` for unit tests and `e2e/goldens/` for E2E tests).
- **Test Commands**:
  - `npm test`: Runs both unit and E2E test suites.
  - `npm run test:unit`: Runs only unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers on macOS requires `BypassSandbox: true` due to OS child process IPC sandbox restrictions.
