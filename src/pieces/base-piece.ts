import {signal} from '@lit-labs/signals';
import {css, CSSResultGroup, html, TemplateResult} from 'lit';

import {BaseAction} from '../action/base-action';
import {PickAction} from '../action/pick-action';
import {RotateAction} from '../action/rotate-action';
import {BaseElement} from '../core/base-element';

export abstract class BasePiece extends BaseElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
  `;

  abstract readonly sides: number;

  protected readonly activeFace = signal(0);

  constructor(actionsFactory: () => readonly BaseAction[]) {
    super(() => [
      new PickAction(this.handService),
      new RotateAction(),
      ...actionsFactory(),
    ]);
  }

  override render(): TemplateResult {
    return html`<slot name="face${this.activeFace.get()}"></slot>`;
  }
}
