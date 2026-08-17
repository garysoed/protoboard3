import {css, CSSResultGroup, html, TemplateResult} from 'lit';

import {BaseElement} from '../core/base-element';

export class D1 extends BaseElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
  `;

  constructor() {
    super();
    this.registerAction({
      defaultShortcut: 'c',
      handler: () => this.pick(),
      id: 'pick',
    });
  }

  pick(): void {
    this.handService?.push(this);
  }
  override render(): TemplateResult {
    return html`<slot name="face0"></slot>`;
  }
}
