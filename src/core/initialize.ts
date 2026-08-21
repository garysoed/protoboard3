import {ContextProvider} from '@lit/context';

import {D1} from '../pieces/d1';
import {D2} from '../pieces/d2';

import {HandOverlay} from './hand-overlay';
import {HandService, handServiceContext} from './hand-service';

export interface InitOptions {
  readonly ignoreExisting?: boolean;
  readonly prefix?: string;
  readonly root?: HTMLElement;
}

const DEFINITIONS: Record<string, CustomElementConstructor> = {
  d1: D1,
  d2: D2,
  'hand-overlay': HandOverlay,
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
