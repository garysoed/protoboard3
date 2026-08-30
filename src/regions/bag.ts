import {css, CSSResultGroup} from 'lit';

import {PickAllAction} from '../action/pick-all-action';
import {PickRandomAction} from '../action/pick-random-action';
import {ActionEvent} from '../core/action-event';

import {BaseRegion} from './base-region';

export class Bag extends BaseRegion {
  static override styles: CSSResultGroup = [
    BaseRegion.styles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }
      ::slotted(*) {
        display: none !important;
      }
    `,
  ];

  constructor() {
    super('Bag', () => [
      new PickRandomAction(this.handService),
      new PickAllAction(this.handService),
    ]);
  }

  protected override onDrop(target: Element, _event: ActionEvent): void {
    if (target instanceof HTMLElement) {
      target.style.position = '';
      target.style.left = '';
      target.style.top = '';
    }
    this.appendChild(target);
  }
}
