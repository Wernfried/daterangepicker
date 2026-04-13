import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime, Settings } from 'luxon';

function isVisible(el) {
    if (!el || el.innerHTML === '')
        return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
}

test('daterangepicker no initial date', () => {
    document.body.innerHTML = `<input id="p" >`;
    Settings.defaultLocale = 'en-CH';

    daterangepicker('#p', {
        timePicker: true,
        startDate: null,
        initialMonth: DateTime.fromISO('2026-03-01')
    });
    const drp = getDateRangePicker('#p');
    const input = document.querySelector('#p');
    input.click();
    expect(document.querySelector('div.daterangepicker tbody .active')).toBe(null);
    expect(drp.startDate).toBe(null);
    expect(drp.endDate).toBe(null);
    const leftMonth = document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table .month');
    const rightMonth = document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table .month');
    expect(leftMonth.innerHTML).toBe('March 2026');
    expect(rightMonth.innerHTML).toBe('April 2026');

    const cancelBtn = document.querySelector('.cancelBtn');
    const applyBtn = document.querySelector('.applyBtn');
    cancelBtn.click();
    expect(drp.startDate).toBe(null);
    expect(drp.endDate).toBe(null);

    input.click();
    const startDay = document.querySelector('.drp-calendar.left .calendar-table tbody td[data-title="r3c3"]'); // -> 2026-03-19
    startDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(applyBtn.disabled).toBe(true);

    const endDay = document.querySelector('.drp-calendar.right .calendar-table tbody td[data-title="r1c1"]'); // -> 2026-04-07
    endDay.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(applyBtn.disabled).toBe(false);

    applyBtn.click();

    expect(drp.startDate.toString()).toBe(DateTime.fromISO('2026-03-19').toString());
    expect(drp.endDate.toString()).toBe(DateTime.fromISO('2026-04-07').endOf('day').toString());

});

