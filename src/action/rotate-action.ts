import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class RotateAction extends BaseAction {
  readonly attrName = 'action-rotate';

  private stopIndex = 0;
  private stops: number[] = [0, 90, 180, 270];

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
    this.stopIndex = (this.stopIndex + 1) % this.stops.length;
    this.applyRotation(element);
  }

  private applyRotation(element: Element): void {
    if (element instanceof HTMLElement) {
      const angle = this.stops[this.stopIndex % this.stops.length] ?? 0;
      element.style.transform = angle !== 0 ? `rotate(${angle}deg)` : '';
    }
  }
  private updateStops(element: Element): void {
    const raw = element.getAttribute('action-rotate-stops');
    if (!raw) {
      this.stops = [0, 90, 180, 270];
    } else {
      const angles = raw
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      this.stops = angles.length > 0 ? angles : [0, 90, 180, 270];
    }
    this.applyRotation(element);
  }
}
