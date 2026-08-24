import {css, CSSResultGroup, html, TemplateResult} from 'lit';

import {BaseAction} from '../action/base-action';
import {DropAction} from '../action/drop-action';
import {DropAllAction} from '../action/drop-all-action';
import {BaseElement} from '../core/base-element';

export abstract class BaseRegion extends BaseElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
  `;

  constructor(
    defaultName: string,
    actionsFactory: () => readonly BaseAction[],
  ) {
    super(defaultName, () => [
      new DropAction(this.handService),
      new DropAllAction(this.handService),
      ...actionsFactory(),
    ]);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
