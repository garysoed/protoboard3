import {computed, signal} from '@lit-labs/signals';

import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

const DEFAULT_STOPS: readonly number[] = [0, 90, 180, 270];

export class RotateAction extends BaseAction {
  readonly attrName = 'action-rotate';
  readonly label = 'Rotate';

  private readonly stops = signal<readonly number[]>(DEFAULT_STOPS);
  private readonly currentAngle = computed(() => {
    const stops = this.stops.get();
    return stops[this.stopIndex.get() % stops.length] ?? 0;
  });
  private readonly stopIndex = signal(0);

  constructor() {
    super(parseTriggerKey('t'));
  }

  protected override initAttributes(element: Element): void {
    this.updateStops(element);
  }
  protected override onAttributeChanged(
    attributeName: string,
    element: Element,
  ): void {
    if (attributeName === 'stops') {
      this.updateStops(element);
    }
  }
  protected override onTrigger(element: Element): void {
    const stops = this.stops.get();
    this.stopIndex.set((this.stopIndex.get() + 1) % stops.length);
    this.applyRotation(element);
  }

  private applyRotation(element: Element): void {
    if (element instanceof HTMLElement) {
      const angle = this.currentAngle.get();
      element.style.transform = angle !== 0 ? `rotate(${angle}deg)` : '';
    }
  }
  private updateStops(element: Element): void {
    const raw = element.getAttribute('action-rotate-stops');
    if (!raw) {
      this.stops.set(DEFAULT_STOPS);
    } else {
      const angles = raw
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      this.stops.set(angles.length > 0 ? angles : DEFAULT_STOPS);
    }
    this.applyRotation(element);
  }
}
