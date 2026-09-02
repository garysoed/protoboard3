# Protoboard Example App Design Document (`bohnanza.md`)

## 1. Overview & Philosophy

The **Protoboard Example App** (code-named **Bohnanza**) is an interactive, comprehensive documentation explorer and visual sandbox for the Protoboard library. It serves as both the official GitHub Pages deployment (`site/`) and a hands-on playground where developers can discover components, customize piece and region configurations, inspect real-time HTML snippets, and interact directly with physical tabletop mechanics.

### Key Objectives

1. **Live Documentation Explorer**: Provide an exhaustive reference for every Protoboard piece (`D1` through `DN`), region (`Slot`, `Deck`, `Bag`, `Chute`), and system element (`Hand Overlay`, `Action Popup`), complete with supported attributes, default actions, and usage notes.
2. **Interactive Component Creator**: Allow developers to interactively customize component attributes (e.g. `rotations`, action keybindings) and compose multi-faced pieces using built-in visual presets (dice pips, cards, meeples, colored tokens, game symbols).
3. **Dual-View Preview & Real-Time Code Generation**: Provide a preview toggle in the component creator allowing users to switch between an interactive Live Component Preview and production-ready HTML markup with syntax highlighting and one-click copy support.
4. **Live Tabletop Sandbox**: Provide an active tabletop canvas containing a default spatial slot and supporting dynamic region additions, enabling immediate tactile experimentation with hover shortcuts, LIFO hand pick/drop, dice rolling, card flipping, deck shuffling, and chute flushes.
5. **Real-World Consumer Integration**: Built as a standalone TypeScript web application consuming the production `dist/protoboard.min.js` bundle, demonstrating realistic external library integration.

---

## 2. Technology Stack & Architecture

### Core Technologies

