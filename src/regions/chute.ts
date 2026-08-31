import {css, CSSResultGroup} from 'lit';
import {property} from 'lit/decorators.js';

import {FlushAction} from '../action/flush-action';
import {ActionEvent} from '../core/action-event';

import {BaseRegion} from './base-region';
import {ChuteLayer} from './chute-layer';

export class Chute extends BaseRegion {
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

  @property({type: String})
  accessor target = '';

  constructor() {
    super('Chute', () => [new FlushAction()]);
  }

  protected override onDrop(target: Element, _event: ActionEvent): void {
    if (target instanceof HTMLElement) {
      target.style.position = '';
      target.style.left = '';
      target.style.top = '';
    }

    const layers = Array.from(this.children)
      .filter((child): child is ChuteLayer => child instanceof ChuteLayer)
      .sort((a, b) => a.layer - b.layer);

    const allPassed = layers.every((layer) => Math.random() < layer.chance);

    const destination = allPassed ? this.getTargetElement() : null;
    if (destination) {
      destination.appendChild(target);
    } else {
      this.appendChild(target);
    }
  }

  private getTargetElement(): Element | null {
    if (!this.target) {
      return null;
    }
    const targetId = this.target.startsWith('#')
      ? this.target.slice(1)
      : this.target;
    const rootNode = this.getRootNode();
    if (rootNode instanceof Document || rootNode instanceof ShadowRoot) {
      return rootNode.getElementById(targetId);
    }
    return null;
  }
}
