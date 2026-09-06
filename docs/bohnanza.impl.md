# Protoboard Example App Implementation Roadmap & Specifications (`bohnanza.impl.md`)

Based on the architectural specifications defined in [`docs/bohnanza.md`](./bohnanza.md), this document details the phased, component-by-component implementation roadmap for the **Protoboard Example App** (Bohnanza). Each phase is ordered strictly by its architectural and runtime dependencies, with all tasks numbered hierarchically for reference.

---

## 1. Dependency Graph

```mermaid
graph TD
    P1["Phase 1: Project Setup, Carbon Dependencies & Site Build Pipeline"] --> P2["Phase 2: Face Presets Library & Table Generator Utilities"]
    P2 --> P3["Phase 3: Core UI Shell, Hash Router & Carbon SideNav"]
    P2 --> P4["Phase 4: Common Detail Layout (<pbd-detail-layout>) & Slot Assigner (<pbd-slot-assigner>)"]
    P4 --> P5["Phase 5: Test Infrastructure Simplification & Shared Test Harness"]
    P3 --> P6["Phase 6: Tabletop Sandbox Canvas (<pbd-sandbox-pane>)"]
    P5 --> P6
    P5 --> P7["Phase 7: Getting Started / Overview Page (<pbd-page-overview>)"]
    P5 --> P8["Phase 8: Piece Detail Pages (<pbd-page-d1>..<pbd-page-dn>)"]
    P5 --> P9["Phase 9: Region Detail Pages (<pbd-page-slot>..<pbd-page-chute>)"]
    P5 --> P10["Phase 10: System Detail Pages (<pbd-page-hand-overlay>, <pbd-page-action-popup>)"]
    P6 --> P11["Phase 11: Full Integration, End-to-End Testing & Migration Cleanup"]
    P7 --> P11
    P8 --> P11
    P9 --> P11
    P10 --> P11
    P11 --> P12["Phase 12: Syntax Highlighting for Code Snippets (<cds-code-snippet>)"]
```

---

## 2. Phased Implementation Plan

### Phase 1: Project Setup, Carbon Dependencies & Site Build Pipeline

**Goal**: Install IBM Carbon dependencies, configure the Rollup build pipeline for `site/`, and establish the HTML/CSS entry point.
**Dependencies**: None.

- [x] **1. Phase 1: Project Setup, Carbon Dependencies & Site Build Pipeline**
  - [x] **1.1 Dependency Installation**
    - [x] 1.1.1 Add `@carbon/web-components` and `@carbon/styles` to `package.json`.
    - [x] 1.1.2 Verify dependency installation and module resolution.
  - [x] **1.2 Build & Bundler Configuration**
    - [x] 1.2.1 Configure `rollup.config.mjs` with a new build target compiling `site/src/main.ts` into `site/dist/site.min.js`.
    - [x] 1.2.2 Add `build:site` script to `package.json` and update `build` script to build the Protoboard library followed by the site bundle.
  - [x] **1.3 Site Entry Point & Styling**
    - [x] 1.3.1 Create `site/index.html` loading Carbon Plex fonts, stylesheet, Protoboard library bundle, and site application bundle.
    - [x] 1.3.2 Create `site/styles.scss` (compiled to `site/dist/styles.css`) establishing 3-pane flex/grid layout variables, Carbon Sass theme styling, and base container styles.

---

### Phase 2: Face Presets Library & Table Generator Utilities

**Goal**: Implement the 20 standardized 64×64 px SVG face preset generators and the reusable `<cds-table>` generation utilities.
**Dependencies**: Phase 1.

