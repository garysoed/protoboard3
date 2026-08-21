import {computed, signal, SignalWatcher} from '@lit-labs/signals';

import {BaseAction} from '../action/base-action';
import {FlipAction} from '../action/flip-action';
import {NextFaceAction} from '../action/next-face-action';
import {PickAction} from '../action/pick-action';
import {PrevFaceAction} from '../action/prev-face-action';
import {RollAction} from '../action/roll-action';
import {RotateAction} from '../action/rotate-action';
import {ActionEvent} from '../core/action-event';
import {BaseElement} from '../core/base-element';
import {HandService, handServiceContext} from '../core/hand-service';
import {initialize as coreInitialize, InitOptions} from '../core/initialize';
import {matchesKey, parseTriggerKey, TriggerKey} from '../core/trigger-key';
import {BasePiece} from '../pieces/base-piece';
import {D1} from '../pieces/d1';
import {D2} from '../pieces/d2';

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
  D2,
  FlipAction,
  HandService,
  handServiceContext,
  matchesKey,
  NextFaceAction,
  parseTriggerKey,
  PickAction,
  PrevFaceAction,
  RollAction,
  RotateAction,
  signal,
  SignalWatcher,
  TestFace,
};
export type {TriggerKey};
