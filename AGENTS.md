# Protoboard Project Guidelines

## Component Architecture & Styling

- **Host Display**: Custom piece components (e.g. `<pb-d1>`) must define `:host { display: inline-block; }` so they shrink-wrap to their slotted content size in layouts and visual screenshots.
- **Clean Public Exports**: Keep `src/index.ts` focused strictly on consumer-facing functions (such as `initialize`) without exporting internal component classes or unnecessary intermediary dependency sources.
- **Dedicated Testing Entrypoint**: Internal services and test fixture components (e.g. `TestFace`, `HandService`, `handServiceContext`) must be exported through `src/testing/index.ts` and bundled as `dist/testing.min.js`. All tests, and only tests, should load `dist/testing.min.js`.
- **Type Narrowing without Typecasts**: Never use `as` type assertions in production code. Use `instanceof` checks (e.g. `if (piece instanceof Element)`) to safely narrow DOM elements and objects.
- **Lit Decorators Syntax**: In TypeScript with standard TC39 decorators, properties decorated with `@state()` or `@property()` must use the `accessor` keyword (e.g. `@state() private accessor cursorX = 0;`).

## Dependency Injection & Context (`@lit/context`)

- **Context-Driven Services**: Use `@lit/context` (`createContext`, `ContextProvider`, `@consume`) for all shared service injection.
- **Optional Consumer Typing**: When consuming a non-nullable context (`createContext<T>`) into a component property typed as `T | undefined`, supply the generic parameter to `@consume<T | undefined>({ context, subscribe })`. Never widen `createContext<T>` to `T | undefined` when the context provider provides a non-nullable service.
- **No Fallback Singletons**: Never instantiate or export module-level default singletons as fallbacks inside base element classes.
- **Initialization Standards**: The public `initialize()` function must return `void`. Do not expose internal service instances for overriding in `InitOptions`.
- **No Redundant Type Guards**: Avoid adding runtime type guards (e.g. `if (root instanceof HTMLElement)`) when variables are already statically typed to `HTMLElement`.

## Global Types & DOM Integration

- **Root Typedefs**: Maintain global type definitions in `typedef.d.ts` at the project root with `type Protoboard = typeof import('./src/testing/index')` so the compiler automatically enforces `window.Protoboard` interface fidelity across test suites without polluting `src/index.ts`.

## Jujutsu (jj) Workflow

- **In-Place Conflict Resolution**: When changes to an ancestor commit trigger rebase conflicts in descendant commits, never abandon (`jj abandon`) the descendant commits to recreate them. Always switch to the conflicted revision (`jj edit <rev>`) and resolve the conflicts in place.

## Testing Conventions

- **Unit Tests**:
  - Located in `src/`, co-located in the same directory as the module or component being tested (e.g. `src/pieces/d1.test.ts`).
  - Target browser: **Chromium** only.
- **Method-Focused Organization**: Group unit tests by the function or method under test using `test.describe('<methodName>')`. Maintain granular, single-scenario `test(...)` cases rather than bundling multiple distinct conditions into one test.
- **End-to-End (E2E) Tests**:
  - Located in the top-level `e2e/` directory, organized per component (e.g. `e2e/d1.test.ts`). Do not use generic smoke test files.
  - Target browsers: **Chromium**, **Firefox**, and **WebKit**.
- **Viewport Standard**:
  - All tests must use a default viewport size of **480 × 480** pixels (configured via `DEFAULT_VIEWPORT` in `playwright.config.ts`).
- **File Naming**: All test files must be named `<name>.test.ts`.
- **Visual Golden Screenshots**:
  - Visual snapshot baselines must be stored in `<directory_of_test>/goldens/<test_name>_<label>.png` (e.g. `src/**/goldens/` for unit tests and `e2e/goldens/` for E2E tests).
  - In test code, always specify screenshot names with underscores: `toHaveScreenshot('<name>_<label>.png')` (e.g. `'d1_face0.png'`).
- **No Redundant DOM Assertions**: Avoid adding redundant manual DOM traversal or slot inspection tests when a visual screenshot golden test already verifies the component rendering and slot projection.
- **Browser Object Evaluation**: When verifying constructor functions or non-JSON serializable DOM objects in Playwright tests (e.g. `customElements.get(...)`), use `page.evaluateHandle(...)` to prevent JSON serialization errors.
- **Test Commands**:
  - `npm test`: Runs the test suite.
  - `npm run test:unit`: Runs unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers on macOS requires `BypassSandbox: true` due to OS child process IPC sandbox restrictions.
