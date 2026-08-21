# Pieces Directory

This directory contains tabletop piece components for Protoboard.

## Directory Inventory

- [`base-piece.ts`](./base-piece.ts): Base piece component abstraction (`BasePiece`) implementing active face state and slot projection.
- [`d1.ts`](./d1.ts): Single-faced piece component (`D1`) extending `BasePiece` with a single face (`face0`).
- [`d12.ts`](./d12.ts): Twelve-faced piece component (`D12`) extending `BasePiece` with 12 faces (`face0`..`face11`) and flipping/rolling actions.
- [`d2.ts`](./d2.ts): Two-faced piece component (`D2`) extending `BasePiece` with two faces (`face0`, `face1`) and flipping/rolling actions.
- [`d20.ts`](./d20.ts): Twenty-faced piece component (`D20`) extending `BasePiece` with 20 faces (`face0`..`face19`) and flipping/rolling actions.
- [`d4.ts`](./d4.ts): Four-faced piece component (`D4`) extending `BasePiece` with four faces (`face0`..`face3`) and flipping/rolling actions.
- [`d6.ts`](./d6.ts): Six-faced piece component (`D6`) extending `BasePiece` with six faces (`face0`..`face5`) and flipping/rolling actions.
- [`d8.ts`](./d8.ts): Eight-faced piece component (`D8`) extending `BasePiece` with eight faces (`face0`..`face7`) and flipping/rolling actions.
