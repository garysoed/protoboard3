import {computed, signal, SignalWatcher} from '@lit-labs/signals';
import {html, LitElement, TemplateResult} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

export class HandOverlay extends SignalWatcher(LitElement) {
  private readonly boundOnMouseMoveHandler = this.onMouseMoveHandler.bind(this);
  private readonly cursorX = signal(0);
  private readonly cursorY = signal(0);
  private readonly containerStyles = computed(() => ({
    left: `${this.cursorX.get()}px`,
    pointerEvents: 'none',
    position: 'fixed',
    top: `${this.cursorY.get()}px`,
    zIndex: '9999',
  }));

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mousemove', this.boundOnMouseMoveHandler);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this.boundOnMouseMoveHandler);
  }
  override render(): TemplateResult {
    return html`<div
      id="container"
      style=${styleMap(this.containerStyles.get())}
    >
      <slot></slot>
    </div>`;
  }

  private onMouseMoveHandler(event: MouseEvent): void {
    this.cursorX.set(event.clientX);
    this.cursorY.set(event.clientY);
  }
}
