import {Signal, signal} from '@lit-labs/signals';

import {ActionEvent} from '../core/action-event';
import {matchesKey, parseTriggerKey, TriggerKey} from '../core/trigger-key';

export abstract class BaseAction {
  abstract readonly attrName: string;

  protected readonly triggerKey: Signal.State<TriggerKey>;

  private readonly boundOnAction = this.onAction.bind(this);
  private readonly observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName &&
        mutation.target instanceof Element
      ) {
        if (mutation.attributeName === this.attrName) {
          this.onTriggerKeyChanged(mutation.target);
        } else if (mutation.attributeName.startsWith(`${this.attrName}-`)) {
          const subAttrName = mutation.attributeName.slice(
            this.attrName.length + 1,
          );
          this.onAttributeChanged(subAttrName, mutation.target);
        }
      }
    }
  });

  constructor(readonly defaultTriggerKey: TriggerKey) {
    this.triggerKey = signal(defaultTriggerKey);
  }

  observe(element: Element): void {
    element.addEventListener(ActionEvent.TYPE, this.boundOnAction);
    this.onTriggerKeyChanged(element);
    this.initAttributes(element);
    this.observer.observe(element, {attributes: true});
  }
  unobserve(element: Element): void {
    element.removeEventListener(ActionEvent.TYPE, this.boundOnAction);
    this.observer.disconnect();
  }

  protected initAttributes(_element: Element): void {}
  protected onAttributeChanged(
    _attributeName: string,
    _element: Element,
  ): void {}
  protected onTriggerKeyChanged(element: Element): void {
    const attr = element.getAttribute(this.attrName);
    if (attr !== null) {
      this.triggerKey.set(parseTriggerKey(attr));
    } else {
      this.triggerKey.set(this.defaultTriggerKey);
    }
  }

  private maybeTrigger(event: KeyboardEvent, element: Element): void {
    if (matchesKey(this.triggerKey.get(), event)) {
      this.onTrigger(element);
    }
  }
  private onAction(event: Event): void {
    if (
      event instanceof ActionEvent &&
      event.currentTarget instanceof Element
    ) {
      this.maybeTrigger(event.keyboardEvent, event.currentTarget);
    }
  }

  protected abstract onTrigger(element: Element): unknown;
}
