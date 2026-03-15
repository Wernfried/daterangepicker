import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime, Settings, Duration } from 'luxon';

test('inputChanged singleDate events fire correctly', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;
   let inputChanged = false;
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
   ).on('inputChanged.daterangepicker', (ev, picker) => {
      // Fires only for valid input
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(values[2]);
      expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
      expect(violated).toBe(false);
      inputChanged = true;
   }).on('violated.daterangepicker', (ev, picker, result, newDate) => {
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(values[0]);
      expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
      expect(inputChanged).toBe(false);
      violated = true;
   });
   const drp = $('#p').data('daterangepicker');
   const altStart = document.querySelector('#altStart');
   const input = document.querySelector('#p');
   input.click();

   let month = document.querySelector('.drp-calendar.left .calendar-table .month');
   expect(month.innerHTML).toBe('March 2026');

   input.value = values[1];
   input.dispatchEvent(new Event('keyup', { bubbles: true }));
   // Invalid value, must revert to old value
   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   let selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');
   expect(month.innerHTML).toBe('March 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[1]).day);
   expect(drp.startDate.toISODate()).toBe(values[0]);
   expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
   expect(inputChanged).toBe(false);
   expect(violated).toBe(true);

   inputChanged = false;
   violated = false;
   input.value = values[2];
   input.dispatchEvent(new Event('keyup', { bubbles: true }));

   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');

   expect(month.innerHTML).toBe('May 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[2]).day);
   expect(drp.startDate.toISODate()).toBe(values[2]);
   expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
   expect(inputChanged).toBe(true);
   expect(violated).toBe(false);

});


test('inputChanged events fire correctly with correction', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;
   let inputChanged = false;
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
   ).on('inputChanged.daterangepicker', (ev, picker) => {
      inputChanged = true;
   }).on('violated.daterangepicker', (ev, picker, result, newDate) => {
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe(values[0]);
      expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
      expect(inputChanged).toBe(false);
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

   let newValue = values[1]
   input.value = newValue;
   input.dispatchEvent(new Event('keyup', { bubbles: true }));
   // Invalid value, must revert to old value
   month = document.querySelector('.drp-calendar.left .calendar-table .month');
   let selectedDay = document.querySelector('.drp-calendar.left .calendar-table tbody td.active.available.start-date');
   expect(month.innerHTML).toBe('June 2026');
   expect(parseInt(selectedDay.innerHTML)).toBe(DateTime.fromISO(values[2]).day);
   expect(drp.startDate.toISODate()).toBe(values[2]);
   expect(altStart.value).toBe(DateTime.fromISO(values[2]).toISODate({ format: 'basic' }));
   expect(inputChanged).toBe(true);
   expect(violated).toBe(true);

});


test('inputChanged range events fire correctly', () => {
   document.body.innerHTML = `<input id="p"> <input id="altStart" hidden> <input id="altEnd" hidden>`;
   let inputChanged = false;

   Settings.defaultLocale = 'en-US';
   $('#p').daterangepicker(
      {
         timePicker: false,
         startDate: '2026-03-01',
         endDate: '2026-03-03',
         altInput: ['#altStart', '#altEnd'],
         locale: { format: 'yyyy-MM-dd' }
      }
   ).on('inputChanged.daterangepicker', (ev, picker) => {
      // Fires only for valid input
      expect(picker).toBe(drp);
      expect(picker.startDate.toISODate()).toBe('2026-05-10');
      expect(altStart.value).toBe(DateTime.fromISO('2026-05-10').toISODate({ format: 'basic' }));
      expect(picker.endDate.toISODate()).toBe('2026-05-20');
      expect(altEnd.value).toBe(DateTime.fromISO('2026-05-20').toISODate({ format: 'basic' }));
      inputChanged = true;
   });
   const drp = $('#p').data('daterangepicker');
   const altStart = document.querySelector('#altStart');
   const input = document.querySelector('#p');
   input.click();

   input.value = '2026-05-10 - 2026-05-20';
   input.dispatchEvent(new Event('keyup', { bubbles: true }));

   expect(drp.startDate.toISODate()).toBe('2026-05-10');
   expect(altStart.value).toBe(DateTime.fromISO('2026-05-10').toISODate({ format: 'basic' }));
   expect(drp.endDate.toISODate()).toBe('2026-05-20');
   expect(altEnd.value).toBe(DateTime.fromISO('2026-05-20').toISODate({ format: 'basic' }));
   expect(inputChanged).toBe(true);

});


