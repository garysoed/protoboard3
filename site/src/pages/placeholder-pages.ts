import {html, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * Common base class for placeholder documentation pages.
 */
export abstract class BasePlaceholderPage extends LitElement {
  abstract readonly pageTitle: string;
  abstract readonly tag: string;

  override render(): TemplateResult {
    return html`
      <div class="pbd-placeholder-page">
        <h2>${this.pageTitle} (<code>&lt;${this.tag}&gt;</code>)</h2>
        <p>
          Documentation and interactive creator for
          <code>&lt;${this.tag}&gt;</code>.
        </p>
      </div>
    `;
  }
}

@customElement('pbd-page-overview')
export class PbdPageOverview extends BasePlaceholderPage {
  readonly pageTitle = 'Overview';
  readonly tag = 'protoboard-overview';

  override render(): TemplateResult {
    return html`
      <div class="pbd-placeholder-page">
        <h2>Protoboard Explorer Overview</h2>
        <p>
          Welcome to the interactive component documentation and tabletop
          sandbox for Protoboard.
        </p>
      </div>
    `;
  }
}

@customElement('pbd-page-d1')
export class PbdPageD1 extends BasePlaceholderPage {
  readonly pageTitle = 'D1';
  readonly tag = 'pb-d1';
}

@customElement('pbd-page-d2')
export class PbdPageD2 extends BasePlaceholderPage {
  readonly pageTitle = 'D2';
  readonly tag = 'pb-d2';
}

@customElement('pbd-page-d4')
export class PbdPageD4 extends BasePlaceholderPage {
  readonly pageTitle = 'D4';
  readonly tag = 'pb-d4';
}

@customElement('pbd-page-d6')
export class PbdPageD6 extends BasePlaceholderPage {
  readonly pageTitle = 'D6';
  readonly tag = 'pb-d6';
}

@customElement('pbd-page-d8')
export class PbdPageD8 extends BasePlaceholderPage {
  readonly pageTitle = 'D8';
  readonly tag = 'pb-d8';
}

@customElement('pbd-page-d12')
export class PbdPageD12 extends BasePlaceholderPage {
  readonly pageTitle = 'D12';
  readonly tag = 'pb-d12';
}

@customElement('pbd-page-d20')
export class PbdPageD20 extends BasePlaceholderPage {
  readonly pageTitle = 'D20';
  readonly tag = 'pb-d20';
}

@customElement('pbd-page-dn')
export class PbdPageDn extends BasePlaceholderPage {
  readonly pageTitle = 'DN';
  readonly tag = 'pb-dn';
}

@customElement('pbd-page-slot')
export class PbdPageSlot extends BasePlaceholderPage {
  readonly pageTitle = 'Slot';
  readonly tag = 'pb-slot';
}

@customElement('pbd-page-deck')
export class PbdPageDeck extends BasePlaceholderPage {
  readonly pageTitle = 'Deck';
  readonly tag = 'pb-deck';
}

@customElement('pbd-page-bag')
export class PbdPageBag extends BasePlaceholderPage {
  readonly pageTitle = 'Bag';
  readonly tag = 'pb-bag';
}

@customElement('pbd-page-chute')
export class PbdPageChute extends BasePlaceholderPage {
  readonly pageTitle = 'Chute';
  readonly tag = 'pb-chute';
}

@customElement('pbd-page-hand-overlay')
export class PbdPageHandOverlay extends BasePlaceholderPage {
  readonly pageTitle = 'Hand Overlay';
  readonly tag = 'pb-hand-overlay';
}

@customElement('pbd-page-action-popup')
export class PbdPageActionPopup extends BasePlaceholderPage {
  readonly pageTitle = 'Action Popup';
  readonly tag = 'pb-action-popup';
}
