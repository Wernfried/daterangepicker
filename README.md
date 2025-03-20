# Date Range Picker

![Improvely.com](https://i.imgur.com/UTRlaar.png)

This date range picker component creates a dropdown menu from which a user can
select a range of dates. I created it while building the UI for [Improvely](http://www.improvely.com), 
which needed a way to select date ranges for reports.

Features include limiting the selectable date range, localizable strings and date formats,
a single date picker mode, a time picker, and predefined date ranges.

## [Documentation and Live Usage Examples](http://www.daterangepicker.com)

## [See It In a Live Application](https://awio.iljmp.com/5/drpdemogh)


## Basic usage
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Wernfried/daterangepicker@master/daterangepicker.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/Wernfried/daterangepicker@master/daterangepicker.min.css" />

<input type="text" id="daterange" />

<script>
$(function() {
   const options = {
      timePicker: true
   }
   $('#daterange').daterangepicker(options);
});

```

## Options
| Name                 | Type    | Default    | Description |
| -------------------- | ------- | ---------- | ----------- |
| parentEl             | string  | `'body'`     |  jQuery selector of the parent element that the date range picker will be added to |
| startDate            | DateTime \| Date \| string | Start of current day | The beginning date of the initially selected date range.</br>Must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`. |
| endDate              | DateTime \| Date \| string | End of current day | The end date of the initially selected date range.</br>Must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`. |
| minDate              | DateTime \| Date \| string | `null` | The earliest date a user may select or `null` for no limit.</br>Must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`. |
| maxDate              | DateTime \| Date \| string | `null` | The latest date a user may select or `null` for no limit.</br>Must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`. |
| maxSpan              | Duration \| string | `null`    | The maximum span between the selected start and end dates.</br>Must be a [luxon.Durations](https://moment.github.io/luxon/api-docs/index.html#duration) of a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) duration.</br>Ignored when `singleDatePicker: true` |
| minSpan              | Duration \| string | `null`    | The minimum span between the selected start and end dates..</br>Must be a [luxon.Durations](https://moment.github.io/luxon/api-docs/index.html#duration) of a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) duration.</br>Ignored when `singleDatePicker: true` |
| autoApply            | boolean | `null`    | Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates are clicked.<br/>Only useful when `timePicker: false` |
| singleDatePicker     | boolean | `false`    | Show only a single calendar to choose one date, instead of a range picker with two calendars. The start and end dates provided to your callback will be the same single date chosen.  |
| showDropdowns        | boolean | `false`    | Show year and month select boxes above calendars to jump to a specific month and year |
| minYear              | number  | this year - 100 | The minimum year shown in the dropdowns when `showDropdowns` is set to `true` |
| maxYear              | number  | this year + 100 | The maximum year shown in the dropdowns when `showDropdowns` is set to `true` |
| showWeekNumbers      | boolean | `false`    | Show localized week numbers at the start of each week on the calendars |
| showISOWeekNumbers   | boolean | `false`    | Show ISO week numbers at the start of each week on the calendars |
| showCustomRangeLabel | boolean | `true`     | Displays "Custom Range" at the end of the list of predefined `ranges`, when the `ranges` option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.  |
| timePicker           | boolean | `false`    | Adds select boxes to choose times in addition to dates |
| timePicker24Hour     | boolean | `false`    | Use 24-hour instead of 12-hour times, removing the AM/PM selection |
| timePickerIncrement  | number  | `null`     | **Deprecated**, only supported for backward compatibility</br>Use `timePickerStepMinute` |
| timePickerStepHour   | number  | 1          | Increment of the hour selection list for times (i.e. 6 to allow only selection of times ending in 0, 6, 12 or 18) |
| timePickerStepMinute | number  | 1          | Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30) |
| timePickerStepSecond | number  | 1          | Increment of the seconds selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30) |
| timePickerSeconds    | boolean | `false`    | Show seconds in the timePicke |
| linkedCalendars      | boolean | `true`     | When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year |
| autoUpdateInput      | boolean | `true`     | Indicates whether the date range picker should automatically update the value of the `<input>` element it's attached to at initialization and when the selected dates change. |
| alwaysShowCalendars  | boolean | `false`    | Normally, if you use the `ranges` option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.  |
| ranges               | object  | `{}`       | Object of predefined ranges. `{name: [start, end]}`. See example [ranges](#options-ranges)</br>Ignored when `singleDatePicker: true` |
| locale               | object  | `{}`       | See [Options.locale](#options-locale) |
| opens                | string  | `'right'`  | Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.</br> `'left'` \|  `'right'` \| `'center'` |
| drops                | string  | `'down'`   | Whether the picker appears below (default) or above the HTML element it's attached to.</br> `'down'` \|  `'up'` \| `'auto'` |
| buttonClasses        | string \| Array(string)  | `'btn btn-sm'`  | CSS class names that will be added to both the apply and cancel buttons.  |
| applyButtonClasses   | string  | `'btn-primary'` | CSS class names that will be added only to the apply button  |
| cancelButtonClasses  | string  | `'btn-default'` | CSS class names that will be added only to the cancel button |
| isInvalidDate        | function | `undefined`    | A function that is passed each date in the two calendars before they are displayed, and may return `true` or `false` to indicate whether that date should be available for selection or not.</br>**Signature**: `isInvalidDate(date)` |
| isInvalidTime        | function | `undefined`    | A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed, and may return `true` or `false` to indicate whether that time should be available for selection or not.</br></br>**Signature**: `isInvalidTime(time, side, unit)`.</br>`side` is `'start'` or `'end'` or `null` for `singleDatePicker = true`</br>`unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`</br></br>**Note**: Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered. |
| isCustomDate         | function | `undefined`    | A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.</br>**Signature**: `isCustomDate(date)`

### Options.locale
<a name="options-locale"></a>
| Name             | Type    | Default    | Description |
| -----------------| ------- | ---------- | ----------- |
| direction        | string  | `'ltr'`      | Direction of reading, `'ltr'` `'rtl'` | 
| format           | string \| object | `DateTime.DATE_SHORT` | Date formats. Either given as string, see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)</br>I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets).</br>Note, when using an `object`, then this parameter is **not** used to parse string or `startDate`, `endDate`, `minDate`, `maxDate`  | 
| separator        | string | `' - '`       | Separator for start and end time | 
| applyLabel       | string | `'Apply'`     | Label of `Apply` Button | 
| cancelLabel      | string | `'Cancel'`    | Label of `Cancel` Button  | 
| weekLabel        | string | `'W'`        | Label for week numbers | 
| customRangeLabel | string | `'Custom Range'` | Title for custom ranges| 
| daysOfWeek       | Array(string) | `luxon.Info.weekdays('short')` | Array with weekday names | 
| monthNames       | Array(string) | `luxon.Info.months('long')`| Array with month names | 
| firstDay         | number | `luxon.Info.getStartOfWeek()`| First day of the week, 1 for Monday through 7 for Sunday | 


## Methods
| Name                          | Description |
| ----------------------------- | ----------- |
| setStartDate(startDate)       | Sets the date range picker's currently selected start date to the provided date.</br>`startDate` must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`. |
| setEndDate(endDate)           | Sets the date range picker's currently selected end date to the provided date.</br>`endDate` must be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`.  |
| setPeriod(startDate,endDate ) | Shortcut for `setStartDate()` and `setEndDate()`.</br>`startDate` and `endDate` be a [luxon.DateTime](](https://moment.github.io/luxon/api-docs/index.html#datetime)) or [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format` when given as `string`.  |


## Events
| Name                                 | Description |
| ------------------------------------ | ----------- | 
| `show.daterangepicker(this)`         | Triggered when the picker is shown
| `hide.daterangepicker(this)`         | Triggered when the picker is hidden
| `showCalendar.daterangepicker(this)` | Triggered when the calendar(s) are shown, i.e. triggers every time when user select new month or "Custom Range" in predefined ranges
| `hideCalendar.daterangepicker(this)` | Triggered when the calendar(s) are hidden
| `apply.daterangepicker(this)`        | Triggered when the apply button is clicked, or when a predefined range is clicked
| `cancel.daterangepicker(this)`       | Triggered when the cancel button is clicked
| `outsideClick.daterangepicker(this)` | Triggered when user clicked outside the picker
| `dateChange.daterangepicker(this, side)` | Triggered when selected day changes.</br>`side` indicates which day changed, `'start'` or `'end'` or `null` for `singleDatePicker = true`
| `timeChange.daterangepicker(this, side)` |Triggered when selected time changes.</br>`side` indicates which time changed, `'start'` or `'end'` or `null` for `singleDatePicker = true`

## Examples
### `ranges`
<a name="options-ranges"></a>
```
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
```
isInvalidDate: function(date) {
   return date.isWeekend;
}
```

### `isInvalidTime`
```
const validRange = [moment('2025-03-01 11:30'), moment('2025-04-21 18:30')];

isInvalidTime: (time, side, unit) => {   
   if (side == 'start' && time.hasSame(validRange[0], 'day')) {
      if (unit == 'hour') {
         return time.hour < validRange[0].hour;
      } else {
         return time.hasSame(validRange[0], 'hour') ? time.minute < validRange[0].minute : false;
      }
   } else if (side == 'end' && t.hasSame(validRange[1], 'day')) {
      if (unit == 'hour') {
         return time.hour > validRange[1].hour;
      } else {
         return time.hasSame(validRange[1], 'hour') ? time.minute > validRange[1].minute : false;
      }
   } else {
      return false;
   }
}
```

### `isCustomDate`
```
.daterangepicker-bank-day {
  color: red;
}
.daterangepicker-weekend-day {
  color: blue;
}

isInvalidDate: function(date) {
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
Compared to [inital repository](https://github.com/dangrossman/daterangepicker), this fork added following features:

- Added CSS class `weekend-day` for weekend days in csalendar 
- Deprecated option `timePickerIncrement` im favor of `timePickerStepHour`, `timePickerStepMinute` and `timePickerStepSecond`
- Added events for `dateChange.daterangepicker` and `timeChange.daterangepicker`
- Added method `setRange` to combine `setStartDate` and `setEndDate`
- Added option `minSpan` similar to `maxSpan`
- Added option `isInvalidTime` similar to `isInvalidDate`
- Replaced [moment](https://momentjs.com/) by [luxon](https://moment.github.io/luxon/index.html)
- Better validation of input parameters, error are printed to console
- Highlight range in calendars when hovering over custom ranges
- ... and maybe some new bugs 😉 

#### Differences between moment vs. luxon
This table lists a few important differences between datarangepicker using moment and luxon

| Parameter               | moment                                              | luxon             |
| ----------------------- | --------------------------------------------------- | ----------------- |
| locale.daysOfWeek       | [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ] | [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ] | 
| locale.firstDay         | 0-6 (Sunday to Saturday)                            | 1 for Monday through 7 for Sunday | 
| to ISO-8601 String      | `toISOString()`                                     | `toISO()`         | 
| to [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Object | `toDate()` | `toJSDate()`         | 
| from ISO-8601 String    | `moment(...)`                                       | `DateIme.fromISO(...)`         | 
| from [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Object | `moment(...)` | `DateIme.fromJSDate(...)`         | 



## License

The MIT License (MIT)

Copyright (c) 2012-2019 Dan Grossman
Copyright (c) 2025 Wernfried Domscheit

Licensed under the [MIT license](LICENSE).
