import { daterangepicker, getDateRangePicker } from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('show and hide events fire correctly', () => {
    let shown = false;
    let hidden = false;

    document.body.innerHTML = `<input id="p">`;
    const picker = daterangepicker('#p', {})
    .addEventListener('show', () => {
        shown = true;
    }).addEventListener('hide', () => {
        hidden = true;
    });
    picker.show();

    const applyBtn = document.querySelector('.applyBtn');
    applyBtn.click();

    expect(shown).toBe(true);
    expect(hidden).toBe(true);

});

