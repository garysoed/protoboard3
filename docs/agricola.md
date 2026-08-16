# Protoboard Design Document

## 1. Overview & Philosophy

**Protoboard** is a lightweight, declarative HTML/Web Component library for rapid prototyping of tabletop and board games in the browser.

### Key Principles

1. **Declarative HTML First**: Games are expressed as standard HTML markup using custom elements (e.g., `<pb-d6>`, `<pb-slot>`, `<pb-deck>`).
2. **Physical Tabletop Sandbox**: Protoboard models physical objects and tabletop interactions (rolling dice, picking up pieces, dropping them into regions, shuffling decks, drawing from bags) rather than enforcing rigid digital game rules. Rule enforcement and game flow are left to the players or the developer's game logic.
3. **Zero Presentation Enforcement**: The library provides **no baked-in visual styling**. Developers provide standard HTML/DOM nodes (images, text, SVGs, buttons) inside custom element slots. Protoboard only manages slot visibility, active state, containment, and interaction mechanics.
4. **Hover & Keyboard-First Interaction**: Players interact with pieces and regions by hovering with the mouse cursor or focusing via keyboard/click, and pressing configurable action shortcuts (e.g., hovering a die and pressing `r` to roll).

---

## 2. Core Architecture & Tech Stack

### Technology Stack

