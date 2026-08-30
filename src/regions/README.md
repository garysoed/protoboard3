# Regions Directory

This directory contains container and tabletop spatial region components.

## Directory Inventory

- [`bag.ts`](./bag.ts): Blind draw container region suppressing rendering of all child pieces (`Bag`).
- [`base-region.ts`](./base-region.ts): Abstract base class for container regions (`BaseRegion`).
- [`deck.ts`](./deck.ts): Stacked pile region rendering only the top piece (`Deck`).
- [`slot.ts`](./slot.ts): Tabletop spatial placement container rendering child pieces with relative drop positioning (`Slot`).
