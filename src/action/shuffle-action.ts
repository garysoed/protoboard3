import {parseTriggerKey} from '../core/trigger-key';

import {BaseAction} from './base-action';

export class ShuffleAction extends BaseAction {
  readonly attrName = 'action-shuffle';
  readonly label = 'Shuffle';

  constructor() {
    super(parseTriggerKey('s'));
  }

  protected override onTrigger(element: Element): void {
    const children = Array.from(element.children);
    for (let i = children.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const childI = children[i];
      const childJ = children[j];
      if (childI && childJ) {
        children[i] = childJ;
        children[j] = childI;
      }
    }
    for (const child of children) {
      element.appendChild(child);
    }
  }
}
