/**
* @version: 4.1
* @author: Wernfried Domscheit
* @copyright: Copyright (c) 2025 Wernfried Domscheit. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://github.com/Wernfried/daterangepicker
*/
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

    var DateRangePicker = function (element, options, cb) {

        //default settings for options
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = DateTime.now().startOf('day');
        this.endDate = DateTime.now().endOf('day');
        this.minDate = null;
        this.maxDate = null;
        this.maxSpan = null;
        this.minSpan = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.minYear = DateTime.now().minus({ year: 100 }).year;
        this.maxYear = DateTime.now().plus({ year: 100 }).year;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.showCustomRangeLabel = true;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerStepSize = Duration.fromObject({ minutes: 1 });
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.ranges = {};

        this.opens = 'right';
        if (this.element.hasClass('pull-right'))
            this.opens = 'left';

        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';

        this.buttonClasses = 'btn btn-sm';
        this.applyButtonClasses = 'btn-primary';
        this.cancelButtonClasses = 'btn-default';

        this.locale = {
            direction: 'ltr',
            format: DateTime.DATE_SHORT,
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: Info.weekdays('short'),
            monthNames: Info.months('long'),
            firstDay: Info.getStartOfWeek(),
            durationLabel: null
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

        if (typeof options.locale === 'object') {

            if (typeof options.locale.direction === 'string')
                this.locale.direction = options.locale.direction;

            if (['string', 'object'].includes(typeof options.locale.format))
                this.locale.format = options.locale.format;

            if (typeof options.locale.separator === 'string')
                this.locale.separator = options.locale.separator;

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

            if (typeof options.locale.applyLabel === 'string')
                this.locale.applyLabel = options.locale.applyLabel;

            if (typeof options.locale.cancelLabel === 'string')
                this.locale.cancelLabel = options.locale.cancelLabel;

            if (typeof options.locale.weekLabel === 'string')
                this.locale.weekLabel = options.locale.weekLabel;

            if (typeof options.locale.customRangeLabel === 'string') {
                //Support unicode chars in the custom range name.
                var elem = document.createElement('textarea');
                elem.innerHTML = options.locale.customRangeLabel;
                var rangeHtml = elem.value;
                this.locale.customRangeLabel = rangeHtml;
            }

            if (['string', 'object'].includes(typeof options.locale.durationLabel) && options.locale.durationLabel != null)
                this.locale.durationLabel = durationLabel;
        }
        this.container.addClass(this.locale.direction);

        if (typeof options.singleDatePicker === 'boolean')
            this.singleDatePicker = options.singleDatePicker;

        if (typeof options.timePicker === 'boolean')
            this.timePicker = options.timePicker;

        if (typeof options.timePicker24Hour === 'boolean')
            this.timePicker24Hour = options.timePicker24Hour;

        if (typeof options.timePickerSeconds === 'boolean')  // backward compatibility            
            this.timePickerStepSize = Duration.fromObject({ [options.timePickerSeconds ? 'seconds' : 'minutes']: 1 });
        if (typeof options.timePickerIncrement === 'number')  // backward compatibility
            this.timePickerStepSize = Duration.fromObject({ minutes: options.timePickerIncrement });

        if (['string', 'object'].includes(typeof options.timePickerStepSize)) {
            let duration = this.timePickerStepSize;
            if (options.timePickerStepSize instanceof Duration && options.timePickerStepSize.isValid) {
                duration = options.timePickerStepSize;
            } else if (Duration.fromISO(options.timePickerStepSize).isValid) {
                duration = Duration.fromISO(options.timePickerStepSize);
            } else if (typeof options[opt] === 'number' && Duration.fromObject({ seconds: this.timePickerStepSize }).isValid) {
                duration = Duration.fromObject({ seconds: this.timePickerStepSize });
            } else {
                console.error(`Option 'timePickerStepSize' is not valid`);
            };
            var valid = [];
            for (let unit of ['minutes', 'seconds'])
                valid.push(...[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].map(x => { return Duration.fromObject({ [unit]: x }) }));
            valid.push(...[1, 2, 3, 4, 6].map(x => { return Duration.fromObject({ hours: x }) }));
            if (this.timePicker24Hour)
                valid.push(...[8, 12].map(x => { return Duration.fromObject({ hours: x }) }));

            if (valid.some(x => duration.rescale().equals(x))) {
                if (this.maxSpan && duration > this.maxSpan) {
                    console.error(`Option 'timePickerStepSize' ${JSON.stringify(duration.toObject())} must be smaller than 'maxSpan'`);
                } else if (this.minSpan && duration < this.minSpan) {
                    console.error(`Option 'timePickerStepSize' ${JSON.stringify(duration.toObject())} must be greater than 'minSpan'`);
                } else {
                    this.timePickerStepSize = duration.rescale();
                }
            } else {
                console.error(`Option 'timePickerStepSize' ${JSON.stringify(duration.toObject())} is not valid`);
            }
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
                console.error(`Ignore option 'minSpan' and 'maxSpan', because 'minSpan' must be smaller than 'maxSpan'`);
            }
        }

        for (let opt of ['startDate', 'endDate', 'minDate', 'maxDate']) {
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
                    console.error(`Option '${key}' must be a luxon.DateTime or Date or string`);
                }
            } else if (typeof options[opt] === 'string') {
                if (DateTime.fromISO(options[opt]).isValid) {
                    this[opt] = DateTime.fromISO(options[opt]);
                } else if (typeof this.locale.format === 'string' && DateTime.fromFormat(options[opt], this.locale.format).isValid) {
                    this[opt] = DateTime.fromFormat(options[opt], this.locale.format);
                } else {
                    console.error(`Option '${key}' is not a valid string`);
                }
            }
            if (!this.timePicker && ['minDate', 'maxDate'].includes(opt)) {
                this[opt] = opt == 'minDate' ? this[opt].startOf('day') : this[opt].endOf('day');
            } else {
                const secs = this.timePickerStepSize.as('seconds');
                this[opt] = DateTime.fromSeconds(secs * Math.round(this[opt].toSeconds() / secs));
            }
        }
        if (this.singleDatePicker)
            this.endDate = this.startDate;

        // Do some sanity checks on startDate for minDate, maxDate
        if (this.minDate && this.startDate < this.minDate) {
            if (this.timePicker) {
                while (this.startDate < this.minDate)
                    this.startDate = this.startDate.plus(this.timePickerStepSize);
            } else {
                this.startDate = this.minDate;
            }
            console.warn(`Set startDate to ${this.startDate.toISO()} due to 'minDate'`);
        } else if (this.maxDate && this.startDate > this.maxDate) {
            if (this.timePicker) {
                while (this.startDate > this.minDate)
                    this.startDate = this.startDate.minus(this.timePickerStepSize);
            } else {
                this.startDate = this.maxDate;
            }
            console.warn(`Set startDate to ${this.startDate.toISO()} due to 'maxDate'`);
        }

        // Do some sanity checks on endDate for minDate, maxDate
        if (!this.singleDatePicker) {
            if (this.minDate && this.endDate < this.minDate) {
                if (this.timePicker) {
                    while (this.endDate < this.minDate)
                        this.endDate = this.endDate.plus(this.timePickerStepSize);
                } else {
                    this.endDate = this.minDate;
                }
                console.warn(`Set endDate to ${this.endDate.toISO()} due to 'minDate'`);
            } else if (this.maxDate && this.endDate > this.maxDate) {
                if (this.timePicker) {
                    while (this.endDate > this.minDate)
                        this.endDate = this.endDate.minus(this.timePickerStepSize);
                } else {
                    this.endDate = this.maxDate;
                }
                console.warn(`Set endDate to ${this.endDate.toISO()} due to 'maxDate'`);
            }
        }

        if (typeof options.applyButtonClasses === 'string')
            this.applyButtonClasses = options.applyButtonClasses;

        if (typeof options.applyClass === 'string') //backwards compat
            this.applyButtonClasses = options.applyClass;

        if (typeof options.cancelButtonClasses === 'string')
            this.cancelButtonClasses = options.cancelButtonClasses;

        if (typeof options.cancelClass === 'string') //backwards compat
            this.cancelButtonClasses = options.cancelClass;

        if (typeof options.opens === 'string')
            this.opens = options.opens;

        if (typeof options.drops === 'string')
            this.drops = options.drops;

        if (typeof options.showWeekNumbers === 'boolean')
            this.showWeekNumbers = options.showWeekNumbers;

        if (typeof options.showISOWeekNumbers === 'boolean')
            this.showISOWeekNumbers = options.showISOWeekNumbers;

        if (Array.isArray(options.buttonClasses)) {
            this.buttonClasses = options.buttonClasses.join(' ')
        } else if (typeof options.buttonClasses === 'string') {
            this.buttonClasses = options.buttonClasses;
        }

        if (typeof options.showDropdowns === 'boolean')
            this.showDropdowns = options.showDropdowns;

        if (typeof options.minYear === 'number')
            this.minYear = options.minYear;

        if (typeof options.maxYear === 'number')
            this.maxYear = options.maxYear;

        if (typeof options.showCustomRangeLabel === 'boolean')
            this.showCustomRangeLabel = options.showCustomRangeLabel;

        if (typeof options.autoApply === 'boolean')
            this.autoApply = options.autoApply;

        if (typeof options.autoUpdateInput === 'boolean')
            this.autoUpdateInput = options.autoUpdateInput;

        if (typeof options.linkedCalendars === 'boolean')
            this.linkedCalendars = options.linkedCalendars;

        if (typeof options.isInvalidDate === 'function')
            this.isInvalidDate = options.isInvalidDate;

        if (typeof options.isInvalidTime === 'function')
            this.isInvalidTime = options.isInvalidTime;

        if (typeof options.isCustomDate === 'function')
            this.isCustomDate = options.isCustomDate;

        if (typeof options.alwaysShowCalendars === 'boolean')
            this.alwaysShowCalendars = options.alwaysShowCalendars;

        // update day names order to firstDay
        if (this.locale.firstDay != 1) {
            let iterator = this.locale.firstDay;
            while (iterator > 1) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }

        //if no start/end dates set, check if the input element contains initial values
        if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
            if ($(this.element).is(':text')) {
                let start, end;
                const val = $(this.element).val();
                const split = val.split(this.locale.separator);

                const format = typeof this.locale.format === 'string' ? typeof this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                if (split.length == 2) {
                    start = DateTime.fromFormat(split[0], format, { locale: DateTime.now().locale });
                    end = DateTime.fromFormat(split[1], format, { locale: DateTime.now().locale });
                } else if (this.singleDatePicker && val !== "") {
                    start = DateTime.fromFormat(val, format, { locale: DateTime.now().locale });
                    end = DateTime.fromFormat(val, format, { locale: DateTime.now().locale });
                }

                if (start.isValid && end.isValid) {
                    this.setStartDate(start, false);
                    this.setEndDate(end, false);
                }
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
                        console.error(`Option 'ranges.${range}' is not a valid string or DateTime`);
                    }
                }
                if (['string', 'object'].includes(typeof options.ranges[range][1])) {
                    if (options.ranges[range][1] instanceof DateTime && options.ranges[range][1].isValid) {
                        end = options.ranges[range][1];
                    } else if (typeof options.ranges[range][1] === 'string' && DateTime.fromISO(options.ranges[range][1]).isValid) {
                        end = DateTime.fromISO(options.ranges[range][1]);
                    } else {
                        console.error(`Option 'ranges.${range}' is not a valid string or DateTime`);
                    }
                }
                if (start == null || end == null)
                    continue;

                if (this.timePicker) {
                    // Round time to step size                    
                    const secs = this.timePickerStepSize.as('seconds');
                    start = DateTime.fromSeconds(secs * Math.round(start.toSeconds() / secs));
                    end = DateTime.fromSeconds(secs * Math.round(end.toSeconds() / secs));
                }

                // If the start falls below those allowed by the minDate option, shorten the range to the allowable period.
                if (this.minDate && start < this.minDate) {
                    if (this.timePicker) {
                        while (start < this.minDate)
                            start = start.plus(this.timePickerStepSize);
                    } else {
                        start = this.minDate;
                    }
                    console.warn(`Set start of range '${range}' to ${start.toISO()} due to 'minDate'`);
                }

                // If the end exceeds the maxDate option, shorten the range to the allowable period.
                if (this.maxDate && end > this.maxDate) {
                    if (this.timePicker) {
                        while (end > this.minDate)
                            end = end.minus(this.timePickerStepSize);
                    } else {
                        end = this.maxDate;
                    }
                    console.warn(`Set end of range '${range}' to ${end.toISO()} due to 'maxDate'`);
                }

                // As written in README.md minSpan and maxSpan are not evaluated.
                // However, if someone may request it, then uncomment the block:
                /*
                if (this.maxSpan) {
                    // If the end date exceeds those allowed by the maxSpan option, shorten the range to the allowable period.
                    const maxDate = start.plus(this.maxSpan);
                    if (end > maxDate) {
                        if (this.timePicker) {
                            while (end > maxDate)
                                end = end.minus(this.timePickerStepSize);
                        } else {
                            end = maxDate;
                        }
                        console.warn(`Set end of range '${range}' to ${end.toISO()} due to 'maxSpan'`);
                    }
                }

                if (this.minSpan) {
                    // If the end date falls below those allowed by the minSpan option, expand the range to the allowable period.
                    const minDate = start.plus(this.minSpan);
                    if (end < minDate) {
                        if (this.minDate && end > this.minDate) {
                            console.warn(`Skip range '${range}' because option 'minDate' contradicts to option 'minSpan'`);
                            continue;
                        } else {
                            if (this.timePicker) {
                                while (end < minDate)
                                    end = end.plus(this.timePickerStepSize);
                            } else {
                                end = minDate;
                            }
                            console.warn(`Set end of range '${range}' to ${end.toISO()} due to 'minSpan'`);
                        }
                    }
                }
                */

                //Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;

                this.ranges[rangeHtml] = [start, end];
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
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
            this.container.find('.calendar-time').hide();
        }

        //can't be used together for now
        if (this.timePicker && this.autoApply)
            this.autoApply = false;

        if (this.autoApply) {
            this.container.addClass('auto-apply');
        }

        if (this.singleDatePicker) {
            this.container.addClass('single');
            this.container.find('.drp-calendar.left').addClass('single');
            this.container.find('.drp-calendar.left').show();
            this.container.find('.drp-calendar.right').hide();
            if (!this.timePicker && this.autoApply) {
                this.container.addClass('auto-apply');
            }
        }

        if ((typeof options.ranges === 'undefined' && !this.singleDatePicker) || this.alwaysShowCalendars) {
            this.container.addClass('show-calendar');
        }

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

        setStartDate: function (startDate, isValid) {
            // If isValid == true, then value is selected from calendar and stepSize, minDate, maxDate are already considered
            if (isValid === undefined || !isValid) {
                if (typeof startDate === 'object') {
                    if (startDate instanceof DateTime && startDate.isValid) {
                        this.startDate = startDate;
                    } else if (startDate instanceof Date) {
                        this.startDate = DateTime.fromJSDate(startDate);
                    } else {
                        throw RangeError(`Option '${key}' must be a luxon.DateTime or Date or string`);
                    }
                } else if (typeof startDate === 'string') {
                    const format = typeof this.locale.format === 'string' ? typeof this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                    if (DateTime.fromISO(startDate).isValid) {
                        this.startDate = DateTime.fromISO(startDate);
                    } else if (DateTime.fromFormat(startDate, format, { locale: DateTime.now().locale }).isValid) {
                        this.startDate = DateTime.fromFormat(startDate, format, { locale: DateTime.now().locale });
                    } else {
                        throw RangeError(`Option '${key}' is not a valid string`);
                    }
                }
            } else {
                this.startDate = startDate;
            }

            if (isValid === undefined || !isValid) {
                if (this.timePicker) {
                    // Round time to step size
                    const secs = this.timePickerStepSize.as('seconds');
                    this.startDate = DateTime.fromSeconds(secs * Math.round(this.startDate.toSeconds() / secs));
                } else {
                    this.startDate = this.startDate.startOf('day');
                }

                // Do some sanity checks on minDate, maxDate
                if (this.minDate && this.startDate < this.minDate) {
                    if (this.timePicker) {
                        while (this.startDate < this.minDate)
                            this.startDate = this.startDate.plus(this.timePickerStepSize);
                    } else {
                        this.startDate = this.minDate;
                    }
                    console.warn(`Set startDate to ${this.startDate.toISO()} due to 'minDate'`);
                } else if (this.maxDate && this.startDate > this.maxDate) {
                    if (this.timePicker) {
                        while (this.startDate > this.minDate)
                            this.startDate = this.startDate.minus(this.timePickerStepSize);
                    } else {
                        this.startDate = this.maxDate.startOf('day');
                    }
                    console.warn(`Set startDate to ${this.startDate.toISO()} due to 'maxDate'`);
                }
            }

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        setEndDate: function (endDate, isValid) {
            // If isValid == true, then value is selected from calendar and stepSize, minDate, maxDate are already considered
            if (isValid === undefined || !isValid) {
                if (typeof endDate === 'object') {
                    if (endDate instanceof DateTime && endDate.isValid) {
                        this.endDate = endDate;
                    } else if (endDate instanceof Date) {
                        this.endDate = DateTime.fromJSDate(endDate);
                    } else {
                        throw RangeError(`Option '${key}' must be a luxon.DateTime or Date or string`);
                    }
                } else if (typeof endDate === 'string') {
                    const format = typeof this.locale.format === 'string' ? typeof this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
                    if (DateTime.fromISO(endDate).isValid) {
                        this.endDate = DateTime.fromISO(endDate);
                    } else if (DateTime.fromFormat(endDate, format, { locale: DateTime.now().locale }).isValid) {
                        this.endDate = DateTime.fromFormat(endDate, format, { locale: DateTime.now().locale });
                    } else {
                        throw RangeError(`Option '${key}' is not a valid string`);
                    }
                }
            } else {
                this.endDate = endDate;
            }

            if (isValid === undefined || !isValid) {
                if (this.timePicker) {
                    // Round time to step size
                    const secs = this.timePickerStepSize.as('seconds');
                    this.endDate = DateTime.fromSeconds(secs * Math.round(this.endDate.toSeconds() / secs));
                } else {
                    this.endDate = this.endDate.endOf('day');
                }

                // Do some sanity checks on minDate, maxDate
                if (this.minDate && this.endDate < this.minDate) {
                    if (this.timePicker) {
                        while (this.endDate < this.minDate)
                            this.endDate = this.endDate.plus(this.timePickerStepSize);
                    } else {
                        this.endDate = this.minDate;
                    }
                    console.warn(`Set endDate to ${this.endDate.toISO()} due to 'minDate'`);
                } else if (this.maxDate && this.endDate > this.maxDate) {
                    if (this.timePicker) {
                        while (this.endDate > this.minDate)
                            this.endDate = this.endDate.minus(this.timePickerStepSize);
                    } else {
                        this.endDate = this.maxDate.endOf('day');
                    }
                    console.warn(`Set endDate to ${this.endDate.toISO()} due to 'maxDate'`);
                }

                if (this.maxSpan) {
                    // If the end date exceeds those allowed by the maxSpan option, shorten the range to the allowable period.
                    const maxDate = this.startDate.plus(this.maxSpan);
                    if (this.endDate > maxDate) {
                        if (this.timePicker) {
                            while (this.endDate > maxDate)
                                this.endDate = this.endDate.minus(this.timePickerStepSize);
                        } else {
                            this.endDate = maxDate.endOf('day');
                        }
                        console.warn(`Set endDate to ${this.endDate.toISO()} due to 'maxSpan'`);
                    }
                }

                if (this.minSpan) {
                    // If the end date falls below those allowed by the minSpan option, expand the range to the allowable period.
                    const minDate = this.startDate.plus(this.minSpan);
                    if (this.endDate < minDate) {
                        if (this.minDate && this.endDate > this.minDate) {
                            throw RangeError(`Option 'minDate' contradicts to option 'minSpan'`);
                        } else {
                            if (this.timePicker) {
                                while (this.endDate < minDate)
                                    this.endDate = this.endDate.plus(this.timePickerStepSize);
                            } else {
                                this.endDate = minDate.endOf('day');
                            }
                            console.warn(`Set endDate to ${this.endDate.toISO()} due to 'minSpan'`);
                        }
                    }
                }

            }

            this.previousRightTime = this.endDate;

            if (this.locale.durationLabel && !this.singleDatePicker) {
                const duration = this.endDate.diff(this.startDate).rescale();
                if (typeof this.locale.durationLabel === 'object') {
                    this.container.find('.drp-duration-label').html(duration.toHuman(this.locale.durationLabel));
                } else {
                    this.container.find('.drp-duration-label').html(duration.toFormat(this.locale.durationLabel));
                }
            }
            if (typeof this.locale.format === 'object') {
                this.container.find('.drp-selected').html(this.startDate.toLocaleString(this.locale.format) + this.locale.separator + this.endDate.toLocaleString(this.locale.format));
            } else {
                this.container.find('.drp-selected').html(this.startDate.toFormat(this.locale.format) + this.locale.separator + this.endDate.toFormat(this.locale.format));
            }

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        setPeriod: function (startDate, endDate) {
            if (this.singleDatePicker) {
                this.setStartDate(startDate, false);
            } else {
                this.setStartDate(startDate, false);
                this.setEndDate(endDate, false);
            }
        },

        isInvalidDate: function () {
            return false;
        },

        isInvalidTime: function () {
            return false;
        },

        isCustomDate: function () {
            return false;
        },

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
                if (this.locale.durationLabel && !this.singleDatePicker) {
                    const duration = this.endDate.diff(this.startDate).rescale();
                    if (typeof this.locale.durationLabel === 'object') {
                        this.container.find('.drp-duration-label').html(duration.toHuman(this.locale.durationLabel));
                    } else {
                        this.container.find('.drp-duration-label').html(duration.toFormat(this.locale.durationLabel));
                    }
                }
                if (typeof this.locale.format === 'object') {
                    this.container.find('.drp-selected').html(this.startDate.toLocaleString(this.locale.format) + this.locale.separator + this.endDate.toLocaleString(this.locale.format));
                } else {
                    this.container.find('.drp-selected').html(this.startDate.toFormat(this.locale.format) + this.locale.separator + this.endDate.toFormat(this.locale.format));
                }
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
        },

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
                if (!this.leftCalendar.month.hasSame(this.startDate, 'month') && !this.rightCalendar.month.hasSame(this.startDate, 'month')) {
                    this.leftCalendar.month = this.startDate.startOf('month');
                    this.rightCalendar.month = this.startDate.startOf('month').plus({ month: 1 });
                }
            }
            if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
                this.rightCalendar.month = this.maxDate.startOf('month');
                this.leftCalendar.month = this.maxDate.startOf('month').minus({ month: 1 });
            }
        },

        updateCalendars: function () {

            if (this.timePicker) {
                var hour, minute, second;
                if (this.endDate) {
                    hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.left .hourselect option:last').val(), 10);

                    minute = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                        minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
                    }

                    second = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
                        second = parseInt(this.container.find('.left .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.left .secondselect option:last').val(), 10);
                    }
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                } else {
                    hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.right .hourselect option:last').val(), 10);

                    minute = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                        minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
                    }

                    second = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
                        second = parseInt(this.container.find('.right .secondselect').val(), 10);
                        if (isNaN(second))
                            second = parseInt(this.container.find('.right .secondselect option:last').val(), 10);
                    }

                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
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

        renderCalendar: function (side) {

            //
            // Build the matrix of dates that will populate the calendar
            //

            var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            calendar.firstDay = calendar.month.startOf('month');
            calendar.lastDay = calendar.month.endOf('month').startOf('day');

            for (var i = 0; i < 6; i++)
                calendar[i] = [];

            // compute the startDay in month
            let theDate = calendar.month.startOf('month').minus({ day: 1 });
            while (theDate.weekday != this.locale.firstDay)
                theDate = theDate.minus({ day: 1 });

            var row, col;
            for (let i = 0, col = 0, row = 0; i < 42; i++, col++, theDate = theDate.plus({ day: 1 })) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = theDate;

                if (this.minDate && calendar[row][col].hasSame(this.minDate, 'month') && calendar[row][col] < this.minDate && side == 'left')
                    calendar[row][col] = this.minDate;

                if (this.maxDate && calendar[row][col].hasSame(this.maxDate, 'month') && calendar[row][col] > this.maxDate && side == 'right')
                    calendar[row][col] = this.maxDate;
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

            var dateHtml = this.locale.monthNames[calendar[1][1].month] + calendar[1][1].toFormat(" YYYY");

            if (this.showDropdowns) {
                var currentMonth = calendar[1][1].month;
                var currentYear = calendar[1][1].year;
                var maxYear = (maxDate && maxDate.year) || (this.maxYear);
                var minYear = (minDate && minDate.year) || (this.minYear);
                var inMinYear = currentYear == minYear;
                var inMaxYear = currentYear == maxYear;

                var monthHtml = '<select class="monthselect">';
                for (var m = 0; m < 12; m++) {
                    if ((!inMinYear || (minDate && m >= minDate.month)) && (!inMaxYear || (maxDate && m <= maxDate.month))) {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            ">" + this.locale.monthNames[m] + "</option>";
                    } else {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
                    }
                }
                monthHtml += "</select>";

                var yearHtml = '<select class="yearselect">';
                for (var y = minYear; y <= maxYear; y++) {
                    yearHtml += '<option value="' + y + '"' +
                        (y === currentYear ? ' selected="selected"' : '') +
                        '>' + y + '</option>';
                }
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
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                if (Info.getWeekendWeekdays().includes(index + 1)) {
                    //highlight weekend day
                    html += '<th class="weekend-day">' + dayOfWeek + '</th>';
                } else {
                    html += '<th>' + dayOfWeek + '</th>';
                }
            });

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

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].localWeekNumber + '</td>';
                else if (this.showISOWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].weekNumber + '</td>';

                for (var col = 0; col < 7; col++) {

                    var classes = [];

                    //highlight today's date
                    if (calendar[row][col].hasSame(DateTime.now(), 'day'))
                        classes.push('today');

                    //highlight weekends
                    if (Info.getWeekendWeekdays().includes(calendar[row][col].weekday))
                        classes.push('weekend');

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
                    if (calendar[row][col].hasSame(this.startDate, 'day'))
                        classes.push('active', 'start-date');

                    //highlight the currently selected end date
                    if (this.endDate != null && calendar[row][col].hasSame(this.endDatee, 'day'))
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

                    var cname = '', disabled = false;
                    for (var i = 0; i < classes.length; i++) {
                        cname += classes[i] + ' ';
                        if (classes[i] == 'disabled')
                            disabled = true;
                    }
                    if (!disabled)
                        cname += 'available';

                    html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].day + '</td>';

                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';

            this.container.find('.drp-calendar.' + side + ' .calendar-table').html(html);

        },

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
                    selected.set({ hour: !isNaN(selected.hour) ? selected.hour : timeSelector.find('.hourselect option:selected').val() });
                    selected.set({ minute: !isNaN(selected.minute) ? selected.minute : timeSelector.find('.minuteselect option:selected').val() });
                    selected.set({ second: !isNaN(selected.second) ? selected.second : timeSelector.find('.secondselect option:selected').val() });

                    if (!this.timePicker24Hour) {
                        var ampm = timeSelector.find('.ampmselect option:selected').val();
                        if (ampm === 'PM' && selected.hour < 12)
                            selected.set({ hour: selected.hour + 12 });
                        if (ampm === 'AM' && selected.hour === 12)
                            selected.set({ hour: 0 });
                    }

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

            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;

            for (var i = start; i <= end; i += this.timePickerStepSize > Duration.fromObject({ hours: 1 }) ? this.timePickerStepSize.hours : 1) {
                var i_in_24 = i;
                if (!this.timePicker24Hour)
                    i_in_24 = selected.hour >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);

                var time = selected.set({ hour: i_in_24 });
                var disabled = false;
                if (minDate && time.set({ minute: 59 }) < minDate)
                    disabled = true;
                if (maxDate && time.set({ minute: 0 }) > maxDate)
                    disabled = true;
                if (minLimit && time.endOf('hour') < minLimit)
                    disabled = true;
                if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'hour'))
                    disabled = true;

                if (i_in_24 == selected.hour && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                } else {
                    html += '<option value="' + i + '">' + i + '</option>';
                }
            }

            html += '</select> ';

            //
            // minutes
            //

            if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                html += ': <select class="minuteselect">';

                for (var i = 0; i < 60; i += this.timePickerStepSize > Duration.fromObject({ minutes: 1 }) ? this.timePickerStepSize.minutes : 1) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.set({ minute: i });

                    var disabled = false;
                    if (minDate && time.set({ second: 59 }) < minDate)
                        disabled = true;
                    if (maxDate && time.set({ second: 0 }) > maxDate)
                        disabled = true;
                    if (minLimit && time.endOf('minute') < minLimit)
                        disabled = true;
                    if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'minute'))
                        disabled = true;

                    if (selected.minute == i && !disabled) {
                        html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                    } else if (disabled) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + padded + '</option>';
                    }
                }

                html += '</select> ';
            }

            //
            // seconds
            //

            if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
                html += ': <select class="secondselect">';

                for (var i = 0; i < 60; i += this.timePickerStepSize.seconds) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.set({ second: i });

                    var disabled = false;
                    if (minDate && time < minDate)
                        disabled = true;
                    if (maxDate && time > maxDate)
                        disabled = true;
                    if (minLimit && time < minLimit)
                        disabled = true;
                    if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'second'))
                        disabled = true;

                    if (selected.second == i && !disabled) {
                        html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                    } else if (disabled) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + padded + '</option>';
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

                if (minDate && selected.startOf('day').plus({ hour: 12 }) < minDate)
                    am_html = ' disabled="disabled" class="disabled"';

                if (maxDate && selected.startOf('day') > maxDate)
                    pm_html = ' disabled="disabled" class="disabled"';

                if (minLimit && selected.startOf('day') > minLimit)
                    pm_html = ' disabled="disabled" class="disabled"';

                if (this.isInvalidTime(time, this.singleDatePicker ? null : (side == 'left' ? 'start' : 'end'), 'ampm')) {
                    am_html = ' disabled="disabled" class="disabled"';
                    pm_html = ' disabled="disabled" class="disabled"';
                }

                if (selected.hour >= 12) {
                    html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                } else {
                    html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                }

                html += '</select>';
            }

            this.container.find('.drp-calendar.' + side + ' .calendar-time').html(html);

        },

        updateFormInputs: function () {
            if (this.singleDatePicker || (this.endDate && this.startDate <= this.endDate)) {
                this.container.find('button.applyBtn').prop('disabled', false);
            } else {
                this.container.find('button.applyBtn').prop('disabled', true);
            }

        },

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
            this.element.trigger('show.daterangepicker', this);
            this.isShowing = true;
        },

        hide: function (e) {
            if (!this.isShowing) return;

            //incomplete date selection, revert to last values
            if (!this.endDate) {
                this.startDate = this.oldStartDate;
                this.endDate = this.oldEndDate;
            }

            //if a new date range was selected, invoke the user callback function
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.callback(this.startDate, this.endDate, this.chosenLabel);

            //if picker is attached to a text input, update it
            this.updateElement();

            $(document).off('.daterangepicker');
            $(window).off('.daterangepicker');
            this.container.hide();
            this.element.trigger('hide.daterangepicker', this);
            this.isShowing = false;
        },

        toggle: function (e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },

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
            this.hide();
            this.element.trigger('outsideClick.daterangepicker', this);
        },

        showCalendars: function () {
            this.container.addClass('show-calendar');
            this.move();
            this.element.trigger('showCalendar.daterangepicker', this);
        },

        hideCalendars: function () {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.daterangepicker', this);
        },

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

        clickPrev: function (e) {
            var cal = $(e.target).parents('.drp-calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.minus({ month: 1 });
                if (this.linkedCalendars)
                    this.rightCalendar.month.minus({ month: 1 });
            } else {
                this.rightCalendar.month.minus({ month: 1 });
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parents('.drp-calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.plus({ month: 1 });
            } else {
                this.rightCalendar.month.plus({ month: 1 });
                if (this.linkedCalendars)
                    this.leftCalendar.month.plus({ month: 1 });
            }
            this.updateCalendars();
        },

        hoverDate: function (e) {

            //ignore dates that can't be selected
            if (!$(e.target).hasClass('available')) return;

            var title = $(e.target).attr('data-title');
            var row = title.substring(1, 1);
            var col = title.substring(3, 1);
            var cal = $(e.target).parents('.drp-calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

            //highlight the dates between the start date and the date being hovered as a potential end date
            var leftCalendar = this.leftCalendar;
            var rightCalendar = this.rightCalendar;
            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find('.drp-calendar tbody td').each(function (index, el) {

                    //skip week numbers, only look at dates
                    if ($(el).hasClass('week')) return;

                    var title = $(el).attr('data-title');
                    var row = title.substring(1, 1);
                    var col = title.substring(3, 1);
                    var cal = $(el).parents('.drp-calendar');
                    var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                    if ((dt > startDate) && dt < date || dt.hasSame(date, 'day')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }

                });
            }

        },

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
                const row = title.substring(1, 1);
                const col = title.substring(3, 1);
                const cal = $(el).parents('.drp-calendar');
                const dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                if (dates == null) {
                    // Hover over custom range
                    $(el).removeClass('in-range');
                    $(el).removeClass('start-date');
                    $(el).removeClass('end-date');
                } else {
                    if (dt.hasSame(dates[0])) {
                        $(el).addClass('start-date');
                    } else if (dt.hasSame(dates[1])) {
                        $(el).addClass('end-date');
                    } else if (dt.startOf('day') > dates[0].startOf('day') && dt.startOf('day') < dates[1].startOf('day')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }
                }

            });
        },

        clickDate: function (e) {

            if (!$(e.target).hasClass('available')) return;

            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.drp-calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            let side = 'end';

            //
            // this function needs to do a few things:
            // * alternate between selecting a start and end date for the range,
            // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
            // * if autoapply is enabled, and an end date was chosen, apply the selection
            // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
            // * if one of the inputs above the calendars was focused, cancel that manual input
            //

            if (this.endDate || date < this.startDate, 'day') { //picking start
                if (this.timePicker) {
                    let hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.left .hourselect option:last').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                    let minute = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                        minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.left .minuteselect option:last').val(), 10);
                    }

                    let second = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
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
            } else { // picking end
                if (this.timePicker) {
                    let hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (isNaN(hour))
                        hour = parseInt(this.container.find('.right .hourselect option:last').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }

                    let minute = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                        minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                        if (isNaN(minute))
                            minute = parseInt(this.container.find('.right .minuteselect option:last').val(), 10);
                    }

                    let second = 0;
                    if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
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
            }

            if (this.singleDatePicker) {
                this.setEndDate(this.startDate, true);
                if (!this.timePicker && this.autoApply)
                    this.clickApply();
            }

            this.updateView();

            //This is to cancel the blur event handler if the mouse was in one of the inputs
            e.stopPropagation();

            this.element.trigger('dateChange.daterangepicker', [this, this.singleDatePicker ? null : side]);

        },

        calculateChosenLabel: function () {
            // If selected range from calendar matches any custom range, then highlight it
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                var unit = this.timePicker ? 'hour' : 'day';
                if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                    unit = 'minute';
                } else if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
                    unit = 'second';
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

        clickApply: function (e) {
            this.hide();
            this.element.trigger('apply.daterangepicker', this);
        },

        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

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
                this.leftCalendar.month.set({ year: year, month: month });
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.plus({ month: 1 });
            } else {
                this.rightCalendar.month.set({ year: year, month: month });
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.minus({ month: 1 });
            }
            this.updateCalendars();
        },

        timeChanged: function (e) {

            var cal = $(e.target).closest('.drp-calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            if (isNaN(hour))
                hour = parseInt(cal.find('.hourselect option:last').val(), 10);

            var minute = 0;
            if (this.timePickerStepSize < Duration.fromObject({ hours: 1 })) {
                minute = parseInt(cal.find('.minuteselect').val(), 10);
                if (isNaN(minute))
                    minute = parseInt(cal.find('.minuteselect option:last').val(), 10);
            }

            var second = 0;
            if (this.timePickerStepSize < Duration.fromObject({ minutes: 1 })) {
                second = parseInt(cal.find('.secondselect').val(), 10);
                if (isNaN(second))
                    second = parseInt(cal.find('.secondselect option:last').val(), 10);
            }

            if (!this.timePicker24Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate;
                start.set({ hour: hour });
                start.set({ minute: minute });
                start.set({ second: second });
                this.setStartDate(start, true);
                if (this.singleDatePicker) {
                    this.endDate = this.startDate;
                } else if (this.endDate && this.endDate.hasSame(start, 'day') && this.endDate < start) {
                    this.setEndDate(start, true);
                }
            } else if (this.endDate) {
                var end = this.endDate;
                end.hour.set({ hour });
                end.minuteset({ minute });
                end.secondset({ second });
                this.setEndDate(end, true);
            }

            //update the calendars so all clickable dates reflect the new time component
            this.updateCalendars();

            //update the form inputs above the calendars with the new time
            this.updateFormInputs();

            //re-render the time pickers because changing one selection can affect what's enabled in another
            this.renderTimePicker('left');
            this.renderTimePicker('right');

            this.element.trigger('timeChange.daterangepicker', [this, this.singleDatePicker ? null : (isLeft ? 'start' : 'stop')]);
        },

        elementChanged: function () {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            const dateString = this.element.val().split(this.locale.separator);
            var start = null, end = null;
            const format = typeof this.locale.format === 'string' ? typeof this.locale.format : DateTime.parseFormatForOpts(this.locale.format);

            if (dateString.length === 2) {
                start = DateTime.fromFormat(dateString[0], format, { locale: DateTime.now().locale });
                end = DateTime.fromFormat(dateString[1], format, { locale: DateTime.now().locale });
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = DateTime.fromFormat(this.element.val(), format, { locale: DateTime.now().locale });
                end = start;
            }

            if (!start.isValid() || !end.isValid()) return;

            this.setStartDate(start, false);
            this.setEndDate(end, false);
            this.updateView();
        },

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

        updateElement: function () {
            if (this.element.is('input') && this.autoUpdateInput) {
                let newValue = typeof this.locale.format === 'object' ? this.startDate.toLocaleString(this.locale.format) : this.startDate.toFormat(this.locale.format);
                if (!this.singleDatePicker)
                    newValue += this.locale.separator
                newValue += typeof this.locale.format === 'object' ? this.endDate.toLocaleString(this.locale.format) : this.endDate.toFormat(this.locale.format);

                if (newValue !== this.element.val()) {
                    this.element.val(newValue).trigger('change');
                }
            }
        },

        remove: function () {
            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData();
        }

    };

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