- **UI Framework**: [IBM Carbon Web Components](https://web-components.carbondesignsystem.com/) (`@carbon/web-components`) for UI shell, navigation, forms, buttons, content switchers, tables (`<cds-table>`), code snippets, and layout widgets.
- **Language**: TypeScript (strict typing, ES modules).
- **Core Library Consumer**: Direct consumption of `dist/protoboard.min.js` (IIFE bundle exposed via `window.Protoboard`) without internal source coupling.
- **Component Prefix**: Documentation UI components use the **`pbd-`** prefix (Protoboard Documentation, e.g. `<pbd-detail-layout>`, `<pbd-slot-assigner>`), cleanly distinguishing documentation UI elements from library pieces (`pb-`) and Carbon controls (`cds-`).
- **Styling**: Carbon CSS foundations (`@carbon/styles`), component-specific styling via dedicated CSS files, and scoped CSS Shadow Parts (`::part()`).
- **Build Tooling**: [Rollup](https://rollupjs.org/) for bundling the `site/` application source into a static, deployable GitHub Pages asset bundle.
- **Deployment Target**: Served directly from the `site/` directory for GitHub Pages hosting.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          IBM Carbon UI Shell                           │
├─────────────────┬───────────────────────────────┬──────────────────────┤
│    Left Pane    │          Middle Pane          │      Right Pane      │
│(<cds-side-nav>) │       (#middle-pane)          │  (<pbd-sandbox-pane>)│
│                 │                               │                      │
│ • Overview (*)  │ Active Mounted Page:          │ • <pb-hand-overlay>  │
│ • Pieces        │ • <pbd-page-overview>         │ • <pb-action-popup>  │
│   - D1..D20     │ • <pbd-page-d1..dn>           │ • Empty Default      │
│   - DN          │ • <pbd-page-slot..chute>      │   <pb-slot>          │
│ • Regions       │ • <pbd-page-hand-overlay..    │ • Dynamic Sibling    │
│   - Slot        │    action-popup>              │   Regions (decks,    │
│   - Deck        │                               │   bags, chutes,      │
│   - Bag         │ (Detail pages use             │   slots)             │
│   - Chute       │  <pbd-detail-layout>)         │                      │
│ • System        │                               │                      │
│   - Hand Overlay│                               │                      │
│   - Action Popup│                               │                      │
└─────────────────┴───────────────────────────────┴──────────────────────┘
(*) Selected by default on initial load
```

---

## 3. Application Layout & 3-Pane Structure

The application is structured into a 3-pane responsive desktop layout framed by an IBM Carbon UI Shell header.

### 3.1 Carbon UI Shell Header

- **Header Component**: `<cds-header>` with `<cds-header-name prefix="Protoboard">Explorer</cds-header-name>`.
- **Navigation Toggle**: `<cds-header-menu-button>` controlling the collapsible left navigation bar.
- **Global Actions**:
  - Link to GitHub Repository (icon button).
  - Version indicator / badge.

### 3.2 Left Pane: Collapsible Navigation (`<cds-side-nav>`)

The left sidebar organizes all available documentation pages using native IBM Carbon side-navigation components (`<cds-side-nav>`, `<cds-side-nav-items>`, `<cds-side-nav-menu>`, `<cds-side-nav-link>`). Component display names and link labels are clean human-readable names without the `pb-` prefix.

#### Section Hierarchy & Link Mapping

1. **Getting Started**:
   - `Overview` (`#overview`, selected by default): Quick start guide, installation, core concepts (declarative HTML, zero presentation enforcement, hover/focus, LIFO hand stack).
2. **Pieces**:
   - `D1` (`#d1`): Single-faced piece (meeples, tokens, chess pieces).
   - `D2` (`#d2`): 2-faced piece (coins, double-sided cards).
   - `D4` (`#d4`): 4-faced polyhedral die / tetrahedral piece.
   - `D6` (`#d6`): 6-faced standard die / cubic piece.
   - `D8` (`#d8`): 8-faced polyhedral die / octahedral piece.
   - `D12` (`#d12`): 12-faced polyhedral die / dodecahedral piece.
   - `D20` (`#d20`): 20-faced polyhedral die / icosahedral piece.
   - `DN` (`#dn`): N-sided custom piece (arbitrary slot count).
3. **Regions**:
   - `Slot` (`#slot`): 2D spatial drop zone with coordinate positioning.
   - `Deck` (`#deck`): Stacked card pile with shuffle, flip-all, and LIFO ordering.
   - `Bag` (`#bag`): Blind draw bag with random draw and piece hiding.
   - `Chute` (`#chute`): Multi-layer piece router with filter criteria and auto-drop.
4. **System**:
   - `Hand Overlay` (`#hand-overlay`): Floating LIFO cursor stack overlay.
   - `Action Popup` (`#action-popup`): Universal action discovery menu (`?`).

#### 3.2.1 Client-Side Router & Hash Navigation

The application uses client-side hash routing (`router.ts`) to manage page transitions without full page reloads:

- **Route Mapping**: Maps clean URL hash strings (`#overview`, `#d1` through `#dn`, `#slot`, `#deck`, `#bag`, `#chute`, `#hand-overlay`, `#action-popup`) to corresponding page custom element tag names (`pbd-page-overview`, `pbd-page-d1`, etc.).
- **Routing Lifecycle & Redirect Fallback**:
  - On initial page load and on `window.location.hash` changes (`hashchange` event):
    - Reads the current hash:
      - If the hash is empty, missing, or unrecognized in the route map, the router performs an **explicit redirect** by setting `window.location.hash = '#overview'`. This updates the browser address bar and routes directly to `#overview`.
      - If the hash is valid, resolves the target tag name and mounts a new instance of the page custom element into `#middle-pane`.
    - Synchronizes the active state across all `<cds-side-nav-link>` elements, setting `active="true"` on the matching link and clearing it from others, while ensuring any parent `<cds-side-nav-menu>` is expanded.

---

### 3.3 Middle Pane: Component Documentation & Page Architecture

Each documentation page is implemented as its own dedicated custom element (e.g. `<pbd-page-overview>`, `<pbd-page-d1>`, `<pbd-page-d6>`, `<pbd-page-slot>`, `<pbd-page-deck>`, `<pbd-page-chute>`, `<pbd-page-hand-overlay>`, `<pbd-page-action-popup>`).

To ensure layout and styling consistency, all detail pages (Pieces, Regions, and System elements) utilize a shared layout component: `<pbd-detail-layout>`.

#### 3.3.1 Common Detail Layout Component (`<pbd-detail-layout>`)

`<pbd-detail-layout>` standardizes the structure of component documentation and creator workflows using a pure declarative slot-based architecture:

##### API Contract

- **Attributes**:
  - `tag: string`: Custom element tag name being documented (e.g. `"pb-d6"`).
  - `title: string`: Clean display title without prefix (e.g. `"D6"`).
- **Slots**:
  - `<slot name="description">`: Rich semantic description of the component and its tabletop analogue.
  - `<slot name="attributes">`: Rendered `<cds-table>` of supported HTML attributes.
  - `<slot name="actions">`: Rendered `<cds-table>` of supported actions and keybindings.
  - `<slot name="controls">`: Attribute configuration form fields (optional, omitted on system pages).
  - `<slot name="slot-assigner">`: Face preset slot assigner (optional, housing `<pbd-slot-assigner>` for piece pages).

##### Table Generation Utility (`table-utils.ts`)

To ensure absolute visual and markup consistency across all documentation pages, all tables strictly use IBM Carbon's `<cds-table>` Web Component family (`<cds-table>`, `<cds-table-head>`, `<cds-table-header-cell>`, `<cds-table-body>`, `<cds-table-row>`, `<cds-table-cell>`).

Dedicated generator functions in `table-utils.ts` construct these tables:

- `renderAttributesTable(attributes: readonly AttributeDescriptor[])`: Accepts a list of attribute descriptors (`name`, `type`, `default`, `description`) and returns a structured `<cds-table>` element/template with columns: `Attribute`, `Type`, `Default`, `Description`.
- `renderActionsTable(actions: readonly ActionDescriptor[])`: Accepts a list of action descriptors (`id`, `label`, `defaultKey`, `description`) and returns a structured `<cds-table>` element/template with columns: `Action`, `Default Key`, `Description`.

Each page component calls these generator functions and projects the resulting tables into `slot="attributes"` and `slot="actions"`.

##### Structural Layout

```
┌───────────────────────────────────────────────────────────┐
│ <pbd-detail-layout title="D6" tag="pb-d6">                │
│                                                           │
│ 1. Documentation Header & Tables                          │
│    • Title & Tag Badge                                    │
│    • <slot name="description">                            │
│    • <slot name="attributes"> (<cds-table> via helper)    │
│    • <slot name="actions"> (<cds-table> via helper)       │
│                                                           │
│ 2. Configuration & Slot Assignment (Optional)             │
│    • <slot name="controls"> (Attribute form inputs)       │
│    • <slot name="slot-assigner"> (<pbd-slot-assigner>)    │
│                                                           │
│ 3. Dual-View Preview & Sandbox Action (Optional)          │
│    • <cds-content-switcher> [Live Component | HTML View]  │
│    • Preview Container:                                   │
│        - [Live View]: Rendered, interactive component     │
│        - [HTML View]: <cds-code-snippet> + Copy Button    │
│    • <cds-button kind="primary">Add to Sandbox</cds-button│
└───────────────────────────────────────────────────────────┘
```

#### 3.3.2 Generated HTML Code Display & Copy Button

For interactive piece and region pages, the bottom section of `<pbd-detail-layout>` provides an interactive preview area with a dual-view toggle:

- **Dual-View Switcher**: An IBM Carbon `<cds-content-switcher>` allows switching between:
  1. **Live Component View**: Renders the actual interactive Protoboard piece or region in place.
  2. **HTML Code View**: Displays the exact production-ready HTML markup corresponding to the component as configured.
- **Code Display Component**: Uses IBM Carbon's `<cds-code-snippet type="multi">`.
- **Live Reactive Generation**: The generated HTML string updates in real time as the user modifies attribute inputs (e.g. `name`, `rotations`, action shortcut overrides) or alters face presets in `<pbd-slot-assigner>`.
- **Syntax Highlighting**: Tokenized markup highlights HTML tags, attribute names, string values, and slot names using Carbon theme token colors.
- **Copy to Clipboard**: Leverages the built-in copy button on `<cds-code-snippet>` with animated tooltip confirmation ("Copied to clipboard!").

#### 3.3.3 Common Slot Assigner Component (`<pbd-slot-assigner>`)

For piece components, `<pbd-slot-assigner>` provides a dedicated, reusable sub-component for managing face slot assignments:

- Displays slots corresponding to the piece's faces (`slot="face0"`, `slot="face1"`, ..., `slot="faceN-1"`).
- For `<pb-dn>`, provides controls to dynamically increment or decrement the number of face slots.
- For each face slot, provides a visual preset picker allowing the user to select from the 20 built-in face presets.
- Renders an immediate 64×64 px thumbnail preview of the currently selected preset for each slot.

#### 3.3.4 Piece & Region Component Pages

1. **Piece Pages (`D1` through `DN`)**:
   - Use `<pbd-detail-layout>`.
   - Configure attributes (`name`, `rotations`, custom `action-*` shortcut overrides).
   - Configure face slots using `<pbd-slot-assigner>` in `slot="slot-assigner"`.
   - Dual-view preview at the bottom (interactive rendered piece vs generated HTML).
   - "Add to Sandbox" button instantiates the piece DOM element and appends it into the right pane's default `#sandbox-main-slot`.
2. **Region Pages (`Slot`, `Deck`, `Bag`, `Chute`)**:
   - Use `<pbd-detail-layout>`.
   - Configure attributes (`name`, custom `action-*` shortcut overrides, chute layer filters and targets).
   - Dual-view preview at the bottom (interactive rendered region vs generated HTML).
   - "Add to Sandbox" button instantiates the region DOM element and appends it to the right pane's sandbox container as a sibling to `#sandbox-main-slot`.

#### 3.3.5 System Component Pages (`Hand Overlay`, `Action Popup`)

System component pages describe global singletons and also use `<pbd-detail-layout>`, omitting the creator controls and "Add to Sandbox" section:

- Detailed explanation of service contexts (`heldStackContext`, `QueryActionsEvent`) in `slot="description"`.
- Attributes and configuration `<cds-table>` in `slot="attributes"`.
- Guidance on document-level placement (e.g. mounting once at the application root).
- Recommended HTML and TypeScript setup snippets with `<cds-code-snippet>` copy support.

#### 3.3.6 Overview Page (`<pbd-page-overview>`)

- Comprehensive getting-started guide: script inclusion, `Protoboard.initialize()`, basic markup structure.
- Interactive keyboard shortcuts reference cheat-sheet.
- Quick links to each piece, region, and system component section.

---

### 3.4 Right Pane: Interactive Tabletop Sandbox (`<pbd-sandbox-pane>`)

The right pane provides a live, persistent sandbox canvas where developers can test physical interactions.

#### Sandbox Architecture

1. **System Singletons**:
   - Includes `<pb-hand-overlay>` mounted at the sandbox root to display floating held pieces following cursor coordinates.
   - Includes `<pb-action-popup>` mounted at the sandbox root to display contextual action menus when pressing `?`.
2. **Initial Canvas State**:
   - Contains a large default `<pb-slot id="sandbox-main-slot">` taking up the primary canvas area.
   - Starts **empty** (no pre-populated dummy pieces), ready for the user to add components from the middle pane.
3. **Dynamic Additions**:
   - Created **Pieces** (from piece pages) are appended into `#sandbox-main-slot`.
   - Created **Regions** (`pb-deck`, `pb-bag`, `pb-chute`, additional `pb-slot`) are appended into the sandbox container as siblings to `#sandbox-main-slot` in a responsive flex layout.
4. **Tabletop Interactivity**:
   - Standard Protoboard hover targeting and keyboard shortcuts function immediately in the sandbox.
   - Pick pieces with `c`, drop into slots/regions with `Space` (or `Shift+Space` for drop-all).
   - Roll dice with `r`, flip coins with `f`, rotate tokens with `t`, cycle faces with `]` / `[`.
   - Shuffle decks with `s`, draw from bags with `c`, flush chutes with `f`.
   - Press `?` on any element to trigger the Action Discovery popup.

---

## 4. Built-in Face Presets Library

The example app provides a library of **20 built-in visual face presets**. Every preset is standardized to exactly **64 × 64 pixels** using clean inline SVG templates.

### Preset Catalog

| ID              | Name           | Category | Dimensions | Visual Description                             |
| :-------------- | :------------- | :------- | :--------- | :--------------------------------------------- |
| `pip-1`         | Pip 1          | Dice     | 64 × 64 px | White die face with 1 center black pip         |
| `pip-2`         | Pip 2          | Dice     | 64 × 64 px | White die face with 2 diagonal pips            |
| `pip-3`         | Pip 3          | Dice     | 64 × 64 px | White die face with 3 diagonal pips            |
| `pip-4`         | Pip 4          | Dice     | 64 × 64 px | White die face with 4 corner pips              |
| `pip-5`         | Pip 5          | Dice     | 64 × 64 px | White die face with 4 corner + 1 center pip    |
| `pip-6`         | Pip 6          | Dice     | 64 × 64 px | White die face with 6 pips (2 columns of 3)    |
| `card-spade`    | Spade          | Cards    | 64 × 64 px | Playing card face with black ♠ suit symbol     |
| `card-heart`    | Heart          | Cards    | 64 × 64 px | Playing card face with red ♥ suit symbol       |
| `card-diamond`  | Diamond        | Cards    | 64 × 64 px | Playing card face with red ♦ suit symbol       |
| `card-club`     | Club           | Cards    | 64 × 64 px | Playing card face with black ♣ suit symbol     |
| `card-joker`    | Joker          | Cards    | 64 × 64 px | Card face with purple Joker star/jester symbol |
| `meeple`        | Meeple         | Tokens   | 64 × 64 px | Classic boardgame meeple silhouette            |
| `circle-red`    | Red Token      | Tokens   | 64 × 64 px | Crimson circular token with border bevel       |
| `circle-yellow` | Yellow Token   | Tokens   | 64 × 64 px | Amber/gold circular token with border bevel    |
| `circle-green`  | Green Token    | Tokens   | 64 × 64 px | Emerald circular token with border bevel       |
| `circle-blue`   | Blue Token     | Tokens   | 64 × 64 px | Sapphire circular token with border bevel      |
| `symbol-arrow`  | Arrow          | Symbols  | 64 × 64 px | Directional pointer arrow (for rotation demo)  |
| `symbol-sword`  | Crossed Swords | Symbols  | 64 × 64 px | Crossed combat swords icon                     |
| `symbol-shield` | Shield         | Symbols  | 64 × 64 px | Defensive knight shield icon                   |
| `symbol-star`   | Gold Star      | Symbols  | 64 × 64 px | Victory point / gold star icon                 |

---

## 5. Component Catalog & Attributes Reference

Each dedicated page component documents its specific attributes, supported actions, and default slot presets:

- **`D1` (`pb-d1`)**:
  - Category: `piece`, sides: `1`
  - Attributes: `name`, `rotations`, `action-pick`, `action-rotate`, `action-help`
  - Actions: `pick` (`c`), `rotate` (`t`), `help` (`?`)
  - Default preset: `['meeple']`
- **`D2` (`pb-d2`)**:
  - Category: `piece`, sides: `2`
  - Attributes: `name`, `rotations`, `action-pick`, `action-roll`, `action-flip`, `action-next-face`, `action-prev-face`, `action-rotate`, `action-help`
  - Actions: `pick` (`c`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `rotate` (`t`), `help` (`?`)
  - Default presets: `['circle-red', 'circle-blue']`
- **`D4` (`pb-d4`)**:
  - Category: `piece`, sides: `4`
  - Attributes: `name`, `rotations`, `action-pick`, `action-roll`, `action-flip`, `action-next-face`, `action-prev-face`, `action-rotate`, `action-help`
  - Actions: `pick` (`c`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `rotate` (`t`), `help` (`?`)
  - Default presets: `['card-spade', 'card-heart', 'card-diamond', 'card-club']`
- **`D6` (`pb-d6`)**:
  - Category: `piece`, sides: `6`
  - Attributes: `name`, `rotations`, `action-pick`, `action-roll`, `action-flip`, `action-next-face`, `action-prev-face`, `action-rotate`, `action-help`
  - Actions: `pick` (`c`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `rotate` (`t`), `help` (`?`)
  - Default presets: `['pip-1', 'pip-2', 'pip-3', 'pip-4', 'pip-5', 'pip-6']`
- **`D8` (`pb-d8`)**, **`D12` (`pb-d12`)**, **`D20` (`pb-d20`)**:
  - Category: `piece`, sides: `8`, `12`, `20`
  - Attributes: Same as `D6`
  - Actions: Same as `D6`
- **`DN` (`pb-dn`)**:
  - Category: `piece`, sides: dynamic (user configured via `<pbd-slot-assigner>`)
  - Attributes: Same as `D6` (without `flip` action)
  - Actions: `pick` (`c`), `roll` (`r`), `next-face` (`]`), `prev-face` (`[`), `rotate` (`t`), `help` (`?`)
- **`Slot` (`pb-slot`)**:
  - Category: `region`
  - Attributes: `name`, `action-drop`, `action-drop-all`, `action-help`
  - Actions: `drop` (`Space`), `drop-all` (`Shift+Space`), `help` (`?`)
- **`Deck` (`pb-deck`)**:
  - Category: `region`
  - Attributes: `name`, `action-drop`, `action-drop-all`, `action-shuffle`, `action-flip-all`, `action-pick-all`, `action-help`
  - Actions: `drop` (`Space`), `drop-all` (`Shift+Space`), `shuffle` (`s`), `flip-all` (`f`), `pick-all` (`Shift+C`), `help` (`?`)
- **`Bag` (`pb-bag`)**:
  - Category: `region`
  - Attributes: `name`, `action-drop`, `action-drop-all`, `action-pick`, `action-pick-all`, `action-help`
  - Actions: `drop` (`Space`), `drop-all` (`Shift+Space`), `pick` (`c`), `pick-all` (`Shift+C`), `help` (`?`)
- **`Chute` (`pb-chute`)**:
  - Category: `region`
  - Attributes: `name`, `action-drop`, `action-drop-all`, `action-flush`, `action-help`
  - Actions: `drop` (`Space`), `drop-all` (`Shift+Space`), `flush` (`f`), `help` (`?`)
- **`Hand Overlay` (`pb-hand-overlay`)** & **`Action Popup` (`pb-action-popup`)**:
  - Category: `system`
  - Attributes: Standard HTML global attributes

---

## 6. Directory Structure & Build Pipeline

### Directory Layout

```
protoboard/
├── site/
│   ├── index.html                  # GitHub Pages entry point
│   ├── styles.css                  # Main application layout styles
│   ├── src/
│   │   ├── main.ts                 # Application bootstrapper & initialization
│   │   ├── router.ts               # Hash-based client router (redirect fallback: #overview)
│   │   ├── presets.ts              # 20 SVG face preset generators (64×64 px)
│   │   ├── table-utils.ts          # Generator functions for <cds-table>
│   │   ├── components/
│   │   │   ├── detail-layout.ts    # Common detail layout (<pbd-detail-layout>)
│   │   │   ├── slot-assigner.ts    # Common slot assigner (<pbd-slot-assigner>)
│   │   │   ├── code-snippet.ts     # Live syntax-highlighted HTML generator (<pbd-code-snippet>)
│   │   │   └── sandbox-pane.ts     # Right tabletop canvas manager (<pbd-sandbox-pane>)
│   │   ├── pages/
│   │   │   ├── overview-page.ts    # Getting started page (<pbd-page-overview>)
│   │   │   ├── piece-pages.ts      # Dedicated pages for D1 through DN
│   │   │   ├── region-pages.ts     # Dedicated pages for Slot, Deck, Bag, Chute
│   │   │   └── system-pages.ts     # Dedicated pages for Hand Overlay and Action Popup
│   │   └── README.md
│   ├── dist/
│   │   ├── site.min.js             # Compiled standalone site bundle
│   │   └── site.min.js.map
│   └── README.md
├── dist/
│   ├── protoboard.min.js           # Production Protoboard bundle
│   └── index.mjs
```

### Build & Bundling Process

1. **Protoboard Build**: `npm run build` generates `dist/protoboard.min.js`.
2. **Site Rollup Build**: A dedicated Rollup target builds `site/src/main.ts` into `site/dist/site.min.js`.
3. **HTML Entrypoint (`site/index.html`)**: Serves Carbon Plex fonts and stylesheets, loads `dist/protoboard.min.js`, and mounts the site module bundle.

---

## 7. Migration & Deprecation

1. **Delete `examples/index.html`**: Remove the legacy prototype showcase file.
2. **Update Documentation**: Point all interactive documentation and demo links in `README.md` directly to `site/index.html` / GitHub Pages URL.
3. **NPM Scripts**:
   - Add `npm run build:site`: Compiles the `site/` application.
   - Update `npm run build`: Compiles Protoboard core followed by the site bundle.

---

## 8. Verification Strategy

1. **Unit & Component Tests**:
   - Verify face presets generate valid, well-formed 64×64 px SVGs.
   - Verify table utility generator functions produce valid `<cds-table>` structures with proper headers and cells.
   - Verify `<pbd-slot-assigner>` correctly assigns presets to face slots and manages dynamic slot counts for `DN`.
   - Verify `<pbd-detail-layout>` switcher toggles between Live Component View and HTML View.
2. **End-to-End (E2E) Browser Tests**:
   - Validate 3-pane layout, collapsible sidebar, and router redirect to `#overview` on initial load or empty/invalid hash.
   - Verify component creation: customizing a D6 die with custom presets in `<pbd-detail-layout>`, switching to Live View to roll with `r`, switching to HTML View to verify generated markup, and clicking "Add to Sandbox" to verify insertion into `#sandbox-main-slot`.
   - Verify region creation: adding a `Deck` region to the sandbox, dropping cards, and shuffling with `s`.
   - Cross-browser verification across Chromium, Firefox, and WebKit.
