import {computed, signal, SignalWatcher} from '@lit-labs/signals';

import {BaseAction} from '../action/base-action';
import {PickAction} from '../action/pick-action';
import {RotateAction} from '../action/rotate-action';
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
  BaseAction,
  BaseElement,
  BasePiece,
  computed,
  D1,
  HandService,
  handServiceContext,
  matchesKey,
  parseTriggerKey,
  PickAction,
  RotateAction,
  signal,
  SignalWatcher,
  TestFace,
};
export type {TriggerKey};
