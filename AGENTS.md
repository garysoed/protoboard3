# Protoboard Project Guidelines

## Component Architecture & Styling

- **Host Display**: Custom piece components (e.g. `<pb-d1>`) must define `:host { display: inline-block; }` so they shrink-wrap to their slotted content size in layouts and visual screenshots.
- **Clean Public Exports**: Keep `src/index.ts` focused strictly on consumer-facing functions (such as `initialize`) without exporting internal component classes or unnecessary intermediary dependency sources.
- **Dedicated Testing Entrypoint**: Internal services and test fixture components (e.g. `TestFace`, `HandService`, `$handService`) must be exported through `src/testing/index.ts` and bundled as `dist/testing.min.js`. All tests, and only tests, should load `dist/testing.min.js`.
- **Type Narrowing without Typecasts**: Never use `as` type assertions in production code. Use `instanceof` checks (e.g. `if (piece instanceof Element)`) to safely narrow DOM elements and objects.
- **Lit Decorators Syntax**: In TypeScript with standard TC39 decorators, properties decorated with `@state()` or `@property()` must use the `accessor` keyword (e.g. `@state() private accessor cursorX = 0;`).

## Global Types & DOM Integration

- **Root Typedefs**: Maintain global type definitions in `typedef.d.ts` at the project root with `type Protoboard = typeof import('./src/testing/index')` so the compiler automatically enforces `window.Protoboard` interface fidelity across test suites without polluting `src/index.ts`.

## Testing Conventions

- **Unit Tests**:
  - Located in `src/`, co-located in the same directory as the module or component being tested (e.g. `src/pieces/d1.test.ts`).
  - Target browser: **Chromium** only.
- **End-to-End (E2E) Tests**:
  - Located in the top-level `e2e/` directory (e.g. `e2e/smoke.test.ts`).
  - Target browsers: **Chromium**, **Firefox**, and **WebKit**.
- **File Naming**: All test files must be named `<name>.test.ts`.
- **Visual Golden Screenshots**:
  - Visual snapshot baselines must be stored in `<directory_of_test>/goldens/<test_name>_<label>.png` (e.g. `src/**/goldens/` for unit tests and `e2e/goldens/` for E2E tests).
- **Browser Object Evaluation**: When verifying constructor functions or non-JSON serializable DOM objects in Playwright tests (e.g. `customElements.get(...)`), use `page.evaluateHandle(...)` to prevent JSON serialization errors.
- **Test Commands**:
  - `npm test`: Runs both unit and E2E test suites.
  - `npm run test:unit`: Runs only unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers on macOS requires `BypassSandbox: true` due to OS child process IPC sandbox restrictions.
