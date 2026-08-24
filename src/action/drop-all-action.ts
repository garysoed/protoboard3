import {Signal} from '@lit-labs/signals';

import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class DropAllAction extends BaseAction {
  readonly attrName = 'action-drop-all';
  readonly label = 'Drop all';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
  ) {
    super(parseTriggerKey('Shift+Space'));
  }

  protected override onTrigger(element: Element): void {
    const handService = this.handService.get();
    if (!handService) {
      return;
    }
    const pieces = handService.popAll();
    for (const piece of pieces) {
      element.appendChild(piece);
    }
  }
}
