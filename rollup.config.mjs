import { minify } from 'rollup-plugin-esbuild-minify'

let output = [];
const formats = {
   cjs: false,
   esm: false,
   umd: { globals: true, name: true },
   iife: { globals: true, name: true }
};

for (let fmt of Object.keys(formats)) {
   for (let compact of [true, false]) {
      let out = {
         file: `dist/${fmt}/daterangepicker${compact ? '.min' : ''}.js`,
         format: fmt,
         sourcemap: true,
         plugins: [minify({ minify: compact })]
      };
      if (formats[fmt].globals)
         out.globals = { luxon: 'luxon' };
      if (formats[fmt].name)
         out.name = 'DateRangePicker'
      output.push(out);
   }

}

export default {
   input: 'src/daterangepicker.js',
   external: ['jquery', 'luxon'],
   output: output
};