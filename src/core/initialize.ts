import {ContextProvider} from '@lit/context';

import {D1} from '../pieces/d1';
import {D12} from '../pieces/d12';
import {D2} from '../pieces/d2';
import {D20} from '../pieces/d20';
import {D4} from '../pieces/d4';
import {D6} from '../pieces/d6';
import {D8} from '../pieces/d8';
import {DN} from '../pieces/dn';
import {Bag} from '../regions/bag';
import {ChuteLayer} from '../regions/chute-layer';
import {Deck} from '../regions/deck';
import {Slot} from '../regions/slot';

import {ActionPopup} from './action-popup';
import {HandOverlay} from './hand-overlay';
import {HandService, handServiceContext} from './hand-service';

export interface InitOptions {
  readonly ignoreExisting?: boolean;
  readonly prefix?: string;
  readonly root?: HTMLElement;
}

const DEFINITIONS: Record<string, CustomElementConstructor> = {
  'action-popup': ActionPopup,
  bag: Bag,
  'chute-layer': ChuteLayer,
  d1: D1,
  d12: D12,
  d2: D2,
  d20: D20,
  d4: D4,
  d6: D6,
  d8: D8,
  deck: Deck,
  dn: DN,
  'hand-overlay': HandOverlay,
  slot: Slot,
};

export function initialize(options: InitOptions = {}): void {
  const handService = new HandService();

  const root = options.root ?? document.body ?? document.documentElement;
  new ContextProvider(root, {
    context: handServiceContext,
    initialValue: handService,
  });

  const prefix = options.prefix ?? 'pb';
  const ignoreExisting = options.ignoreExisting ?? false;

  for (const [tag, elementClass] of Object.entries(DEFINITIONS)) {
    const tagName = `${prefix}-${tag}`;
    if (ignoreExisting && customElements.get(tagName)) {
      continue;
    }
    customElements.define(tagName, elementClass);
  }
}
