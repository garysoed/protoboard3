# Protoboard Project Guidelines

## Component Architecture & Styling

- **Parameter Derivation & Simplification**: When designing functions, constructors, or internal helper methods that accept multiple arguments, check if some parameters can be derived or accessed directly from other existing parameters (e.g. deriving `KeyboardEvent` or `currentTarget` directly from an `ActionEvent`). If so, simplify the parameter list by eliminating the redundant, derivable parameters.
- **Carbon Semantic Design Tokens**: In documentation applications and showcase interfaces styled with IBM Carbon, strictly utilize native Carbon semantic design tokens (`--cds-background`, `--cds-layer-*`, `--cds-text-*`, `--cds-border-*`, `--cds-interactive`, etc.) and typography scales rather than defining custom CSS color/theme property namespaces.
- **Host Display**: Custom piece components (e.g. `<pb-d1>`) must define `:host { display: inline-block; }` so they shrink-wrap to their slotted content size in layouts and visual screenshots.
- **Dedicated CSS Files**: Place custom element styling in dedicated `.css` files (e.g. `src/core/action-popup.css`) and import them directly (`import styles from './<name>.css'`) rather than using `.css.ts` or inline string templates.
- **No Premature CSS Variables**: Avoid adding speculative CSS custom properties (`var(--pb-*, ...)`) for prospective customization. Use direct literal CSS properties and values until theming or dynamic overrides are requested.
- **Clean Public Exports**: Keep `src/index.ts` focused strictly on consumer-facing functions (such as `initialize`) without exporting internal component classes or unnecessary intermediary dependency sources.
- **Dedicated Testing Entrypoint**: Shared internal services and cross-test fixture components (e.g. `TestFace`, `HandService`, `handServiceContext`) must be exported through `src/testing/index.ts` and bundled as `dist/testing.min.js`. Unit tests in `src/` should load `dist/testing.min.js`, whereas end-to-end tests in `e2e/` represent consumer usage and must load the production bundle `dist/protoboard.min.js` and use standard HTML/DOM elements. Single-use test fixture classes should be defined and registered directly within their respective test file.
- **Type Narrowing without Typecasts**: Never use `as` type assertions in production code. Use `instanceof` checks (e.g. `if (piece instanceof Element)`) to safely narrow DOM elements and objects.
- **Lit Decorators Syntax**: In TypeScript with standard TC39 decorators, properties decorated with `@state()` or `@property()` must use the `accessor` keyword (e.g. `@state() private accessor cursorX = 0;`).
- **Action Registration**: Base classes must not conditionally register actions based on property values. Specialized or multi-variant actions (e.g. `roll`, `next-face`, `flip`) must be registered directly by the subclasses that support them.
- **Universal Element Actions**: Built-in actions that apply across all interactive pieces and containers (e.g. `HelpAction`) must be registered directly in `BaseElement` rather than individual piece or component subclasses.
- **Single Action Factory**: `BaseElement` and its subclasses must take a single non-optional `actionsFactory: () => readonly BaseAction[]` function parameter evaluated lazily by the `@cached()` actions getter.
- **Non-Optional Parameters by Default**: Most parameters across classes, constructors, methods, and functions must be required. Never add default parameter values (`param = default`) or make parameters optional (`param?: type`) without explicit user instruction.
- **No Speculative Methods, Parameters, or Properties**: Do not add any speculative methods, parameters, or properties across classes, interfaces, functions, or constructors unless they are immediately required and utilized.
- **Non-Visual Configuration Elements**: Custom elements used solely as configuration or structural child metadata (such as `<pb-chute-layer>`) that do not render visual content must implement `render()` returning an empty template (`return html``;`) without defining `static override styles` or unused `<slot>` projections.
- **Private Reactive State**: State managed and mutated internally by component actions (e.g. `activeFace`, `rotationIndex`) must be declared as private state using `@state() private accessor ...` rather than public `@property()`.
- **Visual Selection Dropdowns**: Dropdown and select menus cannot host interactive tooltips on options. In visual pickers and selection menus displaying rich visual items (such as SVG thumbnails), pair the visual preview directly with a concise text label (`name`) and logical category grouping (e.g. `<optgroup>` or menu sections) rather than relying on hover tooltips or verbose sentence descriptions.
- **Single-Pass Map Lookups**: When querying a `Map` or collection for a value, avoid calling `.has(key)` immediately prior to `.get(key)`. Retrieve directly using `const value = map.get(key)` and check if the result is nullish/undefined.
- **Compiled Output Locations**: Compiled stylesheets and asset bundles must be output strictly into designated `dist/` directories (e.g. `site/dist/styles.css`) rather than residing alongside source files.
- **Carbon UI Shell & SideNav Hierarchy**: When utilizing IBM Carbon UI Shell components, structure `<cds-side-nav>` as a direct sibling of `<cds-header>` without the `is-not-child-of-header` attribute to retain Carbon's standard expanded UX mode (`cds--side-nav--ux`). When configuring `collapse-mode="rail"`, equip top-level navigation links and category menus with 16×16px SVG icons using `slot="title-icon"` so they render cleanly in the 48px mini-rail.
- **Preserve Super Observed Attributes**: When overriding `static get observedAttributes()` in custom element subclasses (such as classes inheriting from `SignalWatcher(LitElement)` or `BaseElement`), always include `...(super.observedAttributes ?? [])`. Omitting `super.observedAttributes` prevents Lit's internal `finalize()` from executing, leaving `elementStyles` unpopulated and causing component stylesheets not to be adopted into the shadow DOM.
- **Single Source of Truth for Controls**: Custom elements aggregating child form controls or selection rows must avoid caching redundant selection state in component properties or arrays. Read the selected values directly from child control instances on demand via query selectors and boundary accessors.

