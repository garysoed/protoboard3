---
name: update-docs
description: >-
  Maintain and synchronize user documentation, API references, directory READMEs, and implementation roadmaps.
  Use when components, actions, services, attributes, or APIs are added, modified, or removed.
---

# Documentation Maintenance Skill

This skill defines the procedures and standards for keeping Protoboard's documentation accurate, synchronized, and aligned with project conventions whenever the codebase evolves.

## 1. Documentation Targets & Responsibilities

### User-Facing Guide & API Reference (`README.md`)

Update the root [`README.md`](../../../README.md) whenever user-accessible features or programmatic interfaces change:

- **Components & Markup**: New custom element tags (e.g. `<pb-d1>` through `<pb-dn>`, `<pb-slot>`, `<pb-deck>`, `<pb-bag>`, `<pb-chute>`).
- **Actions & Keybindings**: New or modified actions, keybindings, and default shortcuts.
- **Attributes**: New HTML attributes (e.g. `action-*`, `name`, `sides`, `target`, `layer`, `chance`, `action-rotate-stops`).
- **API Reference**: Changes to `initialize(options?: InitOptions)`, public exports, component class hierarchies, action constructors, runtime services (`HandService`), and events.
- **Root Directory Inventory**: Maintain the root directory file list at the bottom of the `README.md`.

### Directory Documentation (`README.md`)

Maintain `README.md` in every directory following strict project guidelines:

- **Current Directory Only**: Only list and describe files located directly in the current directory.
- **No Subdirectory Descriptions**: Subdirectories may be linked for navigation, but must not be described.
- **Exclude Test Files**: Never list or describe test files (e.g. `*.test.ts`).
- **No Duplication**: Do not duplicate file listings or descriptions across multiple sections in the same `README.md`.
- **Alphabetical Sorting**: Keep file listings sorted alphabetically.

### Implementation Roadmap (`docs/azul.impl.md`)

Update roadmap checklists in [`docs/azul.impl.md`](../../../docs/azul.impl.md):

- Mark completed tasks and subtasks with `[x]` upon finishing their implementation.
- Keep dependency graph and section numbering synchronized if tasks are refactored.

---

## 2. Maintenance Workflow

### Step 1: Analyze Scope of Changes

Identify all modified, created, or deleted files:

```bash
jj status
```

Determine if changes affect:

- User-facing markup, shortcuts, APIs, or classes &rarr; update root `README.md`.
- Directory file composition &rarr; update the corresponding directory `README.md`.
- Roadmap milestones &rarr; update `docs/azul.impl.md`.

### Step 2: Apply Documentation Updates

Edit target documentation files to reflect the exact state of the codebase. Ensure code snippets and examples are syntactically valid and use non-typecast TypeScript/HTML patterns.

### Step 3: Format & Validate

Format all documentation and verify linting:

```bash
npm run format
npm run lint
```
