# Protoboard

Protoboard is a declarative HTML/Web Component library for rapid prototyping of tabletop and board games in the browser.

## Documentation

For technical design specifications and architectural guidelines, see the [`docs/`](./docs) directory.

## Directory Inventory

- [`.eslintrc.yml`](./.eslintrc.yml): ESLint linter configuration extending `devbase/ts/.eslintrc.yml` with local build output ignore rules.
- [`.gitignore`](./.gitignore): Git ignore rules for node_modules, build outputs, and local artifacts.
- [`.prettierignore`](./.prettierignore): Prettier ignore rules symlinked from `devbase/ts/.prettierignore`.
- [`.prettierrc.yml`](./.prettierrc.yml): Prettier code formatting configuration symlinked from `devbase/ts/.prettierrc.yml`.
- [`package-lock.json`](./package-lock.json): Automatically generated lockfile defining the resolved dependency tree.
- [`package.json`](./package.json): Package metadata, dependency declarations, and script definitions for the Protoboard library.
- [`README.md`](./README.md): Project overview and directory documentation for the repository root.
- [`rollup.config.mjs`](./rollup.config.mjs): Rollup bundler configuration generating the standalone minified IIFE bundle and ESM module.
- [`tsconfig.json`](./tsconfig.json): TypeScript compiler configuration tailored for modern web component development.
