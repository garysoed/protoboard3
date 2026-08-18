import {css, CSSResultGroup, html, PropertyValues, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators.js';

import {BaseElement} from '../core/base-element';

export class BasePiece extends BaseElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
  `;

  @property({type: String})
  accessor rotations = '0, 90, 180, 270';
  @property({type: Number})
  accessor sides = 1;

  @state()
  private accessor activeFace = 0;
  @state()
  private accessor rotationIndex = 0;

  constructor() {
    super();
    this.registerAction({
      defaultShortcut: 'c',
      handler: () => this.pick(),
      id: 'pick',
    });
    this.registerAction({
      defaultShortcut: 't',
      handler: () => this.rotate(),
      id: 'rotate',
    });
  }

  nextFace(): void {
    const totalSides = Math.max(1, this.sides);
    this.activeFace = (this.activeFace + 1) % totalSides;
  }
  pick(): void {
    this.handService?.push(this);
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
  rotate(): void {
    const angles = this.parsedRotations;
    this.rotationIndex = (this.rotationIndex + 1) % angles.length;
  }
  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('rotations') ||
      changedProperties.has('rotationIndex')
    ) {
      this.applyRotation();
    }
  }

  get parsedRotations(): number[] {
    if (!this.rotations) {
      return [0, 90, 180, 270];
    }
    const angles = this.rotations
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    return angles.length > 0 ? angles : [0, 90, 180, 270];
  }

  private applyRotation(): void {
    const angles = this.parsedRotations;
    const angle = angles[this.rotationIndex % angles.length] ?? 0;
    this.style.transform = angle !== 0 ? `rotate(${angle}deg)` : '';
  }
}
