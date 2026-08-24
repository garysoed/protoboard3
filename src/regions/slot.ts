import {css, CSSResultGroup} from 'lit';

import {ActionEvent} from '../core/action-event';

import {BaseRegion} from './base-region';

export class Slot extends BaseRegion {
  static override styles: CSSResultGroup = [
    BaseRegion.styles,
    css`
      :host {
        position: relative;
      }
    `,
  ];

  constructor() {
    super('Slot', () => []);
  }

  protected override onDrop(target: Element, event: ActionEvent): void {
    if (target instanceof HTMLElement) {
      const rect = this.getBoundingClientRect();
      const left = event.mousePosition.x - rect.left;
      const top = event.mousePosition.y - rect.top;
      target.style.position = 'absolute';
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    }
    this.appendChild(target);
  }
}
