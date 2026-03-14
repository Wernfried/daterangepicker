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
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@4.16.10/dist/global/daterangepicker.min.js"></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@4.16.10/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   const DateTime = luxon.DateTime;

   $(function() {
      $('#picker').daterangepicker({
         startDate: DateTime.now().plus({day: 1})
      });
   });
</script>
```

#### ESM Imports
```html
<script type="importmap">
{
   "imports": {
      "jquery": "https://cdn.jsdelivr.net/npm/jquery@4.0.0/+esm",
      "luxon": "https://cdn.jsdelivr.net/npm/luxon@3.7.2/+esm",
      "daterangepicker": "https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@4.16.10/+esm"
   }
}
</script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@4.16.10/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="module">
   import { $ } from 'jquery';
   import { DateTime } from 'luxon';
   import DateRangePicker from 'daterangepicker';

   $(function() {
      $('#picker').daterangepicker({
         startDate: DateTime.now().plus({day: 1})
      });
   });
</script>
```

#### Style with Bulma
```html
<script ...></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css" rel="stylesheet" />
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@4.16.10/css/daterangepicker.bulma.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   $(function() {
      $('#picker').daterangepicker({
         externalStyle: 'bulma'
      });
   });
</script>
```

#### Use of `data-*` attributes
```html
<script ...></script>
<input type="text" id="picker" data-start-date="2026-02-01" data-end-date="2026-02-20" data-show-week-numbers="true" />

<script type="text/javascript">
   $(function() {
      $('#picker').daterangepicker();
   });
</script>
```
See [HTML5 data-* Attributes](https://api.jquery.com/data/#data-html5)<br/>
Options in `daterangepicker({...})` take precedence over `data-*` attributes.



## Examples
### `ranges`
<a name="options-ranges"></a>
```js
range: {
   'Today': [DateTime.now().startOf('day'), DateTime.now().endOf('day')],
   'Yesterday': [DateTime.now().startOf('day').minus({day: 1}), DateTime.now().endOf('day').minus({day: 1})],
   'Last 7 Days': ['2025-03-01', '2025-03-07'],
   'Last 30 Days': [new Date(new Date - 1000*60*60*24*30), new Date()],
   'This Month': [DateTime.now().startOf('month'), DateTime.now().endOf('month')],
   'Last Month': [DateTime.now().minus({month: 1}).startOf('month'), DateTime.now().minus({month: 1}).endOf('month')]
},
alwaysShowCalendars: true
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
- [Jest](https://jestjs.io/) unit testing
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
   * [.setRange(startDate, endDate)](#DateRangePicker+setRange)
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
