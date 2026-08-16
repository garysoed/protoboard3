import {css, CSSResultGroup, html, LitElement, TemplateResult} from 'lit';

export class D1 extends LitElement {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
  `;

  override render(): TemplateResult {
    return html`<slot name="face0"></slot>`;
  }
}