- [x] **2. Phase 2: Face Presets Library & Table Generator Utilities**
  - [x] **2.1 Standard 64×64 px Face Presets (`site/src/presets.ts`)**
    - [x] 2.1.1 Implement 6 Dice pip SVG templates (`pip-1` through `pip-6`).
    - [x] 2.1.2 Implement 5 Card suit symbol SVG templates (`card-spade`, `card-heart`, `card-diamond`, `card-club`, `card-joker`).
    - [x] 2.1.3 Implement 5 Token & shape SVG templates (`meeple`, `circle-red`, `circle-yellow`, `circle-green`, `circle-blue`).
    - [x] 2.1.4 Implement 4 Tabletop symbol SVG templates (`symbol-arrow`, `symbol-sword`, `symbol-shield`, `symbol-star`).
    - [x] 2.1.5 Export preset metadata catalog mapping preset IDs, names, categories, and render functions.
  - [x] **2.2 Table Generator Utilities (`site/src/table-utils.ts`)**
    - [x] 2.2.1 Implement `renderAttributesTable(attributes: readonly AttributeDescriptor[])` returning a structured `<cds-table>` Web Component with `Attribute`, `Type`, `Default`, and `Description` columns.
    - [x] 2.2.2 Implement `renderActionsTable(actions: readonly ActionDescriptor[])` returning a structured `<cds-table>` Web Component with `Action`, `Default Key`, and `Description` columns.

---

### Phase 3: Core UI Shell, Hash Router & Carbon SideNav

**Goal**: Build the IBM Carbon UI shell, left-side navigation with clean component names, and client-side hash router with redirect fallback.
**Dependencies**: Phase 2.

- [x] **3. Phase 3: Core UI Shell, Hash Router & Carbon SideNav**
  - [x] **3.1 Carbon UI Shell (`site/src/main.ts`)**
    - [x] 3.1.1 Mount `<cds-header>` with title `Protoboard Explorer`, menu button toggle, and GitHub repository action.
    - [x] 3.1.2 Assemble 3-pane layout containers (`#nav-pane`, `#middle-pane`, `#sandbox-pane`).
  - [x] **3.2 Carbon SideNav**
    - [x] 3.2.1 Build `<cds-side-nav>` with `<cds-side-nav-items>` grouped into Overview (`#overview`), Pieces (`#d1` through `#dn`), Regions (`#slot`, `#deck`, `#bag`, `#chute`), and System (`#hand-overlay`, `#action-popup`).
    - [x] 3.2.2 Wire menu toggle button to expand and collapse `<cds-side-nav>`.
  - [x] **3.3 Client-Side Hash Router (`site/src/router.ts`)**
    - [x] 3.3.1 Implement route map associating `#overview`, piece routes, region routes, and system routes with corresponding `<pbd-page-*>` custom element tags.
    - [x] 3.3.2 Implement `hashchange` listener to dynamically mount active page elements into `#middle-pane`.
    - [x] 3.3.3 Implement active state synchronization across `<cds-side-nav-link>` items and parent menus.
    - [x] 3.3.4 Implement explicit redirect fallback setting `window.location.hash = '#overview'` on empty, missing, or unrecognized hashes.
  - [x] **3.4 Unit & Navigation Testing**
    - [x] 3.4.1 Test router hash resolution, element mounting, and redirect behavior (skipped per user instruction).

---

### Phase 4: Common Detail Layout (`<pbd-detail-layout>`) & Slot Assigner (`<pbd-slot-assigner>`)

**Goal**: Implement the reusable detail page layout component and the face slot assigner widget for piece pages.
**Dependencies**: Phase 2.

- [x] **4. Phase 4: Common Detail Layout & Slot Assigner**
  - [x] **4.1 Reusable Slot Assigner (`<pbd-slot-assigner>`, `site/src/components/slot-assigner.ts`)**
    - [x] 4.1.1 Render slot rows for `slot="face 0"` through `slot="face N-1"`.
    - [x] 4.1.2 Provide visual preset picker dropdown/modal for selecting from the 20 built-in presets.
    - [x] 4.1.3 Render 64×64 px thumbnail preview for each selected slot.
    - [x] 4.1.4 Extract `<pbd-slot-row>` component (`site/src/components/slot-row.ts`); dynamic slot controls deferred to DN piece page.
  - [x] **4.2 Detail Layout Component (`<pbd-detail-layout>`, `site/src/components/detail-layout.ts`)**
    - [x] 4.2.1 Accept `title` and `tag` attributes; provide slots for `description`, `attributes`, `actions`, `controls`, and `slot-assigner`.
    - [x] 4.2.2 Implement preview section with `<cds-content-switcher>` toggling between Live Component View and HTML Code View.
    - [x] 4.2.3 Integrate `<cds-code-snippet type="multi">` displaying reactive HTML markup with one-click copy button (plain HTML view; syntax highlighting deferred to Phase 11).
    - [x] 4.2.4 Implement `<cds-button kind="primary">Add to Sandbox</cds-button>` dispatching component creation event to sandbox.
  - [x] **4.3 Unit Testing**
    - [x] 4.3.1 Test `<pbd-slot-row>` and `<pbd-slot-assigner>` preset mapping and assignment changes.
    - [x] 4.3.2 Test `<pbd-detail-layout>` slot projections and preview switcher toggling.

