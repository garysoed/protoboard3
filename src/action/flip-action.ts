import {Signal} from '@lit-labs/signals';

import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class FlipAction extends BaseAction {
  readonly attrName = 'action-flip';
  readonly label = 'Flip';

  constructor(
    private readonly activeFace: Signal.State<number>,
    private readonly totalSides: number,
  ) {
    super(parseTriggerKey('f'));
  }

  protected override onTrigger(): void {
    const totalSides = Math.max(1, this.totalSides);
    this.activeFace.set(totalSides - 1 - this.activeFace.get());
  }
}
