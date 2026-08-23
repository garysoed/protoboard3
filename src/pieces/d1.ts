import {BasePiece} from './base-piece';

export class D1 extends BasePiece {
  readonly sides = 1;

  constructor() {
    super('D1', () => []);
  }
}
