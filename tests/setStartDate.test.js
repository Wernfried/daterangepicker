import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime, Settings, Duration } from 'luxon';

test('setStartDate method violation fires', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;
   let violated = false;

   const values = ['2026-03-01', '2000-01-01', '2026-05-15'];
   Settings.defaultLocale = 'en-US';
   $('#p').daterangepicker(
      {
         timePicker: false,
         startDate: values[0],
         singleDatePicker: true,
         altInput: '#altStart',
         minDate: '2026-01-01',
         locale: { format: 'yyyy-MM-dd' }
      }
   ).on('violated.daterangepicker', (ev, picker, result, newDate) => {
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(values[0]);
      expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
      violated = true;
   });
   const drp = $('#p').data('daterangepicker');
   const altStart = document.querySelector('#altStart');
   const input = document.querySelector('#p');
   input.click();

   let month = document.querySelector('.drp-calendar.left .calendar-table .month');
   expect(month.innerHTML).toBe('March 2026');

   drp.setStartDate(DateTime.fromISO(values[1]))

   // Invalid value, must revert to old value
   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   let selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');
   expect(month.innerHTML).toBe('March 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[1]).day);
   expect(drp.startDate.toISODate()).toBe(values[0]);
   expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
   expect(violated).toBe(true);

   violated = false;
   drp.setStartDate(DateTime.fromISO(values[2]))

   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');

   expect(month.innerHTML).toBe('May 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[2]).day);
   expect(drp.startDate.toISODate()).toBe(values[2]);
   expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
   expect(violated).toBe(false);

});


test('setStartDate method violation fires with correction', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;
   let violated = false;

   const values = ['2026-03-01', '2000-01-01', '2026-06-25'];
   Settings.defaultLocale = 'en-US';
   $('#p').daterangepicker(
      {
         timePicker: false,
         startDate: values[0],
         singleDatePicker: true,
         altInput: '#altStart',
         minDate: '2026-01-01',
         locale: { format: 'yyyy-MM-dd' }
      }
   ).on('violated.daterangepicker', (ev, picker, result, newDate) => {
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(values[0]);
      expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
      violated = true;
      newDate.startDate = DateTime.fromISO(values[2]);
      return true;
   });
   const drp = $('#p').data('daterangepicker');
   const altStart = document.querySelector('#altStart');
   const input = document.querySelector('#p');
   input.click();

   let month = document.querySelector('.drp-calendar.left .calendar-table .month');
   expect(month.innerHTML).toBe('March 2026');

   drp.setStartDate(DateTime.fromISO(values[1]))

   // Invalid value, must revert to old value
   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   let selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');
   expect(month.innerHTML).toBe('June 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[2]).day);
   expect(drp.startDate.toISODate()).toBe(values[2]);
   expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
   expect(violated).toBe(true);

});

