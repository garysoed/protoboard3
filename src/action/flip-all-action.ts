import {parseTriggerKey} from '../core/trigger-key';
import {BasePiece} from '../pieces/base-piece';

import {BaseAction} from './base-action';
import {flip} from './flip';

export class FlipAllAction extends BaseAction {
  readonly attrName = 'action-flip-all';
  readonly label = 'Flip all';

  constructor() {
    super(parseTriggerKey('f'));
  }

  protected override onTrigger(element: Element): void {
    const children = Array.from(element.children);
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (child) {
        element.appendChild(child);
      }
    }
    for (const child of children) {
      if (child instanceof BasePiece) {
        flip(child.activeFace, child.sides);
      }
    }
  }
}
