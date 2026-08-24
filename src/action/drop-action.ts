import {Signal} from '@lit-labs/signals';

import {ActionEvent} from '../core/action-event';
import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class DropAction extends BaseAction {
  readonly attrName = 'action-drop';
  readonly label = 'Drop';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
    private readonly onDrop: (target: Element, event: ActionEvent) => unknown,
  ) {
    super(parseTriggerKey('Space'));
  }

  protected override onTrigger(_element: Element, event: ActionEvent): void {
    const handService = this.handService.get();
    const target = handService?.pop();
    if (target) {
      this.onDrop(target, event);
    }
  }
}
