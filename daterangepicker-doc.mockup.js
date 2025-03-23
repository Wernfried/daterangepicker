/**
* @version: 3.3.5
* @author: Wernfried Domscheit
* @copyright: Copyright (c) 2025 Wernfried Domscheit. All rights reserved.
*/


/**
* @external jQuery 
* @see {@link https://learn.jquery.com/using-jquery-core/jquery-object/|jQuery}
*/

/**
* @external Selector
* @see {@link https://learn.jquery.com/using-jquery-core/jquery-object/|jQuery Selector}
*/


/**
* @external DateTime
* @see {@link https://moment.github.io/luxon/api-docs/index.html#datetime|DateTime}
*/

/**
* @external Duration
* @see {@link https://moment.github.io/luxon/api-docs/index.html#duration|Duration}
*/

/**
* @external Date
* @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date}
*/


/**
* Options for DateRangePicker
* @typedef Options 
* @property {'sax' | 'expat'} method - The underlying parser. Either `'sax'`, `'expat'`.
* @property {external:jQuery} xmlns - jQuery selector of the parent element that the date range picker will be added to
* @property {external:DateTime|external:Date|string} [trim] - If `true`, then turn any whitespace into a single space. Text and comments are trimmed.
* @property {boolean} [resumeAfterError] - If `true` then parser continues reading after an error. Otherwise it throws exception.
* @property {Options.Locale} [locale] - If `true` then unhandled elements are purged.
* @property {string} [file] - Optional. The name of file to be parsed. Just used for information and logging purpose.
* @example { method: 'expat', xmlns: true }
* @default  { method: 'sax', xmlns: false, trim: true, resumeAfterError: false, partial: false }
*/

/**
* Locale options for DateRangePicker
* @typedef Options.Locale 
* @property {'sax' | 'expat'} [method] - The underlying parser. Either `'sax'`, `'expat'`.
* @property {boolean} [xmlns] - If `true`, then namespaces are accessible by `namespace` property.
* @property {boolean} [trim] - If `true`, then turn any whitespace into a single space. Text and comments are trimmed.
* @property {boolean} [resumeAfterError] - If `true` then parser continues reading after an error. Otherwise it throws exception.
* @property {boolean} [partial] - If `true` then unhandled elements are purged.
* @property {string} [file] - Optional. The name of file to be parsed. Just used for information and logging purpose.
* @example { method: 'expat', xmlns: true }
* @default  { method: 'sax', xmlns: false, trim: true, resumeAfterError: false, partial: false }
*/


// Following the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Make globaly available as well
        define(['moment', 'jquery'], function (moment, jquery) {
            if (!jquery.fn) jquery.fn = {}; // webpack server rendering
            if (typeof moment !== 'function' && moment.hasOwnProperty('default')) moment = moment['default']
            return factory(moment, jquery);
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node / Browserify
        //isomorphic issue
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;
        if (!jQuery) {
            jQuery = require('jquery');
            if (!jQuery.fn) jQuery.fn = {};
        }
        var moment = (typeof window != 'undefined' && typeof window.moment != 'undefined') ? window.moment : require('moment');
        module.exports = factory(moment, jQuery);
    } else {
        // Browser globals
        root.daterangepicker = factory(root.moment, root.jQuery);
    }
}(typeof window !== 'undefined' ? window : this, function (moment, $) {
    /**
     * @constructs DateRangePicker
     * @param {Selector} [element=body] - jQuery selector of the parent element that the date range picker will be added to
     * @param {Options} options - 
     * @param {function} cb - Callback function executed when 
     */
    var DateRangePicker = function (element, options, cb) {

        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = moment().startOf('day');
        this.minSpan = false;
        this.minYear = moment().subtract(100, 'year').format('YYYY');
        this.timePickerStepMinute = 1;
        this.ranges = {};
        this.opens = 'right';
        this.isCustomDate = function () { return false };
        this.isCustomTime = () => { return false };

        this.locale = {
            direction: 'ltr',
            format: moment.localeData().longDateFormat('L'),
            daysOfWeek: moment.weekdaysMin(),
        };

        this.callback = function () { };

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        /**
        * Create a new Twig parser
        * @param {external:DateTime|external:Date|string} startDate - Object or array of element specification and function to handle elements
        */
        setStartDate: function (startDate) {
            console.log('In setStartDate')

        },

        /**
        * Create a new Twig parser
        * @param {TwigHandler|TwigHandler[]} handler - Object or array of element specification and function to handle elements
        * @param {ParserOptions} [options] - Object of optional options 
        * @public
        */
        setEndDate: function (startDate) {
            console.log('In setStartDate')
            throw new RangeError("");
        },

        /**
        * Shows the daterangepicker
        * @param {external:jQuery} e - The calendar jQuery Object
        * @fires "show.daterangepicker"
        * @private
        */
        show: function (e) {
            if (this.isShowing) return;
            /**
            * @event
            * @name "show.daterangepicker"
            * @param {DateRangePicker} this - Object of optional options 
            */

            this.element.trigger('show.daterangepicker', this);
            this.isShowing = true;
        },

        /**
        * Create a new Twig parser
        * @fires hideCalendar
        */
        hideCalendars: function () {
            this.container.removeClass('show-calendar');
            /**
            * @event
            * @name hideCalendar
            * @param {DateRangePicker} this - Object of optional options 
            */
            this.element.trigger('hideCalendar.daterangepicker', this);
        },

    };

    /**
    * Initiate a new DateRangePicker
    * @name DateRangePicker.daterangepicker
    * @function
    * @param {Options} options - 
    * @param {function} callback - Callback function executed when 
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
