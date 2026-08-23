import {ContextConsumer} from '@lit/context';
import {Signal, SignalWatcher, signal} from '@lit-labs/signals';
import {cached} from 'gs-tools/export/data';
import {LitElement} from 'lit';

import {BaseAction} from '../action/base-action';

import {ActionDescriptor, QueryActionsEvent} from './action-descriptor';
import {ActionEvent} from './action-event';
import {HandService, handServiceContext} from './hand-service';

export abstract class BaseElement extends SignalWatcher(LitElement) {
  readonly handService = signal<HandService | undefined>(undefined);

  private readonly boundOnMouseEnter = this.onMouseEnter.bind(this);
  private readonly boundOnMouseLeave = this.onMouseLeave.bind(this);
  private readonly boundOnQueryActions = this.onQueryActions.bind(this);
  private readonly boundOnWindowKeyDown = this.onWindowKeyDown.bind(this);
  private readonly handServiceConsumer = new ContextConsumer(this, {
    callback: (service) => {
      this.handService.set(service);
    },
    context: handServiceContext,
    subscribe: true,
  });
  private readonly isHovered = signal(false);
  private readonly name: Signal.State<string>;

  constructor(
    private readonly defaultName: string,
    private readonly actionsFactory: () => readonly BaseAction[],
  ) {
    super();
    this.name = signal(defaultName);
  }

  override attributeChangedCallback(
    name: string,
    _old: null | string,
    value: null | string,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'name') {
      this.name.set(value ?? this.defaultName);
    }
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
    this.addEventListener(QueryActionsEvent.TYPE, this.boundOnQueryActions);
    window.addEventListener('keydown', this.boundOnWindowKeyDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const action of this.actions) {
      action.unobserve(this);
    }
    this.removeEventListener('mouseenter', this.boundOnMouseEnter);
    this.removeEventListener('mouseleave', this.boundOnMouseLeave);
    this.removeEventListener(QueryActionsEvent.TYPE, this.boundOnQueryActions);
    window.removeEventListener('keydown', this.boundOnWindowKeyDown);
  }
  getActionDescriptors(): readonly ActionDescriptor[] {
    return this.actions.map((action) => action.getActionDescriptor(this));
  }

  static override get observedAttributes(): string[] {
    return ['name', ...(super.observedAttributes ?? [])];
  }

  private onMouseEnter(): void {
    this.isHovered.set(true);
  }
  private onMouseLeave(): void {
    this.isHovered.set(false);
  }
  private onQueryActions(event: Event): void {
    if (!(event instanceof QueryActionsEvent)) {
      return;
    }

    event.addActionGroup({
      actions: this.getActionDescriptors(),
      name: this.name.get(),
    });
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
    const isHovered = this.isHovered.get();
    if (!isHovered && !isDirectlyFocused) {
      return;
    }

    if (isHovered) {
      const descendants = Array.from(this.querySelectorAll('*'));
      const hasHoveredChild = descendants.some(
        (el) => el instanceof BaseElement && el.isHovered.get(),
      );
      if (hasHoveredChild) {
        return;
      }
    }

    this.dispatchEvent(new ActionEvent(event.key, event));
  }

  @cached()
  private get actions(): readonly BaseAction[] {
    return this.actionsFactory();
  }
}
