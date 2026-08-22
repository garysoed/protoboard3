import {Signal} from '@lit-labs/signals';

import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class PickAction extends BaseAction {
  readonly attrName = 'action-pick';
  readonly label = 'Pick';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
  ) {
    super(parseTriggerKey('c'));
  }

  protected override onTrigger(element: Element): void {
    this.handService.get()?.push(element);
  }
}
