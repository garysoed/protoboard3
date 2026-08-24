import {Signal} from '@lit-labs/signals';

import {ActionEvent} from '../core/action-event';
import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class DropAllAction extends BaseAction {
  readonly attrName = 'action-drop-all';
  readonly label = 'Drop all';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
    private readonly onDrop: (target: Element, event: ActionEvent) => unknown,
  ) {
    super(parseTriggerKey('Shift+Space'));
  }

  protected override onTrigger(_element: Element, event: ActionEvent): void {
    const handService = this.handService.get();
    if (!handService) {
      return;
    }
    const targets = handService.popAll();
    for (const target of targets) {
      this.onDrop(target, event);
    }
  }
}
