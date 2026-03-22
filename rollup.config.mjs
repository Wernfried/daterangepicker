import { minify } from 'rollup-plugin-esbuild-minify'

let output = [];
const meta = [
   { format: 'amd' },
   { format: 'cjs' },
   { format: 'esm' },
   { format: 'umd', globals: true, name: true },
   { format: 'iife', globals: true, name: true }
];

for (let fmt of meta) {
   for (let compact of [true, false]) {
      let out = {
         file: `dist/${fmt.format}/daterangepicker${compact ? '.min' : ''}.js`,
         format: fmt.format,
         sourcemap: true,
         plugins: [minify({ minify: compact })]
      };
      if (fmt.globals)
         out.globals = { luxon: 'luxon' };
      if (fmt.name)
         out.name = 'DateRangePicker';
      output.push(out);
   }

}

export default {
   input: 'src/daterangepicker.js',
   external: ['luxon'],
   output: output
};

