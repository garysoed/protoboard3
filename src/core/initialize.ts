import {Vine} from 'grapevine';

import {D1} from '../pieces/d1';

export interface InitOptions {
  readonly ignoreExisting?: boolean;
  readonly prefix?: string;
  readonly vine?: Vine;
}

const DEFINITIONS: Record<string, CustomElementConstructor> = {
  d1: D1,
};

export function initialize(options: InitOptions = {}): Vine {
  const vine = options.vine ?? new Vine();

  const prefix = options.prefix ?? 'pb';
  const ignoreExisting = options.ignoreExisting ?? false;

  for (const [tag, elementClass] of Object.entries(DEFINITIONS)) {
    const tagName = `${prefix}-${tag}`;
    if (ignoreExisting && customElements.get(tagName)) {
      continue;
    }
    customElements.define(tagName, elementClass);
  }

  return vine;
}
