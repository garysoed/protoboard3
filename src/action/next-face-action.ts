import {Signal} from '@lit-labs/signals';

import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class NextFaceAction extends BaseAction {
  readonly attrName = 'action-next-face';

  constructor(
    private readonly activeFace: Signal.State<number>,
    private readonly totalSides: number,
  ) {
    super(parseTriggerKey(']'));
  }

  protected override onTrigger(): void {
    const totalSides = Math.max(1, this.totalSides);
    this.activeFace.set((this.activeFace.get() + 1) % totalSides);
  }
}
