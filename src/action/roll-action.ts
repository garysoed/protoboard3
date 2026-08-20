import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class RollAction extends BaseAction {
  readonly attrName = 'action-roll';

  constructor(
    private readonly onRoll: (element: Element) => Promise<void> | void,
  ) {
    super(parseTriggerKey('r'));
  }

  protected override onTrigger(element: Element): Promise<void> | void {
    return this.onRoll(element);
  }
}
