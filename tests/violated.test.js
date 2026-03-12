import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('violated event with correction', () => {
    let called = false;
    document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;

    $('#p').daterangepicker({
        startDate: '2026-01-10',
        minDate: '2026-01-01',
        maxDate: '2026-01-31',
        timePicker: false,
        singleDatePicker: true,
        altInput: '#altStart',
        locale: { format: 'yyyy-MM-dd' }

    }).on('violated.daterangepicker', (ev, picker, result) => {
        called = true;
        expect(picker).toBe(drp);
        expect(result.startDate.violations[0].reason).toBe('maxDate');
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    const applyBtn = document.querySelector('.applyBtn');
    const altStart = document.querySelector('#altStart');

    input.click();
    input.value = '2050-12-31';
    input.dispatchEvent(new Event('keyup', { bubbles: true }));

    applyBtn.click();

    expect(drp.startDate.toISODate()).toBe(DateTime.fromISO('2026-01-31').toISODate());
    expect(altStart.value).toBe(DateTime.fromISO('2026-01-31').toISODate({ format: 'basic' }));
    expect(called).toBe(true);

});

test('violated event without correction', () => {
    let called = false;
    document.body.innerHTML = `<input id="p"> <input id="altStart" hidden>`;

    $('#p').daterangepicker({
        startDate: '2026-01-10',
        minDate: '2026-01-01',
        maxDate: '2026-01-31',
        timePicker: false,
        singleDatePicker: true,
        altInput: '#altStart',
        locale: { format: 'yyyy-MM-dd' }

    }).on('violated.daterangepicker', (ev, picker, result) => {
        called = true;
        expect(picker).toBe(drp);
        expect(result.startDate.violations[0].reason).toBe('maxDate');
        return true;
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    const applyBtn = document.querySelector('.applyBtn');
    const altStart = document.querySelector('#altStart');

    input.click();
    input.value = '2050-12-31';
    input.dispatchEvent(new Event('keyup', { bubbles: true }));

    applyBtn.click();

    expect(drp.startDate.toISODate()).toBe(DateTime.fromISO('2050-12-31').toISODate());
    expect(altStart.value).toBe(DateTime.fromISO('2050-12-31').toISODate({ format: 'basic' }));
    expect(called).toBe(true);

});
