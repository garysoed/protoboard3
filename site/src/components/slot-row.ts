import '@carbon/web-components/es/components/select/index.js';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

import {
  FacePreset,
  getPreset,
  getPresetsByCategory,
  PresetCategory,
  PRESETS,
} from '../presets.js';

import styles from './slot-row.scss';

/**
 * Event detail payload when a slot preset changes.
 */
export interface PresetChangeDetail {
  readonly index: number;
  readonly presetId: string;
}

interface PresetGroup {
  readonly category: PresetCategory;
  readonly label: string;
  readonly presets: readonly FacePreset[];
}

const PRESET_GROUPS: readonly PresetGroup[] = [
  {category: 'dice', label: 'Dice', presets: getPresetsByCategory('dice')},
  {category: 'cards', label: 'Cards', presets: getPresetsByCategory('cards')},
  {
    category: 'tokens',
    label: 'Tokens',
    presets: getPresetsByCategory('tokens'),
  },
  {
    category: 'symbols',
    label: 'Symbols',
    presets: getPresetsByCategory('symbols'),
  },
];

/**
 * Single face slot assignment row widget.
 */
export class PbdSlotRow extends LitElement {
  static override styles = styles;

  @property({type: Number}) accessor index = 0;

  getSlotFace(): string {
    const select = this.renderRoot?.querySelector('cds-select');
    if (
      select &&
      'value' in select &&
      typeof select.value === 'string' &&
      select.value
    ) {
      return select.value;
    }
    return PRESETS[this.index % PRESETS.length]?.id ?? 'pip-1';
  }
  override render(): TemplateResult {
    const currentPresetId = this.getSlotFace();
    const preset = getPreset(currentPresetId);
    return html`
      <div class="slot-row" data-index="${this.index}">
        <span class="slot-label">face ${this.index}</span>
        <div class="slot-thumbnail">${preset ? preset.render() : html``}</div>
        <cds-select
          label-text="Preset for face ${this.index}"
          hide-label
          value="${currentPresetId}"
          @cds-select-selected="${this.handleSelectChange}"
        >
          ${PRESET_GROUPS.map((group) =>
            this.renderGroup(group, currentPresetId),
          )}
        </cds-select>
      </div>
    `;
  }

  private handleSelectChange(event: Event): void {
    if (
      !(event instanceof CustomEvent) ||
      !event.detail ||
      typeof event.detail !== 'object'
    ) {
      return;
    }
    const value =
      'value' in event.detail && typeof event.detail.value === 'string'
        ? event.detail.value
        : undefined;
    if (!value) {
      return;
    }
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent<PresetChangeDetail>('pbd-preset-change', {
        bubbles: true,
        composed: true,
        detail: {
          index: this.index,
          presetId: value,
        },
      }),
    );
  }
  private renderGroup(
    group: PresetGroup,
    selectedPresetId: string,
  ): TemplateResult {
    return html`
      <cds-select-item-group label="${group.label}">
        ${group.presets.map(
          (preset) => html`
            <cds-select-item
              value="${preset.id}"
              ?selected="${preset.id === selectedPresetId}"
            >
              ${preset.name}
            </cds-select-item>
          `,
        )}
      </cds-select-item-group>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pbd-slot-row': PbdSlotRow;
  }
}
