import { minify } from 'rollup-plugin-esbuild-minify'

export default {
   input: 'src/daterangepicker.js',
   //external: ['jquery'],
   external: ['jquery', 'luxon'],
   output: [
      {
         file: 'dist/cjs/daterangepicker.js',
         format: 'cjs'
      },
      {
         file: 'dist/esm/daterangepicker.js',
         format: 'esm'
         //plugins: [terser()]
      },
      {
         file: 'dist/iife/daterangepicker.js',
         format: 'iife',
         globals: {
            jquery: '$',
            daterangepicker: 'daterangepicker',
            luxon: 'luxon'
         },
         name: 'DateRangePicker'
      },
      {
         file: 'dist/umd/daterangepicker.js',
         format: 'umd',
         globals: {
            jquery: '$',
            daterangepicker: 'daterangepicker',
            luxon: 'luxon'
         },
         name: 'DateRangePicker'
      },

            {
         file: 'dist/cjs/daterangepicker.min.js',
         format: 'cjs',
         compact: true
      },
      {
         file: 'dist/esm/daterangepicker.min.js',
         format: 'esm',
         compact: true,
         plugins: [minify({minify:true})]
      },
      {
         file: 'dist/iife/daterangepicker.min.js',
         format: 'iife',
         globals: {
            jquery: '$',
            daterangepicker: 'daterangepicker',
            luxon: 'luxon'
         },
         name: 'DateRangePicker',
         compact: true
      },
      {
         file: 'dist/umd/daterangepicker.min.js',
         format: 'umd',
         globals: {
            jquery: '$',
            daterangepicker: 'daterangepicker',
            luxon: 'luxon'
         },
         name: 'DateRangePicker',
         compact: true
      }

   ]
};