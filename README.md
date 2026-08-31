# Protoboard

**Protoboard** is a lightweight, declarative HTML/Web Component library for rapid prototyping of tabletop and board games in the browser.

---

## 1. Overview & Philosophy

1. **Declarative HTML First**: Games and components are expressed directly in HTML markup using custom elements (e.g. `<pb-d6>`, `<pb-slot>`, `<pb-deck>`).
2. **Physical Tabletop Sandbox**: Protoboard models physical objects and tabletop mechanics (rolling dice, picking up pieces, dropping them into regions, shuffling decks, drawing from bags) rather than enforcing rigid digital game rules. Rule enforcement is left to the players or game logic.
3. **Zero Presentation Enforcement**: Protoboard provides **no baked-in visual styling**. Developers supply standard HTML/DOM nodes (images, SVGs, text, styled `<div>` elements) inside custom element slots. Protoboard manages slot projection, active state, containment, and interaction mechanics.
4. **Hover & Keyboard-First Interaction**: Players interact with pieces and regions by hovering with the mouse cursor or focusing via keyboard/click, and pressing configurable action shortcuts (e.g. hovering a die and pressing `r` to roll).

---

## 2. Quick Start

### Installation & Loading

Protoboard is distributed as both a standalone IIFE bundle (`dist/protoboard.min.js`) and an ES module (`dist/index.mjs`).

