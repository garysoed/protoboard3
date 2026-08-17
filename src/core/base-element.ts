import {consume} from '@lit/context';
import {LitElement} from 'lit';

import {ActionEvent} from './action-event';
import {HandService, handServiceContext} from './hand-service';
import {matchesKey, parseTriggerKey, TriggerKey} from './trigger-key';

export interface ActionConfig {
  readonly defaultShortcut?: string | TriggerKey;
  readonly handler: () => Promise<void> | void;
  readonly id: string;
}

export class BaseElement extends LitElement {
  @consume<HandService | undefined>({
    context: handServiceContext,
    subscribe: true,
  })
  accessor handService: HandService | undefined;

  private readonly actions = new Map<string, ActionConfig>();
  private readonly boundOnAction = this.onAction.bind(this);
  private readonly boundOnMouseEnter = this.onMouseEnter.bind(this);
  private readonly boundOnMouseLeave = this.onMouseLeave.bind(this);
  private readonly boundOnWindowKeyDown = this.onWindowKeyDown.bind(this);
  private isHovered = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    this.addEventListener('mouseenter', this.boundOnMouseEnter);
    this.addEventListener('mouseleave', this.boundOnMouseLeave);
    this.addEventListener(ActionEvent.TYPE, this.boundOnAction);
    window.addEventListener('keydown', this.boundOnWindowKeyDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.boundOnMouseEnter);
    this.removeEventListener('mouseleave', this.boundOnMouseLeave);
    this.removeEventListener(ActionEvent.TYPE, this.boundOnAction);
    window.removeEventListener('keydown', this.boundOnWindowKeyDown);
  }

  protected registerAction(config: ActionConfig): void {
    this.actions.set(config.id, config);
  }

  private getActionShortcut(actionId: string): TriggerKey | undefined {
    const customShortcut = this.getAttribute(
      `action-${actionId.toLowerCase()}`,
    );
    if (customShortcut !== null) {
      const trimmed = customShortcut.trim();
      return trimmed.length > 0 ? parseTriggerKey(trimmed) : undefined;
    }
    const defaultShortcut = this.actions.get(actionId)?.defaultShortcut;
    if (typeof defaultShortcut === 'string') {
      return parseTriggerKey(defaultShortcut);
    }
    return defaultShortcut;
  }
  private handleKeyEvent(event: KeyboardEvent): boolean {
    for (const [id, config] of this.actions) {
      const shortcut = this.getActionShortcut(id);
      if (!shortcut) {
        continue;
      }
      if (matchesKey(shortcut, event)) {
        void config.handler();
        return true;
      }
    }
    return false;
  }
  private onAction(event: Event): void {
    if (!(event instanceof ActionEvent)) {
      return;
    }
    if (this.handleKeyEvent(event.keyboardEvent)) {
      event.stopPropagation();
      event.keyboardEvent.preventDefault();
    }
  }
  private onMouseEnter(): void {
    this.isHovered = true;
  }
  private onMouseLeave(): void {
    this.isHovered = false;
  }
  private onWindowKeyDown(event: KeyboardEvent): void {
    const target = event.target;
    if (target instanceof HTMLElement) {
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }
    }

    const isDirectlyFocused = document.activeElement === this;
    if (!this.isHovered && !isDirectlyFocused) {
      return;
    }

    if (this.isHovered) {
      const descendants = Array.from(this.querySelectorAll('*'));
      const hasHoveredChild = descendants.some(
        (el) => el instanceof BaseElement && el.isHovered,
      );
      if (hasHoveredChild) {
        return;
      }
    }

    this.dispatchEvent(new ActionEvent(event.key, event));
  }
}