---

### Phase 5: Test Infrastructure Simplification & Shared Test Harness

**Goal**: Establish unified Playwright test harness helpers for both the Protoboard library (`src/`) and the Explorer site (`site/src/`), eliminating repetitive DOM bootstrapping, script/style injection, custom element definition waiting, and font readiness synchronization.
**Dependencies**: Phase 4.

- [ ] **5. Phase 5: Test Infrastructure Simplification & Shared Test Harness**
  - [ ] **5.1 Shared Library Test Harness (`src/testing/test-page.ts`)**
    - [ ] 5.1.1 Implement `setupLibraryPage(page: Page, options: { body: string, styles?: string })` injecting `dist/testing.min.js`, calling `window.Protoboard.initialize()`, and awaiting custom element registration.
    - [ ] 5.1.2 Export `setupLibraryPage` from `src/testing/index.ts` so all library unit tests can import it consistently.
  - [ ] **5.2 Shared Site Test Harness (`site/src/testing/test-page.ts`)**
    - [ ] 5.2.1 Implement `setupSitePage(page: Page, options: { body: string, whenDefined?: string | readonly string[], waitForFonts?: boolean })` injecting `site/dist/styles.css`, `dist/protoboard.min.js`, and `site/dist/site.min.js`.
    - [ ] 5.2.2 Automatically await custom elements and `document.fonts.ready` before returning the configured page.
  - [ ] **5.3 Test Suite Migration & Verification**
    - [ ] 5.3.1 Migrate existing site component tests (`detail-layout.test.ts`, `slot-assigner.test.ts`, `slot-row.test.ts`) to use `setupSitePage`.
    - [ ] 5.3.2 Migrate library piece and region tests to use `setupLibraryPage`.
    - [ ] 5.3.3 Verify all unit and E2E tests pass without visual golden regressions.

---

### Phase 6: Tabletop Sandbox Canvas (`<pbd-sandbox-pane>`)

**Goal**: Implement the live right-pane sandbox equipped with `<pb-hand-overlay>`, `<pb-action-popup>`, default `#sandbox-main-slot`, and dynamic sibling region container.
**Dependencies**: Phase 3, Phase 5.

- [ ] **6. Phase 6: Tabletop Sandbox Canvas (`<pbd-sandbox-pane>`)**
  - [ ] **6.1 Sandbox Component (`site/src/components/sandbox-pane.ts`)**
    - [ ] 6.1.1 Mount root `<pb-hand-overlay>` and `<pb-action-popup>`.
    - [ ] 6.1.2 Render empty default `<pb-slot id="sandbox-main-slot">` taking up primary canvas area.
    - [ ] 6.1.3 Render flex container for dynamic sibling regions alongside `#sandbox-main-slot`.
  - [ ] **6.2 Dynamic Component Insertion API**
    - [ ] 6.2.1 Implement piece insertion appending newly created piece DOM elements into `#sandbox-main-slot`.
    - [ ] 6.2.2 Implement region insertion appending newly created region DOM elements as siblings to `#sandbox-main-slot`.
  - [ ] **6.3 Unit & Interaction Testing**
    - [ ] 6.3.1 Test adding pieces to `#sandbox-main-slot` and regions to sibling container.

---

### Phase 7: Getting Started / Overview Page (`<pbd-page-overview>`)

**Goal**: Implement the documentation overview page providing the quick start guide, library initialization instructions, and keyboard shortcuts cheat-sheet.
**Dependencies**: Phase 5.

