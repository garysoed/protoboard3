import path from 'path';
import {fileURLToPath} from 'url';

import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localPkgsResolver = {
  name: 'resolve-local-pkgs',
  resolveId(source) {
    if (source.startsWith('gs-tools/export/')) {
      const subpath = source.replace('gs-tools/export/', '');
      return path.resolve(
        __dirname,
        'node_modules/gs-tools/export',
        `${subpath}.ts`,
      );
    }
    return null;
  },
};

const litCssPlugin = {
  name: 'lit-css',
  transform(code, id) {
    if (id.endsWith('.css')) {
      const escaped = code
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
      return {
        code: `import {css} from 'lit';\nexport default css\`${escaped}\`;`,
        map: {mappings: ''},
      };
    }
    return null;
  },
};

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/protoboard.min.js',
        format: 'iife',
        name: 'Protoboard',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      localPkgsResolver,
      litCssPlugin,
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.css'],
      }),
      typescript({
        declaration: true,
        declarationDir: './dist/types',
        exclude: ['**/*.test.ts'],
        include: [
          'src/**/*.ts',
          'node_modules/gs-tools/src/data/**/*.ts',
          'node_modules/gs-tools/src/core/**/*.ts',
          'node_modules/gs-tools/export/data.ts',
        ],
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: 'src/testing/index.ts',
    output: [
      {
        file: 'dist/testing.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/testing.min.js',
        format: 'iife',
        name: 'Protoboard',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      localPkgsResolver,
      litCssPlugin,
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.css'],
      }),
      typescript({
        declaration: false,
        declarationDir: undefined,
        exclude: ['**/*.test.ts'],
        include: [
          'src/**/*.ts',
          'node_modules/gs-tools/src/data/**/*.ts',
          'node_modules/gs-tools/src/core/**/*.ts',
          'node_modules/gs-tools/export/data.ts',
        ],
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: 'site/src/main.ts',
    output: [
      {
        file: 'site/dist/site.min.js',
        format: 'es',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      localPkgsResolver,
      litCssPlugin,
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.css'],
      }),
      typescript({
        declaration: false,
        declarationDir: undefined,
        exclude: ['**/*.test.ts'],
        include: [
          'site/**/*.ts',
          'src/**/*.ts',
          'typedef.d.ts',
          '*.d.ts',
          'node_modules/gs-tools/src/data/**/*.ts',
          'node_modules/gs-tools/src/core/**/*.ts',
          'node_modules/gs-tools/export/data.ts',
        ],
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
