import {css, CSSResultGroup, html, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators.js';

import {BaseAction} from '../action/base-action';
import {PickAction} from '../action/pick-action';
import {RotateAction} from '../action/rotate-action';
import {BaseElement} from '../core/base-element';

export class BasePiece extends BaseElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
  `;

  @property({type: Number})
  accessor sides = 1;

  @state()
  private accessor activeFace = 0;

  constructor(actions: readonly BaseAction[] = []) {
    super([
      new PickAction(() => this.handService),
      new RotateAction(),
      ...actions,
    ]);
  }

  nextFace(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace = (this.activeFace + 1) % totalSides;
  }
  prevFace(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace = (this.activeFace - 1 + totalSides) % totalSides;
  }
  override render(): TemplateResult {
    return html`<slot name="face${this.activeFace}"></slot>`;
  }
  roll(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace = Math.floor(Math.random() * totalSides);
  }
}
