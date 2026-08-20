# Action Directory

This directory contains reusable, composable action classes for tabletop pieces and elements.

## Directory Inventory

- [`base-action.ts`](./base-action.ts): Abstract base class for declarative keyboard and attribute-configured actions (`BaseAction`).
- [`next-face-action.ts`](./next-face-action.ts): Action that advances the target piece to its next face (`NextFaceAction`).
- [`pick-action.ts`](./pick-action.ts): Action that pushes the target element into the hand stack (`PickAction`).
- [`prev-face-action.ts`](./prev-face-action.ts): Action that steps back the target piece to its previous face (`PrevFaceAction`).
- [`roll-action.ts`](./roll-action.ts): Action that triggers rolling behavior on the target piece (`RollAction`).
- [`rotate-action.ts`](./rotate-action.ts): Action that rotates the target piece (`RotateAction`).