#### Standalone Script (Drop-In `<script>`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Protoboard Game</title>
    <!-- Include Protoboard bundle -->
    <script src="dist/protoboard.min.js"></script>
    <style>
      .die {
        width: 50px;
        height: 50px;
        background: #f1c40f;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <!-- Interactive D6 Die -->
    <pb-d6>
      <div slot="face0" class="die">⚀</div>
      <div slot="face1" class="die">⚁</div>
      <div slot="face2" class="die">⚂</div>
      <div slot="face3" class="die">⚃</div>
      <div slot="face4" class="die">⚄</div>
      <div slot="face5" class="die">⚅</div>
    </pb-d6>

    <!-- Help Popup -->
    <pb-action-popup></pb-action-popup>

    <script>
      // Initialize custom elements and shared services
      Protoboard.initialize();
    </script>
  </body>
</html>
```

#### ES Module Import

```ts
import {initialize} from 'protoboard';

// Register all custom elements under standard 'pb-' prefix
initialize();
```

### Initialization Options

The `initialize()` function accepts optional configuration parameters:

```ts
initialize({
  prefix: 'pb', // Tag prefix (defaults to 'pb', e.g. <pb-d6>)
  root: document.body, // Root element for context provider (defaults to document.body)
  ignoreExisting: false, // Set to true to skip already-defined custom elements
});
```

---

## 3. Global Interaction Model

### Hover & Keyboard Routing

- **Hover**: Moving the mouse cursor over a piece or region activates hover targeting.
- **Focus**: Clicking on an element or navigating with `Tab` focuses it.
- **Bubbling Shortcuts**: When a key is pressed:
  1. The hovered piece evaluates its local actions (e.g. `r` rolls the die, `c` picks it up).
  2. If the piece does not handle that key, the action bubbles up to the parent container region (e.g. pressing `s` while hovering a card in a deck shuffles the deck).
  3. Direct hover over an empty region triggers the region's actions directly.

### Pick & Drop Lifecycle (LIFO Hand Stack)

Protoboard manages held pieces in a Last-In, First-Out (LIFO) hand stack:

1. **Pick (`c`)**: Hovering any piece and pressing `c` picks up the piece. The piece is reparented into the floating `<pb-hand-overlay>` cursor layer that follows the mouse. Picking multiple pieces stacks them in LIFO order.
2. **Drop (`Space`)**: Hovering any target region (`<pb-slot>`, `<pb-deck>`, `<pb-bag>`, `<pb-chute>`) and pressing `Space` pops the top (most recently picked) piece from the hand stack and reparents it into the region.
3. **Drop All (`Shift+Space`)**: Pressing `Shift+Space` pops all currently held pieces and drops them into the target region in sequence.

### Action Discovery Popup (`?`)

Hovering or focusing any piece or region and pressing `?` (or `Shift+/`) opens the `<pb-action-popup>`. The popup displays all available actions, custom component labels, and shortcuts. Clicking any action executes it directly. Pressing `Escape` or `?` again dismisses the popup.

---

## 4. Components Reference

### Pieces (`<pb-d1>` through `<pb-dn>`)

Pieces represent physical multi-sided objects (meeples, coins, cards, tokens, polyhedral dice).

#### Slot-Based Faces

Pieces render only the slot corresponding to their active face index:

- `face0`: First face (default initial state).
- `face1` .. `faceN`: Subsequent faces.

#### Supported Piece Components

| Tag        | Intrinsic Sides            | Use Cases                                    | Default Actions                                                                                              |
| :--------- | :------------------------- | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `<pb-d1>`  | 1                          | Meeples, static tokens, chess pieces         | `pick` (`c`), `rotate` (`t`), `help` (`?`)                                                                   |
| `<pb-d2>`  | 2                          | Coins, double-sided cards, reversible tokens | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-d4>`  | 4                          | Tetrahedral dice (d4)                        | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-d6>`  | 6                          | Standard cubic dice (d6)                     | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-d8>`  | 8                          | Octahedral dice (d8)                         | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-d12>` | 12                         | Dodecahedral dice (d12)                      | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-d20>` | 20                         | Icosahedral dice (d20)                       | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `flip` (`f`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`) |
| `<pb-dn>`  | Configurable (`sides="N"`) | Custom spinners, counters, N-sided dice      | `pick` (`c`), `rotate` (`t`), `roll` (`r`), `next-face` (`]`), `prev-face` (`[`), `help` (`?`)               |

#### Opposite Face Flipping (`flip`)

Polyhedral dice and coins automatically calculate opposite faces using `(N - 1) - currentFaceIndex`:

- `<pb-d2>`: `face0` &harr; `face1`
- `<pb-d6>`: `face0` &harr; `face5`, `face1` &harr; `face4`, `face2` &harr; `face3` (opposite sides sum to 7)
- `<pb-d20>`: `face0` &harr; `face19`, `face1` &harr; `face18`, etc. (opposite sides sum to 21)

#### Piece Rotation (`rotate`)

All pieces support rotation using `rotate` (`t`). By default, rotation cycles through `0°`, `90°`, `180°`, `270°`. Custom rotation stops can be set via `action-rotate-stops`:

```html
<!-- Custom rotation stops: 0, 180, and 270 degrees -->
<pb-d1 action-rotate-stops="0, 180, 270">
  <div slot="face0">Token</div>
</pb-d1>
```

---

### Regions

Regions are containers that hold pieces as child DOM elements.

#### `<pb-slot>` (Spatial Tabletop Placement)

`<pb-slot>` is a 2D tabletop spatial area. When a piece is dropped onto `<pb-slot>`, its coordinates are calculated relative to the slot's bounding box and positioned absolutely (`position: absolute; left: ${x}px; top: ${y}px;`).

```html
<pb-slot style="width: 600px; height: 400px; position: relative;">
  <pb-d6 style="position: absolute; left: 100px; top: 100px;">
    <!-- faces -->
  </pb-d6>
</pb-slot>
```

- **Supported Actions**: `drop` (`Space`), `drop-all` (`Shift+Space`), `help` (`?`).

#### `<pb-deck>` (Stacked Pile)

`<pb-deck>` represents a deck or discard pile. It projects and renders only the **top piece** (the last child element in DOM order). All non-top pieces are automatically hidden.

```html
<pb-deck name="Draw Deck">
  <pb-d2>
    <div slot="face0" class="card">Ace of Spades</div>
    <div slot="face1" class="card card-back"></div>
  </pb-d2>
  <pb-d2>
    <div slot="face0" class="card">King of Hearts</div>
    <div slot="face1" class="card card-back"></div>
  </pb-d2>
</pb-deck>
```

- **Drawing a Card**: Hover the exposed top piece and press `c`.
- **Supported Actions**:
  - `shuffle` (`s`): Shuffles child pieces using Fisher-Yates randomization.
  - `flip-all` (`f`): Reverses child DOM order and flips each piece to its opposite face.
  - `pick-all` (`Shift+C`): Picks all cards into the hand stack.
  - `drop` (`Space`), `drop-all` (`Shift+Space`).

#### `<pb-bag>` (Blind Draw Container)

`<pb-bag>` hides all child pieces completely.

```html
<pb-bag name="Tile Bag">
  <pb-d1><div slot="face0" class="tile">A</div></pb-d1>
  <pb-d1><div slot="face0" class="tile">B</div></pb-d1>
  <pb-d1><div slot="face0" class="tile">C</div></pb-d1>
</pb-bag>
```

- **Supported Actions**:
  - `pick` (`c`): Randomly selects one child piece and pushes it into the hand stack.
  - `pick-all` (`Shift+C`): Pops all pieces into the hand stack.
  - `drop` (`Space`), `drop-all` (`Shift+Space`).

#### `<pb-chute>` & `<pb-chute-layer>` (Probabilistic Dice Tower / Drop Sink)

`<pb-chute>` simulates probabilistic drop mechanics (e.g. dice towers, obstacle chutes, discard sinks). Contained pieces are hidden. Dropped pieces evaluate each child `<pb-chute-layer>` chance `[0, 1)`. If all layers pass, the piece exits and is reparented into the `target` region. If any layer fails, the piece remains trapped in the chute.

```html
<!-- Dice tower linked to tabletop slot -->
<pb-chute target="#tabletop">
  <pb-chute-layer slot="layer" layer="1" chance="0.8"></pb-chute-layer>
  <pb-chute-layer slot="layer" layer="2" chance="0.6"></pb-chute-layer>
</pb-chute>

<pb-slot id="tabletop" style="width: 500px; height: 300px; position: relative;">
</pb-slot>
```

- **Supported Actions**:
  - `flush` (`f`): Evacuates all currently trapped pieces across all layers to the linked target region.
  - `drop` (`Space`), `drop-all` (`Shift+Space`).

---

## 5. Declarative Customization & Attribute Syntax

### Action Shortcut Binding (`action-[actionName]`)

Custom shortcuts can be bound to any action via HTML attributes:

```html
<!-- Roll bound to 'o', flip disabled -->
<pb-d6 action-roll="o" action-flip="">
  <!-- faces -->
</pb-d6>
```

- `action-[actionName]="[key]"`: Binds key `[key]` (supports modifier keys like `Shift+P`).
- `action-[actionName]=""`: Disables keyboard triggering for that action.

### Custom Component Naming (`name`)

The `name` attribute sets a human-readable display label in action discovery popups:

```html
<pb-d6 name="Damage Die"></pb-d6> <pb-deck name="Encounter Deck"></pb-deck>
```

---

## 6. Default Keybindings Matrix

| Component              | Action      | Default Shortcut | Attribute          | Description                                                    |
| :--------------------- | :---------- | :--------------- | :----------------- | :------------------------------------------------------------- |
| **All Elements**       | `help`      | `?`              | `action-help`      | Dispatches action discovery event to open `<pb-action-popup>`. |
| **All Pieces**         | `pick`      | `c`              | `action-pick`      | Adds piece to cursor's held stack (LIFO).                      |
|                        | `rotate`    | `t`              | `action-rotate`    | Rotates piece to next angle stop.                              |
| **Multi-Sided Pieces** | `roll`      | `r`              | `action-roll`      | Randomizes active face (`0` to `N-1`).                         |
|                        | `next-face` | `]`              | `action-next-face` | Advances to `(current + 1) % N`.                               |
|                        | `prev-face` | `[`              | `action-prev-face` | Steps back to `(current - 1 + N) % N`.                         |
| **Flippable Pieces**   | `flip`      | `f`              | `action-flip`      | Flips to opposite face: `(N - 1) - current`.                   |
| **All Regions**        | `drop`      | `Space`          | `action-drop`      | Drops top held piece into this region.                         |
|                        | `drop-all`  | `Shift+Space`    | `action-drop-all`  | Drops all held pieces into this region.                        |
| **`<pb-deck>`**        | `shuffle`   | `s`              | `action-shuffle`   | Randomizes child DOM node order.                               |
|                        | `flip-all`  | `f`              | `action-flip-all`  | Inverts child DOM order and flips all pieces.                  |
|                        | `pick-all`  | `Shift+C`        | `action-pick-all`  | Picks all cards into hand stack.                               |
| **`<pb-bag>`**         | `pick`      | `c`              | `action-pick`      | Randomly picks one piece from the bag.                         |
|                        | `pick-all`  | `Shift+C`        | `action-pick-all`  | Picks all pieces from the bag into hand stack.                 |
| **`<pb-chute>`**       | `flush`     | `f`              | `action-flush`     | Evacuates all trapped pieces to target region.                 |

---

## 7. Technical API Reference

### Initialization & Options

```ts
export interface InitOptions {
  readonly ignoreExisting?: boolean;
  readonly prefix?: string;
  readonly root?: HTMLElement;
}

export function initialize(options?: InitOptions): void;
```

### Component Hierarchy

- **`BaseElement`** (extends `SignalWatcher(LitElement)`): Reactive base element handling hover/focus listeners, context consumption, action registration, and event dispatching.
- **`BasePiece`** (extends `BaseElement`): Abstract multi-sided piece managing `activeFace` signal, intrinsic `sides`, and slot rendering.
- **Piece Classes**: `D1`, `D2`, `D4`, `D6`, `D8`, `D12`, `D20`, `DN`.
- **`BaseRegion`** (extends `BaseElement`): Abstract container managing `drop` and `dropAll`.
- **Region Classes**: `Slot`, `Deck`, `Bag`, `Chute`, `ChuteLayer`.
- **UI Components**: `ActionPopup`, `HandOverlay`.

### Action Classes (`src/action/`)

All actions inherit from `BaseAction`:

- `DropAction`, `DropAllAction`: Region drop handlers.
- `FlipAction`, `FlipAllAction`: Opposite face and deck inversion.
- `FlushAction`: Chute trapped piece evacuation.
- `HelpAction`: Action discovery popup dispatcher.
- `NextFaceAction`, `PrevFaceAction`: Face stepping.
- `PickAction`, `PickAllAction`, `PickRandomAction`: Hand stack pickup.
- `RollAction`: Random face assignment.
- `RotateAction`: Angle cycling.
- `ShuffleAction`: Child node randomization.

### Services & Events

- **`HandService`**: Shared LIFO stack manager for held pieces (`push`, `pop`, `popAll`, `peek`, `isEmpty`, `clear`, `pieces`).
- **`handServiceContext`**: `@lit/context` identifier (`pb-hand-service`).
- **`ActionEvent`**: Bubbling event dispatched on active element when key matches action shortcut.
- **`QueryActionsEvent`**: Bubbling event (`pb-query-actions`) dispatched on `?` key to collect action descriptors.

---

## 8. Directory Inventory

- [`AGENTS.md`](./AGENTS.md): Project-level guidelines, testing conventions, and architectural standards for Antigravity agents.
- [`.eslintrc.yml`](./.eslintrc.yml): ESLint linter configuration extending `devbase/ts/.eslintrc.yml` with local build output ignore rules.
- [`.gitignore`](./.gitignore): Git ignore rules for node_modules, build outputs, and local artifacts.
- [`.prettierignore`](./.prettierignore): Prettier ignore rules symlinked from `devbase/ts/.prettierignore`.
- [`.prettierrc.yml`](./.prettierrc.yml): Prettier code formatting configuration symlinked from `devbase/ts/.prettierrc.yml`.
- [`package-lock.json`](./package-lock.json): Automatically generated lockfile defining the resolved dependency tree.
- [`package.json`](./package.json): Package metadata, dependency declarations, and script definitions for the Protoboard library.
- [`playwright.config.ts`](./playwright.config.ts): Playwright test runner configuration for cross-browser component testing and visual snapshots across Chromium, Firefox, and WebKit.
- [`rollup.config.mjs`](./rollup.config.mjs): Rollup bundler configuration generating the standalone minified IIFE bundle and ESM module.
- [`tsconfig.json`](./tsconfig.json): TypeScript compiler configuration tailored for modern web component development.
- [`typedef.d.ts`](./typedef.d.ts): Global TypeScript definitions extending `Window` with `Protoboard`.
