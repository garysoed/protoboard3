import {computed, signal, SignalWatcher} from '@lit-labs/signals';
import {html, LitElement, TemplateResult} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

export interface Coordinates {
  readonly left: number;
  readonly top: number;
}

export class HandOverlay extends SignalWatcher(LitElement) {
  readonly cursor = signal<Coordinates>({left: 0, top: 0});

  private readonly boundOnMouseMoveHandler = this.onMouseMoveHandler.bind(this);
  private readonly containerStyles = computed(() => ({
    left: `${this.cursor.get().left}px`,
    pointerEvents: 'none',
    position: 'fixed',
    top: `${this.cursor.get().top}px`,
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
    this.cursor.set({left: event.clientX, top: event.clientY});
  }
}
