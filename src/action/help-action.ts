import {QueryActionsEvent} from '../core/action-descriptor';
import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class HelpAction extends BaseAction {
  readonly attrName = 'action-help';
  readonly label = 'Help';

  constructor() {
    super(parseTriggerKey('?'));
  }

  protected override onTrigger(element: Element): void {
    element.dispatchEvent(new QueryActionsEvent(element, []));
  }
}
