# Date Range Picker

![Improvely.com](https://i.imgur.com/UTRlaar.png)

This date range picker component creates a dropdown menu from which a user can
select a range of dates.

Features include limiting the selectable date range, localizable strings and date formats,
a single date picker mode, a time picker, and predefined date ranges.

### [Documentation and Live Usage Examples](http://www.daterangepicker.com)

### [See It In a Live Application](https://awio.iljmp.com/5/drpdemogh)

Above samples are based on the [original repository](https://github.com/dangrossman/daterangepicker) from Dan Grossman. [New features](#Features) from this fork are not available in these samples.

## Basic usage
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Wernfried/daterangepicker@master/daterangepicker.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/Wernfried/daterangepicker@master/daterangepicker.min.css" />

<! --https://cdn.jsdelivr.net/npm/daterangepickerg@4.0.1/daterangepicker.min.js -->

<input type="text" id="daterange" />

<script>
$(function() {
   const options = {
      timePicker: true
   }
   $('#daterange').daterangepicker(options);
});

```

## API Documentation

### Options

See [Options](daterangepicker.md#Options)

See [Options.locale](daterangepicker.md#Options.Locale)

### Methods

- [setStartDate(startDate)](daterangepicker.md#DateRangePicker+setStartDate)
- [setEndDate(endDate)](daterangepicker.md#DateRangePicker+setEndDate)
- [setPeriod(startDate, endDate)](daterangepicker.md#DateRangePicker+setPeriod)

### Events

See [Events](daterangepicker.md)


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
const validRange = [DateTime.fromSQL('2025-03-01 11:30'), DateTime.fromSQL('2025-04-21 18:30')];

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

- Added CSS class `weekend-day` for weekend days in calendar 
- Added option `timePickerStepSize` to succeed options `timePickerIncrement` and `timePickerSeconds`
- Added events for `dateChange.daterangepicker` and `timeChange.daterangepicker`
- Added method `setRange` to combine `setStartDate` and `setEndDate`
- Added option `minSpan` similar to `maxSpan`
- Added option `isInvalidTime` similar to `isInvalidDate`
- Replaced [moment](https://momentjs.com/) by [luxon](https://moment.github.io/luxon/index.html)
- Better validation of input parameters, error are printed to console
- Highlight range in calendar when hovering over pre-defined ranges
- Added option `locale.durationLabel` to show customized label for selected duration, e.g. `'4 Days, 6 Hours, 30 Minutes'` 
- ... and maybe some new bugs 😉 

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
| format to string        | `format(...)``                                      | `toFormat(...)`   |
| format tokens           | `'YYYY-MM-DD'`                                      | `'yyyy-MM-dd'`    |


## License

The MIT License (MIT)

Copyright (c) 2012-2019 Dan Grossman<br/> 
Copyright (c) 2025 Wernfried Domscheit

Licensed under the [MIT license](LICENSE).
