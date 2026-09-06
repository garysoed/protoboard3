import {SignalWatcher, signal} from '@lit-labs/signals';
import {html, LitElement, TemplateResult} from 'lit';

import styles from './slot-assigner.scss';

/**
 * Interactive face slot assignment widget.
 */
export class PbdSlotAssigner extends SignalWatcher(LitElement) {
  static override styles = styles;

  readonly sideCount = signal(6);

  override attributeChangedCallback(
    name: string,
    old: null | string,
    value: null | string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'side-count' && value !== null && this.sideCount) {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isNaN(parsed)) {
        this.sideCount.set(parsed);
      }
    }
  }
  override connectedCallback(): void {
    super.connectedCallback();
    const attr = this.getAttribute('side-count');
    if (attr === null) {
      throw new Error(
        'Attribute "side-count" is required on <pbd-slot-assigner>',
      );
    }
    const parsed = Number.parseInt(attr, 10);
    if (!Number.isNaN(parsed)) {
      this.sideCount.set(parsed);
    }
  }
  getSlotFaces(): readonly string[] {
    const rows = this.renderRoot.querySelectorAll('pbd-slot-row');
    return Array.from(rows, (row) => row.getSlotFace());
  }
  override render(): TemplateResult {
    const count = this.sideCount.get();
    return html`
      <div class="slot-assigner">
        ${Array.from(
          {length: count},
          (_, index) => html` <pbd-slot-row .index="${index}"></pbd-slot-row> `,
        )}
      </div>
    `;
  }

  static override get observedAttributes(): string[] {
    return ['side-count', ...(super.observedAttributes ?? [])];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pbd-slot-assigner': PbdSlotAssigner;
  }
}
