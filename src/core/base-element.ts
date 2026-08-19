import {consume} from '@lit/context';
import {LitElement} from 'lit';

import {BaseAction} from '../action/base-action';

import {ActionEvent} from './action-event';
import {HandService, handServiceContext} from './hand-service';

export class BaseElement extends LitElement {
  @consume<HandService | undefined>({
    context: handServiceContext,
    subscribe: true,
  })
  accessor handService: HandService | undefined;

  private readonly boundOnMouseEnter = this.onMouseEnter.bind(this);
  private readonly boundOnMouseLeave = this.onMouseLeave.bind(this);
  private readonly boundOnWindowKeyDown = this.onWindowKeyDown.bind(this);
  private isHovered = false;

  constructor(protected readonly actions: readonly BaseAction[] = []) {
    super();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    for (const action of this.actions) {
      action.observe(this);
    }
    this.addEventListener('mouseenter', this.boundOnMouseEnter);
    this.addEventListener('mouseleave', this.boundOnMouseLeave);
    window.addEventListener('keydown', this.boundOnWindowKeyDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const action of this.actions) {
      action.unobserve(this);
    }
    this.removeEventListener('mouseenter', this.boundOnMouseEnter);
    this.removeEventListener('mouseleave', this.boundOnMouseLeave);
    window.removeEventListener('keydown', this.boundOnWindowKeyDown);
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
