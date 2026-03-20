import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('dateChange event fires correctly', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;
    daterangepicker('#p', {
        startDate: '2026-03-02',
        endDate: '2026-03-06',
        timePicker: false
    }).addEventListener('dateChange', (ev) => {
        called = true;
        expect(ev.side).toBe(left ? 'start' : 'end');
        let day = ev.picker[left ? 'startDate' : 'endDate'].day;
        expect(day).toBe(left ? 19 : 7);
    });

    const drp = getDateRangePicker('#p');
    const input = document.querySelector('#p');
    input.click();

    let left = true;
    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));

    left = false;
    const endDay = document.querySelector('.drp-calendar.right .calendar-table tbody td[data-title="r1c1"]'); // -> 2026-04-07
    endDay.dispatchEvent(new Event('mousedown', { bubbles: true }));

    expect(called).toBe(true);

});

