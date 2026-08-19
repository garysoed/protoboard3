import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class PickAction extends BaseAction {
  readonly attrName = 'action-pick';

  constructor(private readonly getHandService: () => HandService | undefined) {
    super(parseTriggerKey('c'));
  }

  protected override onTrigger(element: Element): void {
    this.getHandService()?.push(element);
  }
}
