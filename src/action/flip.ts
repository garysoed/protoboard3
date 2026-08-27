import {Signal} from '@lit-labs/signals';

export function flip(
  activeFace: Signal.State<number>,
  totalSides: number,
): void {
  const sides = Math.max(1, totalSides);
  activeFace.set(sides - 1 - activeFace.get());
}
