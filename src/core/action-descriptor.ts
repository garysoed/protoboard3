import {TriggerKey} from './trigger-key';

export interface ActionDescriptor {
  readonly id: unknown;
  readonly label: string;
  readonly shortcut: TriggerKey;
}

export interface ActionGroup {
  readonly actions: readonly ActionDescriptor[];
  readonly name: string;
}

export interface QueryActionsDetail {
  readonly actionGroups: ActionGroup[];
  readonly targetElement: Element;
}

export class QueryActionsEvent extends CustomEvent<QueryActionsDetail> {
  static readonly TYPE = 'pb-query-actions';

  constructor(targetElement: Element, actionGroups: ActionGroup[]) {
    super(QueryActionsEvent.TYPE, {
      bubbles: true,
      composed: true,
      detail: {
        actionGroups,
        targetElement,
      },
    });
  }

  addActionGroup(group: ActionGroup): void {
    this.detail.actionGroups.push(group);
  }
}
