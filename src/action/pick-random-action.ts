import {Signal} from '@lit-labs/signals';

import {HandService} from '../core/hand-service';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class PickRandomAction extends BaseAction {
  readonly attrName = 'action-pick';
  readonly label = 'Pick';

  constructor(
    private readonly handService: Signal.State<HandService | undefined>,
  ) {
    super(parseTriggerKey('c'));
  }

  protected override onTrigger(element: Element): void {
    const handService = this.handService.get();
    if (!handService) {
      return;
    }
    const children = element.children;
    if (children.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * children.length);
    const chosenChild = children[randomIndex];
    if (chosenChild) {
      handService.push(chosenChild);
    }
  }
}
