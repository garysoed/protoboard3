import {Signal} from '@lit-labs/signals';

import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class DropAction extends BaseAction {
  readonly attrName = 'action-drop';
  readonly label = 'Drop';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
  ) {
    super(parseTriggerKey('Space'));
  }

  protected override onTrigger(element: Element): void {
    const piece = this.handService.get()?.pop();
    if (piece) {
      element.appendChild(piece);
    }
  }
}
