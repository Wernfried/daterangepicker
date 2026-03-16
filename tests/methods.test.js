import DateRangePicker from '../src/daterangepicker.js';

test('list all implemented methods', () => {
   const drp = new DateRangePicker();

   const toBe = [
      'constructor', 'setStartDate',
      'setEndDate', 'setRange',
      'parseDate', 'logDate',
      'formatDate', 'updateLabel',
      'validateInput', 'updateView',
      'updateMonthsInView', 'updateCalendars',
      'renderCalendar', 'renderTimePicker',
      'setApplyBtnState', 'move',
      'show', 'hide',
      'toggle', 'showCalendars',
      'hideCalendars', 'outsideClick',
      'clickPrev', 'clickNext',
      'hoverDate', 'hoverRange',
      'leaveRange', 'clickRange',
      'clickDate', 'calculateChosenLabel',
      'timeChanged', 'monthOrYearChanged',
      'clickApply', 'clickCancel',
      'elementChanged', 'keydown',
      'updateElement', 'updateAltInput',
      'remove', 'triggerEvent',
      'triggerHandler'
   ];

   const methods = getMethods(drp);
   for (let m of toBe)
      expect(methods.find(x => x === m)).toBe(m);

   for (let m of methods)
      expect(toBe.find(x => x === m)).toBe(m);
});


function getMethods(obj) {
   return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
      .filter(m => 'function' === typeof obj[m])
}

