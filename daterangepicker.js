// Following the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Make globaly available as well
        define(['luxon', 'jquery'], function (luxon, jquery) {
            if (!jquery.fn) jquery.fn = {}; // webpack server rendering
            if (typeof luxon !== 'function' && luxon.hasOwnProperty('default')) luxon = luxon['default']
            return factory(luxon, jquery);
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node / Browserify
        //isomorphic issue
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;
        if (!jQuery) {
            jQuery = require('jquery');
            if (!jQuery.fn) jQuery.fn = {};
        }
        var luxon = (typeof window != 'undefined' && typeof window.luxon != 'undefined') ? window.luxon : require('luxon');
        module.exports = factory(luxon, jQuery);
    } else {
        // Browser globals
        root.daterangepicker = factory(root.luxon, root.jQuery);
    }
}(typeof window !== 'undefined' ? window : this, function (luxon, $) {
    const DateTime = luxon.DateTime;
    const Duration = luxon.Duration;
    const Info = luxon.Info;
    const Settings = luxon.Settings;

    /**
    * @constructs DateRangePicker
    * @param {external:jQuery} element - jQuery selector of the parent element that the date range picker will be added to
    * @param {Options} options - Object to configure the DateRangePicker
    * @param {function} cb - Callback function executed when 
    */
    var DateRangePicker = function (element, options, cb) {
        /**
        * Options for DateRangePicker
        * @typedef Options 
        * @property {string} parentEl=body - {@link jQuery} selector of the parent element that the date range picker will be added to
        
        * @property {external:DateTime|external:Date|string} startDate - Default: `DateTime.now().startOf('day')`<br/>The beginning date of the initially selected date range.<br/>
        * Must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br/>
        * Date value is rounded to match option `timePickerStepSize`<br/>
        * Option `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br/>
        * If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.
        * @property {external:DateTime|external:Date|string} endDate - Defautl: `DateTime.now().endOf('day')`<br/>The end date of the initially selected date range.<br/>
        * Must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br/>
        * Date value is rounded to match option `timePickerStepSize`<br/>
        * Option `isInvalidDate`, `isInvalidTime` and `minSpan`, `maxSpan` are not evaluated, you may set date/time which is not selectable in calendar.<br/>
        * If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br/>

        * @property {external:DateTime|external:Date|string|null} minDate - The earliest date a user may select or `null` for no limit.<br/>
        * Must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.
        * @property {external:DateTime|external:Date|string|null} maxDate - The latest date a user may select or `null` for no limit.<br/>
        * Must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.
        * @property {external:Duration|string|number|null} minSpan - The maximum span between the selected start and end dates.<br/>
        * Must be a `luxon.Duration` or number of seconds or a string according to {@link ISO-8601} duration.<br/>
        * Ignored when `singleDatePicker: true`
        * @property {external:Duration|string|number|null} maxSpan - The minimum span between the selected start and end dates.<br/>
        * Must be a `luxon.Duration` or number of seconds or a string according to {@link ISO-8601} duration.<br/>
        * Ignored when `singleDatePicker: true`
        * @property {external:DateTime|external:Date|string|null} initalMonth - Default: `DateTime.now().startOf('month')`<br/>
        * The inital month shown when `startDate: null`. Be aware, the attached `<input>` element must be also empty.`<br/>
        * Must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br/>
        * When `initalMonth` is used, then `endDate` is ignored and it works only with `timePicker: false`

        * @property {boolean} autoApply=false - Hide the `Apply` and `Cancel` buttons, and automatically apply a new date range as soon as two dates are clicked.<br/>
        * Only useful when `timePicker: false`
        * @property {boolean} singleDatePicker=false - Show only a single calendar to choose one date, instead of a range picker with two calendars.<br/>
        * The start and end dates provided to your callback will be the same single date chosen.
        * @property {boolean} showDropdowns=false - Show year and month select boxes above calendars to jump to a specific month and year
        * @property {number} minYear - Default: `DateTime.now().minus({year:100}).year`<br/>The minimum year shown in the dropdowns when `showDropdowns: true`
        * @property {number} maxYear - Default: `DateTime.now().plus({year:100}).year`<br/>The maximum  year shown in the dropdowns when `showDropdowns: true`
        * @property {boolean} showWeekNumbers=false - Show **localized** week numbers at the start of each week on the calendars
        * @property {boolean} showISOWeekNumbers=false - Show **ISO** week numbers at the start of each week on the calendars.<br/>
        * Takes precedence over localized `showWeekNumbers`
        
        * @property {boolean} timePicker=false - Adds select boxes to choose times in addition to dates
        * @property {boolean} timePicker24Hour=true - Use 24-hour instead of 12-hour times, removing the AM/PM selection
        * @property {external:Duration|string|number} timePickerStepSize - Default: `Duration.fromObject({minutes:1})`<br/>Set the time picker step size.<br/>
        * Must be a `luxon.Duration` or the number of seconds or a string according to {@link ISO-8601} duration.<br/>
        * Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})` 
        * and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br/>
        * Duration must be greater than `minSpan` and smaller than `maxSpan`.<br/>
        * For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes.<br/>
        * Overwrites `timePickerIncrement` and `timePickerSeconds`, ignored when `timePicker: false`
        * @property {boolean} timePickerSeconds=boolean - **Deprecated**, use `timePickerStepSize`<br/>Show seconds in the timePicker
        * @property {boolean} timePickerIncrement=1 - **Deprecated**, use `timePickerStepSize`<br/>Increment of the minutes selection list for times
        
        * @property {boolean} autoUpdateInput=true - Indicates whether the date range picker should instantly update the value of the attached `<input>` 
        * element when the selected dates change.<br/>The `<input>` element will be always updated on `Apply` and reverted when user clicks on `Cancel`.
        * @property {string} onOutsideClick=apply - Defines what picker shall do when user clicks outside the calendar. 
        * `'apply'` or `'cancel'`. Event {@link #event_outsideClick.daterangepicker|onOutsideClick.daterangepicker} is always emitted.
        * @property {boolean} linkedCalendars=true - When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), 
        * and both will be advanced when clicking the left or right arrows above the calendars.<br/>
        * When disabled, the two calendars can be individually advanced and display any month/year
        * @property {function} isInvalidDate=false - A function that is passed each date in the two calendars before they are displayed,<br/> 
        * and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/>
        * Signature: `isInvalidDate(date)`<br/>
        * Function has no effect on date values set by `startDate`, `endDate`, `ranges`, {@link #DateRangePicker+setStartDate|setStartDate}, {@link #DateRangePicker+setEndDate|setEndDate}.
        * @property {function} isInvalidTime=false - A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br/> 
        * and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/>
        * Signature: `isInvalidTime(time, side, unit)`<br/>
        * `side` is `'start'` or `'end'` or `null` for `singleDatePicker: true`<br/>
        * `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br/>
        * Hours are always given as 24-hour clock<br/>
        * Function has no effect on time values set by `startDate`, `endDate`, `ranges`, {@link #DateRangePicker+setStartDate|setStartDate}, {@link #DateRangePicker+setEndDate|setEndDate}.<br/>
        * Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br/>
        * @property {function} isCustomDate=false - A function that is passed each date in the two calendars before they are displayed, 
        * and may return a string or array of CSS class names to apply to that date's calendar cell.<br/>
        * Signature: `isCustomDate(date)`
        
        * @property {string} applyButtonClasses=btn-primary - CSS class names that will be added only to the apply button
        * @property {string} cancelButtonClasses=btn-default - CSS class names that will be added only to the cancel button
        * @property {string} buttonClasses - Default: `'btn btn-sm'`<br/>CSS class names that will be added to both the apply and cancel buttons.
        * @property {string} weekendClasses=weekend - CSS class names that will be used to highlight weekend days.<br/>
        * Use `null` or empty string if you don't like to highlight weekend days.
        * @property {string} weekendDayClasses=weekend-day - CSS class names that will be used to highlight weekend day names.<br/>
        * Weekend days are evaluated by [Info.getWeekendWeekdays](https://moment.github.io/luxon/api-docs/index.html#infogetweekendweekdays) and depend on current 
        * locale settings.
        * Use `null` or empty string if you don't like to highlight weekend day names.
        * @property {string} todayClasses=today - CSS class names that will be used to highlight the current day.<br/>
        * Use `null` or empty string if you don't like to highlight the current day.

        * @property {string} opens=right - Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.<br/>
        * `'left' \| 'right' \| 'center'`
        * @property {string} drops=down - Whether the picker appears below or above the HTML element it's attached to.<br/>
        * `'down' \| 'up' \| 'auto'`
        
        * @property {object} ranges={} - Set predefined date {@link #Ranges|Ranges} the user can select from. Each key is the label for the range, 
        * and its value an array with two dates representing the bounds of the range.
        * @property {boolean} showCustomRangeLabel=true - Displays "Custom Range" at the end of the list of predefined {@link #Ranges|Ranges}, 
        * when the ranges option is used.<br>
        * This option will be highlighted whenever the current date range selection does not match one of the predefined ranges.<br/>
        * Clicking it will display the calendars to select a new range.
        * @property {boolean} alwaysShowCalendars=false - Normally, if you use the ranges option to specify pre-defined date ranges, 
        * calendars for choosing a custom date range are not shown until the user clicks "Custom Range".<br/>
        * When this option is set to true, the calendars for choosing a custom date range are always shown instead.
        * @property {object} locale={} - Allows you to provide localized strings for buttons and labels, customize the date format, 
        * and change the first day of week for the calendars.
        * @property {string} locale.direction=ltr - Direction of reading, `'ltr'` or `'rtl'`
        * @property {object|string} locale.format - Default: `DateTime.DATE_SHORT` or `DateTime.DATETIME_SHORT` when `timePicker: true`<br/>Date formats. 
        * Either given as string, see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according 
        * to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)<br/>
        * I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets).
        * @property {string} locale.separator - Defaut: `' - '`<br/>Separator for start and end time
        * @property {string} locale.weekLabel=W - Label for week numbers
        * @property {Array} locale.daysOfWeek - Default: `luxon.Info.weekdays('short')`<br/>Array with weekday names, from Monday to Sunday
        * @property {Array} locale.monthNames - Default: `luxon.Info.months('long')`<br/>Array with month names
        * @property {number} locale.firstDay - Default: `luxon.Info.getStartOfWeek()`<br/>First day of the week, 1 for Monday through 7 for Sunday
        * @property {string} locale.applyLabel=Apply - Label of `Apply` Button
        * @property {string} locale.cancelLabel=Cancel - Label of `Cancel` Button
        * @property {string} locale.customRangeLabel=Custom Range - Title for custom ranges
        * @property {object|string} locale.durationFormat={} - Format a custom label for selected duration, for example `'5 Days, 12 Hours'`.<br/>
        * Define the format either as string, see [Duration.toFormat - Format Tokens](https://moment.github.io/luxon/api-docs/index.html#durationtoformat) or 
        * an object according to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options), 
        * see [Duration.toHuamn](https://moment.github.io/luxon/api-docs/index.html#durationtohuman).
        */

        /**
        * A set of predefined ranges
        * @typedef Ranges
        * @type {Object}
        * @property {string} name - The name of the range
        * @property {external:DateTime|external:Date|string} range - Array of 2 elements with startDate and endDate
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

        //default settings for options
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = DateTime.now().startOf('day');
        this.endDate = DateTime.now().endOf('day');
        this.minDate = null;
        this.maxDate = null;
        this.maxSpan = null;
        this.minSpan = null;
        this.initalMonth = DateTime.now().startOf('month');
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.minYear = DateTime.now().minus({ year: 100 }).year;
        this.maxYear = DateTime.now().plus({ year: 100 }).year;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.showCustomRangeLabel = true;
        this.timePicker = false;
        this.timePicker24Hour = true;
        this.timePickerStepSize = Duration.fromObject({ minutes: 1 });
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.isInvalidDate = null;
        this.isInvalidTime = null;
        this.isCustomDate = null;
        this.onOutsideClick = 'apply';
        this.opens = this.element.hasClass('pull-right') ? 'left' : 'right';
        this.drops = this.element.hasClass('dropup') ? 'up' : 'down';
        this.buttonClasses = 'btn btn-sm';
        this.applyButtonClasses = 'btn-primary';
        this.cancelButtonClasses = 'btn-default';
        this.weekendClasses = 'weekend';
        this.weekendDayClasses = 'weekend-day';
        this.todayClasses = 'today';
        this.warnings = true;
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

        this.callback = function () { };

        //some state information
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};

        //custom options from user
        if (typeof options !== 'object' || options === null)
            options = {};

        //allow setting options with data attributes
        //data-api options will be overwritten with custom javascript options
        options = $.extend(this.element.data(), options);

        //html template for the picker UI
        if (typeof options.template !== 'string' && !(options.template instanceof $))
            options.template =
                '<div class="daterangepicker">' +
                '<div class="ranges"></div>' +
                '<div class="drp-calendar left">' +
                '<div class="calendar-table"></div>' +
                '<div class="calendar-time"></div>' +
                '</div>' +
                '<div class="drp-calendar right">' +
                '<div class="calendar-table"></div>' +
                '<div class="calendar-time"></div>' +
                '</div>' +
                '<div class="drp-buttons">' +
                '<span class="drp-duration-label"></span>' +
                '<span class="drp-selected"></span>' +
                '<button class="cancelBtn" type="button"></button>' +
                '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
                '</div>' +
                '</div>';

        this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(options.template).appendTo(this.parentEl);

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

            if (['string', 'object'].includes(typeof options.locale.durationFormat) && options.locale.durationFormat != null)
                this.locale.durationFormat = options.locale.durationFormat;
        }
        this.container.addClass(this.locale.direction);

        for (let key of ['singleDatePicker', 'timePicker24Hour', 'showWeekNumbers', 'showISOWeekNumbers',
            'showDropdowns', 'linkedCalendars', 'showCustomRangeLabel', 'alwaysShowCalendars', 'autoApply', 'autoUpdateInput', 'warnings']) {
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

        if (!this.singleDatePicker) {
            for (let opt of ['minSpan', 'maxSpan']) {
                if (['string', 'number', 'object'].includes(typeof options[opt])) {
                    if (options[opt] instanceof Duration && options[opt].isValid) {
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
        }

        if (this.timePicker) {
            if (typeof options.timePickerSeconds === 'boolean')  // backward compatibility            
                this.timePickerStepSize = Duration.fromObject({ [options.timePickerSeconds ? 'seconds' : 'minutes']: 1 });
            if (typeof options.timePickerIncrement === 'number')  // backward compatibility
                this.timePickerStepSize = Duration.fromObject({ minutes: options.timePickerIncrement });

            if (['string', 'object', 'number'].includes(typeof options.timePickerStepSize)) {
                let duration;
                if (options.timePickerStepSize instanceof Duration && options.timePickerStepSize.isValid) {
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

        for (let opt of ['startDate', 'endDate', 'minDate', 'maxDate', 'initalMonth']) {
            if (opt == 'endDate' && this.singleDatePicker)
                continue;
            if (typeof options[opt] === 'object') {
                if (options[opt] instanceof DateTime && options[opt].isValid) {
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
        if (!this.timePicker) {
            if (this.minDate)
                this.minDate = this.minDate.startOf('day');
            if (this.maxDate)
                this.maxDate = this.maxDate.endOf('day');
        }

        //if no start/end dates set, check if the input element contains initial values
        if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
            if ($(this.element).is(':text')) {
                let start, end;
                const val = $(this.element).val();
                if (val != '') {
                    const split = val.split(this.locale.separator);
                    const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                    if (split.length == 2) {
                        start = DateTime.fromFormat(split[0], format, { locale: DateTime.now().locale });
                        end = DateTime.fromFormat(split[1], format, { locale: DateTime.now().locale });
                    } else if (this.singleDatePicker) {
                        start = DateTime.fromFormat(val, format, { locale: DateTime.now().locale });
                        end = DateTime.fromFormat(val, format, { locale: DateTime.now().locale });
                    }

                    if (start.isValid && end.isValid) {
                        this.setStartDate(start, false);
                        this.setEndDate(end, false);
                    } else {
                        if (this.singleDatePicker)
                            console.error(`Value in <input> is not a valid string: ${start.invalidExplanation}`)
                        else
                            console.error(`Value in <input> is not a valid string: ${start.invalidExplanation} - ${end.invalidExplanation}`);
                    }
                }
            }
        }

        if (this.singleDatePicker) {
            this.endDate = this.startDate;
        } else if (this.endDate < this.startDate) {
            this.endDate = this.startDate;
            console.warn(`Set 'endDate' to ${this - this.logDate(endDate)}  because it was earlier than 'startDate'`);
        }

        if (!this.startDate && this.initalMonth) {
            // No initial date selected
            this.endDate = null;
            if (this.timePicker)
                console.error(`Option 'initalMonth' works only with 'timePicker: false'`);
        } else {
            // Do some sanity checks on startDate and endDate for minDate, maxDate, minSpan, maxSpan, etc.
            this.constrainDate();
        }

        if (typeof options.opens === 'string') {
            if (['left', 'right', 'center'].includes(options.opens))
                this.opens = options.opens
            else
                console.error(`Option 'options.opens' must be 'left', 'right' or 'center'`);
        }

        if (typeof options.drops === 'string') {
            if (['drop', 'down', 'auto'].includes(options.drops))
                this.drops = options.drops
            else
                console.error(`Option 'options.drops' must be 'drop', 'down' or 'auto'`);
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
                    if (options.ranges[range][0] instanceof DateTime && options.ranges[range][0].isValid) {
                        start = options.ranges[range][0];
                    } else if (typeof options.ranges[range][0] === 'string' && DateTime.fromISO(options.ranges[range][0]).isValid) {
                        start = DateTime.fromISO(options.ranges[range][0]);
                    } else {
                        console.error(`Option 'ranges.${range}' is not a valid ISO-8601 string or DateTime`);
                    }
                }
                if (['string', 'object'].includes(typeof options.ranges[range][1])) {
                    if (options.ranges[range][1] instanceof DateTime && options.ranges[range][1].isValid) {
                        end = options.ranges[range][1];
                    } else if (typeof options.ranges[range][1] === 'string' && DateTime.fromISO(options.ranges[range][1]).isValid) {
                        end = DateTime.fromISO(options.ranges[range][1]);
                    } else {
                        console.error(`Option 'ranges.${range}' is not a valid ISO-8601 string or DateTime`);
                    }
                }
                if (start == null || end == null)
                    continue;

                const validRange = this.constrainDate({ span: false }, [range, start, end]);
                options.ranges[range] = [validRange[0], validRange[1]];

                //Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;

                this.ranges[rangeHtml] = [validRange[0], validRange[1]];
            }

            var list = '<ul>';
            for (range in this.ranges) {
                list += '<li data-range-key="' + range + '">' + range + '</li>';
            }
            if (this.showCustomRangeLabel) {
                list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>';
            }
            list += '</ul>';
            this.container.find('.ranges').prepend(list);
            this.container.addClass('show-ranges');
        }

        if (typeof cb === 'function') {
            this.callback = cb;
        }

        if (!this.timePicker) {
            if (this.startDate)
                this.startDate = this.startDate.startOf('day');
            if (this.endDate)
                this.endDate = this.endDate.endOf('day');
            this.container.find('.calendar-time').hide();
        }

        //can't be used together for now
        if (this.timePicker && this.autoApply)
            this.autoApply = false;

        if (this.autoApply)
            this.container.addClass('auto-apply');

        if (this.singleDatePicker) {
            this.container.addClass('single');
            this.container.find('.drp-calendar.left').addClass('single');
            this.container.find('.drp-calendar.left').show();
            this.container.find('.drp-calendar.right').hide();
            if (!this.timePicker && this.autoApply)
                this.container.addClass('auto-apply');
        }

        if ((typeof options.ranges === 'undefined' && !this.singleDatePicker) || this.alwaysShowCalendars)
            this.container.addClass('show-calendar');

        this.container.addClass('opens' + this.opens);

        //apply CSS classes and labels to buttons
        this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
        if (this.applyButtonClasses.length)
            this.container.find('.applyBtn').addClass(this.applyButtonClasses);
        if (this.cancelButtonClasses.length)
            this.container.find('.cancelBtn').addClass(this.cancelButtonClasses);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

        //
        // event listeners
        //

        this.container.find('.drp-calendar')
            .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
            .on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
            .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
            .on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this));

        this.container.find('.ranges')
            .on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
            .on('mouseenter.daterangepicker', 'li', $.proxy(this.hoverRange, this));

        this.container.find('.drp-buttons')
            .on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this));

        if (this.element.is('input') || this.element.is('button')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.elementChanged, this),
                'keydown.daterangepicker': $.proxy(this.keydown, this) //IE 11 compatibility
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
            this.element.on('keydown.daterangepicker', $.proxy(this.toggle, this));
        }

        //
        // if attached to a text input, set the initial value
        //

        this.updateElement();

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,
        /**
        * Sets the date range picker's currently selected start date to the provided date.<br/>
        * `startDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or 
        * a string matching `locale.format`.
        * The value of the attached `<input>` element is also updated.
        * Date value is rounded to match option `timePickerStepSize`<br/>
        * Functions `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br/>
        * If the `startDate` does not fall into `minDate` and `maxDate` then `startDate` is shifted and a warning is written to console. 
        * @param {external:DateTime|external:Date|string} startDate - startDate to be set
        * @param {boolean} isValid=false - If `true` then the `startDate` is not checked against `minDate` and `maxDate`<br/>
        * Use this option only if you are really sure about the value you put in.
        * @throws `RangeError` for invalid date values.
        * @example const DateTime = luxon.DateTime;
        * const drp = $('#picker').data('daterangepicker');
        * drp.setStartDate(DateTime.now().startOf('hour'));
        */
        setStartDate: function (startDate, isValid = false) {
            // If isValid == true, then value is selected from calendar and stepSize, minDate, maxDate are already considered
            if (isValid === undefined || !isValid) {
                if (typeof startDate === 'object') {
                    if (startDate instanceof DateTime && startDate.isValid) {
                        this.startDate = startDate;
                    } else if (startDate instanceof Date) {
                        this.startDate = DateTime.fromJSDate(startDate);
                    } else {
                        throw RangeError(`The 'startDate' must be a luxon.DateTime or Date or string`);
                    }
                } else if (typeof startDate === 'string') {
                    const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                    if (DateTime.fromISO(startDate).isValid) {
                        this.startDate = DateTime.fromISO(startDate);
                    } else if (DateTime.fromFormat(startDate, format, { locale: DateTime.now().locale }).isValid) {
                        this.startDate = DateTime.fromFormat(startDate, format, { locale: DateTime.now().locale });
                    } else {
                        const invalid = DateTime.fromFormat(startDate, format, { locale: DateTime.now().locale }).invalidExplanation;
                        throw RangeError(`The 'startDate' is not a valid string: ${invalid}`);
                    }
                }
            } else {
                this.startDate = startDate;
            }

            if (isValid === undefined || !isValid)
                this.constrainDate();

            if (!this.singleDatePicker) {
                if (this.locale.durationFormat)
                    this.container.find('.drp-duration-label').html('');
                if (typeof this.locale.format === 'object') {
                    const empty = `<span style="color: rgb(0,0,0,0);">${this.startDate.toLocaleString(this.locale.format)}</span>`;
                    this.container.find('.drp-selected').html(this.startDate.toLocaleString(this.locale.format) + this.locale.separator + empty);
                } else {
                    const empty = `<span style="color: rgb(0,0,0,0);">${this.startDate.toFormat(this.locale.format)}</span>`;
                    this.container.find('.drp-selected').html(this.startDate.toFormat(this.locale.format) + this.locale.separator + empty);
                }
            }

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        /**
        * Sets the date range picker's currently selected end date to the provided date.<br/>
        * `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or 
        * a string matching`locale.format`.
        * The value of the attached `<input>` element is also updated.
        * Date value is rounded to match option `timePickerStepSize`<br/>
        * Functions `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br/>
        * If the `endDate` does not fall into  `minDate` and `maxDate` or into `minSpan` and `maxSpan`
        * then `endDate` is shifted and a warning is written to console. 
        * @param {external:DateTime|external:Date|string} endDate - endDate to be set
        * @param {boolean} isValid=false - If `true` then the `endDate` is not checked against `minDate`, `maxDate` and `minSpan`, `maxSpan`<br/>
        * Use this option only if you are really sure about the value you put in.
        * @throws `RangeError` for invalid date values.
        * @example const drp = $('#picker').data('daterangepicker');
        * drp.setEndDate('2025-03-28T18:30:00');
        */
        setEndDate: function (endDate, isValid = false) {
            // If isValid == true, then value is selected from calendar and stepSize, minDate, maxDate are already considered
            if (isValid === undefined || !isValid) {
                if (typeof endDate === 'object') {
                    if (endDate instanceof DateTime && endDate.isValid) {
                        this.endDate = endDate;
                    } else if (endDate instanceof Date) {
                        this.endDate = DateTime.fromJSDate(endDate);
                    } else {
                        throw RangeError(`The 'endDate' must be a luxon.DateTime or Date or string`);
                    }
                } else if (typeof endDate === 'string') {
                    const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                    if (DateTime.fromISO(endDate).isValid) {
                        this.endDate = DateTime.fromISO(endDate);
                    } else if (DateTime.fromFormat(endDate, format, { locale: DateTime.now().locale }).isValid) {
                        this.endDate = DateTime.fromFormat(endDate, format, { locale: DateTime.now().locale });
                    } else {
                        const invalid = DateTime.fromFormat(endDate, format, { locale: DateTime.now().locale }).invalidExplanation;
                        throw RangeError(`The 'endDate' is not a valid string: ${invalid}`);
                    }
                }
            } else {
                this.endDate = endDate;
            }

            if (isValid === undefined || !isValid)
                this.constrainDate();

            this.previousRightTime = this.endDate;

            if (!this.singleDatePicker) {
                if (this.locale.durationFormat) {
                    const duration = this.endDate.diff(this.startDate).rescale();
                    if (typeof this.locale.durationFormat === 'object') {
                        this.container.find('.drp-duration-label').html(duration.toHuman(this.locale.durationFormat));
                    } else {
                        this.container.find('.drp-duration-label').html(duration.toFormat(this.locale.durationFormat));
                    }
                }
                if (typeof this.locale.format === 'object') {
                    this.container.find('.drp-selected').html(this.startDate.toLocaleString(this.locale.format) + this.locale.separator + this.endDate.toLocaleString(this.locale.format));
                } else {
                    this.container.find('.drp-selected').html(this.startDate.toFormat(this.locale.format) + this.locale.separator + this.endDate.toFormat(this.locale.format));
                }
            }

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        /**
        * Shortcut for {@link #DateRangePicker+setStartDate|setStartDate} and {@link #DateRangePicker+setEndDate|setEndDate}
        * @param {external:DateTime|external:Date|string} startDate - startDate to be set
        * @param {external:DateTime|external:Date|string} endDate - endDate to be set
        * @param {boolean} isValid=false - If `true` then the `startDate` and `endDate` are not checked against `minDate`, `maxDate` and `minSpan`, `maxSpan`<br/>
        * Use this option only if you are really sure about the value you put in.
        * @throws `RangeError` for invalid date values.
        * @example const DateTime = luxon.DateTime;
        * const drp = $('#picker').data('daterangepicker');
        * drp.setPeriod(DateTime.now().startOf('week'), DateTime.now().startOf('week').plus({days: 10}));
        */
        setPeriod: function (startDate, endDate, isValid = false) {
            if (this.singleDatePicker) {
                this.setStartDate(startDate, isValid);
            } else {
                this.setStartDate(startDate, true);
                this.setEndDate(endDate, true);
                if (!isValid)
                    this.constrainDate();
            }
        },

        logDate: function (date) {
            return this.timePicker ? date.toISO({ suppressMilliseconds: true }) : date.toISODate();
        },

        /**
        * @typedef constraintOptions
        * @type {Object}
        * @property {boolean} stepSize=true If `true`, then `startDate` and `endDate` are rounded to match `timePickerStepSize` (no warning)
        * @property {boolean} minMax=true If `true` then and if the `startDate` and `endDate` do not fall into `minDate` and `maxDate`
        * then dates are shifted and a warning is written to console. 
        * @property {boolean} span=true If `true` then and if the `startDate` and `endDate` do not fall into `minDate` and `maxSpan` 
        * then `endDate` is shifted and a warning is written to console. 
        * @property {boolean} invalidDate=false If `true` then and if `invalidDate` return `true`, then an error is logged to console
        * @property {boolean} invalidTime=false If `true` then and if `invalidTime` return `true`, then an error is logged to console
        * @property {boolean} writeWarning=true If `true` then a warning is written to console if `startDate` or `endDate` is modified 
        * with the exception of rounding due to `timePickerStepSize`.
        */

        /**
        * Validate `startDate` and `endDate` or `range` against `timePickerStepSize`, `minDate`, `maxDate`, 
        * `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` and modifies them, if needed. 
        * When `startDate` or `endDate` are modified, then a warning is written to console by default.
        * @param {constraintOptions} options - Defines which constraints shall be validated
        * @param {Array} [range] - Used to check prefefined range instead of `startDate` and `endDate` => `[name, startDate, endDate]`
        * When set, then function does not modify anything, just returning corrected range.
        * @throws `RangeError` if 'minDate' contradicts to 'minSpan'
        * @returns {Array} - Corrected range as array of `[startDate, endDate, isInvalid]` when range is set, otherwise just `isInvalid` object
        * @example 
        * constrainDate({}, [DateTime.fromISO('2025-02-03'), DateTime.fromISO('2025-02-25')]) => 
        * [ DateTime.fromISO('2025-02-05'), DateTime.fromISO('2025-02-20'), { startDate: { stepped: ... }, endDate: { stepped: ..., modified: [{old: ... new: ..., reason: 'minSpan'}] } } ]
        * constrainDate({span: false, invalidDate: true, invalidTime: true}) => 
        * { startDate: {stepped: ..., modified: [{old: ... new: ..., reason: 'minDate'}], isInvalidDate: true, isInvalidTime: false}, endDate: {stepped: ..., isInvalidDate: false, isInvalidTime: true} } ]
        */
        constrainDate: function ({ minMax = true, span = true, stepSize = true, invalidDate = false, invalidTime = false, writeWarning = this.warnings } = {}, range) {
            const name = range === undefined ? null : range[0];
            const nLog = range === undefined ? '' : ` of range '${name}'`;
            let startDate = range === undefined ? this.startDate : range[1];
            let endDate = range === undefined ? this.endDate : range[2];

            if (!startDate)
                return;

            let result = { startDate: { modified: [] } };
            if (invalidDate)
                result.startDate.isInvalidDate = false;
            if (invalidTime)
                result.startDate.isInvalidTime = false;

            if (stepSize) {
                let modified = { old: startDate, reason: stepSize && this.timePicker ? 'timePickerStepSize' : 'No timePicker' };
                if (this.timePicker) {
                    // Round time to step size
                    const secs = this.timePickerStepSize.as('seconds');
                    startDate = DateTime.fromSeconds(secs * Math.round(startDate.toSeconds() / secs));
                } else {
                    startDate = startDate.startOf('day');
                }
                modified.new = startDate;
                if (modified.new != modified.old)
                    result.startDate.modified.push(modified);
            }


            if (minMax) {
                if (this.minDate && startDate < this.minDate) {
                    // If the startDate is earlier than minDate option, shift the startDate to allowable date
                    let modified = { old: startDate, reason: 'minDate' };
                    while (startDate < this.minDate)
                        startDate = startDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                    modified.new = startDate;
                    if (modified.new != modified.old) {
                        result.startDate.modified.push(modified);
                        if (writeWarning)
                            console.warn(`Set 'startDate'${nLog} to ${this.logDate(startDate)} due to 'minDate'`);
                    }
                } else if (this.maxDate && startDate > this.maxDate) {
                    // If the startDate is later than maxDate option, shift the startDate to allowable date
                    let modified = { old: startDate, reason: 'maxDate' };
                    while (startDate > this.maxDate)
                        startDate = startDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                    modified.new = startDate;
                    if (modified.new != modified.old) {
                        result.startDate.modified.push(modified);
                        if (writeWarning)
                            console.warn(`Set 'startDate'${nLog} to ${this.logDate(startDate)} due to 'maxDate'`);
                    }
                }
            }

            let units = ['hour'];
            if (invalidTime && this.timePicker) {
                if (this.timePickerOpts.showMinutes)
                    units.push('minute');
                if (this.timePickerOpts.showSeconds)
                    units.push('second');
                if (!this.timePicker24Hour)
                    units.push('ampm');
            }

            if (invalidDate && this.isInvalidDate(startDate)) {
                result.startDate.isInvalidDate = true;
                if (writeWarning)
                    console.warn(`The 'startDate'${nLog} ${this.logDate(startDate)} is invalid by 'isInvalidDate'`);
            }

            if (invalidTime && this.timePicker) {
                for (let unit of units) {
                    if (this.isInvalidTime(startDate, unit, 'start'))
                        result.startDate.isInvalidTime = true;
                    if (writeWarning)
                        console.warn(`The 'startDate'${nLog} ${this.logDate(startDate)} ${unit} is invalid by 'isInvalidTime'`);
                }
            }

            if (result.startDate.modified.length == 0)
                delete result.startDate.modified;

            if (this.singleDatePicker) {
                endDate = startDate;
                if (range === undefined) {
                    this.startDate = startDate;
                    this.endDate = endDate;
                    return result;
                } else {
                    return [startDate, endDate, result];
                }
            }

            if (endDate == null)
                return result;

            result.endDate = { modified: [] };
            if (invalidDate)
                result.endDate.isInvalidDate = false;
            if (invalidTime)
                result.endDate.isInvalidTime = false;

            if (stepSize) {
                let modified = { old: endDate, reason: stepSize && this.timePicker ? 'timePickerStepSize' : 'No timePicker' };
                if (this.timePicker) {
                    // Round time to step size
                    const secs = this.timePickerStepSize.as('seconds');
                    endDate = DateTime.fromSeconds(secs * Math.round(endDate.toSeconds() / secs));
                } else {
                    endDate = endDate.endOf('day');
                }
                modified.new = endDate;
                if (modified.new != modified.old)
                    result.endDate.modified.push(modified);
            }

            if (minMax) {
                if (this.maxDate && endDate > this.maxDate) {
                    // If the endDate is later than maxDate option, shorten the range to the allowable period.
                    let modified = { old: endDate, reason: 'maxDate' };
                    while (endDate > this.maxDate)
                        endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                    modified.new = endDate;
                    if (modified.new != modified.old) {
                        result.endDate.modified.push(modified);
                        if (writeWarning)
                            console.warn(`Set 'endDate'${nLog} to ${this.logDate(endDate)} due to 'maxDate'`);
                    }
                } else if (this.minDate && endDate < this.minDate) {
                    // If the endDate is earlier than minDate option, shorten the range to the allowable period.
                    let modified = { old: endDate, reason: 'minDate' };
                    while (endDate < this.minDate)
                        endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                    modified.new = endDate;
                    if (modified.new != modified.old) {
                        result.endDate.modified.push(modified);
                        if (writeWarning)
                            console.warn(`Set 'endDate'${nLog} to ${this.logDate(endDate)} due to 'minDate'`);
                    }
                }
            }

            if (span) {
                if (this.maxSpan) {
                    // If the endDate exceeds those allowed by the maxSpan option, shorten the range to the allowable period.
                    const maxDate = startDate.plus(this.maxSpan);
                    if (endDate > maxDate) {
                        let modified = { old: endDate, reason: 'maxSpan' };
                        while (endDate > maxDate)
                            endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                        modified.new = endDate;
                        if (modified.new != modified.old) {
                            result.endDate.modified.push(modified);
                            if (writeWarning)
                                console.warn(`Set 'endDate'${nLog} to ${this.logDate(endDate)} due to 'maxSpan'`);
                        }
                    }
                }

                if (this.minSpan) {
                    // If the endDate falls below those allowed by the minSpan option, expand the range to the allowable period.
                    const minDate = startDate.plus(this.minSpan);
                    if (endDate < minDate) {
                        let modified = { old: endDate, reason: 'minSpan' };
                        while (endDate < minDate)
                            endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
                        modified.new = endDate;
                        if (modified.new != modified.old) {
                            result.endDate.modified.push(modified);
                            if (writeWarning)
                                console.warn(`Set 'endDate'${nLog} to ${this.logDate(endDate)} due to 'minSpan'`);
                        }
                    }
                }
            }

            if (invalidDate && this.isInvalidDate(endDate)) {
                result.endDate.isInvalidDate = true;
                if (writeWarning)
                    console.warn(`The 'endDate'${nLog} ${this.logDate(endDate)} is invalid by 'isInvalidDate'`);
            }

            if (invalidTime && this.timePicker) {
                for (let unit of units) {
                    if (this.isInvalidTime(endDate, unit, 'end'))
                        result.endDate.isInvalidTime = true;
                    if (writeWarning)
                        console.warn(`The 'endDate'${nLog} ${this.logDate(endDate)} ${unit} is invalid by 'isInvalidTime'`);
                }
            }

            if (result.endDate.modified.length == 0)
                delete result.endDate.modified;

            if (range === undefined) {
                this.startDate = startDate;
                this.endDate = endDate;
                return result;
            } else {
                return [startDate, endDate, result];
            }

        },


        /**
        * Updates the picker when calendar is initiated or any date has been selected. 
        * Could be useful after running {@link #DateRangePicker+setStartDate|setStartDate} or {@link #DateRangePicker+setEndDate|setEndDate}
        */
        updateView: function () {
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
                if (!this.endDate) {
                    this.container.find('.right .calendar-time select').prop('disabled', true).addClass('disabled');
                } else {
                    this.container.find('.right .calendar-time select').prop('disabled', false).removeClass('disabled');
                }
            }
            if (this.endDate) {
                if (this.locale.durationFormat && !this.singleDatePicker) {
                    const duration = this.endDate.diff(this.startDate).rescale();
                    if (typeof this.locale.durationFormat === 'object') {
                        this.container.find('.drp-duration-label').html(duration.toHuman(this.locale.durationFormat));
                    } else {
                        this.container.find('.drp-duration-label').html(duration.toFormat(this.locale.durationFormat));
                    }
                }
                if (this.startDate) {
                    if (typeof this.locale.format === 'object') {
                        this.container.find('.drp-selected').html(this.startDate.toLocaleString(this.locale.format) + this.locale.separator + this.endDate.toLocaleString(this.locale.format));
                    } else {
                        this.container.find('.drp-selected').html(this.startDate.toFormat(this.locale.format) + this.locale.separator + this.endDate.toFormat(this.locale.format));
                    }
                }
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
        },

        /**
        * Shows calendar months based on selected date values
        * @private
        */
        updateMonthsInView: function () {
            if (this.endDate) {
                //if both dates are visible already, do nothing
                if (!this.singleDatePicker
                    && this.leftCalendar.month && this.rightCalendar.month
                    && (this.startDate.hasSame(this.leftCalendar.month, 'month') || this.startDate.hasSame(this.rightCalendar.month, 'month'))
                    && (this.endDate.hasSame(this.leftCalendar.month, 'month') || this.endDate.hasSame(this.rightCalendar.month, 'month'))
                )
                    return;

                this.leftCalendar.month = this.startDate.startOf('month');
                if (!this.linkedCalendars && !this.endDate.hasSame(this.startDate, 'month')) {
                    this.rightCalendar.month = this.endDate.startOf('month');
                } else {
                    this.rightCalendar.month = this.startDate.startOf('month').plus({ month: 1 });
                }
            } else {
                // Inital view without date
                if (!this.startDate && this.initalMonth) {
                    this.rightCalendar.month = this.initalMonth;
                    this.rightCalendar.month = this.initalMonth.plus({ month: 1 });
                } else {
                    if (!this.leftCalendar.month.hasSame(this.startDate, 'month') && !this.rightCalendar.month.hasSame(this.startDate, 'month')) {
                        this.leftCalendar.month = this.startDate.startOf('month');
                        this.rightCalendar.month = this.startDate.startOf('month').plus({ month: 1 });
                    }
                }
            }

            if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
                this.rightCalendar.month = this.maxDate.startOf('month');
                this.leftCalendar.month = this.maxDate.startOf('month').minus({ month: 1 });
            }

        },

        /**
        * Updates the selected day value from calendar with selected time values
        * @private
        */
        updateCalendars: function () {

            if (this.timePicker) {
                var hour, minute, second;

                if (this.endDate) {
                    hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.left .hourselect option:last').val(), 10);

                    minute = 0;
                    if (this.timePickerOpts.showMinutes) {
                        minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
                    }

                    second = 0;
                    if (this.timePickerOpts.showSeconds) {
                        second = parseInt(this.container.find('.left .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.left .secondselect option:last').val(), 10);
                    }
                } else {
                    hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.right .hourselect option:last').val(), 10);

                    minute = 0;
                    if (this.timePickerOpts.showMinutes) {
                        minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
                    }

                    second = 0;
                    if (this.timePickerOpts.showSeconds) {
                        second = parseInt(this.container.find('.right .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.right .secondselect option:last').val(), 10);
                    }
                }
                this.leftCalendar.month = this.leftCalendar.month.set({ hour: hour, minute: minute, second: second });
                this.rightCalendar.month = this.rightCalendar.month.set({ hour: hour, minute: minute, second: second });
            }

            this.renderCalendar('left');
            this.renderCalendar('right');

            //highlight any predefined range matching the current start and end dates
            this.container.find('.ranges li').removeClass('active');
            if (this.endDate == null) return;

            this.calculateChosenLabel();
        },

        /**
        * Renders the calendar month
        * @private
        */
        renderCalendar: function (side) {

            //
            // Build the matrix of dates that will populate the calendar
            //
            var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
            if (calendar.month == null && !this.startDate && this.initalMonth)
                calendar.month = this.initalMonth.startOf('month');

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
            if (side == 'left') {
                this.leftCalendar.calendar = calendar;
            } else {
                this.rightCalendar.calendar = calendar;
            }

            //
            // Display the calendar
            //

            var minDate = side == 'left' ? this.minDate : this.startDate;
            var maxDate = this.maxDate;
            var selected = side == 'left' ? this.startDate : this.endDate;
            var arrow = this.locale.direction == 'ltr' ? { left: 'chevron-left', right: 'chevron-right' } : { left: 'chevron-right', right: 'chevron-left' };

            var html = '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers || this.showISOWeekNumbers)
                html += '<th></th>';

            if ((!minDate || minDate < calendar.firstDay) && (!this.linkedCalendars || side == 'left')) {
                html += '<th class="prev available"><span></span></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml = `${this.locale.monthNames[calendar.firstDay.month - 1]} ${calendar.firstDay.year}`;

            if (this.showDropdowns) {
                const maxYear = (maxDate && maxDate.year) ?? this.maxYear;
                const minYear = (minDate && minDate.year) ?? this.minYear;

                var monthHtml = '<select class="monthselect">';
                for (var m = 1; m <= 12; m++) {
                    monthHtml += `<option value="${m}"${m === calendar.firstDay.month ? ' selected="selected"' : ''}`;
                    if ((minDate && calendar.firstDay.set({ month: m }) < minDate.startOf('month')) || (maxDate && calendar.firstDay.set({ month: m }) > maxDate.endOf('month')))
                        monthHtml += ` disabled="disabled"`;
                    monthHtml += `>${this.locale.monthNames[m - 1]}</option>`;
                }
                monthHtml += "</select>";

                var yearHtml = '<select class="yearselect">';
                for (var y = minYear; y <= maxYear; y++)
                    yearHtml += `<option value="${y}"${y === calendar.firstDay.year ? ' selected="selected"' : ''}>${y}</option>`;
                yearHtml += '</select>';

                dateHtml = monthHtml + yearHtml;
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if ((!maxDate || maxDate > calendar.lastDay.endOf('day')) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
                html += '<th class="next available"><span></span></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
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
            html += '</thead>';
            html += '<tbody>';

            //adjust maxDate to reflect the maxSpan setting in order to
            //grey out end dates beyond the maxSpan
            if (this.endDate == null && this.maxSpan) {
                var maxLimit = this.startDate.plus(this.maxSpan).endOf('day');
                if (!maxDate || maxLimit < maxDate) {
                    maxDate = maxLimit;
                }
            }

            var minLimit;
            //grey out end dates shorter than minSpan
            if (this.endDate == null && this.minSpan)
                minLimit = this.startDate.plus(this.minSpan).startOf('day');

            for (let row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showISOWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].weekNumber + '</td>';
                else if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].localWeekNumber + '</td>';

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
                    if (minLimit && calendar[row][col].startOf('day') > this.startDate.startOf('day') && calendar[row][col].startOf('day') < minLimit.startOf('day'))
                        classes.push('off', 'disabled');

                    //don't allow selection of date if a custom function decides it's invalid
                    if (this.isInvalidDate(calendar[row][col]))
                        classes.push('off', 'disabled');

                    //highlight the currently selected start date
                    if (this.startDate != null && calendar[row][col].hasSame(this.startDate, 'day'))
                        classes.push('active', 'start-date');

                    //highlight the currently selected end date
                    if (this.endDate != null && calendar[row][col].hasSame(this.endDate, 'day'))
                        classes.push('active', 'end-date');

                    //highlight dates in-between the selected dates
                    if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                        classes.push('in-range');

                    //apply custom classes for this date
                    var isCustom = this.isCustomDate(calendar[row][col]);
                    if (isCustom !== false) {
                        if (typeof isCustom === 'string')
                            classes.push(isCustom);
                        else
                            Array.prototype.push.apply(classes, isCustom);
                    }

                    if (!classes.includes('disabled'))
                        classes.push('available');

                    html += `<td class="${classes.join(' ')}" data-title="r${row}c${col}">${calendar[row][col].day}</td>`;

                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';

            this.container.find('.drp-calendar.' + side + ' .calendar-table').html(html);

        },

        /**
        * Renders the time pickers
        * @private
        */
        renderTimePicker: function (side) {

            // Don't bother updating the time picker if it's currently disabled
            // because an end date hasn't been clicked yet
            if (side == 'right' && !this.endDate) return;

            var html, selected, minLimit, minDate, maxDate = this.maxDate;

            if (this.maxSpan && (!this.maxDate || this.startDate.plus(this.maxSpan) < this.maxDate))
                maxDate = this.startDate.plus(this.maxSpan);

            if (this.minSpan && side == 'right')
                minLimit = this.startDate.plus(this.minSpan);

            if (side == 'left') {
                selected = this.startDate;
                minDate = this.minDate;
            } else if (side == 'right') {
                selected = this.endDate;
                minDate = this.startDate;

                //Preserve the time already selected
                var timeSelector = this.container.find('.drp-calendar.right .calendar-time');
                if (timeSelector.html() != '') {
                    selected = selected.set({
                        hour: !isNaN(selected.hour) ? selected.hour : timeSelector.find('.hourselect option:selected').val(),
                        minute: !isNaN(selected.minute) ? selected.minute : timeSelector.find('.minuteselect option:selected').val(),
                        second: !isNaN(selected.second) ? selected.second : timeSelector.find('.secondselect option:selected').val()
                    });
                }

                if (selected < this.startDate)
                    selected = this.startDate;

                if (maxDate && selected > maxDate)
                    selected = maxDate;
            }

            //
            // hours
            //

            html = '<select class="hourselect">';
            const ampm = selected.toFormat('a', { locale: 'en-US' });
            let start = 0;
            if (!this.timePicker24Hour)
                start = ampm == 'AM' ? 1 : 13;

            for (var i = start; i <= start + 23; i += this.timePickerOpts.hourStep) {
                let time = selected.set({ hour: i % 24 });
                let disabled = false;
                if (minDate && time.set({ minute: 59 }) < minDate)
                    disabled = true;
                if (maxDate && time.set({ minute: 0 }) > maxDate)
                    disabled = true;
                if (minLimit && time.endOf('hour') < minLimit)
                    disabled = true;
                if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'hour'))
                    disabled = true;

                if (this.timePicker24Hour) {
                    if (!disabled && i == selected.hour) {
                        html += `<option value="${i}" selected="selected">${i}</option>`;
                    } else if (disabled) {
                        html += `<option value="${i}" disabled="disabled" class="disabled">${i}</option>`;
                    } else {
                        html += `<option value="${i}">${i}</option>`;
                    }
                } else {
                    const i_12 = DateTime.fromFormat(`${i % 24}`, 'H').toFormat('h');
                    const i_ampm = DateTime.fromFormat(`${i % 24}`, 'H').toFormat('a', { locale: 'en-US' });
                    if (ampm == i_ampm) {
                        if (!disabled && i == selected.hour) {
                            html += `<option ampm="${i_ampm}" value="${i % 24}" selected="selected">${i_12}</option>`;
                        } else if (disabled) {
                            html += `<option  ampm="${i_ampm}" value="${i % 24}" disabled="disabled" class="disabled">${i_12}</option>`;
                        } else {
                            html += `<option ampm="${i_ampm}" value="${i % 24}">${i_12}</option>`;
                        }
                    } else {
                        html += `<option ampm="${i_ampm}" hidden="hidden" value="${i % 24}">${i_12}</option>`;
                    }
                }
            }

            html += '</select> ';

            //
            // minutes
            //

            if (this.timePickerOpts.showMinutes) {
                html += ': <select class="minuteselect">';

                for (var i = 0; i < 60; i += this.timePickerOpts.minuteStep) {
                    var padded = i < 10 ? '0' + i : i;
                    let time = selected.set({ minute: i });

                    let disabled = false;
                    if (minDate && time.set({ second: 59 }) < minDate)
                        disabled = true;
                    if (maxDate && time.set({ second: 0 }) > maxDate)
                        disabled = true;
                    if (minLimit && time.endOf('minute') < minLimit)
                        disabled = true;
                    if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'minute'))
                        disabled = true;

                    if (selected.minute == i && !disabled) {
                        html += `<option value="${i}" selected="selected">${padded}</option>`;
                    } else if (disabled) {
                        html += `<option value="${i}" disabled="disabled" class="disabled">${padded}</option>`;
                    } else {
                        html += `<option value="${i}">${padded}</option>`;
                    }
                }

                html += '</select> ';
            }

            //
            // seconds
            //

            if (this.timePickerOpts.showSeconds) {
                html += ': <select class="secondselect">';

                for (var i = 0; i < 60; i += this.timePickerOpts.secondStep) {
                    var padded = i < 10 ? '0' + i : i;
                    let time = selected.set({ second: i });

                    let disabled = false;
                    if (minDate && time < minDate)
                        disabled = true;
                    if (maxDate && time > maxDate)
                        disabled = true;
                    if (minLimit && time < minLimit)
                        disabled = true;
                    if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'second'))
                        disabled = true;

                    if (selected.second == i && !disabled) {
                        html += `<option value="${i}" selected="selected">${padded}</option>`;
                    } else if (disabled) {
                        html += `<option value="${i}" disabled="disabled" class="disabled">${padded}</option>`;
                    } else {
                        html += `<option value="${i}">${padded}</option>`;
                    }
                }

                html += '</select> ';
            }

            //
            // AM/PM
            //

            if (!this.timePicker24Hour) {
                html += '<select class="ampmselect">';

                var am_html = '';
                var pm_html = '';
                let disabled = false;

                if (minDate && selected.startOf('day') < minDate)
                    disabled = true;
                if (maxDate && selected.endOf('day') > maxDate)
                    disabled = true;
                if (minLimit && selected.startOf('day') < minLimit)
                    disabled = true;
                if (disabled) {
                    am_html = ' disabled="disabled" class="disabled"';
                    pm_html = ' disabled="disabled" class="disabled"';
                } else {
                    if (this.isInvalidTime(selected, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'ampm')) {
                        if (selected.toFormat('a', { locale: 'en-US' }) == 'AM') {
                            pm_html = ' disabled="disabled" class="disabled"';
                        } else {
                            am_html = ' disabled="disabled" class="disabled"';
                        }
                    }
                }

                html += `<option value="AM"${am_html}`;
                if (selected.toFormat('a', { locale: 'en-US' }) == 'AM')
                    html += ' selected="selected"';
                html += `>${Info.meridiems()[0]}</option><option value="PM"${pm_html}`;
                if (selected.toFormat('a', { locale: 'en-US' }) == 'PM')
                    html += ' selected="selected"';
                html += `>${Info.meridiems()[1]}</option>`;

                html += '</select>';
            }

            this.container.find('.drp-calendar.' + side + ' .calendar-time').html(html);

        },

        /**
        * Disable the `Apply` button if no date value is selected
        * @private
        */
        updateFormInputs: function () {
            if (this.singleDatePicker || (this.endDate && this.startDate <= this.endDate)) {
                this.container.find('button.applyBtn').prop('disabled', false);
            } else {
                this.container.find('button.applyBtn').prop('disabled', true);
            }

        },

        /**
        * Place the picker at the right place in the document
        * @private
        */
        move: function () {
            var parentOffset = { top: 0, left: 0 },
                containerTop,
                drops = this.drops;

            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }

            switch (drops) {
                case 'auto':
                    containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
                    if (containerTop + this.container.outerHeight() >= this.parentEl[0].scrollHeight) {
                        containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
                        drops = 'up';
                    }
                    break;
                case 'up':
                    containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
                    break;
                default:
                    containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
                    break;
            }

            // Force the container to it's actual width
            this.container.css({
                top: 0,
                left: 0,
                right: 'auto'
            });
            var containerWidth = this.container.outerWidth();

            this.container.toggleClass('drop-up', drops == 'up');

            if (this.opens == 'left') {
                var containerRight = parentRightEdge - this.element.offset().left - this.element.outerWidth();
                if (containerWidth + containerRight > $(window).width()) {
                    this.container.css({
                        top: containerTop,
                        right: 'auto',
                        left: 9
                    });
                } else {
                    this.container.css({
                        top: containerTop,
                        right: containerRight,
                        left: 'auto'
                    });
                }
            } else if (this.opens == 'center') {
                var containerLeft = this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 - containerWidth / 2;
                if (containerLeft < 0) {
                    this.container.css({
                        top: containerTop,
                        right: 'auto',
                        left: 9
                    });
                } else if (containerLeft + containerWidth > $(window).width()) {
                    this.container.css({
                        top: containerTop,
                        left: 'auto',
                        right: 0
                    });
                } else {
                    this.container.css({
                        top: containerTop,
                        left: containerLeft,
                        right: 'auto'
                    });
                }
            } else {
                var containerLeft = this.element.offset().left - parentOffset.left;
                if (containerLeft + containerWidth > $(window).width()) {
                    this.container.css({
                        top: containerTop,
                        left: 'auto',
                        right: 0
                    });
                } else {
                    this.container.css({
                        top: containerTop,
                        left: containerLeft,
                        right: 'auto'
                    });
                }
            }
        },

        /**
        * Shows the picker
        * @param {external:jQuery} e - The Event target
        * @emits "show.daterangepicker"
        * @private
        */
        show: function (e) {
            if (this.isShowing) return;

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function (e) { this.outsideClick(e); }, this);

            // Bind global datepicker mousedown for hiding and
            $(document)
                .on('mousedown.daterangepicker', this._outsideClickProxy)
                // also support mobile devices
                .on('touchend.daterangepicker', this._outsideClickProxy)
                // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
                .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
                // and also close when focus changes to outside the picker (eg. tabbing between controls)
                .on('focusin.daterangepicker', this._outsideClickProxy);

            // Reposition the picker if the window is resized while it's open
            $(window).on('resize.daterangepicker', $.proxy(function (e) { this.move(e); }, this));

            this.oldStartDate = this.startDate;
            this.oldEndDate = this.endDate;
            this.previousRightTime = this.endDate;

            this.updateView();
            this.container.show();
            this.move();
            /**
            * Emitted when the picker is shown 
            * @event
            * @name "show.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('show.daterangepicker', this);
            this.isShowing = true;
        },

        /**
        * Hides the picker
        * @param {external:jQuery} e - The Event target
        * @emits "beforeHide.daterangepicker"
        * @emits "hide.daterangepicker"
        * @private
        */
        hide: function (e) {
            if (!this.isShowing) return;

            //incomplete date selection, revert to last values
            if (!this.endDate) {
                this.startDate = this.oldStartDate;
                this.endDate = this.oldEndDate;
            }

            //if a new date range was selected, invoke the user callback function
            if (this.startDate != this.oldStartDate || this.endDate != this.oldEndDate)
                this.callback(this.startDate, this.endDate, this.chosenLabel);

            //if picker is attached to a text input, update it
            this.updateElement();

            /**
            * Emitted before the picker will hide. When EventHandler returns `true`, then picker remains visible
            * @event
            * @name "beforeHide.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            * @return {boolean} cancel - If `true`, then the picker remains visible
            */
            if (this.element.triggerHandler('beforeHide.daterangepicker', this))
                return;
            $(document).off('.daterangepicker');
            $(window).off('.daterangepicker');
            this.container.hide();
            /**
            * Emitted when the picker is hidden
            * @event
            * @name "hide.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('hide.daterangepicker', this);
            this.isShowing = false;
        },

        /**
        * Toggles visibility of the picker
        * @param {external:jQuery} e - The Event target
        * @private
        */
        toggle: function (e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },

        /**
        * Closes the picker when user clicks outside
        * @param {external:jQuery} e - The Event target
        * @emits "outsideClick.daterangepicker"
        * @private
        */
        outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix
                e.type == "focusin" ||
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-table').length
            ) return;

            if (this.onOutsideClick == 'cancel') {
                this.startDate = this.oldStartDate;
                this.endDate = this.oldEndDate;
            }
            this.hide();

            /**
            * Emitted when user clicks outside the picker. 
            * Use option `onOutsideClick` to define the default action, then you may not need to handle this event.
            * @event
            * @name "outsideClick.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('outsideClick.daterangepicker', this);
        },

        /**
        * Shows calendar when user selects "Custom Ranges"
        * @emits "showCalendar.daterangepicker"
        */
        showCalendars: function () {
            this.container.addClass('show-calendar');
            this.move();
            /**
            * Emitted when the calendar(s) are shown.
            * Only useful when {@link #Ranges|Ranges} are used.
            * @event
            * @name "showCalendar.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('showCalendar.daterangepicker', this);
        },

        /**
        * Hides calendar when user selects a predefined range
        * @emits "hideCalendar.daterangepicker"
        */
        hideCalendars: function () {
            this.container.removeClass('show-calendar');
            /**
            * Emitted when the calendar(s) are hidden.
            * Only useful when {@link #Ranges|Ranges} are used.
            * @event
            * @name "hideCalendar.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('hideCalendar.daterangepicker', this);
        },

        /**
        * Set date values after user selected a date
        * @param {external:jQuery} e - The Event target
        * @private
        */
        clickRange: function (e) {
            var label = e.target.getAttribute('data-range-key');
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];
                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }

                if (!this.alwaysShowCalendars)
                    this.hideCalendars();
                this.clickApply();
            }
        },

        /**
        * Move calendar to previous month
        * @param {external:jQuery} e - The Event target
        * @private
        */
        clickPrev: function (e) {
            var cal = $(e.target).parents('.drp-calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month = this.leftCalendar.month.minus({ month: 1 });
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
            } else {
                this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
            }
            this.updateCalendars();
        },

        /**
        * Move calendar to next month
        * @param {external:jQuery} e - The Event target
        * @private
        */
        clickNext: function (e) {
            var cal = $(e.target).parents('.drp-calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
            } else {
                this.rightCalendar.month = this.rightCalendar.month.plus({ month: 1 });
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
            }
            this.updateCalendars();
        },

        /**
        * User hovers over date values
        * @param {external:jQuery} e - The Event target
        * @private
        */
        hoverDate: function (e) {

            //ignore dates that can't be selected
            if (!$(e.target).hasClass('available')) return;

            let title = $(e.target).attr('data-title');
            const row = title.substring(1, 2);
            const col = title.substring(3, 4);
            const cal = $(e.target).parents('.drp-calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

            //highlight the dates between the start date and the date being hovered as a potential end date
            const leftCalendar = this.leftCalendar;
            const rightCalendar = this.rightCalendar;
            const startDate = this.startDate;
            const initalMonth = this.initalMonth;
            if (!this.endDate) {
                this.container.find('.drp-calendar tbody td').each(function (index, el) {

                    //skip week numbers, only look at dates
                    if ($(el).hasClass('week')) return;

                    const title = $(el).attr('data-title');
                    const row = title.substring(1, 2);
                    const col = title.substring(3, 4);
                    const cal = $(el).parents('.drp-calendar');
                    const dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                    if (!startDate && initalMonth) {
                        $(el).removeClass('in-range');
                    } else {
                        if ((dt > startDate) && dt < date || dt.hasSame(date, 'day')) {
                            $(el).addClass('in-range');
                        } else {
                            $(el).removeClass('in-range');
                        }
                    }

                });
            }

        },

        /**
        * User hovers over ranges
        * @param {external:jQuery} e - The Event target
        * @private
        */
        hoverRange: function (e) {
            // Not tested yet
            const label = e.target.getAttribute('data-range-key');
            const dates = this.ranges[label];
            const leftCalendar = this.leftCalendar;
            const rightCalendar = this.rightCalendar;

            this.container.find('.drp-calendar tbody td').each(function (index, el) {
                //skip week numbers, only look at dates
                if ($(el).hasClass('week')) return;

                const title = $(el).attr('data-title');
                const row = title.substring(1, 2);
                const col = title.substring(3, 4);
                const cal = $(el).parents('.drp-calendar');
                const dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                if (dates == null) {
                    // Hover over custom range
                    $(el).removeClass('in-range');
                    $(el).removeClass('start-date');
                    $(el).removeClass('end-date');
                } else {
                    if (dt.hasSame(dates[0], 'day')) {
                        $(el).addClass('start-date');
                    } else if (dt.hasSame(dates[1], 'day')) {
                        $(el).addClass('end-date');
                    } else if (dt.startOf('day') > dates[0].startOf('day') && dt.startOf('day') < dates[1].startOf('day')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }
                }

            });
        },

        /**
        * User clicked a date
        * @param {external:jQuery} e - The Event target
        * @emits "dateChange.daterangepicker"
        * @private
        */
        clickDate: function (e) {

            if (!$(e.target).hasClass('available')) return;

            var title = $(e.target).attr('data-title');
            var row = title.substring(1, 2);
            var col = title.substring(3, 4);
            var cal = $(e.target).parents('.drp-calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            let side;

            //
            // this function needs to do a few things:
            // * alternate between selecting a start and end date for the range,
            // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
            // * if autoapply is enabled, and an end date was chosen, apply the selection
            // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
            // * if one of the inputs above the calendars was focused, cancel that manual input
            //

            if (this.endDate || !this.startDate || date < this.startDate.startOf('day')) { //picking start
                if (this.timePicker) {
                    let hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.left .hourselect option:last').val(), 10);

                    let minute = 0;
                    if (this.timePickerOpts.showMinutes) {
                        minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
                    }

                    let second = 0;
                    if (this.timePickerOpts.showSeconds) {
                        second = parseInt(this.container.find('.left .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.left .secondselect option:last').val(), 10);
                    }

                    date = date.set({ hour: hour, minute: minute, second: second });
                }
                this.endDate = null;
                this.setStartDate(date, true);
                side = 'start';
            } else if (!this.endDate && date < this.startDate) {
                //special case: clicking the same date for start/end,
                //but the time of the end date is before the start date
                this.setEndDate(this.startDate, true);
                side = 'end';
            } else { // picking end
                if (this.timePicker) {
                    let hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.right .hourselect option:last').val(), 10);

                    let minute = 0;
                    if (this.timePickerOpts.showMinutes) {
                        minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
                    }

                    let second = 0;
                    if (this.timePickerOpts.showSeconds) {
                        second = parseInt(this.container.find('.right .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.right .secondselect option:last').val(), 10);
                    }

                    date = date.set({ hour: hour, minute: minute, second: second });
                }
                this.setEndDate(date, true);
                if (this.autoApply) {
                    this.calculateChosenLabel();
                    this.clickApply();
                }
                side = 'end';
            }

            if (this.singleDatePicker) {
                this.setEndDate(this.startDate, true);
                if (!this.timePicker && this.autoApply)
                    this.clickApply();
                side = null;
            }

            this.updateView();

            //This is to cancel the blur event handler if the mouse was in one of the inputs
            e.stopPropagation();

            if (this.autoUpdateInput)
                this.updateElement();

            /**
            * Emitted when the date changed. Does not trigger when time is changed, 
            * use {@link #event_timeChange.daterangepicker|"timeChange.daterangepicker"} to handle it
            * @event
            * @name "dateChange.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            * @param {string} side - Either `'start'` or `'end'` indicating whether startDate or endDate was changed. `null` when `singleDatePicker: true`
            */
            this.element.trigger('dateChange.daterangepicker', [this, side]);

        },

        /**
        * Hightlight selected predefined range in calendar
        * @private
        */
        calculateChosenLabel: function () {

            // If selected range from calendar matches any custom range, then highlight it
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                var unit = this.timePicker ? 'hour' : 'day';
                if (this.timePicker) {
                    if (this.timePickerOpts.showMinutes) {
                        unit = 'minute';
                    } else if (this.timePickerOpts.showSeconds) {
                        unit = 'second';
                    }
                }
                if (this.startDate.startOf(unit) == this.ranges[range][0].startOf(unit) == this.endDate.startOf(unit) == this.ranges[range][1].startOf(unit)) {
                    customRange = false;
                    this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').attr('data-range-key');
                    break;
                }
                i++;
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenLabel = this.container.find('.ranges li:last').addClass('active').attr('data-range-key');
                } else {
                    this.chosenLabel = null;
                }
                this.showCalendars();
            }
        },

        /**
        * User clicked `Apply` button
        * @param {external:jQuery} e - The Event target
        * @emits "apply.daterangepicker"
        * @private
        */
        clickApply: function (e) {
            this.hide();
            /**
            * Emitted when the `Apply` button is clicked, or when a predefined {@link #Ranges|Ranges} is clicked 
            * @event
            * @name "apply.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('apply.daterangepicker', this);
        },

        /**
        * User clicked `Cancel` button
        * @param {external:jQuery} e - The Event target
        * @emits "cancel.daterangepicker"
        * @private
        */
        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            /**
            * Emitted when the `Cancel` button is clicked
            * @event
            * @name "cancel.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            */
            this.element.trigger('cancel.daterangepicker', this);
        },

        /**
        * Calender month moved
        * @param {external:jQuery} e - The Event target
        * @private
        */
        monthOrYearChanged: function (e) {
            var isLeft = $(e.target).closest('.drp-calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.drp-calendar.' + leftOrRight);

            // Month must be Number for new DateTime versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            if (!isLeft) {
                if (year < this.startDate.year || (year == this.startDate.year && month < this.startDate.month)) {
                    month = this.startDate.month;
                    year = this.startDate.year;
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
                this.leftCalendar.month = this.leftCalendar.month.set({ year: year, month: month });
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.plus({ month: 1 });
            } else {
                this.leftCalendar.month = this.rightCalendar.month.set({ year: year, month: month });
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.minus({ month: 1 });
            }
            this.updateCalendars();
        },

        /**
        * User clicked a time
        * @param {external:jQuery} e - The Event target
        * @emits "timeChange.daterangepicker"
        * @private
        */
        timeChanged: function (e) {
            var cal = $(e.target).closest('.drp-calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            if (isNaN(hour))
                hour = parseInt(cal.find('.hourselect option:last').val(), 10);

            if (!this.timePicker24Hour) {
                const ampm = cal.find('.ampmselect').val();
                if (ampm == null)
                    cal.find('.ampmselect option:last').val();
                if (ampm != DateTime.fromFormat(`${hour}`, 'H').toFormat('a', { locale: 'en-US' })) {
                    cal.find('.hourselect > option').each(function () {
                        const hidden = $(this).attr('hidden') || false;
                        $(this).attr('hidden', hidden);
                    });
                    const h = DateTime.fromFormat(`${hour}`, 'H').toFormat('h')
                    hour = DateTime.fromFormat(`${h}${ampm}`, 'ha', { locale: 'en-US' }).hour;
                }
            }

            var minute = 0;
            if (this.timePickerOpts.showMinutes) {
                minute = parseInt(cal.find('.minuteselect').val(), 10);
                if (isNaN(minute))
                    minute = parseInt(cal.find('.minuteselect option:last').val(), 10);
            }

            var second = 0;
            if (this.timePickerOpts.showSeconds) {
                second = parseInt(cal.find('.secondselect').val(), 10);
                if (isNaN(second))
                    second = parseInt(cal.find('.secondselect option:last').val(), 10);
            }

            if (isLeft) {
                if (this.startDate) {
                    let start = this.startDate.set({ hour: hour, minute: minute, second: second });
                    this.setStartDate(start, true);
                }
                if (this.singleDatePicker) {
                    this.endDate = this.startDate;
                } else if (this.endDate && this.endDate.hasSame(start, 'day') && this.endDate < start) {
                    this.setEndDate(start, true);
                }
            } else if (this.endDate) {
                let end = this.endDate.set({ hour: hour, minute: minute, second: second });
                this.setEndDate(end, true);
            }

            //update the calendars so all clickable dates reflect the new time component
            this.updateCalendars();

            //update the form inputs above the calendars with the new time
            this.updateFormInputs();

            //re-render the time pickers because changing one selection can affect what's enabled in another
            this.renderTimePicker('left');
            this.renderTimePicker('right');

            if (this.autoUpdateInput)
                this.updateElement();

            /**
            * Emitted when the time changed. Does not trigger when date is changed
            * @event
            * @name "timeChange.daterangepicker"
            * @param {DateRangePicker} this - The daterangepicker object
            * @param {string} side - Either `'start'` or `'end'` indicating whether startDate or endDate was changed
            */
            this.element.trigger('timeChange.daterangepicker', [this, this.singleDatePicker ? null : (isLeft ? 'start' : 'stop')]);
        },

        /**
        * Update the picker with value from attached `<input>` element.
        * Error is written to console if input string cannot be parsed as a valid date/range
        * @param {external:jQuery} e - The Event target
        * @private
        */
        elementChanged: function (e) {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            const dateString = this.element.val().split(this.locale.separator);
            var start = null, end = null;
            const format = typeof this.locale.format === 'string' ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);

            if (dateString.length === 2) {
                start = DateTime.fromFormat(dateString[0], format, { locale: DateTime.now().locale });
                end = DateTime.fromFormat(dateString[1], format, { locale: DateTime.now().locale });
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = DateTime.fromFormat(this.element.val(), format, { locale: DateTime.now().locale });
                end = start;
            }

            if (!start.isValid || !end.isValid) {
                console.error(`Input string '${dateString}' is not valid`);
                return;
            }

            this.setStartDate(start, false);
            this.setEndDate(end, false);
            this.updateView();
        },

        /**
        * Handles key press, IE 11 compatibility
        * @param {external:jQuery} e - The Event target
        * @private
        */
        keydown: function (e) {
            //hide on tab or enter
            if ((e.keyCode === 9) || (e.keyCode === 13)) {
                this.hide();
            }

            //hide on esc and prevent propagation
            if (e.keyCode === 27) {
                e.preventDefault();
                e.stopPropagation();

                this.hide();
            }
        },

        /**
        * Update attached `<input>` element with selected value
        * @emits external:change
        */
        updateElement: function () {
            if (this.startDate == null && this.initalMonth)
                return;

            if (this.element.is('input')) {
                let newValue = typeof this.locale.format === 'object' ? this.startDate.toLocaleString(this.locale.format) : this.startDate.toFormat(this.locale.format);
                if (!this.singleDatePicker) {
                    newValue += this.locale.separator
                    if (this.endDate)
                        newValue += typeof this.locale.format === 'object' ? this.endDate.toLocaleString(this.locale.format) : this.endDate.toFormat(this.locale.format);
                }

                if (newValue !== this.element.val())
                    this.element.val(newValue).trigger('change');
            }
        },

        /**
        * Removes the picker from document
        */
        remove: function () {
            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData();
        }

    };

    /**
    * @callback callback
    * @param {external:DateTime} startDate - Selected startDate
    * @param {external:DateTime} endDate - Selected endDate 
    * @param {string} range
    */

    /**
    * Initiate a new DateRangePicker
    * @name DateRangePicker.daterangepicker
    * @function
    * @param {Options} options - Object to configure the DateRangePicker
    * @param {callback} callback - Callback function executed when date is changed.<br/>
    * Callback function is executed if selected date values has changed, before picker is hidden and before the attached `<input>` element is updated. 
    * As alternative listen to the {@link #event_apply.daterangepicker|"apply.daterangepicker"} event
    * @returns DateRangePicker
    */
    $.fn.daterangepicker = function (options, callback) {
        var implementOptions = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
        this.each(function () {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, implementOptions, callback));
        });
        return this;
    };

    return DateRangePicker;

}));


/** @external jQuery 
@see {@link https://api.jquery.com/Types/#jQuery/|jQuery} */

/** @external Selector
@see {@link https://api.jquery.com/category/selectors/|jQuery Selector} */

/** @external change
@see {@link https://api.jquery.com/change/|change event} */

/** @external DateTime
@see {@link https://moment.github.io/luxon/api-docs/index.html#datetime|DateTime} */

/** @external Duration
@see {@link https://moment.github.io/luxon/api-docs/index.html#duration|Duration} */

/** @external Date
@see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date} */

/** @external ISO-8601
@see {@link https://en.wikipedia.org/wiki/ISO_8601} */

