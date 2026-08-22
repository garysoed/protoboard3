# Protoboard Project Guidelines

## Component Architecture & Styling

- **Host Display**: Custom piece components (e.g. `<pb-d1>`) must define `:host { display: inline-block; }` so they shrink-wrap to their slotted content size in layouts and visual screenshots.
- **Clean Public Exports**: Keep `src/index.ts` focused strictly on consumer-facing functions (such as `initialize`) without exporting internal component classes or unnecessary intermediary dependency sources.
- **Dedicated Testing Entrypoint**: Shared internal services and cross-test fixture components (e.g. `TestFace`, `HandService`, `handServiceContext`) must be exported through `src/testing/index.ts` and bundled as `dist/testing.min.js`. Unit tests in `src/` should load `dist/testing.min.js`, whereas end-to-end tests in `e2e/` represent consumer usage and must load the production bundle `dist/protoboard.min.js` and use standard HTML/DOM elements. Single-use test fixture classes should be defined and registered directly within their respective test file.
- **Type Narrowing without Typecasts**: Never use `as` type assertions in production code. Use `instanceof` checks (e.g. `if (piece instanceof Element)`) to safely narrow DOM elements and objects.
- **Lit Decorators Syntax**: In TypeScript with standard TC39 decorators, properties decorated with `@state()` or `@property()` must use the `accessor` keyword (e.g. `@state() private accessor cursorX = 0;`).
- **Action Registration**: Base classes must not conditionally register actions based on property values. Specialized or multi-variant actions (e.g. `roll`, `next-face`, `flip`) must be registered directly by the subclasses that support them.
- **Single Action Factory**: `BaseElement` and its subclasses must take a single non-optional `actionsFactory: () => readonly BaseAction[]` function parameter evaluated lazily by the `@cached()` actions getter.
- **Non-Optional Parameters by Default**: Most parameters across classes, constructors, methods, and functions must be required. Never add default parameter values (`param = default`) or make parameters optional (`param?: type`) without explicit user instruction.
- **Private Reactive State**: State managed and mutated internally by component actions (e.g. `activeFace`, `rotationIndex`) must be declared as private state using `@state() private accessor ...` rather than public `@property()`.

## Reactive State & Signals (`@lit-labs/signals`)

- **Signals for Reactive State**: Manage mutable reactive state using TC39 Signals (`signal()`) and derived reactive values using `computed()`. Custom elements consuming signals must inherit from `SignalWatcher(LitElement)`.
- **No Signal Suffix**: Do not append a `Signal` suffix to signal property names (e.g. use `overlay`, `cursorX`, `stopIndex`, not `overlaySignal`).
- **Getter Memoization**: Use `@cached()` from `gs-tools/export/data` for memoizing getter calculations and lazy singleton references. Do not convert lazy getters into signals.
- **Constant vs Reactive Properties**: Do not create reactive signals or `computed()` wrappers for immutable class constants. Compute derived values directly in methods where properties are constant.
- **Action Parameter Signal Typing**: Action parameters representing dynamic numeric counts or state (such as `totalSides`) must be typed using reactive Signal types (`Signal.Computed<number> | Signal.State<number>`) rather than scalar numbers or callback functions (`() => number`).

## Piece Architecture & Element Contracts

- **Abstract Piece Base Classes**: `BasePiece` and other piece base abstractions must be declared as `abstract class` and never registered as custom HTML elements. Only concrete piece components (e.g. `<pb-d1>`) are registered.
- **Intrinsic Properties**: Invariant piece characteristics (such as `sides`) must be defined as typed class properties (`abstract readonly sides: number;`) rather than Lit `@property()` accessors or HTML attributes.
- **No Action Methods on Components**: Custom piece and element classes must not expose methods corresponding to actions (e.g. no `piece.flip()` or `piece.roll()`). Action logic and execution must remain encapsulated inside action instances, modifying internal reactive signals directly rather than via component methods.

## Dependency Injection & Context (`@lit/context`)

- **Context-Driven Services**: Use `@lit/context` (`createContext`, `ContextProvider`, `@consume`) for all shared service injection.
- **Context with Signals**: `@consume` cannot bind directly to `Signal.State<T>`. When a context-injected value needs to be stored and exposed as a reactive signal on a component, use `ContextConsumer` with a callback updating the signal (`new ContextConsumer(this, { context, callback: (v) => signal.set(v), subscribe: true })`).
- **Action Service Signals**: Actions depending on contextual services (such as `PickAction`) should consume the service signal (`Signal.State<Service | undefined>`) so they can reactively read the current service instance at trigger time without requiring null-checks at instantiation.
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
- **Task Revision Boundary**: When starting a new task or phase, if the current working copy (`@`) already has a description set or contains completed changes from a prior task, always create a new child revision (`jj new`) before making changes.
- **No `jj new` on Commit**: The commit workflow strictly concludes after setting the commit description with `jj describe -m "<message>"`. Do not run `jj new` when committing or finalizing a task.
- **Learning Documentation in Commit**: Documentation updates resulting from `/learn` or lessons learned during a task must be included directly within that task's committed changes rather than being placed in a separate child revision.

## Testing Conventions

- **Unit Tests**:
  - Located in `src/`, co-located in the same directory as the module or component being tested (e.g. `src/pieces/d1.test.ts`).
  - Target browser: **Chromium** only.
- **Method-Focused Organization**: Group unit tests strictly by the individual function, action, or method under test using `test.describe('<methodName>')` (e.g. `test.describe('nextFace')` and `test.describe('prevFace')` separately, never combined). Maintain granular, single-scenario `test(...)` cases rather than bundling multiple distinct conditions into one test.
- **Action Tests Focus on Effects**: Unit tests for action classes must strictly test the effects and state changes when triggered. Do not test custom shortcut attributes or different triggering mechanisms, as those are already covered by `BaseAction` and `BaseElement`.
- **Targeted Piece Action Tests**: In piece component unit tests, action tests should verify only the primary state transition on the piece (e.g. `face0` flipping to its opposing face) without performing redundant multi-step state permutations or cycling chains already covered by the dedicated action unit test.
- **Direct Boundary Assertions**: In component unit tests, test final target states and boundary transitions directly without adding redundant intermediate assertions for each step in a sequence.
- **Tag Registration Assertions**: When verifying batch custom element definitions in tests, use `tags.every((tag) => !!customElements.get(tag))` and assert `expect(result).toBe(true)` rather than mapping elements with `Boolean(...)` and asserting against boolean arrays.
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
- **No Custom Element Registry Guards**: In test fixtures, register custom elements directly via `customElements.define(...)` without `if (!customElements.get(...))` checks, as each test runs in a clean document context.
- **Browser Object Evaluation**: When verifying constructor functions or non-JSON serializable DOM objects in Playwright tests (e.g. `customElements.get(...)`), use `page.evaluateHandle(...)` to prevent JSON serialization errors.
- **Test Commands**:
  - `npm test`: Runs the test suite.
  - `npm run test:unit`: Runs unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers and Jujutsu commands that snapshot or modify repository state (`jj status`, `jj describe`, `jj new`, etc.) on macOS require `BypassSandbox: true` due to OS child process IPC and `.git/objects` filesystem sandbox restrictions.
