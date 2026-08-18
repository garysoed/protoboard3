import {ActionEvent} from '../core/action-event';
import {BaseElement} from '../core/base-element';
import {HandService, handServiceContext} from '../core/hand-service';
import {initialize as coreInitialize, InitOptions} from '../core/initialize';
import {matchesKey, parseTriggerKey, TriggerKey} from '../core/trigger-key';
import {BasePiece} from '../pieces/base-piece';
import {D1} from '../pieces/d1';

import {TestFace} from './test-face';

export function initialize(options: InitOptions = {}): void {
  coreInitialize(options);
  const prefix = options.prefix ?? 'pb';
  const testFaceTag = `${prefix}-test-face`;
  if (!customElements.get(testFaceTag)) {
    customElements.define(testFaceTag, TestFace);
  }
}

export {
  ActionEvent,
  BaseElement,
  BasePiece,
  D1,
  HandService,
  handServiceContext,
  matchesKey,
  parseTriggerKey,
  TestFace,
};
export type {TriggerKey};
