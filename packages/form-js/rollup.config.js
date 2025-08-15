import copy from 'rollup-plugin-copy';

import pkg from './package.json';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'commonjs',
        file: pkg.main,
      },
      {
        sourcemap: true,
        format: 'esm',
        file: pkg.module,
      },
    ],
    external: [
      '@vbadvanced/form-js-viewer',
      '@vbadvanced/form-js-editor',
      '@vbadvanced/form-js-playground',
      '@vbadvanced/form-js-carbon-styles',
    ],
    plugins: [
      copy({
        targets: [
          { src: '../../node_modules/@vbadvanced/form-js-viewer/dist/assets/**/*[!light].css', dest: 'dist/assets' },
          {
            src: '../../node_modules/@vbadvanced/form-js-viewer/dist/assets/flatpickr/*.css',
            dest: 'dist/assets/flatpickr',
          },
          { src: '../../node_modules/@vbadvanced/form-js-editor/dist/assets/**/*.css', dest: 'dist/assets' },
          { src: '../../node_modules/@vbadvanced/form-js-playground/dist/assets/**/*.css', dest: 'dist/assets' },
          { src: '../../node_modules/@vbadvanced/form-js-carbon-styles/src/carbon-styles.scss', dest: 'dist/assets' },
        ],
      }),
    ],
    onwarn,
  },
  {
    input: 'src/editor.js',
    output: [
      {
        format: 'umd',
        file: pkg.exports['./editor'].umd,
        name: 'FormEditor',
      },
    ],
    plugins: [resolve(), commonjs()],
    onwarn,
  },
  {
    input: 'src/viewer.js',
    output: [
      {
        format: 'umd',
        file: pkg.exports['./viewer'].umd,
        name: 'FormViewer',
      },
    ],
    plugins: [resolve(), commonjs()],
    onwarn,
  },
  {
    input: 'src/playground.js',
    output: [
      {
        format: 'umd',
        file: pkg.exports['./playground'].umd,
        name: 'FormPlayground',
      },
    ],
    plugins: [resolve(), commonjs()],
    onwarn,
  },
];

function onwarn(warning, warn) {
  // TODO(@barmac): remove once https://github.com/moment/luxon/issues/193 is resolved
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    if (warning.message.includes('luxon')) {
      return;
    }
  }

  if (warning.code === 'THIS_IS_UNDEFINED') {
    if (warning.id.includes('flatpickr')) {
      return;
    }
  }

  warn(warning);
}