- **Language**: TypeScript
- **Web Component Framework**: [Lit](https://lit.dev/) (`LitElement`)
- **Dependency Injection**: [`grapevine`](https://github.com/garysoed/grapevine) (`Vine`, `Source`, `source`)
- **Encapsulation**: Shadow DOM with `<slot>` projections, styled via CSS Shadow Parts (`::part()`) and CSS Custom Properties (`--pb-*`).
- **Distribution**: Standalone script bundle (IIFE/UMD and ESM) consumable via a single `<script>` tag.
- **Prefixing**: Default tag prefix is `pb-` (e.g., `pb-d6`, `pb-slot`).
- **Code Formatting & Linting**: ESLint and Prettier configurations are sourced from [`garysoed/devbase`](https://github.com/garysoed/devbase).

### Registration API & Dependency Injection

To avoid side-effect imports and state leaks across tests, components are registered explicitly via a registration function that accepts a Grapevine `Vine` context:

```html
<script src="protoboard.min.js"></script>
<script>
  Protoboard.registerProtoboard({
    prefix: 'pb', // Optional custom prefix, defaults to 'pb'
  });
</script>
```

#### Dynamic Registration Implementation

Component classes extend `LitElement` without the `@customElement` decorator, keeping them tag-name agnostic and free of module-level side-effects. Duplicate registration check is configurable via the `ignoreExisting` flag (defaulting to strict `false` in production, and enabled as `true` in test fixtures):

```ts
import {Vine} from 'grapevine';

export class D6Piece extends LitElement {
  /* ... */
}
export class SlotRegion extends LitElement {
  /* ... */
}

export interface RegisterOptions {
  prefix?: string;
  vine?: Vine;
  /**
   * When true, skips defining tags that already exist in customElements.
   * Useful for test suites where registration may run repeatedly. Defaults to false.
   */
  ignoreExisting?: boolean;
}

export function registerProtoboard(options: RegisterOptions = {}): void {
  const prefix = options.prefix || 'pb';
  const ignoreExisting = options.ignoreExisting ?? false;
  const definitions: Record<string, CustomElementConstructor> = {
    d1: D1Piece,
    d2: D2Piece,
    d4: D4Piece,
    d6: D6Piece,
    d8: D8Piece,
    d12: D12Piece,
    d20: D20Piece,
    dn: DNPiece,
    slot: SlotRegion,
    deck: DeckRegion,
    bag: BagRegion,
    chute: ChuteRegion,
    'chute-layer': ChuteLayerElement,
    'action-popup': ActionPopupElement,
  };

  for (const [tag, elementClass] of Object.entries(definitions)) {
    const tagName = `${prefix}-${tag}`;
    if (ignoreExisting && customElements.get(tagName)) {
      continue;
    }
    customElements.define(tagName, elementClass);
  }
}
```

---

## 3. Global Input, Interaction & State Model

### Hover vs. Focus

- **Hover**: Moving the mouse cursor over a piece or region activates hover targeting (`mouseenter` / `mouseleave`).
- **Focus**: Clicking on an element or navigating with keyboard `Tab` sets active DOM focus (`focus` / `blur`).

### Hierarchical Action & Keypress Routing

When a keyboard shortcut is pressed:

1. **Direct Target First**: If hovering/focusing a piece inside a region, the input dispatcher first checks if the piece handles the pressed key (e.g., `r` -> `piece.roll()`, `c` -> `piece.pick()`).
2. **Bubbling to Parent Region**: If the piece has no action bound to that key, the event bubbles up to the parent container region (`pb-slot`, `pb-deck`, `pb-bag`, `pb-chute`). For example, pressing `s` while hovering a card inside a deck triggers the deck's `shuffle` action.
3. **Direct Region Targeting**: If the user hovers or focuses on an empty area of a region directly, keys trigger the region's actions immediately.

### Dependency Injection with Grapevine (`HeldStackManager`)

Protoboard avoids global singletons to ensure clean unit testing without state leaks. Shared runtime services, such as the `HeldStackManager`, are declared as Grapevine `Source` dependencies:

```ts
import {source, Source, Vine} from 'grapevine';

export class HeldStackManager {
  private stack: HTMLElement[] = [];
  private floatingOverlay: HTMLElement;

  push(piece: HTMLElement): void;
  pop(): HTMLElement | undefined;
  popAll(): HTMLElement[];
  peek(): HTMLElement | undefined;
  isEmpty(): boolean;
  clear(): void;
}

export const $heldStack: Source<HeldStackManager> = source(
  () => new HeldStackManager(),
);
```

When an element needs to access or mutate the held stack, it resolves the dependency from its associated `Vine` instance:

```ts
const heldStack = $heldStack.get(this.vine);
heldStack.push(this);
```

#### Pick & Drop Lifecycle (LIFO)

1. **Pick (`pick`)**:
   - Triggered on a piece or region (shortcut `c`).
   - Pushes the piece into `HeldStackManager`.
   - The piece is detached from its current DOM parent and mounted into a fixed floating overlay (`position: fixed; pointer-events: none; transform: translate(...)`) that follows the mouse cursor.
   - Players can pick up multiple pieces sequentially; they stack up in Last-In, First-Out (LIFO) order.
2. **Drop (`drop`)**:
   - Triggered on a target region (`pb-slot`, `pb-deck`, `pb-bag`, `pb-chute`) (shortcut `Space`).
   - Pops the **most recently picked piece** (top of the held stack).
   - Reparents the piece element into the target region (`targetRegion.appendChild(poppedPiece)`).
   - If dropping into a `pb-slot`, the piece's coordinates are positioned at the drop location.
3. **Drop All (`drop-all`)**:
   - Triggered on a target region (shortcut `Shift+Space`).
   - Pops **all** currently held pieces in sequence and reparents them all into the target region.

### Custom Component Naming (`name` Attribute)

Every piece and region supports an optional `name` attribute (e.g. `<pb-d6 name="Damage Die">`, `<pb-deck name="Draw Pile">`, `<pb-d1 name="White Pawn">`).

- When defined, this custom name is used for display in the Action Discovery popup and debugging logs.
- When omitted, the component defaults to its tag name (e.g., `pb-d6`, `pb-deck`).

### Action Discovery & Help Popup (`?`)

When hovering or focusing any piece or region, pressing `?` (or `Shift+/`) triggers action discovery using a custom bubbling DOM event:

- **Bubbling Event (`QueryActionsEvent`)**:
  - The hovered/focused element dispatches a bubbling, composed custom event (`pb-query-actions`).
  - As the event bubbles up through the DOM tree, each ancestor Protoboard component catches the event, appends its own action descriptors (id, label, shortcut, enabled state, execution handler), and allows the event to continue bubbling.
  - If a child component claims a shortcut that an ancestor also uses, the child's action takes precedence (ancestor's action is marked shadowed).
- **Popup Rendering (`<pb-action-popup>`)**:
  - The library provides a dedicated `<pb-action-popup>` component that users place in their markup (e.g. at the document root).
  - `<pb-action-popup>` listens for `pb-query-actions` at the document root, anchors itself to `event.detail.targetElement`, and renders the aggregated action list grouped by component name (using the custom `name` attribute or tag name).
  - Clicking any action in the popup executes its action handler directly.
  - The popup is dismissed by pressing `Escape`, pressing `?` again, clicking outside, or executing an action.

### Cross-Component Action Triggering

Components trigger actions on other components via direct programmatic APIs:

- Pieces expose public methods: `piece.roll()`, `piece.nextFace()`, `piece.prevFace()`, `piece.pick()`, and `piece.flip()` (for flippable pieces).
- Regions expose public methods: `region.shuffle()`, `region.flipAll()`, `region.pickAll()`, `region.drop()`, `region.dropAll()`, `region.flush()`.
- Example: `<pb-deck>`'s `flipAll()` iterates over its child pieces and calls `childPiece.flip()`.

### Declarative Action & Shortcut Configuration

All actions on pieces and regions can be customized or disabled directly via HTML attributes:

- `action-[actionName]-shortcut="[key]"`: Assigns a single-key shortcut for an action.
- `action-[actionName]-enable="true|false"`: Enables or disables an action.

#### Example

```html
<pb-d6 name="Damage Die" action-roll-shortcut="o" action-flip-enable="false">
</pb-d6>
```

---

## 4. Default Keybindings & Action Matrix

| Target                                                      | Action                  | Default Key   | Description                                                                          |
| :---------------------------------------------------------- | :---------------------- | :------------ | :----------------------------------------------------------------------------------- |
| **All Elements (Pieces & Regions)**                         | `show-actions` / `help` | `?`           | Dispatches `QueryActionsEvent` displaying `<pb-action-popup>`.                       |
| **All Pieces (`pb-d1`..`pb-dn`)**                           | `pick`                  | `c`           | Adds piece to cursor's held stack (LIFO).                                            |
|                                                             | `roll`                  | `r`           | Randomizes active face (`0` to `N-1`).                                               |
|                                                             | `next-face`             | `]`           | Cycles to next face `(current + 1) % N`.                                             |
|                                                             | `prev-face`             | `[`           | Cycles to previous face `(current - 1 + N) % N`.                                     |
| **Flippable Pieces (`d2`, `d4`, `d6`, `d8`, `d12`, `d20`)** | `flip`                  | `f`           | Shows opposite face: `(N - 1) - current`.                                            |
| **All Regions**                                             | `drop`                  | `Space`       | Pops last picked piece from held stack and reparents into this region.               |
|                                                             | `drop-all`              | `Shift+Space` | Pops all held pieces and reparents them all into this region.                        |
| **`<pb-slot>`**                                             | `drop`                  | `Space`       | Reparents piece and sets `position: absolute; left: ${x}px; top: ${y}px;`.           |
| **`<pb-deck>`**                                             | `shuffle`               | `s`           | Randomizes the DOM order of all child pieces.                                        |
|                                                             | `flip-all`              | `f`           | Reverses child DOM order (top becomes bottom) and calls `flip` on every child piece. |
|                                                             | `pick-all`              | `Shift+C`     | Picks up all pieces in the deck into the held stack.                                 |
| **`<pb-bag>`**                                              | `pick`                  | `c`           | Picks a random piece from the bag into the held stack.                               |
|                                                             | `pick-all`              | `Shift+C`     | Picks up all pieces from the bag into the held stack.                                |
| **`<pb-chute>`**                                            | `flush`                 | `f`           | Forces all trapped pieces in all layers to the linked target region.                 |

---

## 5. Component Specifications

### 5.1 Pieces (`pb-d1` through `pb-dn`)

Pieces represent physical multi-sided objects (coins, cards, meeples, tokens, polyhedral dice).

#### Slot-Based Face Architecture

- Faces are declared using named slots: `slot="face0"`, `slot="face1"`, ..., `slot="faceN"`.
- Multiple DOM nodes sharing the same slot name are projected together in DOM order inside that face.
- The piece's Shadow DOM only renders the `<slot>` corresponding to `activeFace`:
  ```ts
  render() {
    return html`<slot name="face${this.activeFace}"></slot>`;
  }
  ```

#### Piece Types

- **`<pb-d1>`**: 1 face (`face0`). Used for meeples, static tokens, chess pieces.
- **`<pb-d2>`**: 2 faces (`face0`, `face1`). Used for coins, double-sided cards, reversible tokens.
- **`<pb-d4>`**: 4 faces (`face0`..`face3`). Standard tetrahedral die.
- **`<pb-d6>`**: 6 faces (`face0`..`face5`). Standard cubic die.
- **`<pb-d8>`**: 8 faces (`face0`..`face7`). Standard octahedron die.
- **`<pb-d12>`**: 12 faces (`face0`..`face11`). Standard dodecahedron die.
- **`<pb-d20>`**: 20 faces (`face0`..`face19`). Standard icosahedron die.
- **`<pb-dn>`**: N faces (`face0`..`faceN-1`). Declared via `sides="N"` attribute.

#### Opposing Face Logic (`flip`)

For even-sided polyhedrals, tetrahedrals, and coins, `flip` calculates the opposing side using `(N - 1) - currentFaceIndex`:

- **`d2`**: `face0 <-> face1`
- **`d4`**: `face0 <-> face3`, `face1 <-> face2`
- **`d6`**: `face0 <-> face5`, `face1 <-> face4`, `face2 <-> face3` (standard dice opposite sides sum to 7)
- **`d8`**: `face0 <-> face7`, `face1 <-> face6`, etc. (sum to 9)
- **`d12`**: `face0 <-> face11`, `face1 <-> face10`, etc. (sum to 13)
- **`d20`**: `face0 <-> face19`, `face1 <-> face18`, etc. (sum to 21)

---

### 5.2 Regions

Regions are containers that hold pieces as child DOM elements.

#### A. `<pb-slot>` (Spatial Tabletop & Placement Area)

- **Behavior**: Renders all dropped child pieces.
- **Positioning**: When a piece is dropped into `<pb-slot>`, the slot calculates coordinates relative to its bounding box and applies inline styling:
  ```html
  <pb-d6 style="position: absolute; left: 140px; top: 85px;"></pb-d6>
  ```
- **Flexibility**: Multiple `<pb-slot>` elements can be arranged using standard CSS Grid or Flexbox to build chessboards, card zones, or modular game tracks.

#### B. `<pb-deck>` (Stacked Pile)

- **Behavior**: Holds pieces in a stack. Only renders the **top piece** (the last child element in DOM order). All other children are hidden (`display: none` in shadow DOM slotting).
- **Actions**:
  - `drop`: Adds dropped piece as the new top child (`this.appendChild(piece)`).
  - `drop-all`: Appends all currently held pieces to the top of the deck.
  - `shuffle`: Randomizes child DOM node order.
  - `flip-all`: Reverses the child DOM node order (so top becomes bottom and bottom becomes top) **and** calls `flip` on each individual child piece.
  - `pick-all`: Pops all pieces from the deck and pushes them into the held stack.
  - _Note_: Hovering the top piece directly and pressing `c` triggers `pick` on that piece (drawing a card).

#### C. `<pb-bag>` (Blind Draw Container)

- **Behavior**: Holds pieces in a bag. **Hides all child pieces** completely from view.
- **Actions**:
  - `drop`: Appends dropped piece into the bag.
  - `drop-all`: Appends all currently held pieces into the bag.
  - `pick`: Randomly selects one child piece, removes it from the bag, and pushes it into the held stack.
  - `pick-all`: Empties the bag, pushing all pieces into the held stack.

#### D. `<pb-chute>` & `<pb-chute-layer>` (Probabilistic Dice Tower / Drop Sink)

- **Behavior**: Pieces dropped into `<pb-chute>` disappear from view.
- **Linking Target**: Linked to a target region via ID reference (`target="discard-deck"` or `target="#discard-deck"`). The ID is resolved via `(this.getRootNode() as Document | ShadowRoot).getElementById(targetId)`.
- **Layer Mechanics**:
  - Configured via child `<pb-chute-layer>` elements:
    ```html
    <pb-chute target="#exit-slot">
      <pb-chute-layer slot="layer" layer="1" chance="0.5"></pb-chute-layer>
      <pb-chute-layer slot="layer" layer="2" chance="0.8"></pb-chute-layer>
    </pb-chute>
    ```
  - When a new piece is dropped into the chute:
    1. Piece enters Layer 1. Rolls random `[0, 1) < chance`.
    2. If passed, advances to Layer 2 and rolls.
    3. If all layers pass, the piece exits and is reparented into the target linked region.
    4. If it fails at any layer, it remains trapped inside that layer of the chute.
- **Actions**:
  - `drop`: Enters a piece into the chute and calculates layer progression.
  - `drop-all`: Enters all held pieces into the chute, evaluating each piece individually.
  - `flush`: Forces all currently trapped pieces across all layers to immediately exit into the target region.

---

## 6. Complete Example Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Protoboard Prototype</title>
    <style>
      body {
        font-family: sans-serif;
        background: #2c3e50;
        color: #ecf0f1;
        margin: 20px;
      }
      .card {
        width: 80px;
        height: 120px;
        border-radius: 8px;
        background: white;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border: 2px solid #333;
      }
      .card-back {
        background: repeating-linear-gradient(
          45deg,
          #b71540,
          #b71540 10px,
          #e55039 10px,
          #e55039 20px
        );
      }
      .die-face {
        width: 50px;
        height: 50px;
        background: #f1c40f;
        color: black;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-weight: bold;
      }
      pb-slot {
        display: block;
        width: 600px;
        height: 400px;
        background: #34495e;
        border: 2px dashed #7f8c8d;
        position: relative;
      }
      pb-deck {
        display: inline-block;
        width: 80px;
        height: 120px;
        border: 2px solid #95a5a6;
        border-radius: 8px;
      }
      pb-bag {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: #8e44ad;
        border-radius: 50%;
      }
      pb-chute {
        display: inline-block;
        width: 80px;
        height: 80px;
        background: #d35400;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>Protoboard Game Table</h1>

    <!-- Play Area -->
    <pb-slot id="tabletop">
      <!-- D6 Die -->
      <pb-d6 style="position: absolute; left: 50px; top: 50px;">
        <div slot="face0" class="die-face">⚀</div>
        <div slot="face1" class="die-face">⚁</div>
        <div slot="face2" class="die-face">⚂</div>
        <div slot="face3" class="die-face">⚃</div>
        <div slot="face4" class="die-face">⚄</div>
        <div slot="face5" class="die-face">⚅</div>
      </pb-d6>
    </pb-slot>

    <!-- Draw Deck -->
    <h2>
      Deck (Press 's' to shuffle, 'f' to flip all, 'c' on top card to draw)
    </h2>
    <pb-deck id="draw-pile">
      <pb-d2>
        <div slot="face0" class="card">Ace ♠</div>
        <div slot="face1" class="card card-back"></div>
      </pb-d2>
      <pb-d2>
        <div slot="face0" class="card">King ♥</div>
        <div slot="face1" class="card card-back"></div>
      </pb-d2>
      <pb-d2>
        <div slot="face0" class="card">Queen ♦</div>
        <div slot="face1" class="card card-back"></div>
      </pb-d2>
    </pb-deck>

    <!-- Chute / Dice Tower -->
    <h2>Chute (Drop items into it, target is Tabletop)</h2>
    <pb-chute target="#tabletop">
      <pb-chute-layer slot="layer" layer="1" chance="0.6"></pb-chute-layer>
      <pb-chute-layer slot="layer" layer="2" chance="0.8"></pb-chute-layer>
    </pb-chute>

    <!-- Bag of Tokens -->
    <h2>Bag (Press 'c' to blind pick, 'Shift+C' to pick all)</h2>
    <pb-bag id="token-bag">
      <pb-d1><div class="die-face" style="background:#e74c3c">Red</div></pb-d1>
      <pb-d1><div class="die-face" style="background:#3498db">Blue</div></pb-d1>
      <pb-d1
        ><div class="die-face" style="background:#2ecc71">Green</div></pb-d1
      >
    </pb-bag>

    <!-- Action Discovery Popup -->
    <pb-action-popup></pb-action-popup>

    <!-- Script Registration -->
    <script src="protoboard.min.js"></script>
    <script>
      Protoboard.registerProtoboard();
    </script>
  </body>
</html>
```

---

## 7. Testing & Quality Assurance Strategy

### Test Isolation & Registration Strategy

1. **Configurable Registration in Tests**: In production, `registerProtoboard()` defaults to `ignoreExisting: false` and strictly calls `customElements.define`. In test setups (e.g. `before` or `beforeEach`), passing `{ ignoreExisting: true }` skips already-registered elements, allowing safe re-execution across test files.
2. **Fresh `Vine` Per Test**: Custom element classes are stateless; all dynamic state (`HeldStackManager`, etc.) is injected via Grapevine. Each test fixture initializes a fresh `new Vine()`:
   ```ts
   describe('D6Piece', () => {
     let vine: Vine;

     beforeEach(async () => {
       registerProtoboard({ignoreExisting: true});
       vine = new Vine();
     });

     it('rolls random face', async () => {
       const el = await fixture<D6Piece>(html`<pb-d6></pb-d6>`);
       el.vine = vine;
       el.roll();
       expect(el.activeFace).to.be.within(0, 5);
     });
   });
   ```

### Test Framework & Architecture

All testing is unified under **Playwright Test** (`@playwright/test`) across Chromium, Firefox, and WebKit. This provides a single consistent runner and assertion model for component unit testing, interaction flows, and visual golden regression testing:

```
┌─────────────────────────────────────────────────────────────┐
│                    Playwright Test Suite                    │
├──────────────────────────────┬──────────────────────────────┤
│   Component & Unit Tests     │  Interaction & Golden Tests  │
├──────────────────────────────┼──────────────────────────────┤
│ • Component State Invariants │ • Golden Screenshot Testing  │
│ • Opposite Face Arithmetic   │ • True Mouse / Drag Gestures │
│ • Slot & Shadow DOM Proj.    │ • Cross-Browser Regression   │
│ • Region & Stack Logic       │ • End-to-End Game Sandboxes  │
└──────────────────────────────┴──────────────────────────────┘
```

#### Coverage Areas

1. **Component & Unit Invariants**:
   - **Piece State Transitions**: Verifies `roll`, `nextFace`, `prevFace`, and `flip` calculate exact active face indices across `d1`..`dn`.
   - **Opposite Face Arithmetic**: Verifies exact mathematical opposite faces for `d2`, `d4`, `d6`, `d8`, `d12`, `d20`.
   - **Slot Visibility**: Asserts only the active face slot is rendered in Shadow DOM.
   - **Region DOM Mechanics**:
     - `<pb-deck>`: Asserts child DOM node reordering on `shuffle`, child inversion and piece flipping on `flipAll`, and non-top child suppression.
     - `<pb-bag>`: Asserts child hiding and random child selection.
     - `<pb-chute>`: Asserts probability evaluation across layers, trapped piece retention, and `flush` evacuation.
   - **Held Stack (LIFO)**: Asserts `HeldStackManager` push/pop/popAll sequence and order preservation using fresh `Vine` instances.

2. **Interactions & Visual Goldens**:
   - **Visual Golden Screenshots**: Comparing rendered board layouts, card flipping visuals, and multi-node slotted faces.
   - **Full Interaction Flows**: Simulating real mouse moves, hover activations, keyboard shortcuts (`c` to pick, `Space` to drop), picking up pieces into the floating cursor layer, and dropping into target regions.
   - **Cross-Browser Parity**: Ensuring identical behavior on Chromium, Firefox, and WebKit.
