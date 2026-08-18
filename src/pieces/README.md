# Pieces Directory

This directory contains tabletop piece components for Protoboard.

## Directory Inventory

- [`base-piece.ts`](./base-piece.ts): Base piece component abstraction (`BasePiece`) implementing active face state, slot projection, piece actions (`pick`, `roll`, `nextFace`, `prevFace`, `rotate`), and rotation styling.
- [`d1.ts`](./d1.ts): Single-faced piece component (`D1`) extending `BasePiece` with a single face (`face0`).
