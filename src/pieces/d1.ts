import {BasePiece} from './base-piece';

export class D1 extends BasePiece {
  readonly sides = 1;

  protected override readonly defaultName = 'D1';

  constructor() {
    super(() => []);
  }
}
