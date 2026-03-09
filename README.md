# Date Range Picker

![Daterangepicker Exsample](example/default-style.png)

This date range picker component creates a dropdown menu from which a user can
select a range of dates.

Features include limiting the selectable date range, localizable strings and date formats,
a single date picker mode, a time picker, and predefined date ranges.

### [Documentation and Live Usage Examples](http://www.daterangepicker.com)

### [See It In a Live Application](https://awio.iljmp.com/5/drpdemogh)

Above samples are based on the [original repository](https://github.com/dangrossman/daterangepicker) from Dan Grossman. [New features](#Features) from this fork are not available in these samples.

## Basic usage

#### Global import with `<script>` tags
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker-4.x@4.13.14/dist/global/daterangepicker.min.js"></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker-4.x@4.13.14/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   const DateTime = luxon.DateTime;

   $(function() {
      $('#picker').daterangepicker(
         startDate: DateTime.now().plus({day: 1})
      );
   });
</script>
```

#### ESM Imports
```html
<script type="importmap">
{
   "imports": {
      "jquery": "https://cdn.jsdelivr.net/npm/jquery@4.0.0/dist-module/jquery.module.min.js",
      "luxon": "https://moment.github.io/luxon/es6/luxon.min.js",
      "daterangepicker": "https://cdn.jsdelivr.net/npm/daterangepicker-4.x@4.13.14/dist/esm/daterangepicker.min.js"
   }
}
</script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker-4.x@4.13.14/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="module">
   import { $ } from 'jquery';
   import { DateTime } from 'luxon';
   import DateRangePicker from 'daterangepicker';

   $(function() {
      $('#picker').daterangepicker(
         startDate: DateTime.now().plus({day: 1})
      );
   });
</script>
```

#### Style with Bulma
```html
<script ...></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css" rel="stylesheet" />
<link type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker-4.x@4.13.14/css/daterangepicker.bulma.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   $(function() {
      $('#picker').daterangepicker(
         externalStyle: 'bulma'
      );
   });
</script>
```



## Examples
### `ranges`
<a name="options-ranges"></a>
```js
{
   'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
   'Yesterday': [DateTime.now().startOf('day').minus({day: 1}), DateTime.now().endOf('day').minus({day: 1})],
   'Last 7 Days': ['2025-03-01', '2025-03-07'],
   'Last 30 Days': [new Date(new Date - 1000*60*60*24*30), new Date()],
   'This Month': [DateTime.now().startOf('month'), DateTime.now().endOf('month')],
   'Last Month': [DateTime.now().minus({month: 1}).startOf('month'), DateTime.now().minus({month: 1}).endOf('month')]
}
```

### `isInvalidDate`
```js
isInvalidDate: function(date) {
   return date.isWeekend;
}
```

### `isInvalidTime`
```js
isInvalidTime: (time, side, unit) => {   
   if (unit == 'hour') {
      return time.hour >= 10 && time.hour <= 14; // Works also with 12-hour clock      
   } else {
      return false;
   }
}
```

### `isCustomDate`
```js
.daterangepicker-bank-day {
  color: red;
}
.daterangepicker-weekend-day {
  color: blue;
}

isCustomDate: function(date) {
   if (date.isWeekend)
      return 'daterangepicker-weekend-day';

   const yyyy = date.year;
   let bankDays = [
      DateTime.fromObject({ year: yyyy, month: 1, day: 1 }), // New year
      DateTime.fromObject({ year: yyyy, month: 7, day: 4 }), // Independence Day
      DateTime.fromObject({ year: yyyy, month: 12, day: 25 }) // Christmas Day
   ];
   return bankDays.some(x => x.hasSame(date, 'day')) ? 'daterangepicker-bank-day' : '';
}
```
### Features
Compared to [inital repository](https://github.com/dangrossman/daterangepicker), this fork added following features and changes:

- Replaced [moment](https://momentjs.com/) by [luxon](https://moment.github.io/luxon/index.html) (see differences below)
- Added option `weekendClasses`, `weekendDayClasses`, `todayClasses` to highlight weekend days or today, respectively 
- Added option `timePickerStepSize` to succeed options `timePickerIncrement` and `timePickerSeconds`
- Added events `dateChange.daterangepicker` and `timeChange.daterangepicker` emitted when user clicks on a date/time
- Added event `beforeHide.daterangepicker` enables you to keep the picker visible after click on `Apply` or `Cancel` button.
- Added event `beforeRenderTimePicker.daterangepicker` and `beforeRenderCalendar.daterangepicker` emitted before elements are rendered
- Added event `violated.daterangepicker` emitted when user input is not valid
- Added method `setRange(startDate, endDate)` to combine `setStartDate(startDate)` and `setEndDate(endDate)`
- Added option `minSpan` similar to `maxSpan`
- Added option `isInvalidTime` similar to `isInvalidDate`
- Added option `altInput` and `altFormat` to provide an alternative output element for selected date value
- Added option `onOutsideClick` where you can define whether picker shall apply or revert selected value
- Added option `initalMonth` to show datepicker without an initial date
- Added option `singleMonthView` to show single month calendar, useful for shorter ranges
- Better validation of input parameters, errors are logged to console
- Highlight range in calendar when hovering over pre-defined ranges
- Option `autoUpdateInput` defines whether the attached `<input>` element is updated when the user clicks on a date value.<br/>
In original daterangepicker this parameter defines whether the `<input>` is updated when the user clicks on `Apply` button.
- Added option `locale.durationFormat` to show customized label for selected duration, e.g. `'4 Days, 6 Hours, 30 Minutes'`
- Added option `externalStyle` to use daterangepicker with external CSS Frameworks. Currently only [Bulma](https://bulma.io/) is supported<br/>
but other frameworks may be added in future releases
- ... and maybe some new bugs 😉 

### Localization
All date values are based on [luxon](https://moment.github.io/luxon/index.html#/intl) which provides great support for localization. Instead of providing date format, weekday and month names manually as strings, it is usually easier to set the default locale like this:
```js
$(function () {
   const Settings = luxon.Settings;
   Settings.defaultLocale = 'fr-CA'

   $('#picker').daterangepicker({
      timePicker: true,
      singleDatePicker: false
   };
});

```
instead of 
```js
$(function () {
   $('#picker').daterangepicker({
      timePicker: true,
      singleDatePicker: false,
      locale: {
         format: 'yyyyy-M-d H h m',
         daysOfWeek: [ 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.' ],
         monthNames: [ "janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre" ],
         firstDay: 7
      }
   };
});

```

### Style and themes

You can style this daterangepicker with [Bulma CSS Framework](https://bulma.io/). Light and dark theme is supported:

![Bulma dark example](example/bulma-dark.png)

![Bulma light example](example/bulma-light.png)


## Methods

Available methods are listed below in [API documentation](#DateRangePicker). You will mainly use 
   * [.daterangepicker(options, callback)](#DateRangePicker.daterangepicker)
   * [.setStartDate(startDate)](#DateRangePicker+setStartDate)
   * [.setEndDate(endDate)](#DateRangePicker+setEndDate)
   * [.setPeriod(startDate, endDate)](#DateRangePicker+setPeriod)
   * `$(...).data('daterangepicker')` to get the daterangepicker object

all other methods are used rarely.

### Differences between `moment` and `luxon` library
This table lists a few important differences between datarangepicker using moment and luxon. Check them carefully when you migrate from older daterangepicker.

| Parameter               | moment                                              | luxon             |
| ----------------------- | --------------------------------------------------- | ----------------- |
| `locale.daysOfWeek`     | [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ] | [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ] | 
| `locale.firstDay`       | 0-6 (Sunday to Saturday)                            | 1 for Monday through 7 for Sunday | 
| to ISO-8601 String      | `toISOString()`                                     | `toISO()`         | 
| to [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Object | `toDate()` | `toJSDate()`         | 
| from ISO-8601 String    | `moment(...)`                                       | `DateIme.fromISO(...)`         | 
| from [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Object | `moment(...)` | `DateIme.fromJSDate(...)`         | 
| current day             | `moment()`                                          | `DateTime.now()`  |
| format to string        | `format(...)`                                       | `toFormat(...)`   |
| format tokens           | `'YYYY-MM-DD'`                                      | `'yyyy-MM-dd'`    |


## License

The MIT License (MIT)

Copyright (c) 2012-2019 Dan Grossman<br/>
Copyright (c) 2025 Wernfried Domscheit

Licensed under the [MIT license](LICENSE).

# API Documentation
## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
</dl>

## Events

<dl>
<dt><a href="#event_violated.daterangepicker">"violated.daterangepicker" (this, violations)</a> ⇒ <code>boolean</code></dt>
<dd><p>Emitted if the input values are not compliant to all constraints</p>
</dd>
<dt><a href="#event_beforeRenderCalendar.daterangepicker">"beforeRenderCalendar.daterangepicker" (this)</a></dt>
<dd><p>Emitted before the calendar is rendered. 
Useful to remove any manually added elements.</p>
</dd>
<dt><a href="#event_beforeRenderTimePicker.daterangepicker">"beforeRenderTimePicker.daterangepicker" (this)</a></dt>
<dd><p>Emitted before the TimePicker is rendered.
Useful to remove any manually added elements.</p>
</dd>
<dt><a href="#event_show.daterangepicker">"show.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the picker is shown</p>
</dd>
<dt><a href="#event_beforeHide.daterangepicker">"beforeHide.daterangepicker" (this)</a> ⇒ <code>boolean</code></dt>
<dd><p>Emitted before the picker will hide. When EventHandler returns <code>true</code>, then picker remains visible</p>
</dd>
<dt><a href="#event_hide.daterangepicker">"hide.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the picker is hidden</p>
</dd>
<dt><a href="#event_outsideClick.daterangepicker">"outsideClick.daterangepicker" (this)</a></dt>
<dd><p>Emitted when user clicks outside the picker. 
Use option <code>onOutsideClick</code> to define the default action, then you may not need to handle this event.</p>
</dd>
<dt><a href="#event_showCalendar.daterangepicker">"showCalendar.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the calendar(s) are shown.
Only useful when <a href="#Ranges">Ranges</a> are used.</p>
</dd>
<dt><a href="#event_hideCalendar.daterangepicker">"hideCalendar.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the calendar(s) are hidden.
Only useful when <a href="#Ranges">Ranges</a> are used.</p>
</dd>
<dt><a href="#event_dateChange.daterangepicker">"dateChange.daterangepicker" (this, side)</a></dt>
<dd><p>Emitted when the date changed. Does not trigger when time is changed, 
use <a href="#event_timeChange.daterangepicker">&quot;timeChange.daterangepicker&quot;</a> to handle it</p>
</dd>
<dt><a href="#event_apply.daterangepicker">"apply.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the <code>Apply</code> button is clicked, or when a predefined <a href="#Ranges">Ranges</a> is clicked</p>
</dd>
<dt><a href="#event_cancel.daterangepicker">"cancel.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the <code>Cancel</code> button is clicked</p>
</dd>
<dt><a href="#event_timeChange.daterangepicker">"timeChange.daterangepicker" (this, side)</a></dt>
<dd><p>Emitted when the time changed. Does not trigger when date is changed</p>
</dd>
<dt><a href="#event_inputChanged.daterangepicker">"inputChanged.daterangepicker" (this)</a></dt>
<dd><p>Emitted when the date is changed through <code>&lt;input&gt;</code> element. Event is only triggered when date string is valid and date value has changed</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a></dt>
<dd><p>Options for DateRangePicker</p>
</dd>
<dt><a href="#Ranges">Ranges</a> : <code>Object</code></dt>
<dd><p>A set of predefined ranges</p>
</dd>
<dt><a href="#Range">Range</a> : <code>Object</code></dt>
<dd><p>A single predefined range</p>
</dd>
<dt><a href="#InputViolation">InputViolation</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#callback">callback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="DateRangePicker"></a>

## DateRangePicker
**Kind**: global class  

* [DateRangePicker](#DateRangePicker)
    * [new DateRangePicker(element, options, cb)](#new_DateRangePicker_new)
    * _instance_
        * [.setStartDate(startDate, isValid)](#DateRangePicker+setStartDate)
        * [.setEndDate(endDate, isValid)](#DateRangePicker+setEndDate)
        * [.setPeriod(startDate, endDate, isValid)](#DateRangePicker+setPeriod)
        * [.validateInput([range])](#DateRangePicker+validateInput) ⇒ <code>Array</code> \| <code>null</code>
        * [.updateView()](#DateRangePicker+updateView)
        * [.showCalendars()](#DateRangePicker+showCalendars)
        * [.hideCalendars()](#DateRangePicker+hideCalendars)
        * [.updateElement()](#DateRangePicker+updateElement)
        * [.remove()](#DateRangePicker+remove)
    * _static_
        * [.daterangepicker(options, callback)](#DateRangePicker.daterangepicker) ⇒

<a name="new_DateRangePicker_new"></a>

### new DateRangePicker(element, options, cb)

| Param | Type | Description |
| --- | --- | --- |
| element | [<code>jQuery</code>](https://api.jquery.com/Types/#jQuery/) | jQuery selector of the parent element that the date range picker will be added to |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| cb | <code>function</code> | Callback function executed when |

<a name="DateRangePicker+setStartDate"></a>

### dateRangePicker.setStartDate(startDate, isValid)
Sets the date range picker's currently selected start date to the provided date.<br/>
`startDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or 
a string matching `locale.format`.
The value of the attached `<input>` element is also updated.
Date value is rounded to match option `timePickerStepSize` unless skipped by `violated.daterangepicker` event handler.<br/>
If the `startDate` does not fall into `minDate` and `maxDate` then `startDate` is shifted unless skipped by `violated.daterangepicker` event handler.

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set |
| isValid | <code>boolean</code> | <code>false</code> | If `true` then the `startDate` is not checked against `minDate` and `maxDate`<br/> Use this option only if you are sure about the value you put in. |

**Example**  
```js
const DateTime = luxon.DateTime;
const drp = $('#picker').data('daterangepicker');
drp.setStartDate(DateTime.now().startOf('hour'));
```
<a name="DateRangePicker+setEndDate"></a>

### dateRangePicker.setEndDate(endDate, isValid)
Sets the date range picker's currently selected end date to the provided date.<br/>
`endDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or 
a string matching`locale.format`.
The value of the attached `<input>` element is also updated.
Date value is rounded to match option `timePickerStepSize` unless skipped by `violated.daterangepicker` event handler.<br/>
If the `endDate` does not fall into  `minDate` and `maxDate` or into `minSpan` and `maxSpan`
then `endDate` is shifted unless skipped by `violated.daterangepicker` event handler

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set |
| isValid | <code>boolean</code> | <code>false</code> | If `true` then the `endDate` is not checked against `minDate`, `maxDate` and `minSpan`, `maxSpan`<br/> Use this option only if you are sure about the value you put in. |

**Example**  
```js
const drp = $('#picker').data('daterangepicker');
drp.setEndDate('2025-03-28T18:30:00');
```
<a name="DateRangePicker+setPeriod"></a>

### dateRangePicker.setPeriod(startDate, endDate, isValid)
Shortcut for [setStartDate](#DateRangePicker+setStartDate) and [setEndDate](#DateRangePicker+setEndDate)

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set |
| isValid | <code>boolean</code> | <code>false</code> | If `true` then the `startDate` and `endDate` are not checked against `minDate`, `maxDate` and `minSpan`, `maxSpan`<br/> Use this option only if you are sure about the value you put in. |

**Example**  
```js
const DateTime = luxon.DateTime;
const drp = $('#picker').data('daterangepicker');
drp.setPeriod(DateTime.now().startOf('week'), DateTime.now().startOf('week').plus({days: 10}));
```
<a name="DateRangePicker+validateInput"></a>

### dateRangePicker.validateInput([range]) ⇒ <code>Array</code> \| <code>null</code>
Validate `startDate` and `endDate` or `range` against `timePickerStepSize`, `minDate`, `maxDate`, 
`minSpan`, `maxSpan`, `invalidDate` and `invalidTime` and corrects them, if needed. 
Correction can be skipped by returning `true` at event listener for `violated.daterangepicker`

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>Array</code> \| <code>null</code> - - Corrected range as array of `[startDate, endDate]` when `range` is defined  
**Emits**: <code>event:&quot;violated.daterangepicker&quot;</code>  

| Param | Type | Description |
| --- | --- | --- |
| [range] | <code>Array</code> | Used to check prefefined range instead of `startDate` and `endDate` => `[name, startDate, endDate]` When set, then function does not modify anything, just returning corrected range. |

**Example**  
```js
validateInput([DateTime.fromISO('2025-02-03'), DateTime.fromISO('2025-02-25')]) => 
[ DateTime.fromISO('2025-02-05'), DateTime.fromISO('2025-02-20'), { startDate: { violations: [{old: ..., new: ..., reasson: 'minDate'}] } } ]
```
<a name="DateRangePicker+updateView"></a>

### dateRangePicker.updateView()
Updates the picker when calendar is initiated or any date has been selected. 
Could be useful after running [setStartDate](#DateRangePicker+setStartDate) or [setEndDate](#DateRangePicker+setEndDate)

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;beforeRenderTimePicker.daterangepicker&quot;</code>  
<a name="DateRangePicker+showCalendars"></a>

### dateRangePicker.showCalendars()
Shows calendar when user selects "Custom Ranges"

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;showCalendar.daterangepicker&quot;</code>  
<a name="DateRangePicker+hideCalendars"></a>

### dateRangePicker.hideCalendars()
Hides calendar when user selects a predefined range

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;hideCalendar.daterangepicker&quot;</code>  
<a name="DateRangePicker+updateElement"></a>

### dateRangePicker.updateElement()
Update attached `<input>` element with selected value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>change</code>](https://api.jquery.com/change/)  
<a name="DateRangePicker+remove"></a>

### dateRangePicker.remove()
Removes the picker from document

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker.daterangepicker"></a>

### DateRangePicker.daterangepicker(options, callback) ⇒
Initiate a new DateRangePicker

**Kind**: static method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: DateRangePicker  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| callback | [<code>callback</code>](#callback) | Callback function executed when date is changed.<br/> Callback function is executed if selected date values has changed, before picker is hidden and before the attached `<input>` element is updated.  As alternative listen to the ["apply.daterangepicker"](#event_apply.daterangepicker) event |

<a name="event_violated.daterangepicker"></a>

## "violated.daterangepicker" (this, violations) ⇒ <code>boolean</code>
Emitted if the input values are not compliant to all constraints

**Kind**: event emitted  
**Returns**: <code>boolean</code> - skip - If `true`, then input values are not corrected and remain invalid  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| violations | [<code>InputViolation</code>](#InputViolation) | An object of input violations |

**Example**  
```js
$('#picker').on('violated.daterangepicker', (ev, picker, violations))
[ DateTime.fromISO('2025-02-05'), DateTime.fromISO('2025-02-20'), { startDate: { violations: [{old: ..., new: ..., reasson: 'minDate'}] } } ]
```
<a name="event_beforeRenderCalendar.daterangepicker"></a>

## "beforeRenderCalendar.daterangepicker" (this)
Emitted before the calendar is rendered. 
Useful to remove any manually added elements.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_beforeRenderTimePicker.daterangepicker"></a>

## "beforeRenderTimePicker.daterangepicker" (this)
Emitted before the TimePicker is rendered.
Useful to remove any manually added elements.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_show.daterangepicker"></a>

## "show.daterangepicker" (this)
Emitted when the picker is shown

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_beforeHide.daterangepicker"></a>

## "beforeHide.daterangepicker" (this) ⇒ <code>boolean</code>
Emitted before the picker will hide. When EventHandler returns `true`, then picker remains visible

**Kind**: event emitted  
**Returns**: <code>boolean</code> - cancel - If `true`, then the picker remains visible  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_hide.daterangepicker"></a>

## "hide.daterangepicker" (this)
Emitted when the picker is hidden

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_outsideClick.daterangepicker"></a>

## "outsideClick.daterangepicker" (this)
Emitted when user clicks outside the picker. 
Use option `onOutsideClick` to define the default action, then you may not need to handle this event.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_showCalendar.daterangepicker"></a>

## "showCalendar.daterangepicker" (this)
Emitted when the calendar(s) are shown.
Only useful when [Ranges](#Ranges) are used.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_hideCalendar.daterangepicker"></a>

## "hideCalendar.daterangepicker" (this)
Emitted when the calendar(s) are hidden.
Only useful when [Ranges](#Ranges) are used.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_dateChange.daterangepicker"></a>

## "dateChange.daterangepicker" (this, side)
Emitted when the date changed. Does not trigger when time is changed, 
use ["timeChange.daterangepicker"](#event_timeChange.daterangepicker) to handle it

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether startDate or endDate was changed. `null` when `singleDatePicker: true` |

<a name="event_apply.daterangepicker"></a>

## "apply.daterangepicker" (this)
Emitted when the `Apply` button is clicked, or when a predefined [Ranges](#Ranges) is clicked

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_cancel.daterangepicker"></a>

## "cancel.daterangepicker" (this)
Emitted when the `Cancel` button is clicked

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_timeChange.daterangepicker"></a>

## "timeChange.daterangepicker" (this, side)
Emitted when the time changed. Does not trigger when date is changed

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether startDate or endDate was changed |

<a name="event_inputChanged.daterangepicker"></a>

## "inputChanged.daterangepicker" (this)
Emitted when the date is changed through `<input>` element. Event is only triggered when date string is valid and date value has changed

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="Options"></a>

## Options
Options for DateRangePicker

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| parentEl | <code>string</code> | <code>&quot;body&quot;</code> | [jQuery selector](https://api.jquery.com/category/selectors/) of the parent element that the date range picker will be added to |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | Default: `DateTime.now().startOf('day')`<br/>The beginning date of the initially selected date range.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br/> Date value is rounded to match option `timePickerStepSize`<br/> Option `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br/> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br/> Use `startDate: null` to show calendar without an inital selected date. |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | Defautl: `DateTime.now().endOf('day')`<br/>The end date of the initially selected date range.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br/> Date value is rounded to match option `timePickerStepSize`<br/> Option `isInvalidDate`, `isInvalidTime` and `minSpan`, `maxSpan` are not evaluated, you may set date/time which is not selectable in calendar.<br/> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br/> |
| minDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The earliest date a user may select or `null` for no limit.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`. |
| maxDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The latest date a user may select or `null` for no limit.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`. |
| minSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The minimum span between the selected start and end dates.<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br/> Ignored when `singleDatePicker: true` |
| maxSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The maximum  span between the selected start and end dates.<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br/> Ignored when `singleDatePicker: true` |
| defaultSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The span which is used when endDate is automatically updated due to wrong user input<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br/> Ignored when `singleDatePicker: true`. Not relevant if `minSpan: null` |
| initalMonth | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | Default: `DateTime.now().startOf('month')`<br/> The inital month shown when `startDate: null`. Be aware, the attached `<input>` element must be also empty.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br/> When `initalMonth` is used, then `endDate` is ignored and it works only with `timePicker: false` |
| autoApply | <code>boolean</code> | <code>false</code> | Hide the `Apply` and `Cancel` buttons, and automatically apply a new date range as soon as two dates are clicked.<br/> Only useful when `timePicker: false` |
| singleDatePicker | <code>boolean</code> | <code>false</code> | Show only a single calendar to choose one date, instead of a range picker with two calendars.<br/> The start and end dates provided to your callback will be the same single date chosen. |
| singleMonthView | <code>boolean</code> | <code>false</code> | Show only a single month calendar, useful when selected ranges are usually short<br/> or for smaller viewports like mobile devices.<br/> Ignored for `singleDatePicker: true`. |
| showDropdowns | <code>boolean</code> | <code>false</code> | Show year and month select boxes above calendars to jump to a specific month and year |
| minYear | <code>number</code> |  | Default: `DateTime.now().minus({year:100}).year`<br/>The minimum year shown in the dropdowns when `showDropdowns: true` |
| maxYear | <code>number</code> |  | Default: `DateTime.now().plus({year:100}).year`<br/>The maximum  year shown in the dropdowns when `showDropdowns: true` |
| showWeekNumbers | <code>boolean</code> | <code>false</code> | Show **localized** week numbers at the start of each week on the calendars |
| showISOWeekNumbers | <code>boolean</code> | <code>false</code> | Show **ISO** week numbers at the start of each week on the calendars.<br/> Takes precedence over localized `showWeekNumbers` |
| timePicker | <code>boolean</code> | <code>false</code> | Adds select boxes to choose times in addition to dates |
| timePicker24Hour | <code>boolean</code> | <code>true|false</code> | Use 24-hour instead of 12-hour times, removing the AM/PM selection.<br/> Default is derived from current locale [Intl.DateTimeFormat.resolvedOptions.hour12](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#hour12). |
| timePickerStepSize | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> |  | Default: `Duration.fromObject({minutes:1})`<br/>Set the time picker step size.<br/> Must be a `luxon.Duration` or the number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br/> Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})`  and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br/> Duration must be greater than `minSpan` and smaller than `maxSpan`.<br/> For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes.<br/> Overwrites `timePickerIncrement` and `timePickerSeconds`, ignored when `timePicker: false` |
| timePickerSeconds | <code>boolean</code> | <code>boolean</code> | **Deprecated**, use `timePickerStepSize`<br/>Show seconds in the timePicker |
| timePickerIncrement | <code>boolean</code> | <code>1</code> | **Deprecated**, use `timePickerStepSize`<br/>Increment of the minutes selection list for times |
| autoUpdateInput | <code>boolean</code> | <code>true</code> | Indicates whether the date range picker should instantly update the value of the attached `<input>`  element when the selected dates change.<br/>The `<input>` element will be always updated on `Apply` and reverted when user clicks on `Cancel`. |
| onOutsideClick | <code>string</code> | <code>&quot;apply&quot;</code> | Defines what picker shall do when user clicks outside the calendar.  `'apply'` or `'cancel'`. Event [onOutsideClick.daterangepicker](#event_outsideClick.daterangepicker) is always emitted. |
| linkedCalendars | <code>boolean</code> | <code>true</code> | When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February),  and both will be advanced when clicking the left or right arrows above the calendars.<br/> When disabled, the two calendars can be individually advanced and display any month/year |
| isInvalidDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,<br/>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/> Signature: `isInvalidDate(date)`<br/> Function has no effect on date values set by `startDate`, `endDate`, `ranges`, [setStartDate](#DateRangePicker+setStartDate), [setEndDate](#DateRangePicker+setEndDate). |
| isInvalidTime | <code>function</code> | <code>false</code> | A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br/>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/> Signature: `isInvalidTime(time, side, unit)`<br/> `side` is `'start'` or `'end'` or `null` for `singleDatePicker: true`<br/> `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br/> Hours are always given as 24-hour clock<br/> Function has no effect on time values set by `startDate`, `endDate`, `ranges`, [setStartDate](#DateRangePicker+setStartDate), [setEndDate](#DateRangePicker+setEndDate).<br/> Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br/> |
| isCustomDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,  and may return a string or array of CSS class names to apply to that date's calendar cell.<br/> Signature: `isCustomDate(date)` |
| altInput | <code>string</code> \| <code>Array</code> | <code>null</code> | A [jQuery selector](https://api.jquery.com/category/selectors/) string for an alternative output (typically hidden) `<input>` element. Uses `altFormat` to format the value.<br/> Must be a single string for `singleDatePicker: true` or an array of two strings for `singleDatePicker: false`<br/> Example: `['#start', '#end']` |
| altFormat | <code>function</code> \| <code>string</code> |  | The output format used for `altInput`.<br/> Default: ISO-8601 basic format without time zone, precisison is derived from `timePicker` and `timePickerStepSize`<br/> Example `yyyyMMdd'T'HHmm` for `timePicker=true` and display of Minutes<br/>  If defined, either a string used with [Format tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or a function.<br/> Examples: `"yyyy:MM:dd'T'HH:mm"`,<br/>`(date) => date.toUnixInteger()` |
| ~~warnings~~ | <code>boolean</code> |  | Not used anymore. Listen to event `violated.daterangepicker` to react on invalid input data |
| applyButtonClasses | <code>string</code> | <code>&quot;btn-primary&quot;</code> | CSS class names that will be added only to the apply button |
| cancelButtonClasses | <code>string</code> | <code>&quot;btn-default&quot;</code> | CSS class names that will be added only to the cancel button |
| buttonClasses | <code>string</code> |  | Default: `'btn btn-sm'`<br/>CSS class names that will be added to both the apply and cancel buttons. |
| weekendClasses | <code>string</code> | <code>&quot;weekend&quot;</code> | CSS class names that will be used to highlight weekend days.<br/> Use `null` or empty string if you don't like to highlight weekend days. |
| weekendDayClasses | <code>string</code> | <code>&quot;weekend-day&quot;</code> | CSS class names that will be used to highlight weekend day names.<br/> Weekend days are evaluated by [Info.getWeekendWeekdays](https://moment.github.io/luxon/api-docs/index.html#infogetweekendweekdays) and depend on current  locale settings. Use `null` or empty string if you don't like to highlight weekend day names. |
| todayClasses | <code>string</code> | <code>&quot;today&quot;</code> | CSS class names that will be used to highlight the current day.<br/> Use `null` or empty string if you don't like to highlight the current day. |
| externalStyle | <code>string</code> | <code>null</code> | External CSS Framework to style the picker. Currently only `'bulma'` is supported. |
| opens | <code>string</code> | <code>&quot;right&quot;</code> | Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.<br/> `'left' \| 'right' \| 'center'` |
| drops | <code>string</code> | <code>&quot;down&quot;</code> | Whether the picker appears below or above the HTML element it's attached to.<br/> `'down' \| 'up' \| 'auto'` |
| ranges | <code>object</code> | <code>{}</code> | Set predefined date [Ranges](#Ranges) the user can select from. Each key is the label for the range,  and its value an array with two dates representing the bounds of the range. |
| showCustomRangeLabel | <code>boolean</code> | <code>true</code> | Displays "Custom Range" at the end of the list of predefined [Ranges](#Ranges),  when the ranges option is used.<br> This option will be highlighted whenever the current date range selection does not match one of the predefined ranges.<br/> Clicking it will display the calendars to select a new range. |
| alwaysShowCalendars | <code>boolean</code> | <code>false</code> | Normally, if you use the ranges option to specify pre-defined date ranges,  calendars for choosing a custom date range are not shown until the user clicks "Custom Range".<br/> When this option is set to true, the calendars for choosing a custom date range are always shown instead. |
| locale | <code>object</code> | <code>{}</code> | Allows you to provide localized strings for buttons and labels, customize the date format,  and change the first day of week for the calendars. |
| locale.direction | <code>string</code> | <code>&quot;ltr&quot;</code> | Direction of reading, `'ltr'` or `'rtl'` |
| locale.format | <code>object</code> \| <code>string</code> |  | Default: `DateTime.DATE_SHORT` or `DateTime.DATETIME_SHORT` when `timePicker: true`<br/>Date formats.  Either given as string, see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according  to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)<br/> I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets). |
| locale.separator | <code>string</code> |  | Defaut: `' - '`<br/>Separator for start and end time |
| locale.weekLabel | <code>string</code> | <code>&quot;W&quot;</code> | Label for week numbers |
| locale.daysOfWeek | <code>Array</code> |  | Default: `luxon.Info.weekdays('short')`<br/>Array with weekday names, from Monday to Sunday |
| locale.monthNames | <code>Array</code> |  | Default: `luxon.Info.months('long')`<br/>Array with month names |
| locale.firstDay | <code>number</code> |  | Default: `luxon.Info.getStartOfWeek()`<br/>First day of the week, 1 for Monday through 7 for Sunday |
| locale.applyLabel | <code>string</code> | <code>&quot;Apply&quot;</code> | Label of `Apply` Button |
| locale.cancelLabel | <code>string</code> | <code>&quot;Cancel&quot;</code> | Label of `Cancel` Button |
| locale.customRangeLabel | <code>string</code> | <code>&quot;Custom&quot;</code> | Range - Title for custom ranges |
| locale.durationFormat | <code>object</code> \| <code>string</code> | <code>{}</code> | Format a custom label for selected duration, for example `'5 Days, 12 Hours'`.<br/> Define the format either as string, see [Duration.toFormat - Format Tokens](https://moment.github.io/luxon/api-docs/index.html#durationtoformat) or  an object according to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options),  see [Duration.toHuamn](https://moment.github.io/luxon/api-docs/index.html#durationtohuman). |

<a name="Ranges"></a>

## Ranges : <code>Object</code>
A set of predefined ranges

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the range |
| range | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | Array of 2 elements with startDate and endDate |

**Example**  
```js
{
 'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
 'Yesterday': [DateTime.now().startOf('day').minus({days: 1}), DateTime.now().minus({days: 1}).endOf('day')],
 'Last 7 Days': [DateTime.now().startOf('day').minus({days: 6}), DateTime.now()],
 'Last 30 Days': [DateTime.now().startOf('day').minus({days: 29}), DateTime.now()],
 'This Month': [DateTime.now().startOf('day').startOf('month'), DateTime.now().endOf('month')],
 'Last Month': [DateTime.now().startOf('day').minus({months: 1}).startOf('month'), DateTime.now().minus({months: 1}).endOf('month')]
}
```
<a name="Range"></a>

## Range : <code>Object</code>
A single predefined range

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the range |
| range | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | Array of 2 elements with startDate and endDate |

**Example**  
```js
{ Today: [DateTime.now().startOf('day'), DateTime.now().endOf('day')] }        
```
<a name="InputViolation"></a>

## InputViolation : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Violation of startDate |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| <code>undefined</code> | Violation of endDate |
| reason | <code>Array</code> | The constraint which violates the input |
| old | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Old value startDate/endDate |
| new | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Corrected value of startDate/endDate |

<a name="callback"></a>

## callback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected startDate |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected endDate |
| range | <code>string</code> |  |

# #   C l a s s e s 
 
 
 
 < d l > 
 
 < d t > < a   h r e f = " # D a t e R a n g e P i c k e r " > D a t e R a n g e P i c k e r < / a > < / d t > 
 
 < d d > < / d d > 
 
 < / d l > 
 
 
 
 # #   E v e n t s 
 
 
 
 < d l > 
 
 < d t > < a   h r e f = " # e v e n t _ v i o l a t e d . d a t e r a n g e p i c k e r " > " v i o l a t e d . d a t e r a n g e p i c k e r "   ( t h i s ,   v i o l a t i o n s ) < / a >   �� �   < c o d e > b o o l e a n < / c o d e > < / d t > 
 
 < d d > < p > E m i t t e d   i f   t h e   i n p u t   v a l u e s   a r e   n o t   c o m p l i a n t   t o   a l l   c o n s t r a i n t s < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ b e f o r e R e n d e r C a l e n d a r . d a t e r a n g e p i c k e r " > " b e f o r e R e n d e r C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   b e f o r e   t h e   c a l e n d a r   i s   r e n d e r e d .   
 
 U s e f u l   t o   r e m o v e   a n y   m a n u a l l y   a d d e d   e l e m e n t s . < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ b e f o r e R e n d e r T i m e P i c k e r . d a t e r a n g e p i c k e r " > " b e f o r e R e n d e r T i m e P i c k e r . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   b e f o r e   t h e   T i m e P i c k e r   i s   r e n d e r e d . 
 
 U s e f u l   t o   r e m o v e   a n y   m a n u a l l y   a d d e d   e l e m e n t s . < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ s h o w . d a t e r a n g e p i c k e r " > " s h o w . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   p i c k e r   i s   s h o w n < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ b e f o r e H i d e . d a t e r a n g e p i c k e r " > " b e f o r e H i d e . d a t e r a n g e p i c k e r "   ( t h i s ) < / a >   �� �   < c o d e > b o o l e a n < / c o d e > < / d t > 
 
 < d d > < p > E m i t t e d   b e f o r e   t h e   p i c k e r   w i l l   h i d e .   W h e n   E v e n t H a n d l e r   r e t u r n s   < c o d e > t r u e < / c o d e > ,   t h e n   p i c k e r   r e m a i n s   v i s i b l e < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ h i d e . d a t e r a n g e p i c k e r " > " h i d e . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   p i c k e r   i s   h i d d e n < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ o u t s i d e C l i c k . d a t e r a n g e p i c k e r " > " o u t s i d e C l i c k . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   u s e r   c l i c k s   o u t s i d e   t h e   p i c k e r .   
 
 U s e   o p t i o n   < c o d e > o n O u t s i d e C l i c k < / c o d e >   t o   d e f i n e   t h e   d e f a u l t   a c t i o n ,   t h e n   y o u   m a y   n o t   n e e d   t o   h a n d l e   t h i s   e v e n t . < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ s h o w C a l e n d a r . d a t e r a n g e p i c k e r " > " s h o w C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   c a l e n d a r ( s )   a r e   s h o w n . 
 
 O n l y   u s e f u l   w h e n   < a   h r e f = " # R a n g e s " > R a n g e s < / a >   a r e   u s e d . < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ h i d e C a l e n d a r . d a t e r a n g e p i c k e r " > " h i d e C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   c a l e n d a r ( s )   a r e   h i d d e n . 
 
 O n l y   u s e f u l   w h e n   < a   h r e f = " # R a n g e s " > R a n g e s < / a >   a r e   u s e d . < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ d a t e C h a n g e . d a t e r a n g e p i c k e r " > " d a t e C h a n g e . d a t e r a n g e p i c k e r "   ( t h i s ,   s i d e ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   d a t e   c h a n g e d .   D o e s   n o t   t r i g g e r   w h e n   t i m e   i s   c h a n g e d ,   
 
 u s e   < a   h r e f = " # e v e n t _ t i m e C h a n g e . d a t e r a n g e p i c k e r " > & q u o t ; t i m e C h a n g e . d a t e r a n g e p i c k e r & q u o t ; < / a >   t o   h a n d l e   i t < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ a p p l y . d a t e r a n g e p i c k e r " > " a p p l y . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   < c o d e > A p p l y < / c o d e >   b u t t o n   i s   c l i c k e d ,   o r   w h e n   a   p r e d e f i n e d   < a   h r e f = " # R a n g e s " > R a n g e s < / a >   i s   c l i c k e d < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ c a n c e l . d a t e r a n g e p i c k e r " > " c a n c e l . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   < c o d e > C a n c e l < / c o d e >   b u t t o n   i s   c l i c k e d < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ t i m e C h a n g e . d a t e r a n g e p i c k e r " > " t i m e C h a n g e . d a t e r a n g e p i c k e r "   ( t h i s ,   s i d e ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   t i m e   c h a n g e d .   D o e s   n o t   t r i g g e r   w h e n   d a t e   i s   c h a n g e d < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # e v e n t _ i n p u t C h a n g e d . d a t e r a n g e p i c k e r " > " i n p u t C h a n g e d . d a t e r a n g e p i c k e r "   ( t h i s ) < / a > < / d t > 
 
 < d d > < p > E m i t t e d   w h e n   t h e   d a t e   i s   c h a n g e d   t h r o u g h   < c o d e > & l t ; i n p u t & g t ; < / c o d e >   e l e m e n t .   E v e n t   i s   o n l y   t r i g g e r e d   w h e n   d a t e   s t r i n g   i s   v a l i d   a n d   d a t e   v a l u e   h a s   c h a n g e d < / p > 
 
 < / d d > 
 
 < / d l > 
 
 
 
 # #   T y p e d e f s 
 
 
 
 < d l > 
 
 < d t > < a   h r e f = " # O p t i o n s " > O p t i o n s < / a > < / d t > 
 
 < d d > < p > O p t i o n s   f o r   D a t e R a n g e P i c k e r < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # R a n g e s " > R a n g e s < / a >   :   < c o d e > O b j e c t < / c o d e > < / d t > 
 
 < d d > < p > A   s e t   o f   p r e d e f i n e d   r a n g e s < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # R a n g e " > R a n g e < / a >   :   < c o d e > O b j e c t < / c o d e > < / d t > 
 
 < d d > < p > A   s i n g l e   p r e d e f i n e d   r a n g e < / p > 
 
 < / d d > 
 
 < d t > < a   h r e f = " # I n p u t V i o l a t i o n " > I n p u t V i o l a t i o n < / a >   :   < c o d e > O b j e c t < / c o d e > < / d t > 
 
 < d d > < / d d > 
 
 < d t > < a   h r e f = " # c a l l b a c k " > c a l l b a c k < / a >   :   < c o d e > f u n c t i o n < / c o d e > < / d t > 
 
 < d d > < / d d > 
 
 < / d l > 
 
 
 
 < a   n a m e = " D a t e R a n g e P i c k e r " > < / a > 
 
 
 
 # #   D a t e R a n g e P i c k e r 
 
 * * K i n d * * :   g l o b a l   c l a s s     
 
 
 
 *   [ D a t e R a n g e P i c k e r ] ( # D a t e R a n g e P i c k e r ) 
 
         *   [ n e w   D a t e R a n g e P i c k e r ( e l e m e n t ,   o p t i o n s ,   c b ) ] ( # n e w _ D a t e R a n g e P i c k e r _ n e w ) 
 
         *   _ i n s t a n c e _ 
 
                 *   [ . s e t S t a r t D a t e ( s t a r t D a t e ,   i s V a l i d ) ] ( # D a t e R a n g e P i c k e r + s e t S t a r t D a t e ) 
 
                 *   [ . s e t E n d D a t e ( e n d D a t e ,   i s V a l i d ) ] ( # D a t e R a n g e P i c k e r + s e t E n d D a t e ) 
 
                 *   [ . s e t P e r i o d ( s t a r t D a t e ,   e n d D a t e ,   i s V a l i d ) ] ( # D a t e R a n g e P i c k e r + s e t P e r i o d ) 
 
                 *   [ . v a l i d a t e I n p u t ( [ r a n g e ] ) ] ( # D a t e R a n g e P i c k e r + v a l i d a t e I n p u t )   �� �   < c o d e > A r r a y < / c o d e >   \ |   < c o d e > n u l l < / c o d e > 
 
                 *   [ . u p d a t e V i e w ( ) ] ( # D a t e R a n g e P i c k e r + u p d a t e V i e w ) 
 
                 *   [ . s h o w C a l e n d a r s ( ) ] ( # D a t e R a n g e P i c k e r + s h o w C a l e n d a r s ) 
 
                 *   [ . h i d e C a l e n d a r s ( ) ] ( # D a t e R a n g e P i c k e r + h i d e C a l e n d a r s ) 
 
                 *   [ . u p d a t e E l e m e n t ( ) ] ( # D a t e R a n g e P i c k e r + u p d a t e E l e m e n t ) 
 
                 *   [ . r e m o v e ( ) ] ( # D a t e R a n g e P i c k e r + r e m o v e ) 
 
         *   _ s t a t i c _ 
 
                 *   [ . d a t e r a n g e p i c k e r ( o p t i o n s ,   c a l l b a c k ) ] ( # D a t e R a n g e P i c k e r . d a t e r a n g e p i c k e r )   �� � 
 
 
 
 < a   n a m e = " n e w _ D a t e R a n g e P i c k e r _ n e w " > < / a > 
 
 
 
 # # #   n e w   D a t e R a n g e P i c k e r ( e l e m e n t ,   o p t i o n s ,   c b ) 
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   e l e m e n t   |   [ < c o d e > j Q u e r y < / c o d e > ] ( h t t p s : / / a p i . j q u e r y . c o m / T y p e s / # j Q u e r y / )   |   j Q u e r y   s e l e c t o r   o f   t h e   p a r e n t   e l e m e n t   t h a t   t h e   d a t e   r a n g e   p i c k e r   w i l l   b e   a d d e d   t o   | 
 
 |   o p t i o n s   |   [ < c o d e > O p t i o n s < / c o d e > ] ( # O p t i o n s )   |   O b j e c t   t o   c o n f i g u r e   t h e   D a t e R a n g e P i c k e r   | 
 
 |   c b   |   < c o d e > f u n c t i o n < / c o d e >   |   C a l l b a c k   f u n c t i o n   e x e c u t e d   w h e n   | 
 
 
 
 < a   n a m e = " D a t e R a n g e P i c k e r + s e t S t a r t D a t e " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . s e t S t a r t D a t e ( s t a r t D a t e ,   i s V a l i d ) 
 
 S e t s   t h e   d a t e   r a n g e   p i c k e r ' s   c u r r e n t l y   s e l e c t e d   s t a r t   d a t e   t o   t h e   p r o v i d e d   d a t e . < b r / > 
 
 ` s t a r t D a t e `   m u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( I S O - 8 6 0 1 )   o r   
 
 a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` . 
 
 T h e   v a l u e   o f   t h e   a t t a c h e d   ` < i n p u t > `   e l e m e n t   i s   a l s o   u p d a t e d . 
 
 D a t e   v a l u e   i s   r o u n d e d   t o   m a t c h   o p t i o n   ` t i m e P i c k e r S t e p S i z e `   u n l e s s   s k i p p e d   b y   ` v i o l a t e d . d a t e r a n g e p i c k e r `   e v e n t   h a n d l e r . < b r / > 
 
 I f   t h e   ` s t a r t D a t e `   d o e s   n o t   f a l l   i n t o   ` m i n D a t e `   a n d   ` m a x D a t e `   t h e n   ` s t a r t D a t e `   i s   s h i f t e d   u n l e s s   s k i p p e d   b y   ` v i o l a t e d . d a t e r a n g e p i c k e r `   e v e n t   h a n d l e r . 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * T h r o w s * * : 
 
 
 
 -   ` R a n g e E r r o r `   f o r   i n v a l i d   d a t e   v a l u e s . 
 
 
 
 
 
 |   P a r a m   |   T y p e   |   D e f a u l t   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   |   - - -   | 
 
 |   s t a r t D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |     |   s t a r t D a t e   t o   b e   s e t   | 
 
 |   i s V a l i d   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   I f   ` t r u e `   t h e n   t h e   ` s t a r t D a t e `   i s   n o t   c h e c k e d   a g a i n s t   ` m i n D a t e `   a n d   ` m a x D a t e ` < b r / >   U s e   t h i s   o p t i o n   o n l y   i f   y o u   a r e   s u r e   a b o u t   t h e   v a l u e   y o u   p u t   i n .   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 c o n s t   D a t e T i m e   =   l u x o n . D a t e T i m e ; 
 
 c o n s t   d r p   =   $ ( ' # p i c k e r ' ) . d a t a ( ' d a t e r a n g e p i c k e r ' ) ; 
 
 d r p . s e t S t a r t D a t e ( D a t e T i m e . n o w ( ) . s t a r t O f ( ' h o u r ' ) ) ; 
 
 ` ` ` 
 
 < a   n a m e = " D a t e R a n g e P i c k e r + s e t E n d D a t e " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . s e t E n d D a t e ( e n d D a t e ,   i s V a l i d ) 
 
 S e t s   t h e   d a t e   r a n g e   p i c k e r ' s   c u r r e n t l y   s e l e c t e d   e n d   d a t e   t o   t h e   p r o v i d e d   d a t e . < b r / > 
 
 ` e n d D a t e `   m u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( I S O - 8 6 0 1 )   o r   
 
 a   s t r i n g   m a t c h i n g ` l o c a l e . f o r m a t ` . 
 
 T h e   v a l u e   o f   t h e   a t t a c h e d   ` < i n p u t > `   e l e m e n t   i s   a l s o   u p d a t e d . 
 
 D a t e   v a l u e   i s   r o u n d e d   t o   m a t c h   o p t i o n   ` t i m e P i c k e r S t e p S i z e `   u n l e s s   s k i p p e d   b y   ` v i o l a t e d . d a t e r a n g e p i c k e r `   e v e n t   h a n d l e r . < b r / > 
 
 I f   t h e   ` e n d D a t e `   d o e s   n o t   f a l l   i n t o     ` m i n D a t e `   a n d   ` m a x D a t e `   o r   i n t o   ` m i n S p a n `   a n d   ` m a x S p a n ` 
 
 t h e n   ` e n d D a t e `   i s   s h i f t e d   u n l e s s   s k i p p e d   b y   ` v i o l a t e d . d a t e r a n g e p i c k e r `   e v e n t   h a n d l e r 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * T h r o w s * * : 
 
 
 
 -   ` R a n g e E r r o r `   f o r   i n v a l i d   d a t e   v a l u e s . 
 
 
 
 
 
 |   P a r a m   |   T y p e   |   D e f a u l t   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   |   - - -   | 
 
 |   e n d D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |     |   e n d D a t e   t o   b e   s e t   | 
 
 |   i s V a l i d   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   I f   ` t r u e `   t h e n   t h e   ` e n d D a t e `   i s   n o t   c h e c k e d   a g a i n s t   ` m i n D a t e ` ,   ` m a x D a t e `   a n d   ` m i n S p a n ` ,   ` m a x S p a n ` < b r / >   U s e   t h i s   o p t i o n   o n l y   i f   y o u   a r e   s u r e   a b o u t   t h e   v a l u e   y o u   p u t   i n .   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 c o n s t   d r p   =   $ ( ' # p i c k e r ' ) . d a t a ( ' d a t e r a n g e p i c k e r ' ) ; 
 
 d r p . s e t E n d D a t e ( ' 2 0 2 5 - 0 3 - 2 8 T 1 8 : 3 0 : 0 0 ' ) ; 
 
 ` ` ` 
 
 < a   n a m e = " D a t e R a n g e P i c k e r + s e t P e r i o d " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . s e t P e r i o d ( s t a r t D a t e ,   e n d D a t e ,   i s V a l i d ) 
 
 S h o r t c u t   f o r   [ s e t S t a r t D a t e ] ( # D a t e R a n g e P i c k e r + s e t S t a r t D a t e )   a n d   [ s e t E n d D a t e ] ( # D a t e R a n g e P i c k e r + s e t E n d D a t e ) 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * T h r o w s * * : 
 
 
 
 -   ` R a n g e E r r o r `   f o r   i n v a l i d   d a t e   v a l u e s . 
 
 
 
 
 
 |   P a r a m   |   T y p e   |   D e f a u l t   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   |   - - -   | 
 
 |   s t a r t D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |     |   s t a r t D a t e   t o   b e   s e t   | 
 
 |   e n d D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |     |   e n d D a t e   t o   b e   s e t   | 
 
 |   i s V a l i d   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   I f   ` t r u e `   t h e n   t h e   ` s t a r t D a t e `   a n d   ` e n d D a t e `   a r e   n o t   c h e c k e d   a g a i n s t   ` m i n D a t e ` ,   ` m a x D a t e `   a n d   ` m i n S p a n ` ,   ` m a x S p a n ` < b r / >   U s e   t h i s   o p t i o n   o n l y   i f   y o u   a r e   s u r e   a b o u t   t h e   v a l u e   y o u   p u t   i n .   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 c o n s t   D a t e T i m e   =   l u x o n . D a t e T i m e ; 
 
 c o n s t   d r p   =   $ ( ' # p i c k e r ' ) . d a t a ( ' d a t e r a n g e p i c k e r ' ) ; 
 
 d r p . s e t P e r i o d ( D a t e T i m e . n o w ( ) . s t a r t O f ( ' w e e k ' ) ,   D a t e T i m e . n o w ( ) . s t a r t O f ( ' w e e k ' ) . p l u s ( { d a y s :   1 0 } ) ) ; 
 
 ` ` ` 
 
 < a   n a m e = " D a t e R a n g e P i c k e r + v a l i d a t e I n p u t " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . v a l i d a t e I n p u t ( [ r a n g e ] )   �� �   < c o d e > A r r a y < / c o d e >   \ |   < c o d e > n u l l < / c o d e > 
 
 V a l i d a t e   ` s t a r t D a t e `   a n d   ` e n d D a t e `   o r   ` r a n g e `   a g a i n s t   ` t i m e P i c k e r S t e p S i z e ` ,   ` m i n D a t e ` ,   ` m a x D a t e ` ,   
 
 ` m i n S p a n ` ,   ` m a x S p a n ` ,   ` i n v a l i d D a t e `   a n d   ` i n v a l i d T i m e `   a n d   c o r r e c t s   t h e m ,   i f   n e e d e d .   
 
 C o r r e c t i o n   c a n   b e   s k i p p e d   b y   r e t u r n i n g   ` t r u e `   a t   e v e n t   l i s t e n e r   f o r   ` v i o l a t e d . d a t e r a n g e p i c k e r ` 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * R e t u r n s * * :   < c o d e > A r r a y < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   -   -   C o r r e c t e d   r a n g e   a s   a r r a y   o f   ` [ s t a r t D a t e ,   e n d D a t e ] `   w h e n   ` r a n g e `   i s   d e f i n e d     
 
 * * E m i t s * * :   < c o d e > e v e n t : & q u o t ; v i o l a t e d . d a t e r a n g e p i c k e r & q u o t ; < / c o d e >     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   [ r a n g e ]   |   < c o d e > A r r a y < / c o d e >   |   U s e d   t o   c h e c k   p r e f e f i n e d   r a n g e   i n s t e a d   o f   ` s t a r t D a t e `   a n d   ` e n d D a t e `   = >   ` [ n a m e ,   s t a r t D a t e ,   e n d D a t e ] `   W h e n   s e t ,   t h e n   f u n c t i o n   d o e s   n o t   m o d i f y   a n y t h i n g ,   j u s t   r e t u r n i n g   c o r r e c t e d   r a n g e .   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 v a l i d a t e I n p u t ( [ D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 0 3 ' ) ,   D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 2 5 ' ) ] )   = >   
 
 [   D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 0 5 ' ) ,   D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 2 0 ' ) ,   {   s t a r t D a t e :   {   v i o l a t i o n s :   [ { o l d :   . . . ,   n e w :   . . . ,   r e a s s o n :   ' m i n D a t e ' } ]   }   }   ] 
 
 ` ` ` 
 
 < a   n a m e = " D a t e R a n g e P i c k e r + u p d a t e V i e w " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . u p d a t e V i e w ( ) 
 
 U p d a t e s   t h e   p i c k e r   w h e n   c a l e n d a r   i s   i n i t i a t e d   o r   a n y   d a t e   h a s   b e e n   s e l e c t e d .   
 
 C o u l d   b e   u s e f u l   a f t e r   r u n n i n g   [ s e t S t a r t D a t e ] ( # D a t e R a n g e P i c k e r + s e t S t a r t D a t e )   o r   [ s e t E n d D a t e ] ( # D a t e R a n g e P i c k e r + s e t E n d D a t e ) 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * E m i t s * * :   < c o d e > e v e n t : & q u o t ; b e f o r e R e n d e r T i m e P i c k e r . d a t e r a n g e p i c k e r & q u o t ; < / c o d e >     
 
 < a   n a m e = " D a t e R a n g e P i c k e r + s h o w C a l e n d a r s " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . s h o w C a l e n d a r s ( ) 
 
 S h o w s   c a l e n d a r   w h e n   u s e r   s e l e c t s   " C u s t o m   R a n g e s " 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * E m i t s * * :   < c o d e > e v e n t : & q u o t ; s h o w C a l e n d a r . d a t e r a n g e p i c k e r & q u o t ; < / c o d e >     
 
 < a   n a m e = " D a t e R a n g e P i c k e r + h i d e C a l e n d a r s " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . h i d e C a l e n d a r s ( ) 
 
 H i d e s   c a l e n d a r   w h e n   u s e r   s e l e c t s   a   p r e d e f i n e d   r a n g e 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * E m i t s * * :   < c o d e > e v e n t : & q u o t ; h i d e C a l e n d a r . d a t e r a n g e p i c k e r & q u o t ; < / c o d e >     
 
 < a   n a m e = " D a t e R a n g e P i c k e r + u p d a t e E l e m e n t " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . u p d a t e E l e m e n t ( ) 
 
 U p d a t e   a t t a c h e d   ` < i n p u t > `   e l e m e n t   w i t h   s e l e c t e d   v a l u e 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * E m i t s * * :   [ < c o d e > c h a n g e < / c o d e > ] ( h t t p s : / / a p i . j q u e r y . c o m / c h a n g e / )     
 
 < a   n a m e = " D a t e R a n g e P i c k e r + r e m o v e " > < / a > 
 
 
 
 # # #   d a t e R a n g e P i c k e r . r e m o v e ( ) 
 
 R e m o v e s   t h e   p i c k e r   f r o m   d o c u m e n t 
 
 
 
 * * K i n d * * :   i n s t a n c e   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 < a   n a m e = " D a t e R a n g e P i c k e r . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # # #   D a t e R a n g e P i c k e r . d a t e r a n g e p i c k e r ( o p t i o n s ,   c a l l b a c k )   �� � 
 
 I n i t i a t e   a   n e w   D a t e R a n g e P i c k e r 
 
 
 
 * * K i n d * * :   s t a t i c   m e t h o d   o f   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )     
 
 * * R e t u r n s * * :   D a t e R a n g e P i c k e r     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   o p t i o n s   |   [ < c o d e > O p t i o n s < / c o d e > ] ( # O p t i o n s )   |   O b j e c t   t o   c o n f i g u r e   t h e   D a t e R a n g e P i c k e r   | 
 
 |   c a l l b a c k   |   [ < c o d e > c a l l b a c k < / c o d e > ] ( # c a l l b a c k )   |   C a l l b a c k   f u n c t i o n   e x e c u t e d   w h e n   d a t e   i s   c h a n g e d . < b r / >   C a l l b a c k   f u n c t i o n   i s   e x e c u t e d   i f   s e l e c t e d   d a t e   v a l u e s   h a s   c h a n g e d ,   b e f o r e   p i c k e r   i s   h i d d e n   a n d   b e f o r e   t h e   a t t a c h e d   ` < i n p u t > `   e l e m e n t   i s   u p d a t e d .     A s   a l t e r n a t i v e   l i s t e n   t o   t h e   [ " a p p l y . d a t e r a n g e p i c k e r " ] ( # e v e n t _ a p p l y . d a t e r a n g e p i c k e r )   e v e n t   | 
 
 
 
 < a   n a m e = " e v e n t _ v i o l a t e d . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " v i o l a t e d . d a t e r a n g e p i c k e r "   ( t h i s ,   v i o l a t i o n s )   �� �   < c o d e > b o o l e a n < / c o d e > 
 
 E m i t t e d   i f   t h e   i n p u t   v a l u e s   a r e   n o t   c o m p l i a n t   t o   a l l   c o n s t r a i n t s 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 * * R e t u r n s * * :   < c o d e > b o o l e a n < / c o d e >   -   s k i p   -   I f   ` t r u e ` ,   t h e n   i n p u t   v a l u e s   a r e   n o t   c o r r e c t e d   a n d   r e m a i n   i n v a l i d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 |   v i o l a t i o n s   |   [ < c o d e > I n p u t V i o l a t i o n < / c o d e > ] ( # I n p u t V i o l a t i o n )   |   A n   o b j e c t   o f   i n p u t   v i o l a t i o n s   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 $ ( ' # p i c k e r ' ) . o n ( ' v i o l a t e d . d a t e r a n g e p i c k e r ' ,   ( e v ,   p i c k e r ,   v i o l a t i o n s ) ) 
 
 [   D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 0 5 ' ) ,   D a t e T i m e . f r o m I S O ( ' 2 0 2 5 - 0 2 - 2 0 ' ) ,   {   s t a r t D a t e :   {   v i o l a t i o n s :   [ { o l d :   . . . ,   n e w :   . . . ,   r e a s s o n :   ' m i n D a t e ' } ]   }   }   ] 
 
 ` ` ` 
 
 < a   n a m e = " e v e n t _ b e f o r e R e n d e r C a l e n d a r . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " b e f o r e R e n d e r C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   b e f o r e   t h e   c a l e n d a r   i s   r e n d e r e d .   
 
 U s e f u l   t o   r e m o v e   a n y   m a n u a l l y   a d d e d   e l e m e n t s . 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ b e f o r e R e n d e r T i m e P i c k e r . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " b e f o r e R e n d e r T i m e P i c k e r . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   b e f o r e   t h e   T i m e P i c k e r   i s   r e n d e r e d . 
 
 U s e f u l   t o   r e m o v e   a n y   m a n u a l l y   a d d e d   e l e m e n t s . 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ s h o w . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " s h o w . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   p i c k e r   i s   s h o w n 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ b e f o r e H i d e . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " b e f o r e H i d e . d a t e r a n g e p i c k e r "   ( t h i s )   �� �   < c o d e > b o o l e a n < / c o d e > 
 
 E m i t t e d   b e f o r e   t h e   p i c k e r   w i l l   h i d e .   W h e n   E v e n t H a n d l e r   r e t u r n s   ` t r u e ` ,   t h e n   p i c k e r   r e m a i n s   v i s i b l e 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 * * R e t u r n s * * :   < c o d e > b o o l e a n < / c o d e >   -   c a n c e l   -   I f   ` t r u e ` ,   t h e n   t h e   p i c k e r   r e m a i n s   v i s i b l e     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ h i d e . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " h i d e . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   p i c k e r   i s   h i d d e n 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ o u t s i d e C l i c k . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " o u t s i d e C l i c k . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   u s e r   c l i c k s   o u t s i d e   t h e   p i c k e r .   
 
 U s e   o p t i o n   ` o n O u t s i d e C l i c k `   t o   d e f i n e   t h e   d e f a u l t   a c t i o n ,   t h e n   y o u   m a y   n o t   n e e d   t o   h a n d l e   t h i s   e v e n t . 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ s h o w C a l e n d a r . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " s h o w C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   c a l e n d a r ( s )   a r e   s h o w n . 
 
 O n l y   u s e f u l   w h e n   [ R a n g e s ] ( # R a n g e s )   a r e   u s e d . 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ h i d e C a l e n d a r . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " h i d e C a l e n d a r . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   c a l e n d a r ( s )   a r e   h i d d e n . 
 
 O n l y   u s e f u l   w h e n   [ R a n g e s ] ( # R a n g e s )   a r e   u s e d . 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ d a t e C h a n g e . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " d a t e C h a n g e . d a t e r a n g e p i c k e r "   ( t h i s ,   s i d e ) 
 
 E m i t t e d   w h e n   t h e   d a t e   c h a n g e d .   D o e s   n o t   t r i g g e r   w h e n   t i m e   i s   c h a n g e d ,   
 
 u s e   [ " t i m e C h a n g e . d a t e r a n g e p i c k e r " ] ( # e v e n t _ t i m e C h a n g e . d a t e r a n g e p i c k e r )   t o   h a n d l e   i t 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 |   s i d e   |   < c o d e > s t r i n g < / c o d e >   |   E i t h e r   ` ' s t a r t ' `   o r   ` ' e n d ' `   i n d i c a t i n g   w h e t h e r   s t a r t D a t e   o r   e n d D a t e   w a s   c h a n g e d .   ` n u l l `   w h e n   ` s i n g l e D a t e P i c k e r :   t r u e `   | 
 
 
 
 < a   n a m e = " e v e n t _ a p p l y . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " a p p l y . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   ` A p p l y `   b u t t o n   i s   c l i c k e d ,   o r   w h e n   a   p r e d e f i n e d   [ R a n g e s ] ( # R a n g e s )   i s   c l i c k e d 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ c a n c e l . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " c a n c e l . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   ` C a n c e l `   b u t t o n   i s   c l i c k e d 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " e v e n t _ t i m e C h a n g e . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " t i m e C h a n g e . d a t e r a n g e p i c k e r "   ( t h i s ,   s i d e ) 
 
 E m i t t e d   w h e n   t h e   t i m e   c h a n g e d .   D o e s   n o t   t r i g g e r   w h e n   d a t e   i s   c h a n g e d 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 |   s i d e   |   < c o d e > s t r i n g < / c o d e >   |   E i t h e r   ` ' s t a r t ' `   o r   ` ' e n d ' `   i n d i c a t i n g   w h e t h e r   s t a r t D a t e   o r   e n d D a t e   w a s   c h a n g e d   | 
 
 
 
 < a   n a m e = " e v e n t _ i n p u t C h a n g e d . d a t e r a n g e p i c k e r " > < / a > 
 
 
 
 # #   " i n p u t C h a n g e d . d a t e r a n g e p i c k e r "   ( t h i s ) 
 
 E m i t t e d   w h e n   t h e   d a t e   i s   c h a n g e d   t h r o u g h   ` < i n p u t > `   e l e m e n t .   E v e n t   i s   o n l y   t r i g g e r e d   w h e n   d a t e   s t r i n g   i s   v a l i d   a n d   d a t e   v a l u e   h a s   c h a n g e d 
 
 
 
 * * K i n d * * :   e v e n t   e m i t t e d     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   t h i s   |   [ < c o d e > D a t e R a n g e P i c k e r < / c o d e > ] ( # D a t e R a n g e P i c k e r )   |   T h e   d a t e r a n g e p i c k e r   o b j e c t   | 
 
 
 
 < a   n a m e = " O p t i o n s " > < / a > 
 
 
 
 # #   O p t i o n s 
 
 O p t i o n s   f o r   D a t e R a n g e P i c k e r 
 
 
 
 * * K i n d * * :   g l o b a l   t y p e d e f     
 
 * * P r o p e r t i e s * * 
 
 
 
 |   N a m e   |   T y p e   |   D e f a u l t   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   |   - - -   | 
 
 |   p a r e n t E l   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; b o d y & q u o t ; < / c o d e >   |   [ j Q u e r y   s e l e c t o r ] ( h t t p s : / / a p i . j q u e r y . c o m / c a t e g o r y / s e l e c t o r s / )   o f   t h e   p a r e n t   e l e m e n t   t h a t   t h e   d a t e   r a n g e   p i c k e r   w i l l   b e   a d d e d   t o   | 
 
 |   s t a r t D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   D e f a u l t :   ` D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) ` < b r / > T h e   b e g i n n i n g   d a t e   o f   t h e   i n i t i a l l y   s e l e c t e d   d a t e   r a n g e . < b r / >   M u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   o r   a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` . < b r / >   D a t e   v a l u e   i s   r o u n d e d   t o   m a t c h   o p t i o n   ` t i m e P i c k e r S t e p S i z e ` < b r / >   O p t i o n   ` i s I n v a l i d D a t e `   a n d   ` i s I n v a l i d T i m e `   a r e   n o t   e v a l u a t e d ,   y o u   m a y   s e t   d a t e / t i m e   w h i c h   i s   n o t   s e l e c t a b l e   i n   c a l e n d a r . < b r / >   I f   t h e   d a t e   d o e s   n o t   f a l l   i n t o   ` m i n D a t e `   a n d   ` m a x D a t e `   t h e n   d a t e   i s   s h i f t e d   a n d   a   w a r n i n g   i s   w r i t t e n   t o   c o n s o l e . < b r / >   U s e   ` s t a r t D a t e :   n u l l `   t o   s h o w   c a l e n d a r   w i t h o u t   a n   i n i t a l   s e l e c t e d   d a t e .   | 
 
 |   e n d D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |     |   D e f a u t l :   ` D a t e T i m e . n o w ( ) . e n d O f ( ' d a y ' ) ` < b r / > T h e   e n d   d a t e   o f   t h e   i n i t i a l l y   s e l e c t e d   d a t e   r a n g e . < b r / >   M u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   o r   a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` . < b r / >   D a t e   v a l u e   i s   r o u n d e d   t o   m a t c h   o p t i o n   ` t i m e P i c k e r S t e p S i z e ` < b r / >   O p t i o n   ` i s I n v a l i d D a t e ` ,   ` i s I n v a l i d T i m e `   a n d   ` m i n S p a n ` ,   ` m a x S p a n `   a r e   n o t   e v a l u a t e d ,   y o u   m a y   s e t   d a t e / t i m e   w h i c h   i s   n o t   s e l e c t a b l e   i n   c a l e n d a r . < b r / >   I f   t h e   d a t e   d o e s   n o t   f a l l   i n t o   ` m i n D a t e `   a n d   ` m a x D a t e `   t h e n   d a t e   i s   s h i f t e d   a n d   a   w a r n i n g   i s   w r i t t e n   t o   c o n s o l e . < b r / >   | 
 
 |   m i n D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   T h e   e a r l i e s t   d a t e   a   u s e r   m a y   s e l e c t   o r   ` n u l l `   f o r   n o   l i m i t . < b r / >   M u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   o r   a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` .   | 
 
 |   m a x D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   T h e   l a t e s t   d a t e   a   u s e r   m a y   s e l e c t   o r   ` n u l l `   f o r   n o   l i m i t . < b r / >   M u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   o r   a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` .   | 
 
 |   m i n S p a n   |   [ < c o d e > D u r a t i o n < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u m b e r < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   T h e   m i n i m u m   s p a n   b e t w e e n   t h e   s e l e c t e d   s t a r t   a n d   e n d   d a t e s . < b r / >   M u s t   b e   a   ` l u x o n . D u r a t i o n `   o r   n u m b e r   o f   s e c o n d s   o r   a   s t r i n g   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   d u r a t i o n . < b r / >   I g n o r e d   w h e n   ` s i n g l e D a t e P i c k e r :   t r u e `   | 
 
 |   m a x S p a n   |   [ < c o d e > D u r a t i o n < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u m b e r < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   T h e   m a x i m u m     s p a n   b e t w e e n   t h e   s e l e c t e d   s t a r t   a n d   e n d   d a t e s . < b r / >   M u s t   b e   a   ` l u x o n . D u r a t i o n `   o r   n u m b e r   o f   s e c o n d s   o r   a   s t r i n g   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   d u r a t i o n . < b r / >   I g n o r e d   w h e n   ` s i n g l e D a t e P i c k e r :   t r u e `   | 
 
 |   d e f a u l t S p a n   |   [ < c o d e > D u r a t i o n < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u m b e r < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   T h e   s p a n   w h i c h   i s   u s e d   w h e n   e n d D a t e   i s   a u t o m a t i c a l l y   u p d a t e d   d u e   t o   w r o n g   u s e r   i n p u t < b r / >   M u s t   b e   a   ` l u x o n . D u r a t i o n `   o r   n u m b e r   o f   s e c o n d s   o r   a   s t r i n g   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   d u r a t i o n . < b r / >   I g n o r e d   w h e n   ` s i n g l e D a t e P i c k e r :   t r u e ` .   N o t   r e l e v a n t   i f   ` m i n S p a n :   n u l l `   | 
 
 |   i n i t a l M o n t h   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u l l < / c o d e >   |     |   D e f a u l t :   ` D a t e T i m e . n o w ( ) . s t a r t O f ( ' m o n t h ' ) ` < b r / >   T h e   i n i t a l   m o n t h   s h o w n   w h e n   ` s t a r t D a t e :   n u l l ` .   B e   a w a r e ,   t h e   a t t a c h e d   ` < i n p u t > `   e l e m e n t   m u s t   b e   a l s o   e m p t y . < b r / >   M u s t   b e   a   ` l u x o n . D a t e T i m e `   o r   ` D a t e `   o r   ` s t r i n g `   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   o r   a   s t r i n g   m a t c h i n g   ` l o c a l e . f o r m a t ` . < b r / >   W h e n   ` i n i t a l M o n t h `   i s   u s e d ,   t h e n   ` e n d D a t e `   i s   i g n o r e d   a n d   i t   w o r k s   o n l y   w i t h   ` t i m e P i c k e r :   f a l s e `   | 
 
 |   a u t o A p p l y   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   H i d e   t h e   ` A p p l y `   a n d   ` C a n c e l `   b u t t o n s ,   a n d   a u t o m a t i c a l l y   a p p l y   a   n e w   d a t e   r a n g e   a s   s o o n   a s   t w o   d a t e s   a r e   c l i c k e d . < b r / >   O n l y   u s e f u l   w h e n   ` t i m e P i c k e r :   f a l s e `   | 
 
 |   s i n g l e D a t e P i c k e r   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   S h o w   o n l y   a   s i n g l e   c a l e n d a r   t o   c h o o s e   o n e   d a t e ,   i n s t e a d   o f   a   r a n g e   p i c k e r   w i t h   t w o   c a l e n d a r s . < b r / >   T h e   s t a r t   a n d   e n d   d a t e s   p r o v i d e d   t o   y o u r   c a l l b a c k   w i l l   b e   t h e   s a m e   s i n g l e   d a t e   c h o s e n .   | 
 
 |   s i n g l e M o n t h V i e w   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   S h o w   o n l y   a   s i n g l e   m o n t h   c a l e n d a r ,   u s e f u l   w h e n   s e l e c t e d   r a n g e s   a r e   u s u a l l y   s h o r t < b r / >   o r   f o r   s m a l l e r   v i e w p o r t s   l i k e   m o b i l e   d e v i c e s . < b r / >   I g n o r e d   f o r   ` s i n g l e D a t e P i c k e r :   t r u e ` .   | 
 
 |   s h o w D r o p d o w n s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   S h o w   y e a r   a n d   m o n t h   s e l e c t   b o x e s   a b o v e   c a l e n d a r s   t o   j u m p   t o   a   s p e c i f i c   m o n t h   a n d   y e a r   | 
 
 |   m i n Y e a r   |   < c o d e > n u m b e r < / c o d e >   |     |   D e f a u l t :   ` D a t e T i m e . n o w ( ) . m i n u s ( { y e a r : 1 0 0 } ) . y e a r ` < b r / > T h e   m i n i m u m   y e a r   s h o w n   i n   t h e   d r o p d o w n s   w h e n   ` s h o w D r o p d o w n s :   t r u e `   | 
 
 |   m a x Y e a r   |   < c o d e > n u m b e r < / c o d e >   |     |   D e f a u l t :   ` D a t e T i m e . n o w ( ) . p l u s ( { y e a r : 1 0 0 } ) . y e a r ` < b r / > T h e   m a x i m u m     y e a r   s h o w n   i n   t h e   d r o p d o w n s   w h e n   ` s h o w D r o p d o w n s :   t r u e `   | 
 
 |   s h o w W e e k N u m b e r s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   S h o w   * * l o c a l i z e d * *   w e e k   n u m b e r s   a t   t h e   s t a r t   o f   e a c h   w e e k   o n   t h e   c a l e n d a r s   | 
 
 |   s h o w I S O W e e k N u m b e r s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   S h o w   * * I S O * *   w e e k   n u m b e r s   a t   t h e   s t a r t   o f   e a c h   w e e k   o n   t h e   c a l e n d a r s . < b r / >   T a k e s   p r e c e d e n c e   o v e r   l o c a l i z e d   ` s h o w W e e k N u m b e r s `   | 
 
 |   t i m e P i c k e r   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   A d d s   s e l e c t   b o x e s   t o   c h o o s e   t i m e s   i n   a d d i t i o n   t o   d a t e s   | 
 
 |   t i m e P i c k e r 2 4 H o u r   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > t r u e | f a l s e < / c o d e >   |   U s e   2 4 - h o u r   i n s t e a d   o f   1 2 - h o u r   t i m e s ,   r e m o v i n g   t h e   A M / P M   s e l e c t i o n . < b r / >   D e f a u l t   i s   d e r i v e d   f r o m   c u r r e n t   l o c a l e   [ I n t l . D a t e T i m e F o r m a t . r e s o l v e d O p t i o n s . h o u r 1 2 ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / I n t l / D a t e T i m e F o r m a t / r e s o l v e d O p t i o n s # h o u r 1 2 ) .   | 
 
 |   t i m e P i c k e r S t e p S i z e   |   [ < c o d e > D u r a t i o n < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n )   \ |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > n u m b e r < / c o d e >   |     |   D e f a u l t :   ` D u r a t i o n . f r o m O b j e c t ( { m i n u t e s : 1 } ) ` < b r / > S e t   t h e   t i m e   p i c k e r   s t e p   s i z e . < b r / >   M u s t   b e   a   ` l u x o n . D u r a t i o n `   o r   t h e   n u m b e r   o f   s e c o n d s   o r   a   s t r i n g   a c c o r d i n g   t o   [ I S O - 8 6 0 1 ] ( h t t p s : / / e n . w i k i p e d i a . o r g / w i k i / I S O _ 8 6 0 1 )   d u r a t i o n . < b r / >   V a l i d   v a l u e s   a r e   1 , 2 , 3 , 4 , 5 , 6 , 1 0 , 1 2 , 1 5 , 2 0 , 3 0   f o r   ` D u r a t i o n . f r o m O b j e c t ( { s e c o n d s :   . . . } ) `   a n d   ` D u r a t i o n . f r o m O b j e c t ( { m i n u t e s :   . . . } ) `     a n d   1 , 2 , 3 , 4 , 6 , ( 8 , 1 2 )   f o r   ` D u r a t i o n . f r o m O b j e c t ( { h o u r s :   . . . } ) ` . < b r / >   D u r a t i o n   m u s t   b e   g r e a t e r   t h a n   ` m i n S p a n `   a n d   s m a l l e r   t h a n   ` m a x S p a n ` . < b r / >   F o r   e x a m p l e   ` t i m e P i c k e r S t e p S i z e :   6 0 0 `   w i l l   d i s a b l e   t i m e   p i c k e r   s e c o n d s   a n d   t i m e   p i c k e r   m i n u t e s   a r e   s e t   t o   s t e p   s i z e   o f   1 0   M i n u t e s . < b r / >   O v e r w r i t e s   ` t i m e P i c k e r I n c r e m e n t `   a n d   ` t i m e P i c k e r S e c o n d s ` ,   i g n o r e d   w h e n   ` t i m e P i c k e r :   f a l s e `   | 
 
 |   t i m e P i c k e r S e c o n d s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > b o o l e a n < / c o d e >   |   * * D e p r e c a t e d * * ,   u s e   ` t i m e P i c k e r S t e p S i z e ` < b r / > S h o w   s e c o n d s   i n   t h e   t i m e P i c k e r   | 
 
 |   t i m e P i c k e r I n c r e m e n t   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > 1 < / c o d e >   |   * * D e p r e c a t e d * * ,   u s e   ` t i m e P i c k e r S t e p S i z e ` < b r / > I n c r e m e n t   o f   t h e   m i n u t e s   s e l e c t i o n   l i s t   f o r   t i m e s   | 
 
 |   a u t o U p d a t e I n p u t   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > t r u e < / c o d e >   |   I n d i c a t e s   w h e t h e r   t h e   d a t e   r a n g e   p i c k e r   s h o u l d   i n s t a n t l y   u p d a t e   t h e   v a l u e   o f   t h e   a t t a c h e d   ` < i n p u t > `     e l e m e n t   w h e n   t h e   s e l e c t e d   d a t e s   c h a n g e . < b r / > T h e   ` < i n p u t > `   e l e m e n t   w i l l   b e   a l w a y s   u p d a t e d   o n   ` A p p l y `   a n d   r e v e r t e d   w h e n   u s e r   c l i c k s   o n   ` C a n c e l ` .   | 
 
 |   o n O u t s i d e C l i c k   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; a p p l y & q u o t ; < / c o d e >   |   D e f i n e s   w h a t   p i c k e r   s h a l l   d o   w h e n   u s e r   c l i c k s   o u t s i d e   t h e   c a l e n d a r .     ` ' a p p l y ' `   o r   ` ' c a n c e l ' ` .   E v e n t   [ o n O u t s i d e C l i c k . d a t e r a n g e p i c k e r ] ( # e v e n t _ o u t s i d e C l i c k . d a t e r a n g e p i c k e r )   i s   a l w a y s   e m i t t e d .   | 
 
 |   l i n k e d C a l e n d a r s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > t r u e < / c o d e >   |   W h e n   e n a b l e d ,   t h e   t w o   c a l e n d a r s   d i s p l a y e d   w i l l   a l w a y s   b e   f o r   t w o   s e q u e n t i a l   m o n t h s   ( i . e .   J a n u a r y   a n d   F e b r u a r y ) ,     a n d   b o t h   w i l l   b e   a d v a n c e d   w h e n   c l i c k i n g   t h e   l e f t   o r   r i g h t   a r r o w s   a b o v e   t h e   c a l e n d a r s . < b r / >   W h e n   d i s a b l e d ,   t h e   t w o   c a l e n d a r s   c a n   b e   i n d i v i d u a l l y   a d v a n c e d   a n d   d i s p l a y   a n y   m o n t h / y e a r   | 
 
 |   i s I n v a l i d D a t e   |   < c o d e > f u n c t i o n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   A   f u n c t i o n   t h a t   i s   p a s s e d   e a c h   d a t e   i n   t h e   t w o   c a l e n d a r s   b e f o r e   t h e y   a r e   d i s p l a y e d , < b r / >     a n d   m a y   r e t u r n   ` t r u e `   o r   ` f a l s e `   t o   i n d i c a t e   w h e t h e r   t h a t   d a t e   s h o u l d   b e   a v a i l a b l e   f o r   s e l e c t i o n   o r   n o t . < b r / >   S i g n a t u r e :   ` i s I n v a l i d D a t e ( d a t e ) ` < b r / >   F u n c t i o n   h a s   n o   e f f e c t   o n   d a t e   v a l u e s   s e t   b y   ` s t a r t D a t e ` ,   ` e n d D a t e ` ,   ` r a n g e s ` ,   [ s e t S t a r t D a t e ] ( # D a t e R a n g e P i c k e r + s e t S t a r t D a t e ) ,   [ s e t E n d D a t e ] ( # D a t e R a n g e P i c k e r + s e t E n d D a t e ) .   | 
 
 |   i s I n v a l i d T i m e   |   < c o d e > f u n c t i o n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   A   f u n c t i o n   t h a t   i s   p a s s e d   e a c h   h o u r / m i n u t e / s e c o n d / a m - p m   i n   t h e   t w o   c a l e n d a r s   b e f o r e   t h e y   a r e   d i s p l a y e d , < b r / >     a n d   m a y   r e t u r n   ` t r u e `   o r   ` f a l s e `   t o   i n d i c a t e   w h e t h e r   t h a t   d a t e   s h o u l d   b e   a v a i l a b l e   f o r   s e l e c t i o n   o r   n o t . < b r / >   S i g n a t u r e :   ` i s I n v a l i d T i m e ( t i m e ,   s i d e ,   u n i t ) ` < b r / >   ` s i d e `   i s   ` ' s t a r t ' `   o r   ` ' e n d ' `   o r   ` n u l l `   f o r   ` s i n g l e D a t e P i c k e r :   t r u e ` < b r / >   ` u n i t `   i s   ` ' h o u r ' ` ,   ` ' m i n u t e ' ` ,   ` ' s e c o n d ' `   o r   ` ' a m p m ' ` < b r / >   H o u r s   a r e   a l w a y s   g i v e n   a s   2 4 - h o u r   c l o c k < b r / >   F u n c t i o n   h a s   n o   e f f e c t   o n   t i m e   v a l u e s   s e t   b y   ` s t a r t D a t e ` ,   ` e n d D a t e ` ,   ` r a n g e s ` ,   [ s e t S t a r t D a t e ] ( # D a t e R a n g e P i c k e r + s e t S t a r t D a t e ) ,   [ s e t E n d D a t e ] ( # D a t e R a n g e P i c k e r + s e t E n d D a t e ) . < b r / >   E n s u r e   t h a t   y o u r   f u n c t i o n   r e t u r n s   ` f a l s e `   f o r   a t   l e a s t   o n e   i t e m .   O t h e r w i s e   t h e   c a l e n d e r   i s   n o t   r e n d e r e d . < b r / >   | 
 
 |   i s C u s t o m D a t e   |   < c o d e > f u n c t i o n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   A   f u n c t i o n   t h a t   i s   p a s s e d   e a c h   d a t e   i n   t h e   t w o   c a l e n d a r s   b e f o r e   t h e y   a r e   d i s p l a y e d ,     a n d   m a y   r e t u r n   a   s t r i n g   o r   a r r a y   o f   C S S   c l a s s   n a m e s   t o   a p p l y   t o   t h a t   d a t e ' s   c a l e n d a r   c e l l . < b r / >   S i g n a t u r e :   ` i s C u s t o m D a t e ( d a t e ) `   | 
 
 |   a l t I n p u t   |   < c o d e > s t r i n g < / c o d e >   \ |   < c o d e > A r r a y < / c o d e >   |   < c o d e > n u l l < / c o d e >   |   A   [ j Q u e r y   s e l e c t o r ] ( h t t p s : / / a p i . j q u e r y . c o m / c a t e g o r y / s e l e c t o r s / )   s t r i n g   f o r   a n   a l t e r n a t i v e   o u t p u t   ( t y p i c a l l y   h i d d e n )   ` < i n p u t > `   e l e m e n t .   U s e s   ` a l t F o r m a t `   t o   f o r m a t   t h e   v a l u e . < b r / >   M u s t   b e   a   s i n g l e   s t r i n g   f o r   ` s i n g l e D a t e P i c k e r :   t r u e `   o r   a n   a r r a y   o f   t w o   s t r i n g s   f o r   ` s i n g l e D a t e P i c k e r :   f a l s e ` < b r / >   E x a m p l e :   ` [ ' # s t a r t ' ,   ' # e n d ' ] `   | 
 
 |   a l t F o r m a t   |   < c o d e > f u n c t i o n < / c o d e >   \ |   < c o d e > s t r i n g < / c o d e >   |     |   T h e   o u t p u t   f o r m a t   u s e d   f o r   ` a l t I n p u t ` . < b r / >   D e f a u l t :   I S O - 8 6 0 1   b a s i c   f o r m a t   w i t h o u t   t i m e   z o n e ,   p r e c i s i s o n   i s   d e r i v e d   f r o m   ` t i m e P i c k e r `   a n d   ` t i m e P i c k e r S t e p S i z e ` < b r / >   E x a m p l e   ` y y y y M M d d ' T ' H H m m `   f o r   ` t i m e P i c k e r = t r u e `   a n d   d i s p l a y   o f   M i n u t e s < b r / >     I f   d e f i n e d ,   e i t h e r   a   s t r i n g   u s e d   w i t h   [ F o r m a t   t o k e n s ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / # / f o r m a t t i n g ? i d = t a b l e - o f - t o k e n s )   o r   a   f u n c t i o n . < b r / >   E x a m p l e s :   ` " y y y y : M M : d d ' T ' H H : m m " ` , < b r / > ` ( d a t e )   = >   d a t e . t o U n i x I n t e g e r ( ) `   | 
 
 |   ~ ~ w a r n i n g s ~ ~   |   < c o d e > b o o l e a n < / c o d e >   |     |   N o t   u s e d   a n y m o r e .   L i s t e n   t o   e v e n t   ` v i o l a t e d . d a t e r a n g e p i c k e r `   t o   r e a c t   o n   i n v a l i d   i n p u t   d a t a   | 
 
 |   a p p l y B u t t o n C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; b t n - p r i m a r y & q u o t ; < / c o d e >   |   C S S   c l a s s   n a m e s   t h a t   w i l l   b e   a d d e d   o n l y   t o   t h e   a p p l y   b u t t o n   | 
 
 |   c a n c e l B u t t o n C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; b t n - d e f a u l t & q u o t ; < / c o d e >   |   C S S   c l a s s   n a m e s   t h a t   w i l l   b e   a d d e d   o n l y   t o   t h e   c a n c e l   b u t t o n   | 
 
 |   b u t t o n C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |     |   D e f a u l t :   ` ' b t n   b t n - s m ' ` < b r / > C S S   c l a s s   n a m e s   t h a t   w i l l   b e   a d d e d   t o   b o t h   t h e   a p p l y   a n d   c a n c e l   b u t t o n s .   | 
 
 |   w e e k e n d C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; w e e k e n d & q u o t ; < / c o d e >   |   C S S   c l a s s   n a m e s   t h a t   w i l l   b e   u s e d   t o   h i g h l i g h t   w e e k e n d   d a y s . < b r / >   U s e   ` n u l l `   o r   e m p t y   s t r i n g   i f   y o u   d o n ' t   l i k e   t o   h i g h l i g h t   w e e k e n d   d a y s .   | 
 
 |   w e e k e n d D a y C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; w e e k e n d - d a y & q u o t ; < / c o d e >   |   C S S   c l a s s   n a m e s   t h a t   w i l l   b e   u s e d   t o   h i g h l i g h t   w e e k e n d   d a y   n a m e s . < b r / >   W e e k e n d   d a y s   a r e   e v a l u a t e d   b y   [ I n f o . g e t W e e k e n d W e e k d a y s ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # i n f o g e t w e e k e n d w e e k d a y s )   a n d   d e p e n d   o n   c u r r e n t     l o c a l e   s e t t i n g s .   U s e   ` n u l l `   o r   e m p t y   s t r i n g   i f   y o u   d o n ' t   l i k e   t o   h i g h l i g h t   w e e k e n d   d a y   n a m e s .   | 
 
 |   t o d a y C l a s s e s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; t o d a y & q u o t ; < / c o d e >   |   C S S   c l a s s   n a m e s   t h a t   w i l l   b e   u s e d   t o   h i g h l i g h t   t h e   c u r r e n t   d a y . < b r / >   U s e   ` n u l l `   o r   e m p t y   s t r i n g   i f   y o u   d o n ' t   l i k e   t o   h i g h l i g h t   t h e   c u r r e n t   d a y .   | 
 
 |   e x t e r n a l S t y l e   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > n u l l < / c o d e >   |   E x t e r n a l   C S S   F r a m e w o r k   t o   s t y l e   t h e   p i c k e r .   C u r r e n t l y   o n l y   ` ' b u l m a ' `   i s   s u p p o r t e d .   | 
 
 |   o p e n s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; r i g h t & q u o t ; < / c o d e >   |   W h e t h e r   t h e   p i c k e r   a p p e a r s   a l i g n e d   t o   t h e   l e f t ,   t o   t h e   r i g h t ,   o r   c e n t e r e d   u n d e r   t h e   H T M L   e l e m e n t   i t ' s   a t t a c h e d   t o . < b r / >   ` ' l e f t '   \ |   ' r i g h t '   \ |   ' c e n t e r ' `   | 
 
 |   d r o p s   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; d o w n & q u o t ; < / c o d e >   |   W h e t h e r   t h e   p i c k e r   a p p e a r s   b e l o w   o r   a b o v e   t h e   H T M L   e l e m e n t   i t ' s   a t t a c h e d   t o . < b r / >   ` ' d o w n '   \ |   ' u p '   \ |   ' a u t o ' `   | 
 
 |   r a n g e s   |   < c o d e > o b j e c t < / c o d e >   |   < c o d e > { } < / c o d e >   |   S e t   p r e d e f i n e d   d a t e   [ R a n g e s ] ( # R a n g e s )   t h e   u s e r   c a n   s e l e c t   f r o m .   E a c h   k e y   i s   t h e   l a b e l   f o r   t h e   r a n g e ,     a n d   i t s   v a l u e   a n   a r r a y   w i t h   t w o   d a t e s   r e p r e s e n t i n g   t h e   b o u n d s   o f   t h e   r a n g e .   | 
 
 |   s h o w C u s t o m R a n g e L a b e l   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > t r u e < / c o d e >   |   D i s p l a y s   " C u s t o m   R a n g e "   a t   t h e   e n d   o f   t h e   l i s t   o f   p r e d e f i n e d   [ R a n g e s ] ( # R a n g e s ) ,     w h e n   t h e   r a n g e s   o p t i o n   i s   u s e d . < b r >   T h i s   o p t i o n   w i l l   b e   h i g h l i g h t e d   w h e n e v e r   t h e   c u r r e n t   d a t e   r a n g e   s e l e c t i o n   d o e s   n o t   m a t c h   o n e   o f   t h e   p r e d e f i n e d   r a n g e s . < b r / >   C l i c k i n g   i t   w i l l   d i s p l a y   t h e   c a l e n d a r s   t o   s e l e c t   a   n e w   r a n g e .   | 
 
 |   a l w a y s S h o w C a l e n d a r s   |   < c o d e > b o o l e a n < / c o d e >   |   < c o d e > f a l s e < / c o d e >   |   N o r m a l l y ,   i f   y o u   u s e   t h e   r a n g e s   o p t i o n   t o   s p e c i f y   p r e - d e f i n e d   d a t e   r a n g e s ,     c a l e n d a r s   f o r   c h o o s i n g   a   c u s t o m   d a t e   r a n g e   a r e   n o t   s h o w n   u n t i l   t h e   u s e r   c l i c k s   " C u s t o m   R a n g e " . < b r / >   W h e n   t h i s   o p t i o n   i s   s e t   t o   t r u e ,   t h e   c a l e n d a r s   f o r   c h o o s i n g   a   c u s t o m   d a t e   r a n g e   a r e   a l w a y s   s h o w n   i n s t e a d .   | 
 
 |   l o c a l e   |   < c o d e > o b j e c t < / c o d e >   |   < c o d e > { } < / c o d e >   |   A l l o w s   y o u   t o   p r o v i d e   l o c a l i z e d   s t r i n g s   f o r   b u t t o n s   a n d   l a b e l s ,   c u s t o m i z e   t h e   d a t e   f o r m a t ,     a n d   c h a n g e   t h e   f i r s t   d a y   o f   w e e k   f o r   t h e   c a l e n d a r s .   | 
 
 |   l o c a l e . d i r e c t i o n   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; l t r & q u o t ; < / c o d e >   |   D i r e c t i o n   o f   r e a d i n g ,   ` ' l t r ' `   o r   ` ' r t l ' `   | 
 
 |   l o c a l e . f o r m a t   |   < c o d e > o b j e c t < / c o d e >   \ |   < c o d e > s t r i n g < / c o d e >   |     |   D e f a u l t :   ` D a t e T i m e . D A T E _ S H O R T `   o r   ` D a t e T i m e . D A T E T I M E _ S H O R T `   w h e n   ` t i m e P i c k e r :   t r u e ` < b r / > D a t e   f o r m a t s .     E i t h e r   g i v e n   a s   s t r i n g ,   s e e   [ F o r m a t   T o k e n s ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / # / f o r m a t t i n g ? i d = t a b l e - o f - t o k e n s )   o r   a n   o b j e c t   a c c o r d i n g     t o   [ I n t l . D a t e T i m e F o r m a t ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / I n t l / D a t e T i m e F o r m a t ) < b r / >   I   r e c o m m e n d   t o   u s e   t h e   l u x o n   [ P r e s e t s ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / # / f o r m a t t i n g ? i d = p r e s e t s ) .   | 
 
 |   l o c a l e . s e p a r a t o r   |   < c o d e > s t r i n g < / c o d e >   |     |   D e f a u t :   ` '   -   ' ` < b r / > S e p a r a t o r   f o r   s t a r t   a n d   e n d   t i m e   | 
 
 |   l o c a l e . w e e k L a b e l   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; W & q u o t ; < / c o d e >   |   L a b e l   f o r   w e e k   n u m b e r s   | 
 
 |   l o c a l e . d a y s O f W e e k   |   < c o d e > A r r a y < / c o d e >   |     |   D e f a u l t :   ` l u x o n . I n f o . w e e k d a y s ( ' s h o r t ' ) ` < b r / > A r r a y   w i t h   w e e k d a y   n a m e s ,   f r o m   M o n d a y   t o   S u n d a y   | 
 
 |   l o c a l e . m o n t h N a m e s   |   < c o d e > A r r a y < / c o d e >   |     |   D e f a u l t :   ` l u x o n . I n f o . m o n t h s ( ' l o n g ' ) ` < b r / > A r r a y   w i t h   m o n t h   n a m e s   | 
 
 |   l o c a l e . f i r s t D a y   |   < c o d e > n u m b e r < / c o d e >   |     |   D e f a u l t :   ` l u x o n . I n f o . g e t S t a r t O f W e e k ( ) ` < b r / > F i r s t   d a y   o f   t h e   w e e k ,   1   f o r   M o n d a y   t h r o u g h   7   f o r   S u n d a y   | 
 
 |   l o c a l e . a p p l y L a b e l   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; A p p l y & q u o t ; < / c o d e >   |   L a b e l   o f   ` A p p l y `   B u t t o n   | 
 
 |   l o c a l e . c a n c e l L a b e l   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; C a n c e l & q u o t ; < / c o d e >   |   L a b e l   o f   ` C a n c e l `   B u t t o n   | 
 
 |   l o c a l e . c u s t o m R a n g e L a b e l   |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > & q u o t ; C u s t o m & q u o t ; < / c o d e >   |   R a n g e   -   T i t l e   f o r   c u s t o m   r a n g e s   | 
 
 |   l o c a l e . d u r a t i o n F o r m a t   |   < c o d e > o b j e c t < / c o d e >   \ |   < c o d e > s t r i n g < / c o d e >   |   < c o d e > { } < / c o d e >   |   F o r m a t   a   c u s t o m   l a b e l   f o r   s e l e c t e d   d u r a t i o n ,   f o r   e x a m p l e   ` ' 5   D a y s ,   1 2   H o u r s ' ` . < b r / >   D e f i n e   t h e   f o r m a t   e i t h e r   a s   s t r i n g ,   s e e   [ D u r a t i o n . t o F o r m a t   -   F o r m a t   T o k e n s ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n t o f o r m a t )   o r     a n   o b j e c t   a c c o r d i n g   t o   [ I n t l . N u m b e r F o r m a t ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / I n t l / N u m b e r F o r m a t / N u m b e r F o r m a t # o p t i o n s ) ,     s e e   [ D u r a t i o n . t o H u a m n ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d u r a t i o n t o h u m a n ) .   | 
 
 
 
 < a   n a m e = " R a n g e s " > < / a > 
 
 
 
 # #   R a n g e s   :   < c o d e > O b j e c t < / c o d e > 
 
 A   s e t   o f   p r e d e f i n e d   r a n g e s 
 
 
 
 * * K i n d * * :   g l o b a l   t y p e d e f     
 
 * * P r o p e r t i e s * * 
 
 
 
 |   N a m e   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   n a m e   |   < c o d e > s t r i n g < / c o d e >   |   T h e   n a m e   o f   t h e   r a n g e   | 
 
 |   r a n g e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |   A r r a y   o f   2   e l e m e n t s   w i t h   s t a r t D a t e   a n d   e n d D a t e   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 { 
 
   ' T o d a y ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) ,   D a t e T i m e . n o w ( ) . e n d O f ( ' d a y ' ) ] , 
 
   ' Y e s t e r d a y ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) . m i n u s ( { d a y s :   1 } ) ,   D a t e T i m e . n o w ( ) . m i n u s ( { d a y s :   1 } ) . e n d O f ( ' d a y ' ) ] , 
 
   ' L a s t   7   D a y s ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) . m i n u s ( { d a y s :   6 } ) ,   D a t e T i m e . n o w ( ) ] , 
 
   ' L a s t   3 0   D a y s ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) . m i n u s ( { d a y s :   2 9 } ) ,   D a t e T i m e . n o w ( ) ] , 
 
   ' T h i s   M o n t h ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) . s t a r t O f ( ' m o n t h ' ) ,   D a t e T i m e . n o w ( ) . e n d O f ( ' m o n t h ' ) ] , 
 
   ' L a s t   M o n t h ' :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) . m i n u s ( { m o n t h s :   1 } ) . s t a r t O f ( ' m o n t h ' ) ,   D a t e T i m e . n o w ( ) . m i n u s ( { m o n t h s :   1 } ) . e n d O f ( ' m o n t h ' ) ] 
 
 } 
 
 ` ` ` 
 
 < a   n a m e = " R a n g e " > < / a > 
 
 
 
 # #   R a n g e   :   < c o d e > O b j e c t < / c o d e > 
 
 A   s i n g l e   p r e d e f i n e d   r a n g e 
 
 
 
 * * K i n d * * :   g l o b a l   t y p e d e f     
 
 * * P r o p e r t i e s * * 
 
 
 
 |   N a m e   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   n a m e   |   < c o d e > s t r i n g < / c o d e >   |   T h e   n a m e   o f   t h e   r a n g e   | 
 
 |   r a n g e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   [ < c o d e > D a t e < / c o d e > ] ( h t t p s : / / d e v e l o p e r . m o z i l l a . o r g / e n - U S / d o c s / W e b / J a v a S c r i p t / R e f e r e n c e / G l o b a l _ O b j e c t s / D a t e )   \ |   < c o d e > s t r i n g < / c o d e >   |   A r r a y   o f   2   e l e m e n t s   w i t h   s t a r t D a t e   a n d   e n d D a t e   | 
 
 
 
 * * E x a m p l e * *     
 
 ` ` ` j s 
 
 {   T o d a y :   [ D a t e T i m e . n o w ( ) . s t a r t O f ( ' d a y ' ) ,   D a t e T i m e . n o w ( ) . e n d O f ( ' d a y ' ) ]   }                 
 
 ` ` ` 
 
 < a   n a m e = " I n p u t V i o l a t i o n " > < / a > 
 
 
 
 # #   I n p u t V i o l a t i o n   :   < c o d e > O b j e c t < / c o d e > 
 
 * * K i n d * * :   g l o b a l   t y p e d e f     
 
 * * P r o p e r t i e s * * 
 
 
 
 |   N a m e   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   s t a r t D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   |   V i o l a t i o n   o f   s t a r t D a t e   | 
 
 |   e n d D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   \ |   < c o d e > u n d e f i n e d < / c o d e >   |   V i o l a t i o n   o f   e n d D a t e   | 
 
 |   r e a s o n   |   < c o d e > A r r a y < / c o d e >   |   T h e   c o n s t r a i n t   w h i c h   v i o l a t e s   t h e   i n p u t   | 
 
 |   o l d   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   |   O l d   v a l u e   s t a r t D a t e / e n d D a t e   | 
 
 |   n e w   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   |   C o r r e c t e d   v a l u e   o f   s t a r t D a t e / e n d D a t e   | 
 
 
 
 < a   n a m e = " c a l l b a c k " > < / a > 
 
 
 
 # #   c a l l b a c k   :   < c o d e > f u n c t i o n < / c o d e > 
 
 * * K i n d * * :   g l o b a l   t y p e d e f     
 
 
 
 |   P a r a m   |   T y p e   |   D e s c r i p t i o n   | 
 
 |   - - -   |   - - -   |   - - -   | 
 
 |   s t a r t D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   |   S e l e c t e d   s t a r t D a t e   | 
 
 |   e n d D a t e   |   [ < c o d e > D a t e T i m e < / c o d e > ] ( h t t p s : / / m o m e n t . g i t h u b . i o / l u x o n / a p i - d o c s / i n d e x . h t m l # d a t e t i m e )   |   S e l e c t e d   e n d D a t e   | 
 
 |   r a n g e   |   < c o d e > s t r i n g < / c o d e >   |     | 
 
 
 
 