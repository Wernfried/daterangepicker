

import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('daterangepicker callback invoked after click', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;
    $('#p').daterangepicker(
        {
            startDate: '2026-03-19',
            endDate: '2026-03-21',
            timePicker: false
        },
        (startDate, endDate) => {
            expect(startDate.toISODate()).toBe(DateTime.fromISO('2026-03-19').toISODate());
            expect(endDate.toISODate()).toBe(DateTime.fromISO('2026-04-07').toISODate());
            called = true
        });

    const input = document.querySelector('#p');
    input.click();

    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    const endDay = document.querySelector('.drp-calendar.right .calendar-table tbody td[data-title="r1c1"]'); // -> 2026-04-07
    endDay.dispatchEvent(new Event('mousedown', { bubbles: true }));

    const applyBtn = document.querySelector('.applyBtn');
    applyBtn.click();

    expect(called).toBe(true);
});


test('daterangepicker callback invoked after input', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;
    $('#p').daterangepicker(
        {
            startDate: '2026-03-19',
            endDate: '2026-03-21',
            timePicker: false,
            locale: { format: 'yyyy-MM-dd' }
        },
        (startDate, endDate) => {
            expect(startDate.toISODate()).toBe(DateTime.fromISO('2026-03-19').toISODate());
            expect(endDate.toISODate()).toBe(DateTime.fromISO('2026-04-07').toISODate());
            called = true;
        });

    const input = document.querySelector('#p');
    input.click();

    input.value = '2026-03-19 - 2026-04-07';
    input.dispatchEvent(new Event('keyup', { bubbles: true }));
    const applyBtn = document.querySelector('.applyBtn');
    applyBtn.click();

    expect(called).toBe(true);
});

