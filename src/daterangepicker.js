import { DateTime, Duration, Info, Settings } from 'luxon';

/**
* @constructs DateRangePicker
* @param {string|external:HTMLElement} element - A DOM HTMLElement or querySelector string of element where DateRangePicker is attached. Often a `<input>` element.
* @param {Options} options - Object to configure the DateRangePicker
* @param {function} cb - Callback function executed when new date values applied
*/
class DateRangePicker {
   #startDate = null;
   #endDate = null;

   constructor(element, options, cb) {
      /**
      * Options for DateRangePicker
      * @typedef Options 
      * @property {string|external:HTMLElement} parentEl=body - {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#selectors|Document querySelector} 
      * or `HTMLElement` of the parent element that the date range picker will be added to

      * @property {external:DateTime|external:Date|string|null} startDate - Default: `DateTime.now().startOf('day')`<br>The beginning date of the initially selected date range.<br>
      * Must be a `luxon.DateTime` or `Date` or `string` according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} or a string matching `locale.format`.<br>
      * Date value is rounded to match option `timePickerStepSize`<br>
      * Option `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br>
      * If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br>
      * Use `startDate: null` to show calendar without an initial selected date.
      * @property {external:DateTime|external:Date|string} endDate - Defautl: `DateTime.now().endOf('day')`<br>The end date of the initially selected date range.<br>
      * Must be a `luxon.DateTime` or `Date` or `string` according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} or a string matching `locale.format`.<br>
      * Date value is rounded to match option `timePickerStepSize`<br>
      * Option `isInvalidDate`, `isInvalidTime` and `minSpan`, `maxSpan` are not evaluated, you may set date/time which is not selectable in calendar.<br>
      * If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br>

      * @property {external:DateTime|external:Date|string|null} minDate - The earliest date a user may select or `null` for no limit.<br>
      * Must be a `luxon.DateTime` or `Date` or `string` according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} or a string matching `locale.format`.
      * @property {external:DateTime|external:Date|string|null} maxDate - The latest date a user may select or `null` for no limit.<br>
      * Must be a `luxon.DateTime` or `Date` or `string` according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} or a string matching `locale.format`.
      * @property {external:Duration|string|number|null} minSpan - The minimum span between the selected start and end dates.<br>
      * Must be a `luxon.Duration` or number of seconds or a string according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} duration.<br>
      * Ignored when `singleDatePicker: true`
      * @property {external:Duration|string|number|null} maxSpan - The maximum  span between the selected start and end dates.<br>
      * Must be a `luxon.Duration` or number of seconds or a string according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} duration.<br>
      * Ignored when `singleDatePicker: true`
      * @property {external:Duration|string|number|null} defaultSpan - The span which is used when endDate is automatically updated due to wrong user input<br>
      * Must be a `luxon.Duration` or number of seconds or a string according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} duration.<br>
      * Ignored when `singleDatePicker: true`. Not relevant if `minSpan: null`
      * @property {external:DateTime|external:Date|string|null} initialMonth - Default: `DateTime.now().startOf('month')`<br>
      * The inital month to be shown. Only relevant for `startDate: null`. Be aware, the attached `<input>` element must also be empty.<br>
      * Must be a `luxon.DateTime` or `Date` or `string` according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} or a string matching `locale.format`.<br>
      * Works only with `timePicker: false`

      * @property {boolean} autoApply=false - Hide the `Apply` and `Cancel` buttons, and automatically apply a new date range as soon as two dates are clicked.<br>
      * Only useful when `timePicker: false`
      * @property {boolean} singleDatePicker=false - Show only a single calendar to choose one date, instead of a range picker with two calendars.<br>
      * If `true`, then `endDate` is always `null`.
      * @property {boolean} singleMonthView=false - Show only a single month calendar, useful when selected ranges are usually short<br>
      * or for smaller viewports like mobile devices.<br>
      * Ignored for `singleDatePicker: true`. 
      * @property {boolean} showDropdowns=false - Show year and month select boxes above calendars to jump to a specific month and year
      * @property {number} minYear - Default: `DateTime.now().minus({year:100}).year`<br>The minimum year shown in the dropdowns when `showDropdowns: true`
      * @property {number} maxYear - Default: `DateTime.now().plus({year:100}).year`<br>The maximum  year shown in the dropdowns when `showDropdowns: true`
      * @property {boolean} showWeekNumbers=false - Show **localized** week numbers at the start of each week on the calendars
      * @property {boolean} showISOWeekNumbers=false - Show **ISO** week numbers at the start of each week on the calendars.<br>
      * Takes precedence over localized `showWeekNumbers`

      * @property {boolean} timePicker=false - Adds select boxes to choose times in addition to dates
      * @property {boolean} timePicker24Hour=true|false - Use 24-hour instead of 12-hour times, removing the AM/PM selection.<br>
      * Default is derived from current locale [Intl.DateTimeFormat.resolvedOptions.hour12](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#hour12).
      * @property {external:Duration|string|number} timePickerStepSize - Default: `Duration.fromObject({minutes:1})`<br>Set the time picker step size.<br>
      * Must be a `luxon.Duration` or the number of seconds or a string according to {@link https://en.wikipedia.org/wiki/ISO_8601|ISO-8601} duration.<br>
      * Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})` 
      * and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br>
      * Duration must be greater than `minSpan` and smaller than `maxSpan`.<br>
      * For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes.

      * @property {boolean} autoUpdateInput=true - Indicates whether the date range picker should instantly update the value of the attached `<input>` 
      * element when the selected dates change.<br>The `<input>` element will be always updated on `Apply` and reverted when user clicks on `Cancel`.
      * @property {string} onOutsideClick=apply - Defines what picker shall do when user clicks outside the calendar. 
      * `'apply'` or `'cancel'`. Event {@link #event_outsideClick|onOutsideClick} is always emitted.
      * @property {boolean} linkedCalendars=true - When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), 
      * and both will be advanced when clicking the left or right arrows above the calendars.<br>
      * When disabled, the two calendars can be individually advanced and display any month/year
      * @property {function} isInvalidDate=false - A function that is passed each date in the two calendars before they are displayed,<br> 
      * and may return `true` or `false` to indicate whether that date should be available for selection or not.<br>
      * Signature: `isInvalidDate(date)`<br>
      * @property {function} isInvalidTime=false - A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br> 
      * and may return `true` or `false` to indicate whether that date should be available for selection or not.<br>
      * Signature: `isInvalidTime(time, side, unit)`<br>
      * `side` is `'start'` or `'end'` or `null` for `singleDatePicker: true`<br>
      * `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br>
      * Hours are always given as 24-hour clock<br>
      * Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br>
      * @property {function} isCustomDate=false - A function that is passed each date in the two calendars before they are displayed, 
      * and may return a string or array of CSS class names to apply to that date's calendar cell.<br>
      * Signature: `isCustomDate(date)`
      * @property {string|Array|external:HTMLInputElement} altInput=null - A {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#selectors|Document querySelector}<br>
      * string or `HTMLElement` 
      * for an alternative output (typically hidden) `<input>` element. Uses `altFormat` to format the value.<br>
      * Must be a single string/HTMLElement for `singleDatePicker: true` or an array of two strings or HTMLElement for `singleDatePicker: false`<br>
      * Example: `['#start', '#end']`
      * @property {function|string} altFormat - The output format used for `altInput`.<br>
      * Default: ISO-8601 basic format without time zone, precisison is derived from `timePicker` and `timePickerStepSize`<br>
      * Example `yyyyMMdd'T'HHmm` for `timePicker=true` and display of Minutes<br> 
      * If defined, either a string used with {@link https://moment.github.io/luxon/#/formatting?id=table-of-tokens|Format tokens} or a function.<br>
      * Examples: `"yyyy:MM:dd'T'HH:mm"`,<br>`(date) => date.toUnixInteger()`

      * @property {string} applyButtonClasses=btn-primary - CSS class names that will be added only to the apply button
      * @property {string} cancelButtonClasses=btn-default - CSS class names that will be added only to the cancel button
      * @property {string} buttonClasses - Default: `'btn btn-sm'`<br>CSS class names that will be added to both the apply and cancel buttons.
      * @property {string} weekendClasses=weekend - CSS class names that will be used to highlight weekend days.<br>
      * Use `null` or empty string if you don't like to highlight weekend days.
      * @property {string} weekendDayClasses=weekend-day - CSS class names that will be used to highlight weekend day names.<br>
      * Weekend days are evaluated by [Info.getWeekendWeekdays](https://moment.github.io/luxon/api-docs/index.html#infogetweekendweekdays) and depend on current 
      * locale settings.
      * Use `null` or empty string if you don't like to highlight weekend day names.
      * @property {string} todayClasses=today - CSS class names that will be used to highlight the current day.<br>
      * Use `null` or empty string if you don't like to highlight the current day.

      * @property {string} opens=right - Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.<br>
      * `'left' \| 'right' \| 'center'`
      * @property {string} drops=down - Whether the picker appears below or above the HTML element it's attached to.<br>
      * `'down' \| 'up' \| 'auto'`

      * @property {object} ranges={} - Set predefined date {@link #Ranges|Ranges} the user can select from. Each key is the label for the range, 
      * and its value an array with two dates representing the bounds of the range.
      * @property {boolean} showCustomRangeLabel=true - Displays "Custom Range" at the end of the list of predefined {@link #Ranges|Ranges}, 
      * when the ranges option is used.<br>
      * This option will be highlighted whenever the current date range selection does not match one of the predefined ranges.<br>
      * Clicking it will display the calendars to select a new range.
      * @property {boolean} alwaysShowCalendars=false - Normally, if you use the ranges option to specify pre-defined date ranges, 
      * calendars for choosing a custom date range are not shown until the user clicks "Custom Range".<br>
      * When this option is set to true, the calendars for choosing a custom date range are always shown instead.
      * @property {boolean} showLabel= - Shows selected range next to Apply buttons.<br>
      * Defaults to `false` if anchor element is `<input type="text">`, otherwise `true`
      * @property {object} locale={} - Allows you to provide localized strings for buttons and labels, customize the date format, 
      * and change the first day of week for the calendars.
      * @property {string} locale.direction=ltr - Direction of reading, `'ltr'` or `'rtl'`
      * @property {object|string} locale.format - Default: `DateTime.DATE_SHORT` or `DateTime.DATETIME_SHORT` when `timePicker: true`<br>Date formats. 
      * Either given as string, see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according 
      * to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)<br>
      * I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets).
      * @property {string} locale.separator - Defaut: `' - '`<br>Separator for start and end time
      * @property {string} locale.weekLabel=W - Label for week numbers
      * @property {Array} locale.daysOfWeek - Default: `luxon.Info.weekdays('short')`<br>Array with weekday names, from Monday to Sunday
      * @property {Array} locale.monthNames - Default: `luxon.Info.months('long')`<br>Array with month names
      * @property {number} locale.firstDay - Default: `luxon.Info.getStartOfWeek()`<br>First day of the week, 1 for Monday through 7 for Sunday
      * @property {string} locale.applyLabel=Apply - Label of `Apply` Button
      * @property {string} locale.cancelLabel=Cancel - Label of `Cancel` Button
      * @property {string} locale.customRangeLabel=Custom Range - Title for custom ranges
      * @property {object|string|function} locale.durationFormat={} - Format a custom label for selected duration, for example `'5 Days, 12 Hours'`.<br>
      * Define the format either as string, see [Duration.toFormat - Format Tokens](https://moment.github.io/luxon/api-docs/index.html#durationtoformat) or 
      * an object according to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options), 
      * see [Duration.toHuamn](https://moment.github.io/luxon/api-docs/index.html#durationtohuman).<br>
      * Or custom function as `(startDate, endDate) => {}`
      */

      /**
      * A set of predefined ranges.<br>
      * Ranges are not validated against `minDate`, `maxDate`, `minSpan`, `maxSpan` or `timePickerStepSize ` constraints.
      * @typedef Ranges
      * @type {Object}
      * @property {string} name - The name of the range
      * @property {external:DateTime|external:Date|string} range - Array of 2 elements with `startDate` and `endDate`
      * @example {
      *  'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
      *  'Yesterday': [DateTime.now().startOf('day').minus({days: 1}), DateTime.now().minus({days: 1}).endOf('day')],
      *  'Last 7 Days': [DateTime.now().startOf('day').minus({days: 6}), DateTime.now()],
      *  'Last 30 Days': [DateTime.now().startOf('day').minus({days: 29}), DateTime.now()],
      *  'This Month': [DateTime.now().startOf('day').startOf('month'), DateTime.now().endOf('month')],
      *  'Last Month': [DateTime.now().startOf('day').minus({months: 1}).startOf('month'), DateTime.now().minus({months: 1}).endOf('month')]
      * }
      */

      /**
      * A single predefined range
      * @typedef Range
      * @type {Object}
      * @property {string} name - The name of the range
      * @property {external:DateTime|external:Date|string} range - Array of 2 elements with startDate and endDate
      * @example { Today: [DateTime.now().startOf('day'), DateTime.now().endOf('day')] }        
      */

      if (typeof element === 'string' && document.querySelectorAll(element).length > 1)
         throw new RangeError(`Option 'element' must match to one element only`);

      //default settings for options
      this.parentEl = 'body';
      this.element = element instanceof HTMLElement ? element : document.querySelector(element);
      this.isInputText = this.element instanceof HTMLInputElement && this.element.type === 'text';
      this.#startDate = DateTime.now().startOf('day');
      this.#endDate = DateTime.now().plus({ day: 1 }).startOf('day');
      this.minDate = null;
      this.maxDate = null;
      this.maxSpan = null;
      this.minSpan = null;
      this.defaultSpan = null;
      this.initialMonth = DateTime.now().startOf('month');
      this.autoApply = false;
      this.singleDatePicker = false;
      this.singleMonthView = false;
      this.showDropdowns = false;
      this.minYear = DateTime.now().minus({ year: 100 }).year;
      this.maxYear = DateTime.now().plus({ year: 100 }).year;
      this.showWeekNumbers = false;
      this.showISOWeekNumbers = false;
      this.showCustomRangeLabel = true;
      this.showLabel = !this.isInputText;
      this.timePicker = false;
      const usesMeridiems = new Intl.DateTimeFormat(DateTime.now().locale, { hour: 'numeric' }).resolvedOptions();
      this.timePicker24Hour = !usesMeridiems.hour12;
      this.timePickerStepSize = Duration.fromObject({ minutes: 1 });
      this.linkedCalendars = true;
      this.autoUpdateInput = true;
      this.alwaysShowCalendars = false;
      this.isInvalidDate = null;
      this.isInvalidTime = null;
      this.isCustomDate = null;
      this.onOutsideClick = 'apply';
      this.opens = this.element?.classList.contains('pull-right') ? 'left' : 'right';
      this.drops = this.element?.classList.contains('dropup') ? 'up' : 'down';
      this.buttonClasses = 'btn btn-sm';
      this.applyButtonClasses = 'btn-primary';
      this.cancelButtonClasses = 'btn-default';
      this.weekendClasses = 'weekend';
      this.weekendDayClasses = 'weekend-day';
      this.todayClasses = 'today';
      this.altInput = null;
      this.altFormat = null;
      this.externalStyle = null;
      this.ranges = {};

      this.locale = {
         direction: 'ltr',
         format: DateTime.DATE_SHORT, // or DateTime.DATETIME_SHORT when timePicker: true
         separator: ' - ',
         applyLabel: 'Apply',
         cancelLabel: 'Cancel',
         weekLabel: 'W',
         customRangeLabel: 'Custom Range',
         daysOfWeek: Info.weekdays('short'),
         monthNames: Info.months('long'),
         firstDay: Info.getStartOfWeek(),
         durationFormat: null
      };

      if (this.element == null)
         return;

      this.callback = null;

      //some state information
      this.isShowing = false;
      this.leftCalendar = {};
      this.rightCalendar = {};

      //custom options from user
      if (typeof options !== 'object' || options === null)
         options = {};

      //allow setting options with data-* attributes
      //do not use simple this.element.dataSet to support object values
      let dataOptions = {};

      const data = Array.from(this.element.attributes).filter(x => x.name.startsWith('data-'));
      for (let item of data) {
         const name = item.name.replace(/^data-/g, '').replace(/-([a-z])/g, function (str) { return str[1].toUpperCase() });
         if (!Object.keys(this).concat(['startDate', 'endDate']).includes(name) || Object.keys(options).includes(name))
            continue; // do not try to parse any attributes which are not needed

         let ts = DateTime.fromISO(item.value);
         const isDate = ['startDate', 'endDate', 'minDate', 'maxDate', 'initialMonth'].includes(name);
         dataOptions[name] = (ts.isValid && isDate) ? ts : JSON.parse(item.value);
      }
      //javascript options take precedence over data-* attributes
      options = { ...dataOptions, ...options };

      if (typeof options.singleDatePicker === 'boolean')
         this.singleDatePicker = options.singleDatePicker;

      if (!this.singleDatePicker && typeof options.singleMonthView === 'boolean') {
         this.singleMonthView = options.singleMonthView;
      } else {
         this.singleMonthView = false;
      }

      // #region Template
      // detect if Bulma stylesheet is loaded
      if (!(options.externalStyle === null)) {
         const bodyStyle = window.getComputedStyle(document.body);
         if (bodyStyle && typeof bodyStyle[Symbol.iterator] === 'function' && [...bodyStyle].some(x => x.startsWith('--bulma-')))
            this.externalStyle = 'bulma';
      }

      // html template for the picker UI. Custom template would be possible, but this option is not documented
      if (typeof options.template === 'string' || options.template instanceof HTMLElement) {
         this.container = typeof options.template === 'string' ? createElementFromHTML(options.template) : options.template;
      } else {
         let template = [
            '<div class="daterangepicker">',
            '<div class="ranges"></div>',
            '<div class="drp-calendar left">',
            '<table class="calendar-table">',
            '<thead></thead>',
            '<tbody></tbody>',
            '<tfoot>',
            '<tr class="calendar-time start-time"></tr>',
            this.singleMonthView ? '<tr class="calendar-time end-time"></tr>' : '',
            '</tfoot>',
            '</table>',
            '</div>'];

         template.push(...[
            '<div class="drp-calendar right">',
            '<table class="calendar-table">',
            '<thead></thead>',
            '<tbody></tbody>',
            '<tfoot>',
            this.singleMonthView ? '' : '<tr class="calendar-time end-time"></tr>',
            '</tfoot>',
            '</table>',
            '</div>']);

         template.push(...[
            '<div class="drp-buttons">',
            '<div class="drp-duration-label"></div>',
            '<div class="drp-selected"></div>']);
         if (this.externalStyle === 'bulma') {
            template.push(...[
               '<div class="buttons">',
               '<button class="cancelBtn button is-small" type="button"></button>',
               '<button class="applyBtn button is-small" disabled type="button"></button>',
               '</div>'
            ]);
         } else {
            template.push(...[
               '<div>',
               '<button class="cancelBtn" type="button"></button>',
               '<button class="applyBtn" disabled type="button"></button>',
               '</div>']);
         }
         template.push('</div></div>');
         options.template = template.join('');
         this.container = createElementFromHTML(options.template);
      }
      this.parentEl = document.querySelector(typeof options.parentEl === 'string' ? options.parentEl : this.parentEl);
      this.parentEl.appendChild(this.container);

      //
      // handle all the possible options overriding defaults
      //

      if (typeof options.timePicker === 'boolean')
         this.timePicker = options.timePicker;
      if (this.timePicker)
         this.locale.format = DateTime.DATETIME_SHORT;

      if (typeof options.locale === 'object') {
         for (let key of ['separator', 'applyLabel', 'cancelLabel', 'weekLabel']) {
            if (typeof options.locale[key] === 'string')
               this.locale[key] = options.locale[key];
         }

         if (typeof options.locale.direction === 'string') {
            if (['rtl', 'ltr'].includes(options.locale.direction))
               this.locale.direction = options.locale.direction
            else
               console.error(`Option 'options.locale.direction' must be 'rtl' or 'ltr'`);
         }

         if (['string', 'object'].includes(typeof options.locale.format))
            this.locale.format = options.locale.format;

         if (Array.isArray(options.locale.daysOfWeek)) {
            if (options.locale.daysOfWeek.some(x => typeof x !== 'string'))
               console.error(`Option 'options.locale.daysOfWeek' must be an array of strings`)
            else
               this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
         }

         if (Array.isArray(options.locale.monthNames)) {
            if (options.locale.monthNames.some(x => typeof x !== 'string'))
               console.error(`Option 'locale.monthNames' must be an array of strings`)
            else
               this.locale.monthNames = options.locale.monthNames.slice();
         }

         if (typeof options.locale.firstDay === 'number')
            this.locale.firstDay = options.locale.firstDay;

         if (typeof options.locale.customRangeLabel === 'string') {
            //Support unicode chars in the custom range name.
            var elem = document.createElement('textarea');
            elem.innerHTML = options.locale.customRangeLabel;
            var rangeHtml = elem.value;
            this.locale.customRangeLabel = rangeHtml;
         }

         if (['string', 'object', 'function'].includes(typeof options.locale.durationFormat) && options.locale.durationFormat != null)
            this.locale.durationFormat = options.locale.durationFormat;
      }
      this.container.classList.add(this.locale.direction);
      // #endregion


      // #region Generic Options
      for (let key of ['timePicker24Hour', 'showWeekNumbers', 'showISOWeekNumbers',
         'showDropdowns', 'linkedCalendars', 'showCustomRangeLabel',
         'alwaysShowCalendars', 'autoApply', 'autoUpdateInput', 'showLabel']) {
         if (typeof options[key] === 'boolean')
            this[key] = options[key];
      }

      for (let key of ['applyButtonClasses', 'cancelButtonClasses', 'weekendClasses', 'weekendDayClasses', 'todayClasses']) {
         if (typeof options[key] === 'string') {
            this[key] = options[key];
         } else if (['weekendClasses', 'weekendDayClasses', 'todayClasses'].includes(key) && options[key] === null) {
            this[key] = options[key];
         }
      }

      for (let key of ['minYear', 'maxYear']) {
         if (typeof options[key] === 'number')
            this[key] = options[key];
      }

      for (let key of ['isInvalidDate', 'isInvalidTime', 'isCustomDate']) {
         if (typeof options[key] === 'function')
            this[key] = options[key]
         else
            this[key] = function () { return false };
      }
      // #endregion

      // #region initial Values
      if (!this.singleDatePicker) {
         for (let opt of ['minSpan', 'maxSpan', 'defaultSpan']) {
            if (['string', 'number', 'object'].includes(typeof options[opt])) {
               if (Duration.isDuration(options[opt]) && options[opt].isValid) {
                  this[opt] = options[opt];
               } else if (Duration.fromISO(options[opt]).isValid) {
                  this[opt] = Duration.fromISO(options[opt]);
               } else if (typeof options[opt] === 'number' && Duration.fromObject({ seconds: options[opt] }).isValid) {
                  this[opt] = Duration.fromObject({ seconds: options[opt] });
               } else if (options[opt] === null) {
                  this[opt] = null;
               } else {
                  console.error(`Option '${key}' is not valid`);
               };
            }
         }
         if (this.minSpan && this.maxSpan && this.minSpan > this.maxSpan) {
            this.minSpan = null;
            this.maxSpan = null;
            console.warn(`Ignore option 'minSpan' and 'maxSpan', because 'minSpan' must be smaller than 'maxSpan'`);
         }
         if (this.defaultSpan && this.minSpan && this.minSpan > this.defaultSpan) {
            this.defaultSpan = null;
            console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be greater than 'minSpan'`);
         } else if (this.defaultSpan && this.maxSpan && this.maxSpan < this.defaultSpan) {
            this.defaultSpan = null;
            console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be smaller than 'maxSpan'`);
         }
      }

