import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('beforeRender events fire correctly', () => {
   let timePicker = false;
   let calendar = false;

   document.body.innerHTML = `<input id="p">`;
   const picker = daterangepicker('#p', 
      {
         timePicker: true,
         ranges: {
            'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
            'Last 7 Days': [DateTime.now().startOf('day').minus({ day: 7 }).toISODate(), DateTime.now().startOf('day').toISODate()],
            'Last 30 Days': [new Date(new Date - 1000 * 60 * 60 * 24 * 30), new Date()],
         }
      }
   );
   picker.addEventListener('beforeRenderTimePicker', () => {
      timePicker = true;
   });
   picker.addEventListener('beforeRenderCalendar', () => {
      calendar = true;
   });
   picker.show();

   expect(timePicker).toBe(true);
   expect(calendar).toBe(true);

});
