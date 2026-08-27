import {css, CSSResultGroup} from 'lit';

import {FlipAllAction} from '../action/flip-all-action';
import {PickAllAction} from '../action/pick-all-action';
import {ShuffleAction} from '../action/shuffle-action';
import {ActionEvent} from '../core/action-event';

import {BaseRegion} from './base-region';

export class Deck extends BaseRegion {
  static override styles: CSSResultGroup = [
    BaseRegion.styles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }
      ::slotted(*:not(:last-child)) {
        display: none !important;
      }
    `,
  ];

  constructor() {
    super('Deck', () => [
      new FlipAllAction(),
      new PickAllAction(this.handService),
      new ShuffleAction(),
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
