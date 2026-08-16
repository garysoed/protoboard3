import path from 'path';
import {fileURLToPath} from 'url';

import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localPkgsResolver = {
  name: 'resolve-local-pkgs',
  resolveId(source) {
    if (source === 'grapevine') {
      return path.resolve(__dirname, 'node_modules/grapevine/export/index.ts');
    }
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

export default {
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
    nodeResolve({
      extensions: ['.js', '.ts', '.mjs'],
    }),
    typescript({
      declaration: true,
      declarationDir: './dist/types',
      exclude: ['**/*.test.ts'],
      include: [
        'src/**/*.ts',
        'node_modules/grapevine/**/*.ts',
        'node_modules/gs-tools/**/*.ts',
      ],
      tsconfig: './tsconfig.json',
    }),
  ],
};
