# Pieces Directory

This directory contains tabletop piece components for Protoboard.

## Directory Inventory

- [`base-piece.ts`](./base-piece.ts): Base piece component abstraction (`BasePiece`) implementing active face state and slot projection.
- [`d1.ts`](./d1.ts): Single-faced piece component (`D1`) extending `BasePiece` with a single face (`face0`).
- [`d2.ts`](./d2.ts): Two-faced piece component (`D2`) extending `BasePiece` with two faces (`face0`, `face1`) and flipping/rolling actions.