## Reactive State & Signals (`@lit-labs/signals`)

- **Signals for Reactive State**: Manage mutable reactive state using TC39 Signals (`signal()`) and derived reactive values using `computed()`. Custom elements consuming signals must inherit from `SignalWatcher(LitElement)`. All mutable element properties and attribute-backed state must be stored as reactive signals.
- **Cohesive Coordinate Signals**: Store co-dependent spatial positions and coordinates (e.g. `{left: number; top: number}`) in a single unified signal rather than separate scalar coordinate signals.
- **No Signal Suffix**: Do not append a `Signal` suffix to signal property names (e.g. use `overlay`, `cursorX`, `stopIndex`, not `overlaySignal`).
- **Getter Memoization**: Use `@cached()` from `gs-tools/export/data` for memoizing getter calculations and lazy singleton references. Do not convert lazy getters into signals.
- **Constant vs Reactive Properties**: Do not create reactive signals or `computed()` wrappers for immutable class constants. Compute derived values directly in methods where properties are constant.
- **Action Parameter Signal Typing**: Action parameters representing dynamic numeric counts or state (such as `totalSides`) must be typed using reactive Signal types (`Signal.Computed<number> | Signal.State<number>`) rather than scalar numbers or callback functions (`() => number`).

## Piece Architecture & Element Contracts

- **Abstract Piece Base Classes**: `BasePiece` and other piece base abstractions must be declared as `abstract class` and never registered as custom HTML elements. Only concrete piece components (e.g. `<pb-d1>`) are registered.
- **Constructor-Injected Default Names**: `BaseElement` and `BasePiece` subclasses must pass `defaultName: string` as a required constructor parameter rather than defining abstract class properties.
- **Intrinsic Properties**: Invariant piece characteristics (such as `sides`) must be defined as typed class properties (`abstract readonly sides: number;`) rather than Lit `@property()` accessors or HTML attributes.
- **No Action Methods on Components**: Custom piece and element classes must not expose methods corresponding to actions (e.g. no `piece.flip()` or `piece.roll()`). Action logic and execution must remain encapsulated inside action instances, modifying internal reactive signals directly rather than via component methods.
- **Encapsulated Action Mutations**: Actions must encapsulate their complete DOM and state side-effects directly (e.g. `DropAction` appending the piece via `element.appendChild(piece)` and `PickAction` pushing to `handService`) rather than delegating standard DOM lifecycle operations to external callback parameters (such as `onDrop`) on action constructors.
- **No Unsolicited Interface or Signature Changes**: Always check with the user before modifying, widening, narrowing, or altering any function, constructor, method signature, or interface type definition. Never make preemptive signature adjustments (e.g. widening parameter types to accept `null`) without explicit instruction.
- **Preserve Working Internal Implementation**: Do not modify, re-architect, or inject conditional branches into existing working internal methods or internal state properties when adapting code for an external return type or boundary interface. Compute derived or transformed values at the boundary (such as in descriptors or getters) rather than altering stable internal logic.
- **Human-Readable Component Names**: Component default names (`defaultName`) must be human-readable strings (e.g. `'D1'`, `'D20'`, `'DN'`, `'Test Piece'`) without library prefixes (e.g. no `pb-`) or dashes.
- **No Unsolicited Property Accessors**: Do not add Lit `@property()` or `@state()` accessors or DOM attribute reflections unless explicitly requested. Avoid adding property reflections for DOM attributes when internal or protected class properties are sufficient.

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
- **No Redundant Window Guards in Browser Code**: In browser application modules and client-side scripts, do not add defensive `typeof window !== 'undefined'` checks. Access `window`, `document`, and DOM APIs directly.

