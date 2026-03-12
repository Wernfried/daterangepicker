import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

// Event beforeRenderTimePicker to be removed - don's see any use case
// Event beforeRenderCalendar rename to renderRanges

test('beforeRender events fire correctly', () => {
   let timePicker = false;
   let calendar = false;

   document.body.innerHTML = `<input id="p">`;
   $('#p').daterangepicker(
      {
         timePicker: true,
         ranges: {
            'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
            'Last 7 Days': [DateTime.now().startOf('day').minus({ day: 7 }).toISODate(), DateTime.now().startOf('day').toISODate()],
            'Last 30 Days': [new Date(new Date - 1000 * 60 * 60 * 24 * 30), new Date()],
         }
      }
   ).on('beforeRenderTimePicker.daterangepicker', () => {
      timePicker = true;
   }).on('beforeRenderCalendar.daterangepicker', () => {
      calendar = true;
   });
   const input = document.querySelector('#p');
   input.click();

   expect(timePicker).toBe(true);
   expect(calendar).toBe(true);

});

