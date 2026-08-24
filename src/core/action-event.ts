export interface MousePosition {
  readonly x: number;
  readonly y: number;
}

export class ActionEvent extends Event {
  static readonly TYPE = 'pb-action';

  constructor(
    readonly key: string,
    readonly keyboardEvent: KeyboardEvent,
    readonly mousePosition: MousePosition,
  ) {
    super(ActionEvent.TYPE, {
      bubbles: true,
      composed: true,
    });
  }
}
