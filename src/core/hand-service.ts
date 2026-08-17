import {createContext} from '@lit/context';
import {cached} from 'gs-tools/export/data';

export class HandService {
  pop(): Element | undefined {
    const piece = this.overlay.lastElementChild;
    if (piece instanceof Element) {
      piece.remove();
      return piece;
    }
    return undefined;
  }
  push(piece: Element): void {
    this.overlay.appendChild(piece);
  }

  @cached()
  private get overlay(): HTMLElement {
    const overlay = document.createElement('pb-hand-overlay');
    document.body.appendChild(overlay);
    return overlay;
  }
}

export const handServiceContext = createContext<HandService>('pb-hand-service');
