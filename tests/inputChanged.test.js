import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('inputChanged events fire correctly', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;

   const values = ['2026-03-01', '2026-14-44', '2026-05-01'];
   $('#p').daterangepicker(
      {
         startDate: values[0],
         timePicker: false,
         singleDatePicker: true,
         altInput: '#altStart',
         locale: { format: 'yyyy-MM-dd' }
      }
   ).on('inputChanged.daterangepicker', (ev, picker) => {
      // Fires only for valid input
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(DateTime.fromISO(values[2]).toISODate());
      expect(document.querySelector('#altStart').value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
   });
   const drp = $('#p').data('daterangepicker');
   const altStart = document.querySelector('#altStart');
   const input = document.querySelector('#p');
   input.click();

   let newValue = values[1]
   input.value = newValue;
   input.dispatchEvent(new Event('keyup', { bubbles: true }));
   // Invalid value, must revert to old value
   expect(drp.startDate.toISODate()).toBe(DateTime.fromISO(values[0]).toISODate());
   expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));

   newValue = values[2]
   input.value = newValue;
   input.dispatchEvent(new Event('keyup', { bubbles: true }));
   expect(drp.startDate.toISODate()).toBe(DateTime.fromISO(values[2]).toISODate());
   expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));

});

