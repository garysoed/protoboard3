import {Signal} from '@lit-labs/signals';

import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class PickAllAction extends BaseAction {
  readonly attrName = 'action-pick-all';
  readonly label = 'Pick all';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
  ) {
    super(parseTriggerKey('Shift+C'));
  }

  protected override onTrigger(element: Element): void {
    const handService = this.handService.get();
    if (!handService) {
      return;
    }
    while (element.lastElementChild) {
      handService.push(element.lastElementChild);
    }
  }
}
