import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('outsideClick event fires and apply', () => {
    let called = false;
    document.body.innerHTML = `<input id="p"> <div id="outside"> <input id="altStart" hidden>`;

    const values = ['2026-03-02', '2026-03-19'];
    daterangepicker('#p', {
        startDate: values[0],
        onOutsideClick: 'apply',
        timePicker: false,
        singleDatePicker: true,
        altInput: '#altStart'
    }).addEventListener('outsideClick', (ev) => {
        called = true;
    });
    const drp = getDateRangePicker('#p');
    const outside = document.querySelector('#outside');
    const input = document.querySelector('#p');
    const altStart = document.querySelector('#altStart');
    input.click();

    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    outside.dispatchEvent(new Event('mousedown', { bubbles: true }));

    expect(drp.startDate.toISODate()).toBe(DateTime.fromISO(values[1]).toISODate());
    expect(altStart.value).toBe(DateTime.fromISO(values[1]).toISODate({ format: 'basic' }));
    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(false);
    expect(called).toBe(true);

});

test('outsideClick event fires and revert', () => {
    let called = false;
    document.body.innerHTML = `<input id="p"> <div id="outside"> <input id="altStart" hidden>`;

    const values = ['2026-03-02', '2026-03-19'];
    daterangepicker('#p', {
        startDate: values[0],
        onOutsideClick: 'cancel',
        timePicker: false,
        singleDatePicker: true,
        altInput: '#altStart'
    }
    ).addEventListener('outsideClick', (ev) => {
        called = true;
    });
    const drp = getDateRangePicker('#p');
    const outside = document.querySelector('#outside');
    const input = document.querySelector('#p');
    const altStart = document.querySelector('#altStart');
    input.click();

    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    outside.dispatchEvent(new Event('mousedown', { bubbles: true }));

    expect(drp.startDate.toISODate()).toBe(DateTime.fromISO(values[0]).toISODate());
    expect(altStart.value).toBe(DateTime.fromISO(values[0]).toISODate({ format: 'basic' }));
    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(false);
    expect(called).toBe(true);

});


function isVisible(el) {
    if (!el || el.innerHTML === '')
        return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
}
