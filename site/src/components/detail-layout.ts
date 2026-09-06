import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/code-snippet/index.js';
import '@carbon/web-components/es/components/content-switcher/index.js';
import '@carbon/web-components/es/components/tag/index.js';
import {html, LitElement, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators.js';

import styles from './detail-layout.scss';

/**
 * Reusable detail page layout for component documentation pages.
 */
export class PbdDetailLayout extends LitElement {
  static override styles = styles;

  @property({type: String}) accessor code = '';
  @property({attribute: 'hide-sandbox', type: Boolean})
  accessor hideSandbox = false;
  @property({type: String}) accessor tag = '';
  @property({type: String}) override accessor title = '';

  @state() private accessor activeView: 'html' | 'live' = 'live';

  override render(): TemplateResult {
    return html`
      <div class="detail-layout">
        <header class="detail-header">
          <h1 class="detail-title">${this.title}</h1>
          ${
            this.tag ? html`<cds-tag type="blue">${this.tag}</cds-tag>` : html``
          }
        </header>

        <div class="detail-section">
          <slot name="description"></slot>
        </div>

        <div class="detail-section">
          <slot name="attributes"></slot>
        </div>

        <div class="detail-section">
          <slot name="actions"></slot>
        </div>

        <div class="detail-section">
          <slot name="controls"></slot>
        </div>

        <div class="detail-section">
          <slot name="slot-assigner"></slot>
        </div>

        <section class="preview-card" aria-label="Component preview and code">
          <div class="preview-header">
            <h2 class="section-heading">Preview</h2>
            <cds-content-switcher
              value="${this.activeView}"
              @cds-content-switcher-selected="${this.handleSwitcherSelected}"
            >
              <cds-content-switcher-item value="live">
                Live Component
              </cds-content-switcher-item>
              <cds-content-switcher-item value="html">
                HTML Code
              </cds-content-switcher-item>
            </cds-content-switcher>
          </div>

          <div class="preview-content">
            ${
              this.activeView === 'live'
                ? html`
                    <div class="preview-live">
                      <slot name="preview"></slot>
                    </div>
                  `
                : html`
                    <div class="preview-code">
                      <cds-code-snippet type="multi"
                        >${this.code}</cds-code-snippet
                      >
                    </div>
                  `
            }
          </div>

          ${
            this.hideSandbox
              ? html``
              : html`
                  <div class="preview-footer">
                    <cds-button
                      kind="primary"
                      id="add-to-sandbox-btn"
                      @click="${this.handleAddToSandbox}"
                    >
                      Add to Sandbox
                    </cds-button>
                  </div>
                `
          }
        </section>
      </div>
    `;
  }

  private handleAddToSandbox(): void {
    this.dispatchEvent(
      new CustomEvent('pbd-add-to-sandbox', {
        bubbles: true,
        composed: true,
        detail: {
          code: this.code,
          tag: this.tag,
          title: this.title,
        },
      }),
    );
  }
  private handleSwitcherSelected(event: Event): void {
    if (
      event instanceof CustomEvent &&
      event.detail &&
      typeof event.detail === 'object'
    ) {
      const item = 'item' in event.detail ? event.detail.item : undefined;
      if (item instanceof HTMLElement) {
        const val = item.getAttribute('value');
        if (val === 'live' || val === 'html') {
          this.activeView = val;
        }
      }
    }
  }
}

customElements.define('pbd-detail-layout', PbdDetailLayout);

declare global {
  interface HTMLElementTagNameMap {
    'pbd-detail-layout': PbdDetailLayout;
  }
}
