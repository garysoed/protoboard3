import {SignalWatcher} from '@lit-labs/signals';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

export class ChuteLayer extends SignalWatcher(LitElement) {
  @property({type: Number})
  accessor chance = 1;
  @property({type: Number})
  accessor layer = 0;

  override render(): TemplateResult {
    return html``;
  }
}
