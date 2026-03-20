import * as Picker  from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('beforeHide event prevents closing', () => {
    let called = false;
    document.body.innerHTML = `<input id="p">`;

    Picker.daterangepicker('#p', {
        startDate: '2026-03-02'
    }).addEventListener('beforeHide', (ev) => {
        called = true;
        ev.preventDefault()
    });
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