      if (this.timePicker) {
         if (['string', 'object', 'number'].includes(typeof options.timePickerStepSize)) {
            let duration;
            if (Duration.isDuration(options.timePickerStepSize) && options.timePickerStepSize.isValid) {
               duration = options.timePickerStepSize;
            } else if (Duration.fromISO(options.timePickerStepSize).isValid) {
               duration = Duration.fromISO(options.timePickerStepSize);
            } else if (typeof options.timePickerStepSize === 'number' && Duration.fromObject({ seconds: options.timePickerStepSize }).isValid) {
               duration = Duration.fromObject({ seconds: options.timePickerStepSize });
            } else {
               console.error(`Option 'timePickerStepSize' is not valid`);
               duration = this.timePickerStepSize;
            };
            var valid = [];
            for (let unit of ['minutes', 'seconds'])
               valid.push(...[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].map(x => { return Duration.fromObject({ [unit]: x }) }));
            valid.push(...[1, 2, 3, 4, 6].map(x => { return Duration.fromObject({ hours: x }) }));
            if (this.timePicker24Hour)
               valid.push(...[8, 12].map(x => { return Duration.fromObject({ hours: x }) }));

            if (valid.some(x => duration.rescale().equals(x))) {
               this.timePickerStepSize = duration.rescale();
            } else {
               console.error(`Option 'timePickerStepSize' ${JSON.stringify(duration.toObject())} is not valid`);
            }
         }
         if (this.maxSpan && this.timePickerStepSize > this.maxSpan)
            console.error(`Option 'timePickerStepSize' ${JSON.stringify(this.timePickerStepSize.toObject())} must be smaller than 'maxSpan'`);

         this.timePickerOpts = {
            showMinutes: this.timePickerStepSize < Duration.fromObject({ hours: 1 }),
            showSeconds: this.timePickerStepSize < Duration.fromObject({ minutes: 1 }),
            hourStep: this.timePickerStepSize >= Duration.fromObject({ hours: 1 }) ? this.timePickerStepSize.hours : 1,
            minuteStep: this.timePickerStepSize >= Duration.fromObject({ minutes: 1 }) ? this.timePickerStepSize.minutes : 1,
            secondStep: this.timePickerStepSize.seconds
         };
      }

