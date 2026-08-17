# Core Directory

This directory contains the core infrastructure, base element abstraction, and action dispatching systems for Protoboard.

## Directory Inventory

- [`action-event.ts`](./action-event.ts): Custom bubbling event dispatched on keydown when hovered (`ActionEvent`).
- [`base-element.ts`](./base-element.ts): Base LitElement component providing Context access, hover tracking, and declarative action registration (`BaseElement`).
- [`hand-overlay.ts`](./hand-overlay.ts): Fixed floating overlay component (`HandOverlay`).
- [`hand-service.ts`](./hand-service.ts): LIFO hand stack service and cursor positioning (`HandService`, `handServiceContext`).
- [`initialize.ts`](./initialize.ts): Custom element registration and context provider initialization (`initialize`).
- [`trigger-key.ts`](./trigger-key.ts): Keyboard trigger matching interface and evaluator (`TriggerKey`, `matchesKey`, `parseTriggerKey`).
