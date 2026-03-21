import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('show and hide events fire correctly', () => {
    let shown = false;
    let hidden = false;

    document.body.innerHTML = `<input id="p">`;
    const input = daterangepicker('#p', {});
    input.addEventListener('show', () => {
        shown = true;
    });
    input.addEventListener('hide', () => {
        hidden = true;
    });
    input.click();

    const applyBtn = document.querySelector('.applyBtn');
    applyBtn.click();

    expect(shown).toBe(true);
    expect(hidden).toBe(true);

});