- [ ] **7. Phase 7: Getting Started / Overview Page (`<pbd-page-overview>`)**
  - [ ] **7.1 Overview Page Component (`site/src/pages/overview-page.ts`)**
    - [ ] 7.1.1 Document library purpose, declarative HTML philosophy, and installation/script inclusion.
    - [ ] 7.1.2 Document core concepts: hover/focus targeting, LIFO hand stack (`c`/`Space`), and action discovery (`?`).
    - [ ] 7.1.3 Render interactive keyboard shortcuts cheat-sheet `<cds-table>`.
    - [ ] 7.1.4 Provide quick links to Piece, Region, and System documentation pages.
  - [ ] **7.2 Unit Testing**
    - [ ] 7.2.1 Test `<pbd-page-overview>` rendering and shortcut table structure.

---

### Phase 8: Piece Detail Pages (`<pbd-page-d1>` through `<pbd-page-dn>`)

**Goal**: Implement dedicated documentation and interactive creator pages for all piece components.
**Dependencies**: Phase 5.

- [ ] **8. Phase 8: Piece Detail Pages (`<pbd-page-d1>` through `<pbd-page-dn>`)**
  - [ ] **8.1 Single-Faced Piece Page (`site/src/pages/piece-pages.ts`)**
    - [ ] 8.1.1 Implement `<pbd-page-d1>` (`D1`, `pb-d1`) with description, attributes table, actions table (`pick`, `rotate`), controls (`name`, `rotations`, action overrides), and `meeple` preset.
  - [ ] **8.2 Flippable & Polyhedral Piece Pages**
    - [ ] 8.2.1 Implement `<pbd-page-d2>` (`D2`, `pb-d2`, coin/token, `flip`).
    - [ ] 8.2.2 Implement `<pbd-page-d4>` (`D4`, `pb-d4`, 4 faces, `flip`).
    - [ ] 8.2.3 Implement `<pbd-page-d6>` (`D6`, `pb-d6`, 6 pip faces, `roll`, `flip`).
    - [ ] 8.2.4 Implement `<pbd-page-d8>` (`D8`, `pb-d8`, 8 faces, `roll`, `flip`).
    - [ ] 8.2.5 Implement `<pbd-page-d12>` (`D12`, `pb-d12`, 12 faces, `roll`, `flip`).
    - [ ] 8.2.6 Implement `<pbd-page-d20>` (`D20`, `pb-d20`, 20 faces, `roll`, `flip`).
  - [ ] **8.3 Custom N-Sided Piece Page**
    - [ ] 8.3.1 Implement `<pbd-page-dn>` (`DN`, `pb-dn`, dynamic face slots, `roll`, face cycling).
  - [ ] **8.4 Unit & Component Testing**
    - [ ] 8.4.1 Unit tests verifying attributes, actions, and preset assignment for all piece pages.

---

### Phase 9: Region Detail Pages (`<pbd-page-slot>` through `<pbd-page-chute>`)

**Goal**: Implement dedicated documentation and interactive creator pages for all region components.
**Dependencies**: Phase 5.

- [ ] **9. Phase 9: Region Detail Pages (`<pbd-page-slot>` through `<pbd-page-chute>`)**
  - [ ] **9.1 Slot Region Page (`site/src/pages/region-pages.ts`)**
    - [ ] 9.1.1 Implement `<pbd-page-slot>` (`Slot`, `pb-slot`, 2D drop zone, `drop`, `drop-all`).
  - [ ] **9.2 Deck Region Page**
    - [ ] 9.2.1 Implement `<pbd-page-deck>` (`Deck`, `pb-deck`, card stack, `shuffle`, `flip-all`, `pick-all`).
  - [ ] **9.3 Bag Region Page**
    - [ ] 9.3.1 Implement `<pbd-page-bag>` (`Bag`, `pb-bag`, blind draw container, `pick` random, `pick-all`).
  - [ ] **9.4 Chute Region Page**
    - [ ] 9.4.1 Implement `<pbd-page-chute>` (`Chute`, `pb-chute`, multi-layer filter, `flush`, layer configuration builder).
  - [ ] **9.5 Unit & Component Testing**
    - [ ] 9.5.1 Unit tests verifying attributes, actions, and configuration for all region pages.

---

