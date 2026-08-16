import {css, CSSResultGroup, html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

export class TestFace extends LitElement {
  static override styles: CSSResultGroup = css`
    :host {
      align-items: center;
      background-color: #3b82f6;
      border-radius: 6px;
      color: white;
      display: flex;
      font-family: sans-serif;
      font-size: 12px;
      font-weight: bold;
      height: 60px;
      justify-content: center;
      width: 60px;
    }
  `;

  @property({type: String})
  accessor text = '';

  override render(): TemplateResult {
    return html`${this.text}<slot></slot>`;
  }
}
