import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('befroreHide event prevents closing', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;

    const values = [, '2026-03-19'];
    $('#p').daterangepicker({
        startDate: '2026-03-02'
    }).on('beforeHide.daterangepicker', (ev, picker) => {
        called = true;
        expect(picker).toBe(drp);
        return true;
        //ev.preventDefault()
    });
    const drp = $('#p').data('daterangepicker');
    const input = document.querySelector('#p');
    const applyBtn = document.querySelector('.applyBtn');
    input.click();
    applyBtn.click();

    expect(isVisible(document.querySelector('div.daterangepicker'))).toBe(true);
    expect(called).toBe(true);

});



function isVisible(el) {
    if (!el || el.innerHTML === '')
        return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
}
