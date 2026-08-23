# Core Directory

This directory contains the core infrastructure, base element abstraction, and action dispatching systems for Protoboard.

## Directory Inventory

- [`action-descriptor.ts`](./action-descriptor.ts): Action metadata interfaces and action query bubbling event (`ActionDescriptor`, `ActionGroup`, `QueryActionsDetail`, `QueryActionsEvent`).
- [`action-event.ts`](./action-event.ts): Custom bubbling event dispatched on keydown when hovered (`ActionEvent`).
- [`base-element.ts`](./base-element.ts): Base LitElement component providing Context access, hover tracking, name customization, and declarative action registration (`BaseElement`).
- [`hand-overlay.ts`](./hand-overlay.ts): Fixed floating overlay component (`HandOverlay`).
- [`hand-service.ts`](./hand-service.ts): LIFO hand stack service and cursor positioning (`HandService`, `handServiceContext`).
- [`initialize.ts`](./initialize.ts): Custom element registration and context provider initialization (`initialize`).
- [`trigger-key.ts`](./trigger-key.ts): Keyboard trigger matching interface and evaluator (`TriggerKey`, `matchesKey`, `parseTriggerKey`).
