import {Signal, SignalWatcher, signal} from '@lit-labs/signals';
import {html, LitElement, TemplateResult} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

import {
  ActionDescriptor,
  ActionGroup,
  QueryActionsEvent,
} from './action-descriptor';
import styles from './action-popup.css';
import {formatTriggerKey} from './trigger-key';

export class ActionPopup extends SignalWatcher(LitElement) {
  static override styles = styles;

  private readonly actionGroups: Signal.State<readonly ActionGroup[]> = signal(
    [],
  );
  private readonly boundOnKeyDown = this.onKeyDown.bind(this);
  private readonly boundOnPointerDown = this.onPointerDown.bind(this);
  private readonly boundOnQueryActions = this.onQueryActions.bind(this);
  private readonly isOpen = signal(false);
  private readonly popupPosition = signal({left: 0, top: 0});
  private readonly targetElement: Signal.State<Element | undefined> =
    signal(undefined);

  close(): void {
    this.isOpen.set(false);
    this.targetElement.set(undefined);
    this.actionGroups.set([]);
  }
  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener(QueryActionsEvent.TYPE, this.boundOnQueryActions);
    window.addEventListener('keydown', this.boundOnKeyDown);
    window.addEventListener('pointerdown', this.boundOnPointerDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(
      QueryActionsEvent.TYPE,
      this.boundOnQueryActions,
    );
    window.removeEventListener('keydown', this.boundOnKeyDown);
    window.removeEventListener('pointerdown', this.boundOnPointerDown);
  }
  override render(): TemplateResult {
    if (!this.isOpen.get()) {
      return html``;
    }

    const {left, top} = this.popupPosition.get();
    const popupStyles = {
      left: `${left}px`,
      top: `${top}px`,
    };

    return html`<div
      aria-label="Available Actions"
      class="popup"
      part="popup"
      role="dialog"
      style=${styleMap(popupStyles)}
    >
      ${this.actionGroups.get().map((group) => this.renderGroup(group))}
    </div>`;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.isOpen.get() && event.key === 'Escape') {
      this.close();
      event.stopPropagation();
    }
  }
  private onPointerDown(event: Event): void {
    if (!this.isOpen.get()) {
      return;
    }

    const path = event.composedPath();
    if (!path.includes(this)) {
      this.close();
    }
  }
  private onQueryActions(event: Event): void {
    if (!(event instanceof QueryActionsEvent)) {
      return;
    }

    if (
      this.isOpen.get() &&
      this.targetElement.get() === event.detail.targetElement
    ) {
      this.close();
      return;
    }

    const target = event.detail.targetElement;
    const rect = target.getBoundingClientRect();
    this.targetElement.set(target);
    this.actionGroups.set(event.detail.actionGroups);
    this.popupPosition.set({left: rect.left, top: rect.bottom});
    this.isOpen.set(true);
  }
  private renderAction(action: ActionDescriptor): TemplateResult {
    const formattedShortcut = formatTriggerKey(action.shortcut);

    return html`<div class="action-item" part="action-item">
      <span class="action-label" part="action-label">${action.label}</span>
      ${
        formattedShortcut
          ? html`<kbd class="action-shortcut" part="action-shortcut"
              >${formattedShortcut}</kbd
            >`
          : null
      }
    </div>`;
  }
  private renderGroup(group: ActionGroup): TemplateResult {
    return html`<div class="group" part="group">
      <div class="group-header" part="group-header">${group.name}</div>
      <div class="action-list" part="action-list">
        ${group.actions.map((action) => this.renderAction(action))}
      </div>
    </div>`;
  }
}
