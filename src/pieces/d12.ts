import {signal} from '@lit-labs/signals';

import {FlipAction} from '../action/flip-action';
import {NextFaceAction} from '../action/next-face-action';
import {PrevFaceAction} from '../action/prev-face-action';
import {RollAction} from '../action/roll-action';

import {BasePiece} from './base-piece';

export class D12 extends BasePiece {
  readonly sides = 12;

  constructor() {
    super('D12', () => [
      new FlipAction(),
      new NextFaceAction(this.activeFace, signal(this.sides)),
      new PrevFaceAction(this.activeFace, signal(this.sides)),
      new RollAction(() => {
        this.activeFace.set(Math.floor(Math.random() * this.sides));
      }),
    ]);
  }
}
