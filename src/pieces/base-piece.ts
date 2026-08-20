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

  private readonly activeFace = signal(0);

  constructor(actions: readonly BaseAction[] = []) {
    super([
      new PickAction(() => this.handService),
      new RotateAction(),
      ...actions,
    ]);
  }

  nextFace(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace.set((this.activeFace.get() + 1) % totalSides);
  }
  prevFace(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace.set((this.activeFace.get() - 1 + totalSides) % totalSides);
  }
  override render(): TemplateResult {
    return html`<slot name="face${this.activeFace.get()}"></slot>`;
  }
  roll(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace.set(Math.floor(Math.random() * totalSides));
  }
}
