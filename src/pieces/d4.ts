import {FlipAction} from '../action/flip-action';
import {NextFaceAction} from '../action/next-face-action';
import {PrevFaceAction} from '../action/prev-face-action';
import {RollAction} from '../action/roll-action';

import {BasePiece} from './base-piece';

export class D4 extends BasePiece {
  readonly sides = 4;

  constructor() {
    super(() => [
      new FlipAction(this.activeFace, this.sides),
      new NextFaceAction(this.activeFace, this.sides),
      new PrevFaceAction(this.activeFace, this.sides),
      new RollAction(() => {
        this.activeFace.set(Math.floor(Math.random() * this.sides));
      }),
    ]);
  }
}
