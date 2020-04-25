import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import {join} from 'path';
import {dependencies, peerDependencies} from './package.json';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import {copyPkgJsonPlugin as copyPkgJson} from '@alorel/rollup-plugin-copy-pkg-json';
import {dtsPlugin as dts} from '@alorel/rollup-plugin-dts';
import {copyPlugin as cpPlugin} from '@alorel/rollup-plugin-copy';

function mkOutput(overrides = {}) {
  return {
    entryFileNames: '[name].js',
    assetFileNames: '../[name][extname]',
    sourcemap: false,
    ...overrides
  };
}

const baseSettings = {
  input: join(__dirname, 'src', 'index.ts'),
  external: Array.from(
    new Set(
      Object.keys(dependencies)
        .concat(Object.keys(peerDependencies))
        .concat('util', 'fs', 'path', 'crypto')
    )
  ),
  preserveModules: true,
  watch: {
    exclude: 'node_modules/*'
  }
}

function plugins(add = [], tscOpts = {}) {
  return [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.json'),
      ...tscOpts
    }),
    nodeResolve(),
    commonjs()
  ].concat(add);
}

export default [
  {
    ...baseSettings,
    output: mkOutput({
      dir: join(__dirname, 'dist'),
      format: 'cjs',
      plugins: [
        copyPkgJson({
          unsetPaths: ['devDependencies', 'scripts']
        }),
        dts()
      ]
    }),
    plugins: plugins([
      cleanPlugin({
        dir: join(__dirname, 'dist')
      }),
      cpPlugin({
        defaultOpts: {
          glob: {
            cwd: __dirname
          },
          emitNameKind: 'fileName'
        },
        copy: [
          'LICENSE',
          'CHANGELOG.md',
          'README.md',
          {from: 'loadStyle.js', opts: {glob: {cwd: join(__dirname, 'src')}}}
        ]
      })
    ])
  },
  {
    ...baseSettings,
    output: mkOutput({
      dir: join(__dirname, 'dist', 'esm'),
      format: 'esm'
    }),
    plugins: plugins([], {outDir: 'dist/esm'})
  }
];
