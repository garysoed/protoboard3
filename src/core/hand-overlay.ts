import {html, LitElement, TemplateResult} from 'lit';
import {state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

export class HandOverlay extends LitElement {
  private readonly boundOnMouseMoveHandler = this.onMouseMoveHandler.bind(this);
  @state()
  private accessor cursorX = 0;
  @state()
  private accessor cursorY = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mousemove', this.boundOnMouseMoveHandler);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this.boundOnMouseMoveHandler);
  }
  override render(): TemplateResult {
    const styles = {
      left: `${this.cursorX}px`,
      pointerEvents: 'none',
      position: 'fixed',
      top: `${this.cursorY}px`,
      zIndex: '9999',
    };
    return html`<div id="container" style=${styleMap(styles)}>
      <slot></slot>
    </div>`;
  }

  private onMouseMoveHandler(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }
}