      for (let opt of ['startDate', 'endDate', 'minDate', 'maxDate', 'initialMonth']) {
         if (opt === 'endDate' && this.singleDatePicker)
            continue;
         if (typeof options[opt] === 'object') {
            if (DateTime.isDateTime(options[opt]) && options[opt].isValid) {
               this[opt] = options[opt];
            } else if (options[opt] instanceof Date) {
               this[opt] = DateTime.fromJSDate(options[opt]);
            } else if (options[opt] === null) {
               this[opt] = null;
            } else {
               console.error(`Option '${opt}' must be a luxon.DateTime or Date or string`);
            }
         } else if (typeof options[opt] === 'string') {
            const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
            if (DateTime.fromISO(options[opt]).isValid) {
               this[opt] = DateTime.fromISO(options[opt]);
            } else if (DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale }).isValid) {
               this[opt] = DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale });
            } else {
               const invalid = DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale }).invalidExplanation;
               console.error(`Option '${opt}' is not a valid string: ${invalid}`);
            }
         }
      }

      if (this.isInputText) {
         //if startDate and/or endDate are not set, check if the input element contains initial values
         if (this.element.value != '') {
            const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
            if (this.singleDatePicker && typeof options.startDate === 'undefined') {
               const start = DateTime.fromFormat(this.element.value, format, { locale: DateTime.now().locale });
               if (start.isValid) {
                  this.#startDate = start;
               } else {
                  console.error(`Value "${this.element.value}" in <input> is not a valid string: ${start.invalidExplanation}`)
               }
            } else if (!this.singleDatePicker && typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
               const split = this.element.value.split(this.locale.separator);
               if (split.length === 2) {
                  const start = DateTime.fromFormat(split[0], format, { locale: DateTime.now().locale });
                  const end = DateTime.fromFormat(split[1], format, { locale: DateTime.now().locale });
                  if (start.isValid && end.isValid) {
                     this.#startDate = start;
                     this.#endDate = end;
                  } else {
                     console.error(`Value in <input> is not a valid string: ${start.invalidExplanation} - ${end.invalidExplanation}`);
                  }
               } else {
                  console.error(`Value "${this.element.value}" in <input> is not a valid string`)
               }
            }
         }
      }

      if (this.singleDatePicker) {
         // Needed to determine if a range is complete
         // If #endDate and #startDate exist, then click on date must be the startDate
         // At this point in time the range is not complete, this applies also for singleDatePicker
         this.#endDate = this.#startDate;
      } else if (this.#endDate < this.#startDate) {
         console.error(`Option 'endDate' ${this.#endDate} must not be earlier than 'startDate' ${this.#startDate}`);
      }
      if (!this.timePicker) {
         if (this.minDate) this.minDate = this.minDate.startOf('day');
         if (this.maxDate) this.maxDate = this.maxDate.endOf('day');
         if (this.#startDate) this.#startDate = this.#startDate.startOf('day');
         if (this.#endDate) this.#endDate = this.#endDate.endOf('day');
      }

      if (!this.#startDate && this.initialMonth) {
         // No initial date selected
         this.#endDate = null;
         if (this.timePicker)
            console.error(`Option 'initialMonth' works only with 'timePicker: false'`);
      } else {
         // Do some sanity checks on startDate and endDate for minDate, maxDate, minSpan, maxSpan, etc.
         // Otherwise you may initialize a calendar were nothing can be selected
         const violations = this.validateInput(null, false);
         if (violations != null) {
            let vio = violations.startDate;
            if (vio.length > 0) {
               if (vio.some(x => x.reason.startsWith('isInvalid'))) {
                  console.error(`Value of startDate "${this.#startDate}" violates ${vio.find(x => x.reason.startsWith('isInvalid')).reason}`);
               } else {
                  const newDate = vio.filter(x => x.new != null).at(-1).new;
                  if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID == null)
                     console.warn(`Correcting startDate from ${this.#startDate} to ${newDate}`)
                  this.#startDate = newDate;
               }
            }
            if (!this.singleDatePicker) {
               vio = violations.endDate.filter(x => x.new != null);
               if (vio.length > 0) {
                  if (vio.some(x => x.reason.startsWith('isInvalid'))) {
                     console.error(`Value of endDate "${this.#endDate}" violates ${vio.find(x => x.reason.startsWith('isInvalid')).reason}`);
                  } else {
                     const newDate = vio.filter(x => x.new != null).at(-1).new;
                     if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID == null)
                        console.warn(`Correcting endDate from ${this.#endDate} to ${newDate}`)
                     this.#endDate = newDate
                  }
               }

            }
         }
      }

      if (this.singleDatePicker) {
         if (typeof options.altInput === 'string') {
            const el = document.querySelector(options.altInput);
            this.altInput = (el instanceof HTMLInputElement && el.type === 'text') ? el : null;
         } else if (options.altInput instanceof HTMLElement) {
            this.altInput = (options.altInput instanceof HTMLInputElement && options.altInput.type === 'text') ? options.altInput : null;
         }
      } else if (!this.singleDatePicker && Array.isArray(options.altInput) && options.altInput.length === 2) {
         this.altInput = [];
         for (let item of options.altInput) {
            const el = typeof item === 'string' ? document.querySelector(item) : item;
            if (el instanceof HTMLInputElement && el.type === 'text')
               this.altInput.push(el);
         }
         if (this.altInput.length !== 2)
            this.altInput = null;
      } else if (options.altInput != null) {
         console.warn(`Option 'altInput' ${JSON.stringify(options.altInput)} is not valid`);
      }
      if (options.altInput && ['function', 'string'].includes(typeof options.altFormat))
         this.altFormat = options.altFormat;
      // #endregion

      // #region - Localisation and Styling
      if (typeof options.opens === 'string') {
         if (['left', 'right', 'center'].includes(options.opens))
            this.opens = options.opens
         else
            console.error(`Option 'options.opens' must be 'left', 'right' or 'center'`);
      }

      if (typeof options.drops === 'string') {
         if (['up', 'down', 'auto'].includes(options.drops))
            this.drops = options.drops
         else
            console.error(`Option 'options.drops' must be 'up', 'down' or 'auto'`);
      }

      if (Array.isArray(options.buttonClasses)) {
         this.buttonClasses = options.buttonClasses.join(' ')
      } else if (typeof options.buttonClasses === 'string') {
         this.buttonClasses = options.buttonClasses;
      }

      if (typeof options.onOutsideClick === 'string') {
         if (['cancel', 'apply'].includes(options.onOutsideClick))
            this.onOutsideClick = options.onOutsideClick
         else
            console.error(`Option 'options.onOutsideClick' must be 'cancel' or 'apply'`);
      }

      // update day names order to firstDay
      if (this.locale.firstDay != 1) {
         let iterator = this.locale.firstDay;
         while (iterator > 1) {
            this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
            iterator--;
         }
      }

      if (!this.singleDatePicker && typeof options.ranges === 'object') {
         // Process custom ranges
         for (let range in options.ranges) {
            let start, end;
            if (['string', 'object'].includes(typeof options.ranges[range][0])) {
               if (DateTime.isDateTime(options.ranges[range][0]) && options.ranges[range][0].isValid) {
                  start = options.ranges[range][0];
               } else if (options.ranges[range][0] instanceof Date) {
                  start = DateTime.fromJSDate(options.ranges[range][0]);
               } else if (typeof options.ranges[range][0] === 'string' && DateTime.fromISO(options.ranges[range][0]).isValid) {
                  start = DateTime.fromISO(options.ranges[range][0]);
               } else {
                  console.error(`Option ranges['${range}'] is not am array of valid ISO-8601 string or luxon.DateTime or Date`);
               }
            }
            if (['string', 'object'].includes(typeof options.ranges[range][1])) {
               if (DateTime.isDateTime(options.ranges[range][1]) && options.ranges[range][1].isValid) {
                  end = options.ranges[range][1];
               } else if (options.ranges[range][1] instanceof Date) {
                  end = DateTime.fromJSDate(options.ranges[range][1]);
               } else if (typeof options.ranges[range][1] === 'string' && DateTime.fromISO(options.ranges[range][1]).isValid) {
                  end = DateTime.fromISO(options.ranges[range][1]);
               } else {
                  console.error(`Option ranges['${range}'] is not a valid ISO-8601 string or luxon.DateTime or Date`);
               }
            }
            if (start == null || end == null)
               continue;

            //Support unicode chars in the range names.
            var elem = document.createElement('textarea');
            elem.innerHTML = range;
            this.ranges[elem.value] = [start, end];
         }
         var list = '<ul>';
         for (let range in this.ranges)
            list += `<li data-range-key="${range}">${range}</li>`;
         if (this.showCustomRangeLabel)
            list += `<li data-range-key="${this.locale.customRangeLabel}">${this.locale.customRangeLabel}</li>`;
         list += '</ul>';
         this.container.querySelector('.ranges').prepend(createElementFromHTML(list));
         this.container.classList.add('show-ranges');
      }

      if (typeof cb === 'function')
         this.callback = cb;

      if (!this.timePicker)
         this.container.querySelectorAll('.calendar-time').forEach(el => { el.style.display = 'none' });

      //can't be used together for now
      if (this.timePicker && this.autoApply)
         this.autoApply = false;

      if (this.autoApply)
         this.container.classList.add('auto-apply');

      if (this.singleDatePicker || this.singleMonthView) {
         this.container.classList.add('single');
         this.container.querySelector('.drp-calendar.left').classList.add('single');
         this.container.querySelector('.drp-calendar.left').style.display = '';
         this.container.querySelector('.drp-calendar.right').style.display = 'none';
         if (!this.timePicker && this.autoApply)
            this.container.classList.add('auto-apply');
      }

      if (this.singleDatePicker || !Object.keys(this.ranges).length || this.alwaysShowCalendars)
         this.container.classList.add('show-calendar');

      this.container.classList.add(`opens${this.opens}`);

      //apply CSS classes and labels to buttons
      this.container.querySelectorAll('.applyBtn, .cancelBtn').forEach(el => {
         el.classList.add(...this.buttonClasses.split(' '))
      });
      if (this.applyButtonClasses.length)
         this.container.querySelector('.applyBtn').classList.add(...this.applyButtonClasses.split(' '));
      if (this.cancelButtonClasses.length)
         this.container.querySelector('.cancelBtn').classList.add(...this.cancelButtonClasses.split(' '));
      this.container.querySelector('.applyBtn').innerHTML = this.locale.applyLabel;
      this.container.querySelector('.cancelBtn').innerHTML = this.locale.cancelLabel;
      // #endregion

      //addListener(element, eventName, selector, delegate)
      // #region Event Listeners
      this.addListener('.drp-calendar', 'click', '.prev', this.clickPrev.bind(this));
      this.addListener('.drp-calendar', 'click', '.next', this.clickNext.bind(this));
      this.addListener('.drp-calendar', 'mousedown', 'td.available', this.clickDate.bind(this));
      this.addListener('.drp-calendar', 'mouseenter', 'td.available', this.hoverDate.bind(this));
      this.addListener('.drp-calendar', 'change', 'select.yearselect,select.monthselect', this.monthOrYearChanged.bind(this));
      this.addListener('.drp-calendar', 'change', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', this.timeChanged.bind(this));

      this.addListener('.ranges', 'click', 'li', this.clickRange.bind(this));
      this.addListener('.ranges', 'mouseenter', 'li', this.hoverRange.bind(this));
      this.addListener('.ranges', 'mouseleave', 'li', this.leaveRange.bind(this));

      this.addListener('.drp-buttons', 'click', 'button.applyBtn', this.clickApply.bind(this));
      this.addListener('.drp-buttons', 'click', 'button.cancelBtn', this.clickCancel.bind(this));

      if (this.element.matches('input') || this.element.matches('button')) {
         this.element.addEventListener('click', this.#showProxy);
         this.element.addEventListener('focus', this.#showProxy);
         this.element.addEventListener('keyup', this.#elementChangedProxy);
         this.element.addEventListener('keydown', this.#keydownProxy); //IE 11 compatibility
      } else {
         this.element.addEventListener('click', this.#toggleProxy)
         this.element.addEventListener('keydown', this.#toggleProxy);
      }
      // #endregion

      // if attached to a text input, set the initial value
      this.updateElement();

   }
   /**
    * startDate
    * @type {external:DateTime}
    */
   get startDate() { return this.timePicker ? this.#startDate : this.#startDate?.startOf('day') ?? null; }
   /**
    * endDate
    * @type {external:DateTime}
    */
   get endDate() { return this.singleDatePicker ? null : (this.timePicker ? this.#endDate : this.#endDate?.endOf('day')) ?? null; }
   set startDate(val) { this.#startDate = val }
   set endDate(val) { this.#endDate = val }

   /**
    * DateRangePicker specific events
    */
   #events = {
      /**
      * Emitted when the date is changed through `<input>` element or via {@link #DateRangePicker+setStartDate|setStartDate} or 
      * {@link #DateRangePicker+setRange|setRange} and date is not valid due to 
      * `minDate`, `maxDate`, `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` constraints.<br>
      * Event is only triggered when date string is valid and date value is changing<br>
      * @event
      * @name "violate"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {InputViolation} event.violation - The daterangepicker object
      * @property {NewDate} event.newDate - Object of corrected date values
      * @property {boolean} event.cancelable=true - By calling `event.preventDefault()` the `newDate` values will apply
      * @example
      * daterangepicker('#picker', {
      *   startDate: DateTime.now(),
      *   // allow only dates from current year
      *   minDate: DateTime.now().startOf('year'),
      *   manDate: DateTime.now().endOf('year'),
      *   singleDatePicker: true,
      *   locale: {
      *      format: DateTime.DATETIME_SHORT
      *   }
      * }).addEventListener('violate', (ev) => {
      *   ev.newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
      *   ev.preventDefault();
      * });
      *
      * // Try to set date outside permitted range at <input> elemet
      * const input = document.querySelector('#picker');
      * input.value = DateTime.now().minus({ years: 10 })).toLocaleString(DateTime.DATETIME_SHORT)
      * input.dispatchEvent(new Event('keyup'));
      
      * // Try to set date outside permitted range by code
      * const drp = getDateRangePicker('#picker');
      * drp.setStartDate(DateTime.now().minus({ years: 10 });
      * 
      * // -> Calendar selects and shows "today - 3 days"
      */
      onViolate: { type: 'violate', param: (violation, newDate) => { return { ...violation, ...{ cancelable: true } } } },
      /**
      * Emitted before the calendar time picker is rendered.
      * @event
      * @name "beforeRenderTimePicker"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onBeforeRenderTimePicker: { type: 'beforeRenderTimePicker' },
      /**
      * Emitted before the calendar is rendered.
      * @event
      * @name "beforeRenderCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onBeforeRenderCalendar: { type: 'beforeRenderCalendar' },
      /**
      * Emitted when the picker is shown 
      * @event
      * @name "show"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onShow: { type: 'show' },
      /**
      * Emitted before the picker will hide.
      * @event
      * @name "beforeHide"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {boolean} event.cancelable=true - Hide is canceled  by calling `event.preventDefault()`
      */
      onBeforeHide: { type: 'beforeHide', param: { cancelable: true } },
      /**
      * Emitted when the picker is hidden
      * @event
      * @name "hide"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onHide: { type: 'hide' },
      /**
      * Emitted when the calendar(s) are shown.
      * Only useful when {@link #Ranges|Ranges} are used.
      * @event
      * @name "showCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onShowCalendar: { type: 'showCalendar' },
      /**
      * Emitted when the calendar(s) are hidden. Only used when {@link #Ranges|Ranges} are used.
      * @event
      * @name "hideCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onHideCalendar: { type: 'hideCalendar' },
      /**
      * Emitted when user clicks outside the picker. Use option `onOutsideClick` to define the default action, then you may not need to handle this event.
      * @event
      * @name "outsideClick"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {boolean} event.cancelable=true - Call `event.preventDefault()` to prevent default behaviour.<br>
      * Useful to define custome areas where click shall not hide the picker
      */
      onOutsideClick: { type: 'outsideClick', param: { cancelable: true } },
      /**
      * Emitted when the date changed. Does not trigger when time is changed, use {@link #event_timeChange|"timeChange"} to handle it
      * @event
      * @name "dateChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {string} event.side - Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker
      */
      onDateChange: { type: 'dateChange', param: (side) => { return side } },
      /**
      * Emitted when the time changed. Does not trigger when date is changed
      * @event
      * @name "timeChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {string} event.side - Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker
      */
      onTimeChange: { type: 'timeChange', param: (side) => { return side } },
      /**
      * Emitted when the `Apply` button is clicked, or when a predefined {@link #Ranges|Ranges} is clicked 
      * @event
      * @name "apply"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onApply: { type: 'apply' },
      /**
      * Emitted when the `Cancel` button is clicked
      * @event
      * @name "cancel"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onCancel: { type: 'cancel' },
      /**
      * Emitted when the date is changed through `<input>` element. Event is only triggered when date string is valid and date value has changed
      * @event
      * @name "inputChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onInputChange: { type: 'inputChange' },
      /**
      * Emitted after month view changed, for example by click on 'prev' or 'next'
      * @event
      * @name "monthViewChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {external:DateTime} event.left - The first day of month in left-hand calendar
      * @property {external:DateTime} event.right - The first day of month in left-hand calendar or `null` for singleDatePicker
      */
      onMonthViewChange: {
         type: 'monthViewChange',
         param: (left, right) => {
            return {
               left: this.leftCalendar.month.startOf('month'),
               right: (this.singleMonthView || this.singleDatePicker) ? null : this.rightCalendar.month.startOf('month')
            }
         }
      },
   }
   /**
    * Getter for all DateRangePickerEvents
    */
   get events() { return this.#events };

   #outsideClickProxy = this.outsideClick.bind(this);
   #onResizeProxy = this.move.bind(this);
   #dropdownClickWrapper = (e) => {
      const match = e.target.closest('[data-toggle="dropdown"]');
      if (match && document.contains(match))
         this.#outsideClickProxy(e);
   };
   #showProxy = this.show.bind(this);
   #elementChangedProxy = this.elementChanged.bind(this);
   #keydownProxy = this.keydown.bind(this);
   #toggleProxy = this.toggle.bind(this);

   /* #region Set startDate/endDate */
   /**
   * Sets the date range picker's currently selected start date to the provided date.<br>
   * `startDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
   * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
   * @param {external:DateTime|external:Date|string} startDate - startDate to be set. In case of ranges, the current `endDate` is used.
   * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
   * @returns {InputViolation} - Object of violations or `null` if no violation have been found
   * @example 
   * const drp = getDateRangePicker('#picker');
   * drp.setStartDate(DateTime.now().startOf('hour'));
   */
   setStartDate(startDate, updateView = true) {
      if (!this.singleDatePicker)
         return this.setRange(startDate, this.#endDate, updateView);

      const oldDate = this.#startDate;
      let newDate = this.parseDate(startDate);
      if (newDate.equals(oldDate))
         return null;

      const violations = this.validateInput([newDate, null], true);
      if (violations != null) {
         if (violations.newDate != null) {
            newDate = violations.newDate.startDate
         } else {
            return violations;
         }
      }
      const monthChange = !this.#startDate.hasSame(newDate, 'month');
      this.#startDate = newDate;
      this.#endDate = this.#startDate;
      if (!this.timePicker) {
         this.#startDate = this.#startDate.startOf('day');
         this.#endDate = this.#endDate.endOf('day');
      }

      this.updateElement();
      if (updateView)
         this.updateView(monthChange);
      return violations;
   }

   /**
   * Sets the date range picker's currently selected start date to the provided date.<br>
   * `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
   * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
   * @param {external:DateTime|external:Date|string} endDate - endDate to be set. In case of ranges, the current `startDate` is used.
   * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
   * @returns {InputViolation} - Object of violations or `null` if no violation have been found
   * @example 
   * const drp = getDateRangePicker('#picker');
   * drp.setEndDate(DateTime.now().startOf('hour'));
   */
   setEndDate(endDate, updateView = true) {
      return this.singleDatePicker ? null : this.setRange(this.#startDate, endDate, updateView);
   }

   /**
   * Sets the date range picker's currently selected start date to the provided date.<br>
   * `startDate` and `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
   * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
   * @param {external:DateTime|external:Date|string} startDate - startDate to be set
   * @param {external:DateTime|external:Date|string} endDate - endDate to be set
   * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
   * @returns {InputViolation} - Object of violations or `null` if no violation have been found
   * @example 
   * const drp = getDateRangePicker('#picker');
   * drp.setRange(DateTime.now().startOf('hour'), DateTime.now().endOf('day'));
   */
   setRange(startDate, endDate, updateView = true) {
      if (this.singleDatePicker)
         return;
      if (!this.#endDate)
         this.#endDate = this.#startDate;

      const oldDate = [this.#startDate, this.#endDate];
      let newDate = [this.parseDate(startDate), this.parseDate(endDate)];

      if ((oldDate[0].equals(newDate[0]) && oldDate[1].equals(newDate[1]) || newDate[0] > newDate[1]))
         return;

      const violations = this.validateInput([newDate[0], newDate[1]], true);
      if (violations != null) {
         if (violations.newDate != null) {
            newDate[0] = violations.newDate.startDate
            newDate[1] = violations.newDate.endDate
         } else {
            return violations;
         }
      }
      const monthChange = !this.#startDate.hasSame(newDate[0], 'month') || !this.#endDate.hasSame(newDate[1], 'month');
      this.#startDate = newDate[0];
      this.#endDate = newDate[1];
      if (!this.timePicker) {
         this.#startDate = this.#startDate.startOf('day');
         this.#endDate = this.#endDate.endOf('day');
      }

      this.updateElement();
      if (updateView)
         this.updateView(monthChange);
      return violations;
   }

   /**
    * Parse date value
    * @param {sting|external:DateTime|Date} value - The value to be parsed
    * @returns {external:DateTime} - DateTime object
    */
   parseDate(value) {
      if (typeof value === 'object') {
         if (DateTime.isDateTime(value) && value.isValid) {
            return value;
         } else if (value instanceof Date) {
            return DateTime.fromJSDate(value);
         } else {
            throw RangeError(`Value must be a luxon.DateTime or Date or string`);
         }
      } else if (typeof value === 'string') {
         const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
         if (DateTime.fromISO(value).isValid) {
            return DateTime.fromISO(value);
         } else if (DateTime.fromFormat(value, format, { locale: DateTime.now().locale }).isValid) {
            return DateTime.fromFormat(value, format, { locale: DateTime.now().locale });
         } else {
            const invalid = DateTime.fromFormat(value, format, { locale: DateTime.now().locale }).invalidExplanation;
            throw RangeError(`Value is not a valid string: ${invalid}`);
         }
      }
   }
   /* #endregion */

   /**
    * Format a DateTime object
    * @param {external:DateTime} date - The DateTime to format
    * @param {object|string} format=this.locale.format - The format option
    * @returns {string} - Formatted date string
    */
   formatDate(date, format = this.locale.format) {
      if (date === null)
         return null;
      if (typeof format === 'object') {
         return date.toLocaleString(format);
      } else {
         if (Settings.defaultLocale === null) {
            // Limitation/bug, see https://github.com/moment/luxon/issues/1366
            const locale = DateTime.now().locale;
            return date.toFormat(format, { locale: locale });
         } else {
            return date.toFormat(format);
         }
      }
   }

   /**
    * Set Duration Label to selected range (if used) and selected dates
    * @private 
    */
   updateLabel() {

      if (this.showLabel) {
         let text = this.formatDate(this.#startDate);
         if (!this.singleDatePicker) {
            text += this.locale.separator;
            if (this.#endDate)
               text += this.formatDate(this.#endDate);
         }
         this.container.querySelector('.drp-selected').innerHTML = text;
      }

      if (this.singleDatePicker || this.locale.durationFormat == null)
         return;
      if (!this.#endDate) {
         this.container.querySelector('.drp-duration-label').innerHTML = '';
         return;
      }

      if (typeof this.locale.durationFormat === 'function') {
         this.container.querySelector('.drp-duration-label').innerHTML = this.locale.durationFormat(this.#startDate, this.#endDate);
      } else {
         let duration = this.#endDate.plus({ milliseconds: 1 }).diff(this.#startDate).rescale().set({ milliseconds: 0 });
         if (!this.timePicker)
            duration = duration.set({ seconds: 0, minutes: 0, hours: 0 });
         duration = duration.removeZeros();

         if (typeof this.locale.durationFormat === 'object') {
            this.container.querySelector('.drp-duration-label').innerHTML = duration.toHuman(this.locale.durationFormat);
         } else {
            this.container.querySelector('.drp-duration-label').innerHTML = duration.toFormat(this.locale.durationFormat);
         }
      }
   }

   /**
   * @typedef InputViolation
   * @type {Object}
   * @typedef {object} Violation
   * @property {string} reason - The type/reason of violation
   * @property {external:DateTime} old - Old value startDate/endDate
   * @property {external:DateTime} new? - Corrected value of startDate/endDate if existing
   * @typedef {object} NewDate
   * @property {external:DateTime} newDate.startDate- Object with corrected values
   * @property {external:DateTime} newDate.endDate - Object with corrected values
   * @property {Violation[]} startDate - The constraints which violates the input
   * @property {Violation[]?} endDate - The constraints which violates the input or `null` for singleDatePicker
   * @property {NewDate} newDate - Object with corrected values
   */
   /**
   * Validate `startDate` and `endDate` against `timePickerStepSize`, `minDate`, `maxDate`, 
   * `minSpan`, `maxSpan`, `invalidDate` and `invalidTime`.
   * @param {Array} range - `[startDate, endDate]`<br>Range to be checked, defaults to current `startDate` and `endDate`
   * @param {boolean} dipatch=false - If `true` then event "violate" is dispated.<br>
   * If eventHandler returns `true`, then `null` is returned, otherwiese the object of violations.
   * @emits "violate"
   * @returns {InputViolation|null} - Object of violations and corrected values or `null` if no violation have been found
   * @example 
   * options => {
   *   minDate: DateTime.now().minus({months: 3}).startOf('day'),
   *   maxDate: DateTime.now().minus({day: 3}).startOf('day'),
   *   minSpan: Duration.fromObject({days: 7}),
   *   maxSpan: Duration.fromObject({days: 70}),
   *   timePickerStepSize: Duration.fromObject({hours: 1})
   * }
   * const result = validateInput(DateTime.now(), DateTime.now().plus({day: 3}));
   * 
   * result => {
   *   startDate: [
   *     { old: "2026-03-13T10:35:52", reason: "timePickerStepSize", new: "2026-03-13T11:00:00" },
   *     { old: "2026-03-13T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" }
   *   ],
   *   endDate: {
   *     { old: "2026-03-16T10:35:52", reason: "stepSize", new: "2026-03-16T11:00:00" },
   *     { old: "2026-03-16T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" },
   *     { old: "2026-03-10T00:00:00", reason: "minSpan", new: "2026-03-17T00:00:00" }
   *   ],
   *   newDate: { 
   *     startDate: "2026-03-10T00:00:00", 
   *     endDate: "2026-03-17T00:00:00"
   *   }
   * }
   */
   validateInput(range, dipatch = false) {
      let startDate = range == null ? this.#startDate : range[0];
      let endDate = range == null ? this.#endDate : range[1];
      if (startDate == null)
         return null;

      let result = { startDate: [] };

      let violation = { old: startDate, reason: this.timePicker ? 'timePickerStepSize' : 'timePicker' };
      if (this.timePicker) {
         // Round time to step size
         const secs = this.timePickerStepSize.as('seconds');
         startDate = DateTime.fromSeconds(secs * Math.round(startDate.toSeconds() / secs));
         violation.new = startDate;
         if (!violation.new.equals(violation.old))
            result.startDate.push(violation);
      } else {
         startDate = startDate.startOf('day');
      }

      const shiftStep = this.timePicker ? this.timePickerStepSize.as('seconds') : Duration.fromObject({ days: 1 }).as('seconds');

      if (this.minDate && startDate < this.minDate) {
         // If the startDate is earlier than minDate option, shift the startDate to allowable date
         violation = { old: startDate, reason: 'minDate' };
         startDate = startDate.plus({ seconds: Math.trunc(this.minDate.diff(startDate).as('seconds') / shiftStep) * shiftStep });
         if (startDate < this.minDate)
            startDate = startDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
         violation.new = startDate;
         if (!violation.new.equals(violation.old))
            result.startDate.push(violation);
      } else if (this.maxDate && startDate > this.maxDate) {
         // If the startDate is later than maxDate option, shift the startDate to allowable date
         violation = { old: startDate, reason: 'maxDate' };
         startDate = startDate.minus({ seconds: Math.trunc(startDate.diff(this.maxDate).as('seconds') / shiftStep) * shiftStep });
         if (startDate > this.maxDate)
            startDate = startDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
         violation.new = startDate;
         if (!violation.new.equals(violation.old))
            result.startDate.push(violation);
      }

      let units = ['hour'];
      if (this.timePicker) {
         if (this.timePickerOpts.showMinutes)
            units.push('minute');
         if (this.timePickerOpts.showSeconds)
            units.push('second');
         if (!this.timePicker24Hour)
            units.push('ampm');
      }

      if (this.isInvalidDate(startDate))
         result.startDate.push({ old: startDate, reason: 'isInvalidDate' });
      if (this.timePicker) {
         for (let unit of units) {
            if (this.isInvalidTime(startDate, unit, 'start'))
               result.startDate.push({ old: startDate, reason: 'isInvalidTime', unit: unit });
         }
      }

      if (this.singleDatePicker) {
         if (result.startDate.length == 0)
            return null;
         if (dipatch) {
            let newValues = { startDate: startDate };
            const event = this.triggerEvent(this.#events.onViolate, { violation: result, newDate: newValues });
            if (event.defaultPrevented) {
               result.newDate = event.newDate;
               return result;
            }
            return result;
         } else {
            return result;
         }
      }

      if (endDate == null)
         return null;
      result.endDate = [];

      violation = { old: endDate, reason: this.timePicker ? 'stepSize' : 'timePicker' };
      if (this.timePicker) {
         // Round time to step size
         const secs = this.timePickerStepSize.as('seconds');
         endDate = DateTime.fromSeconds(secs * Math.round(endDate.toSeconds() / secs));
         violation.new = endDate;
         if (!violation.new.equals(violation.old))
            result.endDate.push(violation);
      } else {
         endDate = endDate.endOf('day');
      }

      if (this.maxDate && endDate > this.maxDate) {
         // If the endDate is later than maxDate option, shorten the range to the allowable period.
         violation = { old: endDate, reason: 'maxDate' };
         endDate = endDate.minus({ seconds: Math.trunc(endDate.diff(this.maxDate).as('seconds') / shiftStep) * shiftStep });
         if (endDate > this.maxDate)
            endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
         violation.new = endDate;
         if (!violation.new.equals(violation.old))
            result.endDate.push(violation);
      } else if (this.minDate && endDate < this.minDate) {
         // If the endDate is earlier than minDate option, shorten the range to the allowable period.
         violation = { old: endDate, reason: 'minDate' };
         endDate = endDate.plus({ seconds: Math.trunc(this.minDate.diff(endDate).as('seconds') / shiftStep) * shiftStep });
         if (endDate < this.minDate)
            endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
         violation.new = endDate;
         if (!violation.new.equals(violation.old))
            result.endDate.push(violation);
      }

      if (this.maxSpan) {
         // If the endDate exceeds those allowed by the maxSpan option, shorten the range to the allowable period.
         const maxDate = startDate.plus(this.maxSpan);
         if (endDate > maxDate) {
            violation = { old: endDate, reason: 'maxSpan' };
            endDate = endDate.minus({ seconds: Math.trunc(maxDate.diff(endDate).as('seconds') / shiftStep) * shiftStep });
            if (endDate > maxDate)
               endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
            violation.new = endDate;
            if (!violation.new.equals(violation.old))
               result.endDate.push(violation);
         }
      }

      if (this.minSpan) {
         // If the endDate falls below those allowed by the minSpan option, expand the range to the allowable period.
         const minDate = startDate.plus(this.defaultSpan ?? this.minSpan);
         if (endDate < minDate) {
            violation = { old: endDate, reason: 'minSpan' };
            endDate = endDate.plus({ seconds: Math.trunc(minDate.diff(endDate).as('seconds') / shiftStep) * shiftStep });
            if (endDate < minDate)
               endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
            violation.new = endDate;
            if (!violation.new.equals(violation.old))
               result.endDate.push(violation);
         }
      }

      if (this.isInvalidDate(endDate))
         result.endDate.push({ old: endDate, reason: 'isInvalidDate' });
      if (this.timePicker) {
         for (let unit of units) {
            if (this.isInvalidTime(endDate, unit, 'end'))
               result.endDate.push({ old: endDate, reason: 'isInvalidTime', unit: unit });
         }
      }

      if (result.startDate.length == 0 && result.endDate.length == 0)
         return null;
      if (dipatch) {
         let newValues = { startDate: startDate, endDate: endDate };
         const event = this.triggerEvent(this.#events.onViolate, { violation: result, newDate: newValues });
         if (event.defaultPrevented) {
            result.newDate = event.newDate;
            return result;
         }
         return result;
      } else {
         return result;
      }
   }


   /* #region Rendering */

   /**
   * Updates the picker when calendar is initiated or any date has been selected. 
   * Could be useful after running {@link #DateRangePicker+setStartDate|setStartDate} or {@link #DateRangePicker+setEndDate|setRange} 
   * @param {boolean} monthChange - If `true` then monthView changed
   * @emits "beforeRenderTimePicker"
   */
   updateView(monthChange) {
      if (this.timePicker) {
         this.triggerEvent(this.#events.onBeforeRenderTimePicker);
         this.renderTimePicker('start');
         this.renderTimePicker('end');
         this.container.querySelectorAll('.calendar-time.end-time select').disabled = !this.#endDate;
         this.container.querySelectorAll('.calendar-time.end-time select').classList.toggle('disabled', !this.#endDate);
      }
      this.updateLabel();
      this.updateMonthsInView();
      this.updateCalendars(monthChange);
      this.setApplyBtnState();

   }

   /**
   * Shows calendar months based on selected date values
   * @private
   */
   updateMonthsInView() {
      if (this.#endDate) {
         //if both dates are visible already, do nothing
         if (!this.singleDatePicker
            && this.leftCalendar.month && this.rightCalendar.month
            && (this.#startDate.hasSame(this.leftCalendar.month, 'month') || this.#startDate.hasSame(this.rightCalendar.month, 'month'))
            && (this.#endDate.hasSame(this.leftCalendar.month, 'month') || this.#endDate.hasSame(this.rightCalendar.month, 'month'))
         )
            return;

         this.leftCalendar.month = this.#startDate.startOf('month');
         if (!this.singleMonthView) {
            if (!this.linkedCalendars && !this.#endDate.hasSame(this.#startDate, 'month')) {
               this.rightCalendar.month = this.#endDate.startOf('month');
            } else {
               this.rightCalendar.month = this.#startDate.startOf('month').plus({ month: 1 });
            }
         }
      } else {
         if (!this.#startDate && this.initialMonth) {
            // initial view without date
            this.leftCalendar.month = this.initialMonth;
            if (!this.singleMonthView)
               this.rightCalendar.month = this.initialMonth.plus({ month: 1 });
         } else {
            if (!this.leftCalendar.month.hasSame(this.#startDate, 'month') && !this.rightCalendar.month.hasSame(this.#startDate, 'month')) {
               this.leftCalendar.month = this.#startDate.startOf('month');
               this.rightCalendar.month = this.#startDate.startOf('month').plus({ month: 1 });
            }
         }
      }

      if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && !this.singleMonthView && this.rightCalendar.month > this.maxDate) {
         this.rightCalendar.month = this.maxDate.startOf('month');
         this.leftCalendar.month = this.maxDate.startOf('month').minus({ month: 1 });
      }

   }

   /**
   * Updates the selected day value from calendar with selected time values
   * @emits "beforeRenderCalendar"
   * @emits "monthViewChange"
   * @param {boolean} monthChange - If `true` then monthView changed
   * @private
   */
   updateCalendars(monthChange) {

      if (this.timePicker) {
         var hour, minute, second;

         if (this.#endDate) {
            hour = parseInt(this.container.querySelector('.start-time .hourselect').value, 10);
            if (isNaN(hour))
               hour = parseInt(this.container.querySelector('.start-time .hourselect option:last-child').value, 10);

            minute = 0;
            if (this.timePickerOpts.showMinutes) {
               minute = parseInt(this.container.querySelector('.start-time .minuteselect').value, 10);
               if (isNaN(minute))
                  minute = parseInt(this.container.querySelector('.start-time .minuteselect option:last-child').value, 10);
            }

            second = 0;
            if (this.timePickerOpts.showSeconds) {
               second = parseInt(this.container.querySelector('.start-time .secondselect').value, 10);
               if (isNaN(second))
                  second = parseInt(this.container.querySelector('.start-time .secondselect option:last-child').value, 10);
            }
         } else {
            hour = parseInt(this.container.querySelector('.end-time .hourselect').value, 10);
            if (isNaN(hour))
               hour = parseInt(this.container.querySelector('.end-time .hourselect option:last-child').value, 10);

            minute = 0;
            if (this.timePickerOpts.showMinutes) {
               minute = parseInt(this.container.querySelector('.end-time .minuteselect').value, 10);
               if (isNaN(minute))
                  minute = parseInt(this.container.querySelector('.end-time .minuteselect option:last-child').value, 10);
            }

            second = 0;
            if (this.timePickerOpts.showSeconds) {
               second = parseInt(this.container.querySelector('.end-time .secondselect').value, 10);
               if (isNaN(second))
                  second = parseInt(this.container.querySelector('.end-time .secondselect option:last-child').value, 10);
            }
         }
         this.leftCalendar.month = this.leftCalendar.month.set({ hour: hour, minute: minute, second: second });
         if (!this.singleMonthView)
            this.rightCalendar.month = this.rightCalendar.month.set({ hour: hour, minute: minute, second: second });
      } else {
         this.leftCalendar.month = this.leftCalendar.month.set({ hour: 0, minute: 0, second: 0 });
         if (!this.singleMonthView)
            this.rightCalendar.month = this.rightCalendar.month.set({ hour: 0, minute: 0, second: 0 });
      }

      this.triggerEvent(this.#events.onBeforeRenderCalendar);
      this.renderCalendar('left');
      //if (!this.singleMonthView)
      this.renderCalendar('right');

      if (monthChange)
         this.triggerEvent(this.#events.onMonthViewChange);


      //highlight any predefined range matching the current start and end dates
      this.container.querySelectorAll('.ranges li').forEach(el => { el.classList.remove('active') });
      if (this.#endDate == null) return;

      this.calculateChosenLabel();

   }

   /**
   * Renders the calendar month
   * @private
   */
   renderCalendar(side) {
      if (side === 'right' && this.singleMonthView)
         return;

      //
      // Build the matrix of dates that will populate the calendar
      //
      var calendar = side === 'left' ? this.leftCalendar : this.rightCalendar;
      if (calendar.month == null && !this.#startDate && this.initialMonth)
         calendar.month = this.initialMonth.startOf('month');

      const firstDay = calendar.month.startOf('month');
      const lastDay = calendar.month.endOf('month').startOf('day');
      var theDate = calendar.month.startOf('month').minus({ day: 1 });
      const time = { hour: calendar.month.hour, minute: calendar.month.minute, second: calendar.month.second };

      //initialize a 6 rows x 7 columns array for the calendar
      var calendar = [];
      calendar.firstDay = firstDay;
      calendar.lastDay = lastDay;

      for (var i = 0; i < 6; i++)
         calendar[i] = [];

      // compute the startDay in month
      while (theDate.weekday != this.locale.firstDay)
         theDate = theDate.minus({ day: 1 });

      for (let col = 0, row = -1; col < 42; col++, theDate = theDate.plus({ day: 1 })) {
         if (col % 7 === 0)
            row++;
         calendar[row][col % 7] = theDate.set(time);
      }

      //make the calendar object available to hoverDate/clickDate
      if (side === 'left') {
         this.leftCalendar.calendar = calendar;
      } else {
         this.rightCalendar.calendar = calendar;
      }

      //
      // Display the calendar
      //

      var minDate = side === 'left' ? this.minDate : this.#startDate;
      var maxDate = this.maxDate;
      //var selected = side === 'left' ? this.#startDate : this.#endDate;
      //var arrow = this.locale.direction === 'ltr' ? { left: 'chevron-left', right: 'chevron-right' } : { left: 'chevron-right', right: 'chevron-left' };

      var html = '<tr>';
      // add empty cell for week number
      if (this.showWeekNumbers || this.showISOWeekNumbers)
         html += '<th></th>';

      if ((!minDate || minDate < calendar.firstDay) && (!this.linkedCalendars || side === 'left')) {
         html += '<th class="prev available"><span></span></th>';
      } else {
         html += '<th></th>';
      }

      var dateHtml = `${this.locale.monthNames[calendar.firstDay.month - 1]} ${calendar.firstDay.year}`;

      if (this.showDropdowns) {
         const maxYear = (maxDate && maxDate.year) ?? this.maxYear;
         const minYear = (minDate && minDate.year) ?? this.minYear;

         let div = this.externalStyle === 'bulma' ? '<div class="select is-small mr-1">' : '';
         var monthHtml = `${div}<select class="monthselect">`;
         for (var m = 1; m <= 12; m++) {
            monthHtml += `<option value="${m}"${m === calendar.firstDay.month ? ' selected' : ''}`;
            if ((minDate && calendar.firstDay.set({ month: m }) < minDate.startOf('month')) || (maxDate && calendar.firstDay.set({ month: m }) > maxDate.endOf('month')))
               monthHtml += ` disabled`;
            monthHtml += `>${this.locale.monthNames[m - 1]}</option>`;
         }
         monthHtml += "</select>";
         if (this.externalStyle === 'bulma')
            monthHtml += "</div>";

         div = this.externalStyle === 'bulma' ? '<div class="select is-small ml-1">' : '';
         var yearHtml = `${div}<select class="yearselect">`;
         for (var y = minYear; y <= maxYear; y++)
            yearHtml += `<option value="${y}"${y === calendar.firstDay.year ? ' selected' : ''}>${y}</option>`;
         yearHtml += '</select>';
         if (this.externalStyle === 'bulma')
            yearHtml += "</div>";

         dateHtml = monthHtml + yearHtml;
      }

      html += '<th colspan="5" class="month">' + dateHtml + '</th>';
      if ((!maxDate || maxDate > calendar.lastDay.endOf('day')) && (!this.linkedCalendars || side === 'right' || this.singleDatePicker || this.singleMonthView)) {
         html += '<th class="next available"><span></span></th>';
      } else {
         html += '<th></th>';
      }
      html += '</tr>';

      // weekday header
      html += '<tr>';
      // add week number label
      if (this.showWeekNumbers || this.showISOWeekNumbers)
         html += `<th class="week">${this.locale.weekLabel}</th>`;

      for (let [index, dayOfWeek] of this.locale.daysOfWeek.entries()) {
         html += '<th';
         if (this.weekendDayClasses && this.weekendDayClasses.length && Info.getWeekendWeekdays().includes(index + 1))
            //highlight weekend day
            html += ` class="${this.weekendDayClasses}"`;
         html += `>${dayOfWeek}</th>`;
      };

      html += '</tr>';
      this.container.querySelector(`.drp-calendar.${side} .calendar-table thead`).innerHTML = html;

      // table body
      html = '';
      //adjust maxDate to reflect the maxSpan setting in order to
      //grey out end dates beyond the maxSpan
      if (this.#endDate == null && this.maxSpan) {
         var maxLimit = this.#startDate.plus(this.maxSpan).endOf('day');
         if (!maxDate || maxLimit < maxDate) {
            maxDate = maxLimit;
         }
      }

      var minLimit;
      //grey out end dates shorter than minSpan
      if (this.#endDate == null && this.minSpan)
         minLimit = this.#startDate.plus(this.minSpan).startOf('day');

      for (let row = 0; row < 6; row++) {
         html += '<tr>';

         // add week number
         if (this.showISOWeekNumbers)
            html += `<td class="week">${calendar[row][0].weekNumber}</td>`;
         else if (this.showWeekNumbers)
            html += `<td class="week">${calendar[row][0].localWeekNumber}</td>`;

         for (let col = 0; col < 7; col++) {
            var classes = [];

            //highlight today's date
            if (this.todayClasses && this.todayClasses.length && calendar[row][col].hasSame(DateTime.now(), 'day'))
               classes.push(this.todayClasses);

            //highlight weekends
            if (this.weekendClasses && this.weekendClasses.length && Info.getWeekendWeekdays().includes(calendar[row][col].weekday))
               classes.push(this.weekendClasses);

            //grey out the dates in other months displayed at beginning and end of this calendar
            if (calendar[row][col].month != calendar[1][1].month)
               classes.push('off', 'ends');

            //don't allow selection of dates before the minimum date
            if (this.minDate && calendar[row][col].startOf('day') < this.minDate.startOf('day'))
               classes.push('off', 'disabled');

            //don't allow selection of dates after the maximum date
            if (maxDate && calendar[row][col].startOf('day') > maxDate.startOf('day'))
               classes.push('off', 'disabled');

            //don't allow selection of dates before the minimun span
            if (minLimit && calendar[row][col].startOf('day') > this.#startDate.startOf('day') && calendar[row][col].startOf('day') < minLimit.startOf('day'))
               classes.push('off', 'disabled');

            //don't allow selection of date if a custom function decides it's invalid
            if (this.isInvalidDate(calendar[row][col]))
               classes.push('off', 'disabled');

            //highlight the currently selected start date
            if (this.#startDate != null && calendar[row][col].hasSame(this.#startDate, 'day'))
               classes.push('active', 'start-date');

            //highlight the currently selected end date
            if (this.#endDate != null && calendar[row][col].hasSame(this.#endDate, 'day'))
               classes.push('active', 'end-date');

            //highlight dates in-between the selected dates
            if (this.#endDate != null && calendar[row][col] > this.#startDate && calendar[row][col] < this.#endDate)
               classes.push('in-range');

            //apply custom classes for this date
            var isCustom = this.isCustomDate(calendar[row][col]);
            if (isCustom !== false)
               typeof isCustom === 'string' ? classes.push(isCustom) : classes.push(...isCustom);

            if (!classes.includes('disabled'))
               classes.push('available');

            html += `<td class="${classes.join(' ')}" data-title="r${row}c${col}">${calendar[row][col].day}</td>`;

         }
         html += '</tr>';
      }

      this.container.querySelector(`.drp-calendar.${side} .calendar-table tbody`).innerHTML = html;

   }

   /**
   * Renders the time pickers
   * @private
   * @emits "beforeRenderTimePicker"
   */
   renderTimePicker(side) {

      // Don't bother updating the time picker if it's currently disabled
      // because an end date hasn't been clicked yet
      if (side === 'end' && !this.#endDate) return;

      var selected, minLimit, minDate, maxDate = this.maxDate;
      let html = '';
      if (this.showWeekNumbers || this.showISOWeekNumbers)
         html += '<th></th>';

      if (this.maxSpan && (!this.maxDate || this.#startDate.plus(this.maxSpan) < this.maxDate))
         maxDate = this.#startDate.plus(this.maxSpan);

      if (this.minSpan && side === 'end')
         minLimit = this.#startDate.plus(this.defaultSpan ?? this.minSpan);

      if (side === 'start') {
         selected = this.#startDate;
         minDate = this.minDate;
      } else if (side === 'end') {
         selected = this.#endDate;
         minDate = this.#startDate;

         //Preserve the time already selected
         let timeSelector = this.container.querySelector('.drp-calendar .calendar-time.end-time');
         if (timeSelector.innerHTML != '') {
            selected = selected.set({
               hour: !isNaN(selected.hour) ? selected.hour : timeSelector.querySelector('.hourselect option:selected').value,
               minute: !isNaN(selected.minute) ? selected.minute : timeSelector.querySelector('.minuteselect option:selected').value,
               second: !isNaN(selected.second) ? selected.second : timeSelector.querySelector('.secondselect option:selected').value
            });
         }

         if (selected < this.#startDate)
            selected = this.#startDate;

         if (maxDate && selected > maxDate)
            selected = maxDate;
      }

      let disabledHours = [];
      let disabledMinutes = [];
      html += `<th colspan="7">`;
      //
      // hours
      //
      if (this.externalStyle === 'bulma')
         html += '<div class="select is-small mx-1">';
      html += '<select class="hourselect">';
      const ampm = selected.toFormat('a', { locale: 'en-US' });
      let start = 0;
      if (!this.timePicker24Hour)
         start = ampm === 'AM' ? 1 : 13;

      for (var i = start; i <= start + 23; i += this.timePickerOpts.hourStep) {
         let time = selected.set({ hour: i % 24 });

         let disabled = false;
         if (minDate && time.set({ minute: 59 }) < minDate)
            disabled = true;
         if (maxDate && time.set({ minute: 0 }) > maxDate)
            disabled = true;
         if (minLimit && time.endOf('hour') < minLimit)
            disabled = true;
         if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, 'hour'))
            disabled = true;

         if (this.timePicker24Hour) {
            if (!disabled && i == selected.hour) {
               html += `<option value="${i}" selected>${i}</option>`;
            } else if (disabled) {
               html += `<option value="${i}" disabled class="disabled">${i}</option>`;
            } else {
               html += `<option value="${i}">${i}</option>`;
            }
         } else {
            const i_12 = DateTime.fromFormat(`${i % 24}`, 'H').toFormat('h');
            const i_ampm = DateTime.fromFormat(`${i % 24}`, 'H').toFormat('a', { locale: 'en-US' });
            if (ampm == i_ampm) {
               if (!disabled && i == selected.hour) {
                  html += `<option ampm="${i_ampm}" value="${i % 24}" selected>${i_12}</option>`;
               } else if (disabled) {
                  html += `<option  ampm="${i_ampm}" value="${i % 24}" disabled class="disabled">${i_12}</option>`;
               } else {
                  html += `<option ampm="${i_ampm}" value="${i % 24}">${i_12}</option>`;
               }
            } else {
               html += `<option ampm="${i_ampm}" hidden="hidden" value="${i % 24}">${i_12}</option>`;
            }
         }
         disabledHours.push(disabled);
      }
      html += '</select>';
      if (this.externalStyle === 'bulma')
         html += '</div>';

      //
      // minutes
      //

      if (this.timePickerOpts.showMinutes) {
         html += ' : ';
         if (this.externalStyle === 'bulma')
            html += '<div class="select is-small mx-1">';
         html += '<select class="minuteselect">';

         for (var i = 0; i < 60; i += this.timePickerOpts.minuteStep) {
            var padded = i < 10 ? '0' + i : i;
            let time = selected.set({ minute: i });

            let disabled = false;
            if (disabledHours.every(x => x))
               disabled = true;
            if (minDate && time.set({ second: 59 }) < minDate)
               disabled = true;
            if (maxDate && time.set({ second: 0 }) > maxDate)
               disabled = true;
            if (minLimit && time.endOf('minute') < minLimit)
               disabled = true;
            if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, 'minute'))
               disabled = true;

            if (selected.minute == i && !disabled) {
               html += `<option value="${i}" selected>${padded}</option>`;
            } else if (disabled) {
               html += `<option value="${i}" disabled class="disabled">${padded}</option>`;
            } else {
               html += `<option value="${i}">${padded}</option>`;
            }
            disabledMinutes.push(disabled);
         }
         html += '</select>';
         if (this.externalStyle === 'bulma')
            html += '</div>';
      }

      //
      // seconds
      //

      if (this.timePickerOpts.showSeconds) {
         html += ' : ';
         if (this.externalStyle === 'bulma')
            html += '<div class="select is-small mx-1">';
         html += '<select class="secondselect">';

         for (var i = 0; i < 60; i += this.timePickerOpts.secondStep) {
            var padded = i < 10 ? '0' + i : i;
            let time = selected.set({ second: i });

            let disabled = false;
            if (disabledMinutes.every(x => x))
               disabled = true;
            if (minDate && time < minDate)
               disabled = true;
            if (maxDate && time > maxDate)
               disabled = true;
            if (minLimit && time < minLimit)
               disabled = true;
            if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, 'second'))
               disabled = true;

            if (selected.second == i && !disabled) {
               html += `<option value="${i}" selected>${padded}</option>`;
            } else if (disabled) {
               html += `<option value="${i}" disabled class="disabled">${padded}</option>`;
            } else {
               html += `<option value="${i}">${padded}</option>`;
            }
         }
         html += '</select>';
         if (this.externalStyle === 'bulma')
            html += '</div>';
      }

      //
      // AM/PM
      //

      if (!this.timePicker24Hour) {
         if (this.externalStyle === 'bulma')
            html += '<div class="select is-small mx-1">';
         html += '<select class="ampmselect">';

         var am_html = '';
         var pm_html = '';
         let disabled = false;
         if (disabledHours.every(x => x))
            disabled = true;
         if (minDate && selected.startOf('day') < minDate)
            disabled = true;
         if (maxDate && selected.endOf('day') > maxDate)
            disabled = true;
         if (minLimit && selected.startOf('day') < minLimit)
            disabled = true;
         if (disabled) {
            am_html = ' disabled class="disabled "';
            pm_html = ' disabled class="disabled"';
         } else {
            if (this.isInvalidTime(selected, this.singleDatePicker ? null : side, 'ampm')) {
               if (selected.toFormat('a', { locale: 'en-US' }) === 'AM') {
                  pm_html = ' disabled class="disabled"';
               } else {
                  am_html = ' disabled class="disabled"';
               }
            }
         }

         html += `<option value="AM"${am_html}`;
         if (selected.toFormat('a', { locale: 'en-US' }) === 'AM')
            html += ' selected';
         html += `>${Info.meridiems()[0]}</option><option value="PM"${pm_html}`;
         if (selected.toFormat('a', { locale: 'en-US' }) === 'PM')
            html += ' selected';
         html += `>${Info.meridiems()[1]}</option>`;

         html += '</select>';
         if (this.externalStyle === 'bulma')
            html += '</div>';
      }

      html += '</div></th>';
      this.container.querySelector(`.drp-calendar .calendar-time.${side}-time`).innerHTML = html;

   }

   /**
   * Disable the `Apply` button if no date value is selected
   * @private
   */
   setApplyBtnState() {
      const state = this.singleDatePicker || (this.#endDate && this.#startDate <= this.#endDate)
      this.container.querySelector('button.applyBtn').disabled = !state;
   }
   /* #endregion */

   /* #region Move/Show/Hide */
   /**
   * Place the picker at the right place in the document
   */
   move() {
      let parentOffset = { top: 0, left: 0 }
      let containerTop;
      let containerLeft;
      let drops = this.drops;

      let parentRightEdge = window.innerWidth;
      if (!this.parentEl.matches('body')) {
         parentOffset = {
            top: offset(this.parentEl).top - this.parentEl.scrollTop(),
            left: offset(this.parentEl).left - this.parentEl.scrollLeft()
         };
         parentRightEdge = this.parentEl[0].clientWidth + offset(this.parentEl).left;
      }

      switch (this.drops) {
         case 'auto':
            containerTop = offset(this.element).top + outerHeight(this.element) - parentOffset.top;
            if (containerTop + outerHeight(this.container) >= this.parentEl.scrollHeight) {
               containerTop = offset(this.element).top - outerHeight(this.container) - parentOffset.top;
               drops = 'up';
            }
            break;
         case 'up':
            containerTop = offset(this.element).top - outerHeight(this.container) - parentOffset.top;
            break;
         case 'down':
            containerTop = offset(this.element).top + outerHeight(this.element) - parentOffset.top;
            break;
         default:
            console.error(`Option drops '${drops}' not defined`)
            break;
      }

      // Force the container to it's actual width
      for (const [key, value] of Object.entries({ top: 0, left: 0, right: 'auto' }))
         this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;

      const containerWidth = outerWidth(this.container);

      this.container.classList.toggle('drop-up', drops === 'up');

      switch (this.opens) {
         case 'left':
            const containerRight = parentRightEdge - offset(this.element).left - outerWidth(this.element);
            if (containerWidth + containerRight > window.innerWidth) {
               for (const [key, value] of Object.entries({ top: containerTop, right: 'auto', left: 9 }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            } else {
               for (const [key, value] of Object.entries({ top: containerTop, right: containerRight, left: 'auto' }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            }
            break;
         case 'center':
            containerLeft = offset(this.element).left - parentOffset.left + outerWidth(this.element) / 2 - containerWidth / 2;
            if (containerLeft < 0) {
               for (const [key, value] of Object.entries({ top: containerTop, right: 'auto', left: 9 }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            } else if (containerLeft + containerWidth > window.innerWidth) {
               for (const [key, value] of Object.entries({ top: containerTop, left: 'auto', right: 0 }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            } else {
               for (const [key, value] of Object.entries({ top: containerTop, left: containerLeft, right: 'auto' }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            }
            break;
         case 'right':
            containerLeft = offset(this.element).left - parentOffset.left;
            if (containerLeft + containerWidth > window.innerWidth) {
               for (const [key, value] of Object.entries({ top: containerTop, left: 'auto', right: 0 }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            } else {
               for (const [key, value] of Object.entries({ top: `${containerTop}px`, left: containerLeft, right: 'auto' }))
                  this.container.style[key] = typeof value === 'number' && value > 0 ? `${value}px` : value;
            }
            break;
         default:
            console.error(`Option opens '${this.opens}' not defined`);
            break;
      }
   }

   /**
   * Shows the picker
   * @emits "show"
   */
   show() {
      if (this.isShowing) return;

      // Bind global datepicker mousedown for hiding and
      document.addEventListener('mousedown', this.#outsideClickProxy);
      // also support mobile devices
      document.addEventListener('touchend', this.#outsideClickProxy);
      // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
      document.addEventListener('click', this.#dropdownClickWrapper);
      // and also close when focus changes to outside the picker (eg. tabbing between controls)
      document.addEventListener('focusin', this.#outsideClickProxy);
      // Reposition the picker if the window is resized while it's open
      window.addEventListener('resize', this.#onResizeProxy);

      this.oldStartDate = this.#startDate;
      this.oldEndDate = this.#endDate;

      this.updateView(false);
      this.container.style.display = 'block';
      this.move();
      this.triggerEvent(this.#events.onShow);
      this.isShowing = true;
   }

   /**
   * Hides the picker
   * @emits "beforeHide"
   * @emits "hide"
   */
   hide() {
      if (!this.isShowing) return;

      //incomplete date selection, revert to last values
      if (!this.#endDate) {
         this.#startDate = this.oldStartDate;
         this.#endDate = this.oldEndDate;
      }

      if (typeof this.callback === 'function') {
         //if a new date range was selected, invoke the user callback function
         if (
            (this.#startDate && !this.#startDate.equals(this.oldStartDate ?? DateTime)) ||
            (this.#endDate && !this.singleDatePicker && !this.#endDate.equals(this.oldEndDate ?? DateTime))
         )
            this.callback(this.startDate, this.endDate, this.chosenLabel);
      }

      //if picker is attached to a text input, update it
      this.updateElement();

      const event = this.triggerEvent(this.#events.onBeforeHide);
      if (event.defaultPrevented)
         return;
      document.removeEventListener('mousedown', this.#outsideClickProxy);
      document.removeEventListener('touchend', this.#outsideClickProxy);
      document.removeEventListener('focusin', this.#outsideClickProxy);
      document.removeEventListener('click', this.#dropdownClickWrapper);
      window.removeEventListener('resize', this.#onResizeProxy);

      this.container.style.display = 'none';
      this.triggerEvent(this.#events.onHide);
      this.isShowing = false;
   }

   /**
   * Toggles visibility of the picker
   */
   toggle() {
      if (this.isShowing) {
         this.hide();
      } else {
         this.show();
      }
   }

   /**
   * Shows calendar when user selects "Custom Ranges"
   * @emits "showCalendar"
   */
   showCalendars() {
      this.container.classList.add('show-calendar');
      this.move();
      this.triggerEvent(this.#events.onShowCalendar);
   }

   /**
   * Hides calendar when user selects a predefined range
   * @emits "hideCalendar"
   */
   hideCalendars() {
      this.container.classList.remove('show-calendar');
      this.triggerEvent(this.#events.onHideCalendar);
   }

   /* #endregion */

   /* #region Handle mouse related events */
   /**
   * Closes the picker when user clicks outside
   * @param {external:Event} e - The Event target
   * @emits "outsideClick"
   * @private
   */
   outsideClick(e) {
      const target = e.target;

      // implements jQuery closest(). 
      // Web-API supports only CSS selectors string
      function closest(el, selector) {
         let parent = el.parentElement;
         while (parent) {
            if (parent == selector)
               return parent;
            parent = parent.parentElement;
         }
         return null;
      }

      // if the page is clicked anywhere except within the daterangerpicker/button
      // itself then call this.hide()
      if (
         // ie modal dialog fix
         e.type === "focusin" ||
         closest(target, this.element) ||
         closest(target, this.container) ||
         target.closest('.calendar-table')
      ) return;

      const event = this.triggerEvent(this.#events.onOutsideClick);
      if (event.defaultPrevented)
         return;

      if (this.onOutsideClick === 'cancel') {
         this.#startDate = this.oldStartDate;
         this.#endDate = this.oldEndDate;
      }
      this.hide();

   }

   /**
   * Move calendar to previous month
   * @param {external:Event} e - The Event target
   * @private
   */
   clickPrev(e) {
      let cal = e.target.closest('.drp-calendar');
      if (cal.classList.contains('left')) {
         this.leftCalendar.month = this.leftCalendar.month.minus({ month: 1 });
         if (this.linkedCalendars && !this.singleMonthView)
            this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      } else {
         this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      }
      this.updateCalendars(true);
   }

   /**
   * Move calendar to next month
   * @param {external:Event} e - The Event target
   * @private
   */
   clickNext(e) {
      let cal = e.target.closest('.drp-calendar');
      if (cal.classList.contains('left')) {
         this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      } else {
         this.rightCalendar.month = this.rightCalendar.month.plus({ month: 1 });
         if (this.linkedCalendars)
            this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      }
      this.updateCalendars(true);
   }

   /**
   * User hovers over date values
   * @param {external:Event} e - The Event target
   * @private
   */
   hoverDate(e) {

      //ignore dates that can't be selected
      if (!e.target.classList.contains('available')) return;

      let title = e.target.dataset.title;
      const row = title.substring(1, 2);
      const col = title.substring(3, 4);
      const cal = e.target(closest, '.drp-calendar');
      var date = cal.classList.contains('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

      //highlight the dates between the start date and the date being hovered as a potential end date
      const leftCalendar = this.leftCalendar;
      const rightCalendar = this.rightCalendar;
      const startDate = this.#startDate;
      const initialMonth = this.initialMonth;
      if (!this.#endDate) {
         this.container.querySelectorAll('.drp-calendar tbody td').forEach(el => {

            //skip week numbers, only look at dates
            if (el.classList.contains('week')) return;

            const title = el.dataset.title;
            const row = title.substring(1, 2);
            const col = title.substring(3, 4);
            const cal = el.closest('.drp-calendar');
            const dt = cal.classList.contains('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

            if (!startDate && initialMonth) {
               el.classList.remove('in-range');
            } else {
               el.classList.toggle('in-range', (dt > startDate) && dt < date || dt.hasSame(date, 'day'));
            }
         });
      }

   }

   /**
   * User hovers over ranges
   * @param {external:Event} e - The Event target
   * @private
   */
   hoverRange(e) {
      const label = e.target.dataset.rangeKey;
      const previousDates = [this.#startDate, this.#endDate];
      const dates = this.ranges[label] ?? [this.#startDate, this.#endDate];
      const leftCalendar = this.leftCalendar;
      const rightCalendar = this.rightCalendar;

      this.container.querySelectorAll('.drp-calendar tbody td').forEach(el => {
         //skip week numbers, only look at dates
         if (el.classList.contains('week')) return;

         const title = el.dataset.ttitle;
         const row = title.substring(1, 2);
         const col = title.substring(3, 4);
         const cal = el.closest('.drp-calendar');
         const dt = cal.classList.contains('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

         el.classList.toggle('start-hover', dt.hasSame(dates[0], 'day'));
         el.classList.toggle('start-date', dt.hasSame(previousDates[0], 'day'));
         el.classList.toggle('end-hover', dt.hasSame(dates[1], 'day'));
         el.classList.toggle('end-date', previousDates[1] != null && dt.hasSame(previousDates[1], 'day'));
         el.classList.toggle('range-hover', dt.startOf('day') >= dates[0].startOf('day') && dt.startOf('day') <= dates[1].startOf('day'));
         el.classList.toggle('in-range', dt.startOf('day') >= previousDates[0].startOf('day') && previousDates[1] != null && dt.startOf('day') <= previousDates[1].startOf('day'));
      });
   }

   /**
   * User leave ranges, remove hightlight from dates
   * @private
   */
   leaveRange() {
      this.container.querySelectorAll('.drp-calendar tbody td').forEach(el => {
         //skip week numbers, only look at dates
         if (el.classList.contains('week')) return;
         el.classList.remove('start-hover');
         el.classList.remove('end-hover');
         el.classList.remove('range-hover');
      });
   }


   /* #endregion */

   /* #region Select values by Mouse  */
   /**
   * Set date values after user selected a date
   * @param {external:Event} e - The Event target
   * @private
   */
   clickRange(e) {
      let label = e.target.getAttribute('data-range-key');
      this.chosenLabel = label;
      if (label == this.locale.customRangeLabel) {
         this.showCalendars();
      } else {
         let newDate = this.ranges[label];
         const monthChange = !this.#startDate.hasSame(newDate[0], 'month') || !this.#endDate.hasSame(newDate[1], 'month');
         this.#startDate = newDate[0];
         this.#endDate = newDate[1];

         if (!this.timePicker) {
            this.#startDate.startOf('day');
            this.#endDate.endOf('day');
         }

         if (!this.alwaysShowCalendars)
            this.hideCalendars();

         const event = this.triggerEvent(this.#events.onBeforeHide);
         if (event.defaultPrevented)
            this.updateView(monthChange);
         this.clickApply();
      }
   }

   /**
   * User clicked a date
   * @param {external:Event} e - The Event target
   * @emits "dateChange"
   * @private
   */
   clickDate(e) {
      if (!e.target.classList.contains('available')) return;

      let title = e.target.dataset.title;
      let row = title.substring(1, 2);
      let col = title.substring(3, 4);
      let cal = e.target.closest('.drp-calendar');
      let date = cal.classList.contains('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
      let side;

      //
      // this function needs to do a few things:
      // * alternate between selecting a start and end date for the range,
      // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
      // * if autoapply is enabled, and an end date was chosen, apply the selection
      // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
      // * if one of the inputs above the calendars was focused, cancel that manual input
      //

      if (this.#endDate || !this.#startDate || date < this.#startDate.startOf('day')) { //picking start
         // #endDate          -> Must be the start of a new range
         // !#startDate       -> Click on empty calendar (without any initial date)
         // date < #startDate -> startDate was selected, but user likes to set an earlier day
         if (this.timePicker) {
            let hour = parseInt(this.container.querySelector('.start-time .hourselect').value, 10);
            if (isNaN(hour))
               hour = parseInt(this.container.querySelector('.start-time .hourselect option:last-child').value, 10);

            let minute = 0;
            if (this.timePickerOpts.showMinutes) {
               minute = parseInt(this.container.querySelector('.start-time .minuteselect').value, 10);
               if (isNaN(minute))
                  minute = parseInt(this.container.querySelector('.start-time .minuteselect option:last-child').value, 10);
            }

            let second = 0;
            if (this.timePickerOpts.showSeconds) {
               second = parseInt(this.container.querySelector('.start-time .secondselect').value, 10);
               if (isNaN(second))
                  second = parseInt(this.container.querySelector('.start-time .secondselect option:last-child').value, 10);
            }

            date = date.set({ hour: hour, minute: minute, second: second });
         } else {
            date = date.startOf('day');
         }
         // First click, must be the startDate
         this.#endDate = null;
         this.#startDate = date;
         side = 'start';
      } else if (!this.#endDate && date < this.#startDate) {
         //special case: clicking the same date for start/end,
         //but the time of the end date is before the start date
         this.#endDate = this.#startDate;
         side = 'end';
      } else { // picking end
         if (this.timePicker) {
            let hour = parseInt(this.container.querySelector('.end-time .hourselect').value, 10);
            if (isNaN(hour))
               hour = parseInt(this.container.querySelector('.end-time .hourselect option:last-child').value, 10);

            let minute = 0;
            if (this.timePickerOpts.showMinutes) {
               minute = parseInt(this.container.querySelector('.end-time .minuteselect').value, 10);
               if (isNaN(minute))
                  minute = parseInt(this.container.querySelector('.end-time .minuteselect option:last-child').value, 10);
            }

            let second = 0;
            if (this.timePickerOpts.showSeconds) {
               second = parseInt(this.container.querySelector('.end-time .secondselect').value, 10);
               if (isNaN(second))
                  second = parseInt(this.container.querySelector('.end-time .secondselect option:last-child').value, 10);
            }

            date = date.set({ hour: hour, minute: minute, second: second });
         } else {
            date = date.endOf('day');
         }
         this.#endDate = date;
         if (this.autoApply) {
            this.calculateChosenLabel();
            this.clickApply();
         }
         side = 'end';
      }

      if (this.singleDatePicker) {
         this.#endDate = this.#startDate; // Date is complete
         if (!this.timePicker && this.autoApply)
            this.clickApply();
         side = null;
      }

      // Need updateView because right calendar depends on left selected value
      this.updateView(false);

      //This is to cancel the blur event handler if the mouse was in one of the inputs
      e.stopPropagation();

      if (this.autoUpdateInput)
         this.updateElement();

      this.triggerEvent(this.#events.onDateChange, { side: side });

   }

   /**
   * Hightlight selected predefined range in calendar
   * @private
   */
   calculateChosenLabel() {
      if (Object.keys(this.ranges).length === 0)
         return;

      // If selected range from calendar matches any custom range, then highlight it
      let customRange = true;
      let unit = this.timePicker ? 'hour' : 'day';
      if (this.timePicker) {
         if (this.timePickerOpts.showMinutes) {
            unit = 'minute';
         } else if (this.timePickerOpts.showSeconds) {
            unit = 'second';
         }
      }
      for (const [key, [start, end]] of Object.entries(this.ranges)) {
         if (this.#startDate.startOf(unit).equals(start.startOf(unit)) && this.#endDate.startOf(unit).equals(end.startOf(unit))) {
            customRange = false;
            const range = this.container.querySelector(`.ranges li[data-range-key="${key}"]`);
            this.chosenLabel = key;
            range.classList.add('active');
            break;
         }
      }
      if (customRange) {
         if (this.showCustomRangeLabel) {
            const range = this.container.querySelector('.ranges li:last-child');
            this.chosenLabel = range.dataset.rangeKey;
            range.classList.add('active');
         } else {
            this.chosenLabel = null;
         }
         this.showCalendars();
      }
   }

   /**
   * User clicked a time
   * @param {external:Event} e - The Event target
   * @emits "timeChange"
   * @private
   */
   timeChanged(e) {
      const time = e.target.closest('.calendar-time');
      const side = time.classList.contains('start-time') ? 'start' : 'end';

      var hour = parseInt(time.querySelector('.hourselect').value, 10);
      if (isNaN(hour))
         hour = parseInt(time.querySelector('.hourselect option:last-child').value, 10);

      if (!this.timePicker24Hour) {
         const ampm = time.querySelector('.ampmselect').value;
         if (ampm == null)
            time.querySelector('.ampmselect option:last-child').value;
         if (ampm != DateTime.fromFormat(`${hour}`, 'H').toFormat('a', { locale: 'en-US' })) {
            time.querySelectorAll('.hourselect > option').forEach(el => {
               el.hidden = !el.hidden;
            });
            const h = DateTime.fromFormat(`${hour}`, 'H').toFormat('h')
            hour = DateTime.fromFormat(`${h}${ampm}`, 'ha', { locale: 'en-US' }).hour;
         }
      }

      var minute = 0;
      if (this.timePickerOpts.showMinutes) {
         minute = parseInt(time.querySelector('.minuteselect').value, 10);
         if (isNaN(minute))
            minute = parseInt(time.querySelector('.minuteselect option:last-child').value, 10);
      }

      var second = 0;
      if (this.timePickerOpts.showSeconds) {
         second = parseInt(time.querySelector('.secondselect').value, 10);
         if (isNaN(second))
            second = parseInt(time.querySelector('.secondselect option:last-child').value, 10);
      }

      if (side === 'start') {
         if (this.#startDate)
            this.#startDate = this.#startDate.set({ hour: hour, minute: minute, second: second });
         if (this.singleDatePicker) {
            this.#endDate = this.#startDate;
         } else if (this.#endDate && this.#endDate.hasSame(this.#startDate, 'day') && this.#endDate < this.#startDate) {
            this.#endDate = this.#startDate;
         }
      } else if (this.#endDate) {
         this.#endDate = this.#endDate.set({ hour: hour, minute: minute, second: second });
      }

      //update the calendars so all clickable dates reflect the new time component
      this.updateCalendars(false);

      //update the form inputs above the calendars with the new time
      this.setApplyBtnState();

      //re-render the time pickers because changing one selection can affect what's enabled in another
      this.triggerEvent(this.#events.onBeforeRenderTimePicker);
      this.renderTimePicker('start');
      this.renderTimePicker('end');

      if (this.autoUpdateInput)
         this.updateElement();

      this.triggerEvent(this.#events.onTimeChange, { side: this.singleDatePicker ? null : side });
   }

   /**
  * Calender month moved
  * @param {external:Event} e - The Event target
  * @private
  */
   monthOrYearChanged(e) {
      const isLeft = e.target.closest('.drp-calendar').classList.contains('left');
      const leftOrRight = isLeft ? 'left' : 'right';
      const cal = this.container.querySelector(`.drp-calendar.${leftOrRight}`);

      // Month must be Number for new DateTime versions
      let month = parseInt(cal.querySelector('.monthselect').value, 10);
      let year = cal.querySelector('.yearselect').value;
      let monthChange = false;

      if (!isLeft) {
         if (year < this.#startDate.year || (year == this.#startDate.year && month < this.#startDate.month)) {
            month = this.#startDate.month;
            year = this.#startDate.year;
         }
      }

      if (this.minDate) {
         if (year < this.minDate.year || (year == this.minDate.year && month < this.minDate.month)) {
            month = this.minDate.month;
            year = this.minDate.year;
         }
      }

      if (this.maxDate) {
         if (year > this.maxDate.year || (year == this.maxDate.year && month > this.maxDate.month)) {
            month = this.maxDate.month;
            year = this.maxDate.year;
         }
      }

      if (isLeft) {
         monthChange = !DateTime.fromObject({ year: year, month: month }).hasSame(this.leftCalendar.month, 'month');
         this.leftCalendar.month = this.leftCalendar.month.set({ year: year, month: month });
         if (this.linkedCalendars)
            this.rightCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      } else {
         monthChange = !DateTime.fromObject({ year: year, month: month }).hasSame(this.leftCalendar.month, 'month');
         this.rightCalendar.month = this.rightCalendar.month.set({ year: year, month: month });
         if (this.linkedCalendars)
            this.leftCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      }
      this.updateCalendars(monthChange);
   }

   /**
* User clicked `Apply` button
* @emits "apply"
* @private
   */
   clickApply() {
      this.hide();
      this.triggerEvent(this.#events.onApply);
   }

   /**
   * User clicked `Cancel` button
   * @emits "cancel"
   * @private
   */
   clickCancel() {
      this.#startDate = this.oldStartDate;
      this.#endDate = this.oldEndDate;
      this.hide();
      this.triggerEvent(this.#events.onCancel);
   }

   /* #endregion */

   /**
   * Update the picker with value from `<input>` element.<br> 
   * Input values must be given in format of `locale.format`. Invalid values are handles by `violate` Event
   * @emits "inputChange"
   * @private
   */
   elementChanged() {
      if (!this.isInputText) return;
      if (!this.element.value.length) return;

      const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
      const dateString = this.element.value.split(this.locale.separator);
      let monthChange = false;
      if (this.singleDatePicker) {
         let newDate = DateTime.fromFormat(this.element.value, format, { locale: DateTime.now().locale });
         const oldDate = this.#startDate;
         if (!newDate.isValid || oldDate.equals(newDate))
            return;

         const violations = this.validateInput([newDate, null], true);
         if (violations != null) {
            if (violations.newDate != null) {
               newDate = violations.newDate.startDate
            } else {
               return; // revert to old startDate
            }
         }
         monthChange = !this.#startDate.hasSame(newDate, 'month');
         this.#startDate = newDate;
         this.#endDate = this.#startDate;
         if (!this.timePicker) {
            this.#startDate = this.#startDate.startOf('day');
            this.#endDate = this.#endDate.endOf('day');
         }
      } else if (!this.singleDatePicker && dateString.length === 2) {
         const newDate = [0, 1].map(i => DateTime.fromFormat(dateString[i], format, { locale: DateTime.now().locale }));
         const oldDate = [this.#startDate, this.#endDate];
         if (!newDate[0].isValid || !newDate[1].isValid || (oldDate[0].equals(newDate[0]) && oldDate[1].equals(newDate[1]) || newDate[0] > newDate[1]))
            return;

         const violations = this.validateInput([newDate[0], newDate[1]], true);
         if (violations != null) {
            if (violations.newDate != null) {
               newDate[0] = violations.newDate.startDate
               newDate[1] = violations.newDate.endDate
            } else {
               return; // revert to old startDate,endDate
            }
         }
         monthChange = !this.#startDate.hasSame(newDate[0], 'month') || !this.#endDate.hasSame(newDate[1], 'month');
         this.#startDate = newDate[0];
         this.#endDate = newDate[1];
         if (!this.timePicker) {
            this.#startDate = this.#startDate.startOf('day');
            this.#endDate = this.#endDate.endOf('day');
         }
      } else {
         return;
      }

      this.updateView(monthChange);
      this.updateElement();
      this.triggerEvent(this.#events.onInputChange);
   }

   /**
   * Handles key press, IE 11 compatibility
   * @param {external:Event} e - The Event target
   * @private
   */
   keydown(e) {
      //hide on tab or enter
      if ([9, 11].includes(e.keyCode))
         this.hide();

      //hide on esc and prevent propagation
      if (e.keyCode === 27) {
         e.preventDefault();
         e.stopPropagation();

         this.hide();
      }
   }

   /**
   * Update attached `<input>` element with selected value
   * @emits external:change
   */
   updateElement() {
      if (this.#startDate == null && this.initialMonth)
         return;

      if (this.isInputText) {
         let newValue = this.formatDate(this.#startDate);
         if (!this.singleDatePicker) {
            newValue += this.locale.separator;
            if (this.#endDate)
               newValue += this.formatDate(this.#endDate);
         }
         this.updateAltInput();
         if (newValue !== this.element.value) {
            this.element.value = newValue
            this.element.dispatchEvent(new Event('change', { bubbles: true }))
         }
      } else {
         this.updateAltInput()
      }
   }

   /**
   * Update altInput `<input>` element with selected value
   */
   updateAltInput() {
      if (this.altInput == null)
         return;

      if (this.altFormat == null) {
         let precision = 'day';
         if (this.timePicker) {
            if (this.timePickerOpts.showSeconds) {
               precision = 'second';
            } else if (this.timePickerOpts.showMinutes) {
               precision = 'minute';
            } else {
               precision = 'hour';
            }
         }
         const startDate = this.#startDate.toISO({ format: 'basic', precision: precision, includeOffset: false });
         (this.singleDatePicker ? this.altInput : this.altInput[0]).value = startDate;
         if (!this.singleDatePicker && this.#endDate) {
            const endDate = this.#endDate.toISO({ format: 'basic', precision: precision, includeOffset: false });
            this.altInput[1].value = endDate;
         }
      } else {
         const startDate = typeof this.altFormat === 'function' ? this.altFormat(this.#startDate) : this.formatDate(this.#startDate, this.altFormat);
         (this.singleDatePicker ? this.altInput : this.altInput[0]).value = startDate;
         if (!this.singleDatePicker && this.#endDate) {
            const endDate = typeof this.altFormat === 'function' ? this.altFormat(this.#endDate) : this.formatDate(this.#endDate, this.altFormat);
            this.altInput[1].value = endDate;
         }
      }
   }

   /**
   * Removes the picker from document
   */
   remove() {
      this.element.removeEventListener('click', this.#showProxy);
      this.element.removeEventListener('focus', this.#showProxy);
      this.element.removeEventListener('keyup', this.#elementChangedProxy);
      this.element.removeEventListener('keydown', this.#keydownProxy);
      this.element.removeEventListener('click', this.#toggleProxy)
      this.element.removeEventListener('keydown', this.#toggleProxy);
      this.container.remove();
   }

   /**
    * Helper function to dispatch events
    * @param {object} ev - Event template from this.#events
    * @param  {...object} args - Additional parameters if needed
    */
   triggerEvent(ev, ...args) {
      if (args.length === 0) {
         const event = new DateRangePickerEvent(this, ev);
         this.element.dispatchEvent(event);
         return event;
      } else {
         const event = new DateRangePickerEvent(this, ev, ...args);
         this.element.dispatchEvent(event);
         return event;
      }
   }

   /**
    * Helper function to add eventListener similar to jQuery .on( events [, selector ] [, data ] )
    * @param {string} element - Query selector of element where listener is added
    * @param {string} eventName - Name of the event
    * @param {string} selector - Query selector string to filter the descendants of the element
    * @param {function} delegate - Handler data
    * @private
    */
   addListener(element, eventName, selector, delegate) {
      this.container.querySelectorAll(element).forEach(el => {
         el.addEventListener(eventName, function (event) {
            const target = event.target.closest(selector);
            if (target && el.contains(target))
               delegate.call(target, event);
         });
      });
   }


}


// Internal helper functions
function createElementFromHTML(html) {
   const template = document.createElement('template');
   template.innerHTML = html.trim();
   return template.content.firstElementChild;
}

/**
 * 
 * @class
 * @extends Event
 */
class DateRangePickerEvent extends Event {
   #picker;

   constructor(drp, ev, args = {}) {
      let param = {};
      if (ev.param)
         param = typeof ev.param === 'function' ? ev.param() : ev.param;

      param = { ...param, ...args };
      super(ev.type, param);
      this.#picker = drp;
      for (const [key, value] of Object.entries(param)) {
         if (Object.getOwnPropertyNames(Event.prototype).includes(key)) continue;
         this[key] = value;
      }
   }

   get picker() {
      return this.#picker;
   }
}

// implements jQuery offset()
function offset(el) {
   const rect = el.getBoundingClientRect();
   return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
   };
}

// implements jQuery outerWidth(withMargin)
function outerWidth(el, withMargin = false) {
   if (!withMargin)
      return el.offsetWidth;
   const style = getComputedStyle(el);
   return el.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
}

// implements jQuery outerHeight(withMargin)
function outerHeight(el, withMargin = false) {
   if (!withMargin)
      return el.offsetHeight;
   const style = getComputedStyle(el);
   return el.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
}
/* #endregion */


/**
* @callback callback
* @param {external:DateTime} startDate - Selected startDate
* @param {external:DateTime} endDate - Selected endDate 
* @param {string} range
*/

/**
* Initiate a new DateRangePicker
* @function
* @param {string|external:HTMLElement} elements - Element where DateRangePicker is attached
* @param {Options} options - Object to configure the DateRangePicker
* @param {callback} callback - Callback function executed when date is changed.<br/>
* Callback function is executed if selected date values has changed, before picker is hidden and before the attached `<input>` element is updated. 
* As alternative listen to the {@link #event_apply|"apply"} event
* @returns {HTMLElement|HTMLElement[]} The input `element` instance or an array of HTMLElement instances if `elements` matches more than one element
*/
function daterangepicker(elements, options, callback) {
   if (typeof elements === 'string')
      return daterangepicker(document.querySelectorAll(elements), options, callback);

   if (elements instanceof HTMLElement)
      elements = [elements];

   if (elements instanceof NodeList || elements instanceof HTMLCollection)
      elements = Array.from(elements);

   if (elements == null)
      return new DateRangePicker(null, options || {}, callback);

   elements.forEach(el => {
      if (el._daterangepicker && typeof el._daterangepicker.remove === 'function')
         el._daterangepicker.remove();
      el._daterangepicker = new DateRangePicker(el, options || {}, callback);
   });

   return elements.length === 1 ? elements[0] : elements;
}


/**
 * Returns the DateRangePicker. Equivalent to `element._daterangepicker`
 * @param {HTMLElement|string} target - The HTMLElement or querySelector string where the DateRangePicker is attached.
 * @returns {DateRangePicker} - The attached DateRangePicker
 */
function getDateRangePicker(target) {
   if (typeof target === 'string')
      target = document.querySelector(target);
   return target instanceof HTMLElement ? target._daterangepicker : undefined;
}

// legacy support for jQuery 
if (window.jQuery?.fn) {
   jQuery.fn.daterangepicker = function (options, callback) {
      return this.each(function () {
         daterangepicker(this, options, callback);
      });
   };
}


function registerJqueryPlugin(jq) {
   if (!jq?.fn) return;
   jq.fn.daterangepicker = function (options, callback) {
      return this.each(function () {
         daterangepicker(this, options, callback);
      });
   };
}

Object.defineProperty(window, "jQuery", {
   configurable: true,
   set(value) {
      this._jQuery = value;
      registerJqueryPlugin(value);
   },
   get() {
      return this._jQuery;
   }
});

export { daterangepicker, getDateRangePicker, DateRangePicker };


/** @external HTMLElement
@see {@link https://developer.mozilla.org/de/docs/Web/API/HTMLElement|HTMLElement} */

/** @external HTMLInputElement
@see {@link https://developer.mozilla.org/de/docs/Web/API/HTMLInputElement|HTMLInputElement} */

/** @external NodeList 
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList|NodeList} */

/** @external HTMLCollection 
@see {@link https://developer.mozilla.org/de/docs/Web/API/HTMLCollection|HTMLCollection} */

/** @external selectors
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#selectors|selectors} */

/** @external change
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event|change event} */

/** @external Event
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event|Event} */

/** @external DateTime
@see {@link https://moment.github.io/luxon/api-docs/index.html#datetime|DateTime} */

/** @external Duration
@see {@link https://moment.github.io/luxon/api-docs/index.html#duration|Duration} */

/** @external Date
@see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date} */

/** @external ISO-8601
@see {@link https://en.wikipedia.org/wiki/ISO_8601} */

