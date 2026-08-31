import {parseTriggerKey} from '../core/trigger-key';
import {ChuteLayer} from '../regions/chute-layer';

import {BaseAction} from './base-action';

export class FlushAction extends BaseAction {
  readonly attrName = 'action-flush';
  readonly label = 'Flush';

  constructor() {
    super(parseTriggerKey('f'));
  }

  protected override onTrigger(element: Element): void {
    const targetAttribute = element.getAttribute('target');
    if (!targetAttribute) {
      return;
    }
    const targetId = targetAttribute.startsWith('#')
      ? targetAttribute.slice(1)
      : targetAttribute;
    const rootNode = element.getRootNode();
    if (!(rootNode instanceof Document || rootNode instanceof ShadowRoot)) {
      return;
    }
    const targetElement = rootNode.getElementById(targetId);
    if (!targetElement) {
      return;
    }

    const trappedPieces = Array.from(element.children).filter(
      (child) => !(child instanceof ChuteLayer),
    );
    for (const piece of trappedPieces) {
      if (piece instanceof HTMLElement) {
        piece.style.position = '';
        piece.style.left = '';
        piece.style.top = '';
      }
      targetElement.appendChild(piece);
    }
  }
}
