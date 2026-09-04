import '@carbon/web-components/es/components/data-table/index.js';

import {html, TemplateResult} from 'lit';

/**
 * Metadata descriptor for a documented HTML attribute.
 */
export interface AttributeDescriptor {
  readonly default?: string;
  readonly description: string;
  readonly name: string;
  readonly type: string;
}

/**
 * Metadata descriptor for a documented component action.
 */
export interface ActionDescriptor {
  readonly defaultKey: string;
  readonly description: string;
  readonly id: string;
  readonly label: string;
}

/**
 * Renders a structured IBM Carbon `<cds-table>` documenting component attributes.
 */
export function renderAttributesTable(
  attributes: readonly AttributeDescriptor[],
): TemplateResult {
  return html`
    <cds-table>
      <cds-table-head>
        <cds-table-header-row>
          <cds-table-header-cell>Attribute</cds-table-header-cell>
          <cds-table-header-cell>Type</cds-table-header-cell>
          <cds-table-header-cell>Default</cds-table-header-cell>
          <cds-table-header-cell>Description</cds-table-header-cell>
        </cds-table-header-row>
      </cds-table-head>
      <cds-table-body>
        ${attributes.map(
          (attr) => html`
            <cds-table-row>
              <cds-table-cell><code>${attr.name}</code></cds-table-cell>
              <cds-table-cell><code>${attr.type}</code></cds-table-cell>
              <cds-table-cell>
                ${attr.default ? html`<code>${attr.default}</code>` : '—'}
              </cds-table-cell>
              <cds-table-cell>${attr.description}</cds-table-cell>
            </cds-table-row>
          `,
        )}
      </cds-table-body>
    </cds-table>
  `;
}

/**
 * Renders a structured IBM Carbon `<cds-table>` documenting component actions and keybindings.
 */
export function renderActionsTable(
  actions: readonly ActionDescriptor[],
): TemplateResult {
  return html`
    <cds-table>
      <cds-table-head>
        <cds-table-header-row>
          <cds-table-header-cell>Action</cds-table-header-cell>
          <cds-table-header-cell>Default Key</cds-table-header-cell>
          <cds-table-header-cell>Description</cds-table-header-cell>
        </cds-table-header-row>
      </cds-table-head>
      <cds-table-body>
        ${actions.map(
          (act) => html`
            <cds-table-row>
              <cds-table-cell>
                <strong>${act.label}</strong> (<code>${act.id}</code>)
              </cds-table-cell>
              <cds-table-cell><kbd>${act.defaultKey}</kbd></cds-table-cell>
              <cds-table-cell>${act.description}</cds-table-cell>
            </cds-table-row>
          `,
        )}
      </cds-table-body>
    </cds-table>
  `;
}
