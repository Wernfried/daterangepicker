import { $, jQuery } from 'jquery';
import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime, Settings } from 'luxon';
window.$ = window.jQuery = jQuery;

function isVisible(el) {
    if (!el || el.innerHTML === '')
        return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
}

test('daterangepicker is shown month, view change', () => {
    document.body.innerHTML = `<input id="p">`;
    let shown = false;
    Settings.defaultLocale = 'en-CH';

    $('#p').daterangepicker({
        timePicker: true
    }).on('show', function (ev) {
        expect(ev.originalEvent.picker).toBe(drp);
        shown = true;
    });
    const input = document.querySelector('#p');
    const drp = getDateRangePicker('#p');
    expect(document.querySelector('#p')._daterangepicker).toBe(drp);
    input.click();
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.left .calendar-table'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-calendar.right .calendar-table'))).toBe(true);
    expect(isVisible(document.querySelector('div.daterangepicker .drp-buttons'))).toBe(true);
    expect(shown).toBe(true);

});