## Documentation & README Standards

- **Centralized GitHub Documentation**: User guides, component references, keybindings matrices, and technical API references must be authored and maintained directly within the repository root `README.md` for GitHub presentation, rather than scattered across individual markdown files in `docs/` (such as `docs/usage.md` or `docs/api.md`). The `docs/` directory is reserved strictly for architectural specifications (`docs/azul.md`, `docs/bohnanza.md`) and implementation roadmaps (`docs/azul.impl.md`, `docs/bohnanza.impl.md`).
- **No Implementation Code in Design Documents**: Architectural design specifications in `docs/` must define systems, component contracts, behaviors, and data models using prose, tables, and structural diagrams rather than embedding raw implementation code blocks.
- **Prefix-Free UI & Navigation Names**: In documentation apps, example showcases, and UI navigation bars, component labels, display titles, and URL route paths must use clean, human-readable names without library custom element tag prefixes (e.g. `D6`, `Slot`, `#d6`, `#slot` rather than `pb-d6`, `pb-slot`, `#pb-d6`).
- **Exclude `README.md` from Directory Inventories**: Never list or describe `README.md` itself inside directory `README.md` inventory sections.

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
- **Single Base Class Method Test**: Test base class methods (such as `getActionDescriptor`) once on the defining base class unit test file (e.g. in `src/action/base-action.test.ts`) using a single representative subclass, without duplicating identical descriptor generation tests across every subclass or calling component.
- **No Trivial Property Assignment Tests**: Do not create unit tests solely to test property assignments, constructor field storage, or simple getters on classes (events, data containers, wrappers) without meaningful branches, transformations, or business logic. Focus tests on non-trivial logic, state transitions, and behavioral effects.
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
- **Distinct Test Fixture IDs**: Avoid using generic element IDs (e.g. `id="container"`) in test fixture markup that may collide with internal component shadow DOM element IDs (such as `<pb-hand-overlay>`'s internal container); use unique, context-specific IDs (e.g. `id="parent-container"` or `id="test-zone"`).
- **Visual Screenshots for Element Rendering and Visibility**: Verify visual formatting, custom element markup structure, element visibility/suppression states (such as hiding non-top pieces via CSS), and UI layouts (such as action shortcuts, popup layout, and face rendering) using visual screenshot golden assertions (`toHaveScreenshot`) rather than manual DOM queries, computed style checks (`getComputedStyle`), or text extraction (`allInnerTexts`, `textContent`).
- **No Negative Feature Tests**: Do not write tests asserting the absence of unsupported actions or shortcuts (e.g. verifying pressing a key does nothing). Focus tests strictly on verifying supported behavior.
- **No Custom Element Registry Guards**: In test fixtures, register custom elements directly via `customElements.define(...)` without `if (!customElements.get(...))` checks, as each test runs in a clean document context.
- **Browser Object Evaluation**: When verifying constructor functions or non-JSON serializable DOM objects in Playwright tests (e.g. `customElements.get(...)`), use `page.evaluateHandle(...)` to prevent JSON serialization errors.
- **Testing Custom Element Lifecycle Errors**: In the DOM standard, exceptions thrown inside custom element lifecycle callbacks (such as `connectedCallback`) during DOM mutations (such as `appendChild`) are reported to `window.onerror` rather than thrown directly by `appendChild`. In Playwright tests, capture and assert these errors using `const errorPromise = page.waitForEvent('pageerror')` followed by `document.body.appendChild(...)` rather than using `try...catch` blocks.
- **Test Commands**:
  - `npm test`: Runs the test suite.
  - `npm run test:unit`: Runs unit tests on Chromium.
  - `npm run test:e2e`: Runs E2E tests across Chromium, Firefox, and WebKit.
- **Environment Notes**:
  - Running Playwright browsers and Jujutsu commands that snapshot or modify repository state (`jj status`, `jj describe`, `jj new`, etc.) on macOS require `BypassSandbox: true` due to OS child process IPC and `.git/objects` filesystem sandbox restrictions.
