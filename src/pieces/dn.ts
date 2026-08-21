import {signal} from '@lit-labs/signals';
import {PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

import {NextFaceAction} from '../action/next-face-action';
import {PrevFaceAction} from '../action/prev-face-action';
import {RollAction} from '../action/roll-action';

import {BasePiece} from './base-piece';

export class DN extends BasePiece {
  @property({type: Number})
  accessor sides = 6;

  private readonly totalSides = signal(6);

  constructor() {
    super(() => [
      new NextFaceAction(this.activeFace, this.totalSides),
      new PrevFaceAction(this.activeFace, this.totalSides),
      new RollAction(() => {
        this.activeFace.set(
          Math.floor(Math.random() * Math.max(1, this.totalSides.get())),
        );
      }),
    ]);
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('sides')) {
      this.totalSides.set(this.sides);
      const totalSides = Math.max(1, this.sides);
      if (this.activeFace.get() >= totalSides) {
        this.activeFace.set(this.activeFace.get() % totalSides);
      }
    }
  }
}
