# Protoboard Project Guidelines

## Component Architecture & Styling

- **Host Display**: Custom piece components (e.g. `<pb-d1>`) must define `:host { display: inline-block; }` so they shrink-wrap to their slotted content size in layouts and visual screenshots.
- **Clean Public Exports**: Keep `src/index.ts` focused strictly on consumer-facing functions (such as `initialize`) without exporting internal component classes or unnecessary intermediary dependency sources.
- **Dedicated Testing Entrypoint**: Shared internal services and cross-test fixture components (e.g. `TestFace`, `HandService`, `handServiceContext`) must be exported through `src/testing/index.ts` and bundled as `dist/testing.min.js`. All tests, and only tests, should load `dist/testing.min.js`. Single-use test fixture classes should be defined and registered directly within their respective test file.
- **Type Narrowing without Typecasts**: Never use `as` type assertions in production code. Use `instanceof` checks (e.g. `if (piece instanceof Element)`) to safely narrow DOM elements and objects.
- **Lit Decorators Syntax**: In TypeScript with standard TC39 decorators, properties decorated with `@state()` or `@property()` must use the `accessor` keyword (e.g. `@state() private accessor cursorX = 0;`).
- **Action Registration**: Base classes must not conditionally register actions based on property values. Specialized or multi-variant actions (e.g. `roll`, `next-face`, `flip`) must be registered directly by the subclasses that support them.
- **Private Reactive State**: State managed and mutated internally by component actions (e.g. `activeFace`, `rotationIndex`) must be declared as private state using `@state() private accessor ...` rather than public `@property()`.

## Reactive State & Signals (`@lit-labs/signals`)

- **Signals for Reactive State**: Manage mutable reactive state using TC39 Signals (`signal()`) and derived reactive values using `computed()`. Custom elements consuming signals must inherit from `SignalWatcher(LitElement)`.
- **No Signal Suffix**: Do not append a `Signal` suffix to signal property names (e.g. use `overlay`, `cursorX`, `stopIndex`, not `overlaySignal`).
- **Getter Memoization**: Use `@cached()` from `gs-tools/export/data` for memoizing getter calculations and lazy singleton references. Do not convert lazy getters into signals.
- **Constant vs Reactive Properties**: Do not create reactive signals or `computed()` wrappers for immutable class constants. Compute derived values directly in methods where properties are constant.

## Piece Architecture & Element Contracts

- **Abstract Piece Base Classes**: `BasePiece` and other piece base abstractions must be declared as `abstract class` and never registered as custom HTML elements. Only concrete piece components (e.g. `<pb-d1>`) are registered.
- **Intrinsic Properties**: Invariant piece characteristics (such as `sides`) must be defined as typed class properties (`abstract readonly sides: number;`) rather than Lit `@property()` accessors or HTML attributes.

## Dependency Injection & Context (`@lit/context`)

- **Context-Driven Services**: Use `@lit/context` (`createContext`, `ContextProvider`, `@consume`) for all shared service injection.
- **Optional Consumer Typing**: When consuming a non-nullable context (`createContext<T>`) into a component property typed as `T | undefined`, supply the generic parameter to `@consume<T | undefined>({ context, subscribe })`. Never widen `createContext<T>` to `T | undefined` when the context provider provides a non-nullable service.
- **No Fallback Singletons**: Never instantiate or export module-level default singletons as fallbacks inside base element classes.
- **Initialization Standards**: The public `initialize()` function must return `void`. Do not expose internal service instances for overriding in `InitOptions`.
- **No Redundant Type Guards**: Avoid adding runtime type guards (e.g. `if (root instanceof HTMLElement)`) when variables are already statically typed to `HTMLElement`.

## Communication & Inquiries

- **Direct Answers to "Why" Questions**: When the user asks why an architectural choice, implementation decision, or specific change was made, answer the question directly, thoroughly, and transparently before proceeding to planning or code execution.

## Global Types & DOM Integration

- **Root Typedefs**: Maintain global type definitions in `typedef.d.ts` at the project root with `type Protoboard = typeof import('./src/testing/index')` so the compiler automatically enforces `window.Protoboard` interface fidelity across test suites without polluting `src/index.ts`.

## Jujutsu (jj) Workflow

- **In-Place Conflict Resolution**: When changes to an ancestor commit trigger rebase conflicts in descendant commits, never abandon (`jj abandon`) the descendant commits to recreate them. Always switch to the conflicted revision (`jj edit <rev>`) and resolve the conflicts in place.

## Testing Conventions

- **Unit Tests**:
  - Located in `src/`, co-located in the same directory as the module or component being tested (e.g. `src/pieces/d1.test.ts`).
  - Target browser: **Chromium** only.
- **Method-Focused Organization**: Group unit tests by the function or method under test using `test.describe('<methodName>')`. Maintain granular, single-scenario `test(...)` cases rather than bundling multiple distinct conditions into one test.
- **Action Tests Focus on Effects**: Unit tests for action classes must strictly test the effects and state changes when triggered. Do not test custom shortcut attributes or different triggering mechanisms, as those are already covered by `BaseAction` and `BaseElement`.
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
- **No Negative Feature Tests**: Do not write tests asserting the absence of unsupported actions or shortcuts (e.g. verifying pressing a key does nothing). Focus tests strictly on verifying supported behavior.
- **Browser Object Evaluation**: When verifying constructor functions or non-JSON serializable DOM objects in Playwright tests (e.g. `customElements.get(...)`), use `page.evaluateHandle(...)` to prevent JSON serialization errors.
- **Test Commands**:
  - `npm test`: Runs the test suite.
  - `npm run test:unit`: Runs unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers on macOS requires `BypassSandbox: true` due to OS child process IPC sandbox restrictions.
