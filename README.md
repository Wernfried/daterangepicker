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
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/dist/global/daterangepicker.min.js"></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   const DateTime = luxon.DateTime;
   DateRangePicker.daterangepicker('#picker', {
      startDate: DateTime.now().plus({day: 1})
   }, (start, end) => {
      console.log(`Selected range: ${start.toString()} to ${end.toString()}`)
   });
</script>
```

#### ESM Imports
```html
<script type="importmap">
{
   "imports": {
      "luxon": "https://cdn.jsdelivr.net/npm/luxon@3.7.2/+esm",
      "daterangepicker": "https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/+esm"
   }
}
</script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="module">
   import { DateTime } from 'luxon';
   import { daterangepicker } from 'daterangepicker';

   daterangepicker('#picker', {
      startDate: DateTime.now().plus({day: 1})
   }, (start, end) => {
      console.log(`Selected range: ${start.toString()} to ${end.toString()}`)
   });
</script>
```

#### Style with Bulma
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/dist/global/daterangepicker.min.js"></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css" rel="stylesheet" />
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/css/daterangepicker.bulma.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   const DateTime = luxon.DateTime;
   DateRangePicker.daterangepicker('#picker', {
      startDate: DateTime.now().plus({day: 1})
   });
</script>
```

#### Use of `data-*` attributes
```html
<input type="text" id="picker" 
   data-start-date="2026-02-01" 
   data-end-date="2026-02-20" 
   data-show-week-numbers="true" />

<script>
   const options = {timePicker: true};
   DateRangePicker.daterangepicker('#picker', options);
</script>
```
See [HTML5 data-* Attributes](https://api.jquery.com/data/#data-html5)<br/>
Values in `options` of `daterangepicker(el, options)` take precedence over `data-*` attributes.

#### Access the DateRangePicker Instance
```html
<input type="text" id="picker" />

<script type="module">
   import {daterangepicker, getDateRangePicker} from 'daterangepicker'; // or global import with <script> tag
   
   const input = daterangepicker('#picker', {}); // returns the mutated <input> HTMLElement
   // or daterangepicker(document.querySelector('#picker'), {})

   const drp = getDateRangePicker('#picker');
   // or DateRangePicker.getDateRangePicker('#picker'); if imported globally with <script> tag

   console.log( drp.startDate.toString()) // prints the selected startDate
   console.log( drp === input._daterangepicker) // prints 'true'
   console.log( drp.element === input) // prints 'true'
   console.log( document.querySelector('#picker') === input) // prints 'true'
</script>
```

#### Upgrade from daterangepicker version 4.x -> 5.x

In version 5.x jQuery dependency has been removed. Version 4.x is available at branch [4.x-jQuery](tree/4.x-jQuery) but new features will not added anymore to this branch.<br> 
Unlesss you work with Events, you should not face any difference between version 4.x and 5.x.
Initialisation with jQuery is supported in version 5.x

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/dist/global/daterangepicker.min.js"></script>
<link type="text/css" href="https://cdn.jsdelivr.net/npm/@wernfried/daterangepicker@5.1.0-beta/css/daterangepicker.min.css" rel="stylesheet" />

<input type="text" id="picker" />

<script type="text/javascript">
   const DateTime = luxon.DateTime;
   
   // if you like to work with jQuery in version 5.x
   $(function() {
      $('#picker').daterangepicker({
         startDate: DateTime.now().plus({day: 1})
      });
   }).on('beforeHide', (ev) => {
      console.log(ev.originalEvent.picker.startDate.toString());
      ev.preventDefault(); // -> do not hide the picker
   });
</script>
```

In case you work with Events there are a few minor changes:
```js
// version 4.x - with jQuery
$('#picker').daterangepicker({
   startDate: DateTime.now(),
   // allow only dates from current year
   minDate: DateTime.now().startOf('year'),
   manDate: DateTime.now().endOf('year'),
   singleDatePicker: true
}).on('violate.daterangepicker', (ev, picker, result, newDate) => {
   newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
   return true;
}).on('show.daterangepicker', (ev, picker) => {
   console.log('Show the picker')
}).on('beforeHide.daterangepicker', (ev, picker) => {
   console.log(picker.startDate.toString());
   return true; // -> do not hide the picker
});

// version 5.x - without jQuery
const input = daterangepicker('#picker', { // or DateRangePicker.daterangepicker('#picker', ...
   startDate: DateTime.now(),
   // allow only dates from current year
   minDate: DateTime.now().startOf('year'),
   manDate: DateTime.now().endOf('year'),
   singleDatePicker: true
});

input.addEventListener('violate', (ev) => {
   ev.newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
   ev.preventDefault();
});
input.addEventListener('show', (ev) => {
   console.log('Show the picker')
});
input.addEventListener('beforeHide', (ev) => {
   console.log(ev.picker.startDate.toString());
   ev.preventDefault(); // -> do not hide the picker
});
```



## Examples
### Option `ranges`
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

### Option `isInvalidDate`
```js
isInvalidDate: function(date) {
   return date.isWeekend; // see https://moment.github.io/luxon/api-docs/index.html#datetimeisweekend
}
```

### Option `isInvalidTime`
```js
isInvalidTime: (time, side, unit) => {   
   if (unit == 'hour') {
      return time.hour >= 10 && time.hour <= 14; // Works also with 12-hour clock      
   } else {
      return false;
   }
}
```

### Option `isCustomDate`
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
- Option `autoUpdateInput` defines whether the attached `<input>` element is updated when the user clicks on a date value.<br>
In original daterangepicker this parameter defines whether the `<input>` is updated when the user clicks on `Apply` button.
- Added option `locale.durationFormat` to show customized label for selected duration, e.g. `'4 Days, 6 Hours, 30 Minutes'`
- Support styling with 3rd party CSS Frameworks. Currently only [Bulma](https://bulma.io/) is supported<br>
but other frameworks may be added in future releases
- [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) Module Import
- [Jest](https://jestjs.io/) unit testing
- Removed dependency from [jQuery](https://jquery.com/)
- ... and maybe some new bugs 😉 

### Localization
All date values are based on [luxon](https://moment.github.io/luxon/index.html#/intl) which provides great support for localization. Instead of providing date format, weekday and month names manually as strings, it is usually easier to set the default locale like this:
```js
const Settings = luxon.Settings;
Settings.defaultLocale = 'fr-CA'

daterangepicker('#picker', {
   timePicker: true,
   singleDatePicker: false
};
```
instead of 
```js
daterangepicker('#picker', {
   timePicker: true,
   singleDatePicker: false,
   locale: {
      format: 'yyyyy-M-d H h m',
      daysOfWeek: [ 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.' ],
      monthNames: [ "janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre" ],
      firstDay: 7
   }
};
```

### Style and themes

You can style this daterangepicker with [Bulma CSS Framework](https://bulma.io/). Light and dark theme is supported:

![Bulma dark example](example/bulma-dark.png)

![Bulma light example](example/bulma-light.png)


## Methods

Available methods are listed in detail at [API Documentation](API_Doc.md). You will mainly use 
