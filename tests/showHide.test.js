import { $ } from 'jquery';
import DateRangePicker from '../src/daterangepicker.js';
import { DateTime } from 'luxon';

test('show and hide events fire correctly', () => {
    let shown = false;
    let hidden = false;

    document.body.innerHTML = `<input id="p">`;
    $('#p').daterangepicker(
        {}
    ).on('show.daterangepicker', () => {
        shown = true;
    }).on('hide.daterangepicker', () => {
        hidden = true;
    });
    const input = document.querySelector('#p');
    input.click();

    const applyBtn = document.querySelector('.applyBtn');
    applyBtn.click();

    expect(shown).toBe(true);
    expect(hidden).toBe(true);

});

