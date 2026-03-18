

import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime, Settings } from 'luxon';

function isVisible(el) {
    if (!el || el.innerHTML === '')
        return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
}

test('daterangepicker is shown month, view change', () => {
    document.body.innerHTML = `<input id="p">`;
    let monthViewChanged = false;
    Settings.defaultLocale = 'en-CH';

    $('#p').daterangepicker({
        timePicker: true,
        startDate: '2026-03-10'
    }).on('monthViewChange.daterangepicker', function (ev, picker) {
        expect(picker).toBe(drp);
        monthViewChanged = true;
    });
    const input = document.querySelector('#p');
    const drp = $('#p').data('daterangepicker');
    input.click();
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table tfoot .calendar-time'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table tfoot .calendar-time'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-buttons'))).toBe(true);
    let leftMonth = document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table .month');
    let rightMonth = document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table .month');
    const next = document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table .next.available');

    expect(monthViewChanged).toBe(false);
    expect(leftMonth.innerHTML).toBe('March 2026');
    expect(rightMonth.innerHTML).toBe('April 2026');

    next.click();

    leftMonth = document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table .month');
    rightMonth = document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table .month');
    expect(monthViewChanged).toBe(true);
    expect(leftMonth.innerHTML).toBe('April 2026');
    expect(rightMonth.innerHTML).toBe('May 2026');

});


test('daterangepicker process input and apply', () => {
    document.body.innerHTML = `<input id="p" /> <input id="altStart" hidden /> <input id="altEnd" hidden />`;
    $('#p').daterangepicker({
        startDate: '2026-03-02',
        endDate: DateTime.fromISO('2026-03-06'),
        timePicker: true,
        altInput: ['#altStart', '#altEnd']
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    input.click();
    const applyBtn = document.querySelector('.applyBtn');

    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(applyBtn.disabled).toBe(true);

    const endDay = document.querySelector('.drp-calendar.right .calendar-table tbody td[data-title="r1c1"]'); // -> 2026-04-07
    endDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(applyBtn.disabled).toBe(false);

    const hourStart = document.querySelector('.drp-calendar.left .calendar-table .hourselect')
    const minuteStart = document.querySelector('.drp-calendar.left .calendar-table .minuteselect')
    hourStart.value = 9;
    minuteStart.value = 15;
    hourStart.dispatchEvent(new Event('change', { bubbles: true }));

    const hourEnd = document.querySelector('.drp-calendar.right .calendar-table .hourselect')
    const minuteEnd = document.querySelector('.drp-calendar.right .calendar-table .minuteselect')
    hourEnd.value = 15;
    minuteEnd.value = 30;
    hourEnd.dispatchEvent(new Event('change', { bubbles: true }));

    applyBtn.click();

    expect(drp.startDate.toString()).toBe(DateTime.fromISO('2026-03-19T09:15').toString());
    expect(drp.endDate.toString()).toBe(DateTime.fromISO('2026-04-07T15:30').toString());
    expect(document.querySelector('#altStart').value).toBe('20260319T0915');
    expect(document.querySelector('#altEnd').value).toBe('20260407T1530');
    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(false);

});



test('daterangepicker process input and cancel', () => {
    document.body.innerHTML = `<input id="p"> <input id="altStart" hidden> <input id="altEnd" hidden>`;
    $('#p').daterangepicker({
        startDate: '2026-03-02',
        endDate: DateTime.fromISO('2026-03-06'),
        timePicker: true,
        altInput: ['#altStart', '#altEnd']
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    input.click();

    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    const endDay = document.querySelector('.drp-calendar.right .calendar-table tbody td[data-title="r1c1"]'); // -> 2026-04-07
    endDay.dispatchEvent(new Event('mousedown', { bubbles: true }));

    const hourStart = document.querySelector('.drp-calendar.left .calendar-table .hourselect')
    hourStart.value = 9;
    hourStart.dispatchEvent(new Event('change', { bubbles: true }));

    const hourEnd = document.querySelector('.drp-calendar.right .calendar-table .hourselect')
    hourEnd.value = 15;
    hourEnd.dispatchEvent(new Event('change', { bubbles: true }));

    const cancelBtn = document.querySelector('.cancelBtn');
    cancelBtn.click();

    expect(drp.startDate.toString()).toBe(DateTime.fromISO('20260302T00:00').toString());
    expect(drp.endDate.toString()).toBe(DateTime.fromISO('20260306T00:00').toString());
    expect(document.querySelector('#altStart').value).toBe('20260302T0000');
    expect(document.querySelector('#altEnd').value).toBe('20260306T0000');
    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(false);

});



test('daterangepicker select range and apply', () => {
    document.body.innerHTML = `<input id="p"> <input id="altStart" hidden> <input id="altEnd" hidden>`;
    const yesterday = [DateTime.now().startOf('day').minus({ day: 1 }), DateTime.now().endOf('day').minus({ day: 1 })];
    $('#p').daterangepicker({
        altInput: ['#altStart', '#altEnd'],
        ranges: {
            'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
            'Yesterday': yesterday,
            'Last 7 Days': [DateTime.now().startOf('day').minus({ day: 7 }).toISODate(), DateTime.now().startOf('day').toISODate()],
            'Last 30 Days': [new Date(new Date - 1000 * 60 * 60 * 24 * 30), new Date()],
        },
        alwaysShowCalendars: true
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    input.click();

    const range = document.querySelector('.ranges li[data-range-key="Yesterday"]');
    range.click();

    expect(drp.startDate.toString()).toBe(yesterday[0].toString());
    expect(drp.endDate.toString()).toBe(yesterday[1].toString());
    expect(document.querySelector('#altStart').value).toBe(yesterday[0].toISODate({ format: 'basic' }));
    expect(document.querySelector('#altEnd').value).toBe(yesterday[1].toISODate({ format: 'basic' }));
    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(false);

});
