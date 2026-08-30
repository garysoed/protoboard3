import {computed, signal, SignalWatcher} from '@lit-labs/signals';
import {html} from 'lit';

import {BaseAction} from '../action/base-action';
import {DropAction} from '../action/drop-action';
import {DropAllAction} from '../action/drop-all-action';
import {flip} from '../action/flip';
import {FlipAction} from '../action/flip-action';
import {FlipAllAction} from '../action/flip-all-action';
import {HelpAction} from '../action/help-action';
import {NextFaceAction} from '../action/next-face-action';
import {PickAction} from '../action/pick-action';
import {PickAllAction} from '../action/pick-all-action';
import {PickRandomAction} from '../action/pick-random-action';
import {PrevFaceAction} from '../action/prev-face-action';
import {RollAction} from '../action/roll-action';
import {RotateAction} from '../action/rotate-action';
import {ShuffleAction} from '../action/shuffle-action';
import {
  ActionDescriptor,
  ActionGroup,
  QueryActionsDetail,
  QueryActionsEvent,
} from '../core/action-descriptor';
import {ActionEvent, MousePosition} from '../core/action-event';
import {ActionPopup} from '../core/action-popup';
import {BaseElement} from '../core/base-element';
import {Coordinates, HandOverlay} from '../core/hand-overlay';
import {HandService, handServiceContext} from '../core/hand-service';
import {initialize as coreInitialize, InitOptions} from '../core/initialize';
import {
  getTriggerKeyParts,
  matchesKey,
  parseTriggerKey,
  TriggerKey,
} from '../core/trigger-key';
import {BasePiece} from '../pieces/base-piece';
import {D1} from '../pieces/d1';
import {D12} from '../pieces/d12';
import {D2} from '../pieces/d2';
import {D20} from '../pieces/d20';
import {D4} from '../pieces/d4';
import {D6} from '../pieces/d6';
import {D8} from '../pieces/d8';
import {DN} from '../pieces/dn';
import {Bag} from '../regions/bag';
import {BaseRegion} from '../regions/base-region';
import {Deck} from '../regions/deck';
import {Slot} from '../regions/slot';

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
  ActionPopup,
  Bag,
  BaseAction,
  BaseElement,
  BasePiece,
  BaseRegion,
  computed,
  D1,
  D12,
  D2,
  D20,
  D4,
  D6,
  D8,
  Deck,
  DN,
  DropAction,
  DropAllAction,
  FlipAction,
  FlipAllAction,
  flip,
  getTriggerKeyParts,
  HandOverlay,
  HandService,
  handServiceContext,
  HelpAction,
  html,
  matchesKey,
  NextFaceAction,
  parseTriggerKey,
  PickAction,
  PickAllAction,
  PickRandomAction,
  PrevFaceAction,
  QueryActionsEvent,
  RollAction,
  RotateAction,
  ShuffleAction,
  signal,
  SignalWatcher,
  Slot,
  TestFace,
};
export type {
  ActionDescriptor,
  ActionGroup,
  Coordinates,
  MousePosition,
  QueryActionsDetail,
  TriggerKey,
};
