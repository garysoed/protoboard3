export class ActionEvent extends Event {
  static readonly TYPE = 'pb-action';

  readonly key: string;
  readonly keyboardEvent: KeyboardEvent;

  constructor(
    key: string,
    keyboardEvent: KeyboardEvent,
    eventInitDict?: EventInit,
  ) {
    super(ActionEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInitDict,
    });
    this.key = key;
    this.keyboardEvent = keyboardEvent;
  }
}
