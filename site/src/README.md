# Site Source Directory

This directory contains the source TypeScript modules for the Protoboard documentation and interactive explorer application.

## Directory Inventory

- [`main.ts`](./main.ts): Application bootstrapper and entry point module initializing Protoboard and UI Shell elements.
- [`presets.ts`](./presets.ts): Built-in 20 face presets library importing vector SVG assets and exporting preset metadata.
- [`router.ts`](./router.ts): Client-side hash router managing page transitions, SideNav active state, and `#overview` redirect fallback.
- [`table-utils.ts`](./table-utils.ts): Helper utilities constructing standardized IBM Carbon `<cds-table>` components for attributes and actions.

See also [`components/`](./components), [`pages/`](./pages), and [`svg/`](./svg).
