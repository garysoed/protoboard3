import {ActionEvent} from '../core/action-event';
import {BaseElement} from '../core/base-element';
import {HandService, handServiceContext} from '../core/hand-service';
import {initialize as coreInitialize, InitOptions} from '../core/initialize';
import {matchesKey, parseTriggerKey, TriggerKey} from '../core/trigger-key';
import {D1} from '../pieces/d1';

import {TestFace} from './test-face';

export function initialize(options: InitOptions = {}): void {
  coreInitialize(options);
  const prefix = options.prefix ?? 'pb';
  const tagName = `${prefix}-test-face`;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TestFace);
  }
}

export {
  ActionEvent,
  BaseElement,
  D1,
  HandService,
  handServiceContext,
  matchesKey,
  parseTriggerKey,
  TestFace,
};
export type {TriggerKey};
