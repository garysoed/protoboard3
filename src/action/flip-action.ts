import {parseTriggerKey} from '../core/trigger-key';
import {BasePiece} from '../pieces/base-piece';

import {BaseAction} from './base-action';
import {flip} from './flip';

export class FlipAction extends BaseAction {
  readonly attrName = 'action-flip';
  readonly label = 'Flip';

  constructor() {
    super(parseTriggerKey('f'));
  }

  protected override onTrigger(element: Element): void {
    if (element instanceof BasePiece) {
      flip(element.activeFace, element.sides);
    }
  }
}
