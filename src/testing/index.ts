import {Vine} from 'grapevine';

import {$handService, HandService} from '../core/hand-service';
import {initialize as coreInitialize, InitOptions} from '../core/initialize';

import {TestFace} from './test-face';

export function initialize(options: InitOptions = {}): Vine {
  const vine = coreInitialize(options);
  const prefix = options.prefix ?? 'pb';
  const tagName = `${prefix}-test-face`;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TestFace);
  }
  return vine;
}

export {$handService, HandService, TestFace};
