import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('timeChange event fires correctly', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;
    daterangepicker('#p', {
        timePicker: true,
        startDate: DateTime.now().set({ hour: 0 }),
        endDate: DateTime.now().plus({ days: 1 }).set({ hour: 0 })
    }).addEventListener('timeChange', (ev) => {
        called = true;
        expect(ev.side).toBe(left ? 'start' : 'end');
        const hour = ev.picker[left ? 'startDate' : 'endDate'].hour;
        expect(hour).toBe(left ? 12 : 14);
    });
    const input = document.querySelector('#p');
    input.click();

    let left = true;
    const hourStart = document.querySelector(`.drp-calendar.left .calendar-table .hourselect`)
    hourStart.value = 12;
    hourStart.dispatchEvent(new Event('change', { bubbles: true }));

    left = false;
    const hourEnd = document.querySelector(`.drp-calendar.right .calendar-table .hourselect`)
    hourEnd.value = 14;
    hourEnd.dispatchEvent(new Event('change', { bubbles: true }));

    expect(called).toBe(true);

});