### Phase 10: System Detail Pages (`<pbd-page-hand-overlay>`, `<pbd-page-action-popup>`)

**Goal**: Implement dedicated documentation pages for global singleton systems.
**Dependencies**: Phase 5.

- [ ] **10. Phase 10: System Detail Pages (`<pbd-page-hand-overlay>`, `<pbd-page-action-popup>`)**
  - [ ] **10.1 Hand Overlay Page (`site/src/pages/system-pages.ts`)**
    - [ ] 10.1.1 Implement `<pbd-page-hand-overlay>` (`Hand Overlay`, `pb-hand-overlay`, LIFO floating cursor stack, setup code snippet).
  - [ ] **10.2 Action Popup Page**
    - [ ] 10.2.1 Implement `<pbd-page-action-popup>` (`Action Popup`, `pb-action-popup`, action discovery `?`, setup code snippet).
  - [ ] **10.3 Unit & Component Testing**
    - [ ] 10.3.1 Unit tests verifying system page rendering and documentation tables.

---

### Phase 11: Full Integration, End-to-End Testing & Migration Cleanup

**Goal**: Integrate all application components, execute end-to-end browser test suites across all target browsers, clean up legacy prototype files, and update documentation.
**Dependencies**: Phases 6, 7, 8, 9, 10.

- [ ] **11. Phase 11: Full Integration, End-to-End Testing & Migration Cleanup**
  - [ ] **11.1 Legacy Cleanup & Migration**
    - [ ] 11.1.1 Delete legacy `examples/index.html`.
    - [ ] 11.1.2 Update `examples/README.md` and root `README.md` links pointing to `site/index.html`.
  - [ ] **11.2 End-to-End Playwright Test Suite (`e2e/site.test.ts`)**
    - [ ] 11.2.1 Test 3-pane layout, collapsible SideNav, and initial hash redirect to `#overview`.
    - [ ] 11.2.2 Test piece creator: configuring a D6 die, toggling live preview, rolling with `r`, toggling HTML view, copying markup, and clicking "Add to Sandbox" to insert into `#sandbox-main-slot`.
    - [ ] 11.2.3 Test region creator: creating a `Deck` region, verifying it appears as a sibling in the sandbox, dropping cards, and shuffling with `s`.
    - [ ] 11.2.4 Execute tests across Chromium, Firefox, and WebKit.
  - [ ] **11.3 Directory Documentation**
    - [ ] 11.3.1 Update `site/README.md` and `site/src/README.md` inventories.
    - [ ] 11.3.2 Update `docs/README.md` inventory with `bohnanza.impl.md`.

---

### Phase 12: Syntax Highlighting for Code Snippets

**Goal**: Implement theme-aware syntax highlighting for reactive HTML code snippets within `<pbd-detail-layout>` using Carbon's `--cds-syntax-*` tokens.
**Dependencies**: Phase 5, Phase 11.

- [ ] **12. Phase 12: Syntax Highlighting for Code Snippets**
  - [ ] **12.1 Tokenizer Integration**
    - [ ] 12.1.1 Select and integrate a lightweight HTML tokenizer or parser.
    - [ ] 12.1.2 Implement HTML token-to-class generator wrapping tags, attributes, strings, and punctuation.
  - [ ] **12.2 Carbon Syntax Tokens Mapping**
    - [ ] 12.2.1 Map token classes to Carbon's `--cds-syntax-*` design tokens (`--cds-syntax-tag`, `--cds-syntax-attribute-name`, `--cds-syntax-string`, `--cds-syntax-punctuation`).
    - [ ] 12.2.2 Ensure syntax styles adapt automatically across light and dark Carbon themes.
  - [ ] **12.3 Layout Integration**
    - [ ] 12.3.1 Slot tokenized HTML markup into `<cds-code-snippet type="multi">` in `<pbd-detail-layout>`.
    - [ ] 12.3.2 Preserve raw code string in copy-to-clipboard action.
  - [ ] **12.4 Unit & Visual Golden Testing**
    - [ ] 12.4.1 Unit tests verifying HTML tokenization and element tree output.
    - [ ] 12.4.2 Visual golden screenshot verification for highlighted code view.
