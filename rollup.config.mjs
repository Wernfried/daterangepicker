import { minify } from 'rollup-plugin-esbuild-minify'

let output = [];
const meta = [
   //{ format: 'amd' },
   { format: 'cjs', extension: 'cjs' },
   { format: 'esm' },
   //{ format: 'umd', globals: true },
   { format: 'iife', out: 'global', globals: true }
];

for (let fmt of meta) {
   for (let compact of [true, false]) {
      let out = {
         file: `dist/${fmt.out ?? fmt.format}/daterangepicker${compact ? '.min' : ''}.${fmt.extension ?? 'js'}`,
         format: fmt.format,
         sourcemap: true,
         plugins: [minify({ minify: compact })]
      };
      if (fmt.globals)
         out = { ...out, ...{ name: 'DateRangePicker', globals: { luxon: 'luxon' } } }
      output.push(out);
   }

}

export default {
   input: 'src/daterangepicker.js',
   external: ['luxon'],
   output: output
};

