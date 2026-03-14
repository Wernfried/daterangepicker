## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
</dl>

## Events

<dl>
<dt><a href="#event_violated.daterangepicker">"violated.daterangepicker" (this, picker, result, newDate)</a> ÔçÆ <code>boolean</code></dt>
<dd><p>Emitted when the date is changed through <code>&lt;input&gt;</code> element or via <a href="#DateRangePicker+setStartDate">setStartDate</a> or 
<a href="#DateRangePicker+setRange">setRange</a> and date is not valid due to 
<code>minDate</code>, <code>maxDate</code>, <code>minSpan</code>, <code>maxSpan</code>, <code>invalidDate</code> and <code>invalidTime</code> constraints.<br>
Event is only triggered when date string is valid and date value is changing<br></p>
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
<dt><a href="#event_beforeHide.daterangepicker">"beforeHide.daterangepicker" (this)</a> ÔçÆ <code>boolean</code></dt>
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
<dd><p>A set of predefined ranges.<br>
Ranges are not validated against <code>minDate</code>, <code>maxDate</code>, <code>minSpan</code>, <code>maxSpan</code> or <code>timePickerStepSize </code> constraints.</p>
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
        * [.startDate](#DateRangePicker+startDate) : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
        * [.endDate](#DateRangePicker+endDate) : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
        * [.setStartDate(startDate, updateView)](#DateRangePicker+setStartDate) ÔçÆ [<code>InputViolation</code>](#InputViolation)
        * [.setEndDate(endDate, updateView)](#DateRangePicker+setEndDate) ÔçÆ [<code>InputViolation</code>](#InputViolation)
        * [.setRange(startDate, endDate, updateView)](#DateRangePicker+setRange) ÔçÆ [<code>InputViolation</code>](#InputViolation)
        * [.parseDate(value)](#DateRangePicker+parseDate) ÔçÆ [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
        * [.formatDate(date, format)](#DateRangePicker+formatDate) ÔçÆ <code>string</code>
        * [.validateInput(range, dipatch)](#DateRangePicker+validateInput) ÔçÆ [<code>InputViolation</code>](#InputViolation) \| <code>null</code>
        * [.updateView()](#DateRangePicker+updateView)
        * [.show()](#DateRangePicker+show)
        * [.hide()](#DateRangePicker+hide)
        * [.toggle()](#DateRangePicker+toggle)
        * [.showCalendars()](#DateRangePicker+showCalendars)
        * [.hideCalendars()](#DateRangePicker+hideCalendars)
        * [.updateElement()](#DateRangePicker+updateElement)
        * [.updateAltInput()](#DateRangePicker+updateAltInput)
        * [.remove()](#DateRangePicker+remove)
    * _static_
        * [.daterangepicker(options, callback)](#DateRangePicker.daterangepicker) ÔçÆ

<a name="new_DateRangePicker_new"></a>

### new DateRangePicker(element, options, cb)

| Param | Type | Description |
| --- | --- | --- |
| element | [<code>jQuery</code>](https://api.jquery.com/Types/#jQuery/) | jQuery selector of the parent element that the date range picker will be added to |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| cb | <code>function</code> | Callback function executed when |

<a name="DateRangePicker+startDate"></a>

### dateRangePicker.startDate : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
startDate

**Kind**: instance property of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+endDate"></a>

### dateRangePicker.endDate : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
endDate

**Kind**: instance property of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+setStartDate"></a>

### dateRangePicker.setStartDate(startDate, updateView) ÔçÆ [<code>InputViolation</code>](#InputViolation)
Sets the date range picker's currently selected start date to the provided date.<br>
`startDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violated](#DateRangePicker+violated) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>InputViolation</code>](#InputViolation) - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set. In case of ranges, the current `endDate` is used. |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = $('#picker').data('daterangepicker');
drp.setStartDate(DateTime.now().startOf('hour'));
```
<a name="DateRangePicker+setEndDate"></a>

### dateRangePicker.setEndDate(endDate, updateView) ÔçÆ [<code>InputViolation</code>](#InputViolation)
Sets the date range picker's currently selected start date to the provided date.<br>
`endDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violated](#DateRangePicker+violated) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>InputViolation</code>](#InputViolation) - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set. In case of ranges, the current `startDate` is used. |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = $('#picker').data('daterangepicker');
drp.setEndDate(DateTime.now().startOf('hour'));
```
<a name="DateRangePicker+setRange"></a>

### dateRangePicker.setRange(startDate, endDate, updateView) ÔçÆ [<code>InputViolation</code>](#InputViolation)
Sets the date range picker's currently selected start date to the provided date.<br>
`startDate` and `endDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violated](#DateRangePicker+violated) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>InputViolation</code>](#InputViolation) - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = $('#picker').data('daterangepicker');
drp.setRange(DateTime.now().startOf('hour'), DateTime.now().endOf('day'));
```
<a name="DateRangePicker+parseDate"></a>

### dateRangePicker.parseDate(value) ÔçÆ [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
Parse date value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) - - DateTime object  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>sting</code> \| [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| <code>Date</code> | The value to be parsed |

<a name="DateRangePicker+formatDate"></a>

### dateRangePicker.formatDate(date, format) ÔçÆ <code>string</code>
Format a DateTime object

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>string</code> - - Formatted date string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) |  | The DateTime to format |
| format | <code>object</code> \| <code>string</code> | <code>this.locale.format</code> | The format option |

<a name="DateRangePicker+validateInput"></a>

### dateRangePicker.validateInput(range, dipatch) ÔçÆ [<code>InputViolation</code>](#InputViolation) \| <code>null</code>
Validate `startDate` and `endDate` against `timePickerStepSize`, `minDate`, `maxDate`, 
`minSpan`, `maxSpan`, `invalidDate` and `invalidTime`.

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>InputViolation</code>](#InputViolation) \| <code>null</code> - - Object of violations and corrected values or `null` if no violation have been found  
**Emits**: <code>event:&quot;violated.daterangepicker&quot;</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| range | <code>Array</code> |  | `[startDate, endDate]`<br>Range to be checked, defaults to current `startDate` and `endDate` |
| dipatch | <code>boolean</code> | <code>false</code> | If `true` then event "violated.daterangepicker" is dispated.<br> If eventHandler returns `true`, then `null` is returned, otherwiese the object of violations. |

**Example**  
```js
options => {
  minDate: DateTime.now().minus({months: 3}).startOf('day'),
  maxDate: DateTime.now().minus({day: 3}).startOf('day'),
  minSpan: Duration.fromObject({days: 7}),
  maxSpan: Duration.fromObject({days: 70}),
  timePickerStepSize: Duration.fromObject({hours: 1})
}
const result = validateInput(DateTime.now(), DateTime.now().plus({day: 3}));

result => {
  startDate: {
    violations: [
      { old: "2026-03-13T10:35:52", reason: "timePickerStepSize", new: "2026-03-13T11:00:00" },
      { old: "2026-03-13T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" }
    ]
},
  endDate: {
    violations: [
      { old: "2026-03-16T10:35:52", reason: "stepSize", new: "2026-03-16T11:00:00" },
      { old: "2026-03-16T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" },
      { old: "2026-03-10T00:00:00", reason: "minSpan", new: "2026-03-17T00:00:00" }
    ]
  }
}
```
<a name="DateRangePicker+updateView"></a>

### dateRangePicker.updateView()
Updates the picker when calendar is initiated or any date has been selected. 
Could be useful after running [setStartDate](#DateRangePicker+setStartDate) or [setRange](#DateRangePicker+setEndDate)

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;beforeRenderTimePicker.daterangepicker&quot;</code>  
<a name="DateRangePicker+show"></a>

### dateRangePicker.show()
Shows the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;show.daterangepicker&quot;</code>  
<a name="DateRangePicker+hide"></a>

### dateRangePicker.hide()
Hides the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;beforeHide.daterangepicker&quot;</code>, <code>event:&quot;hide.daterangepicker&quot;</code>  
<a name="DateRangePicker+toggle"></a>

### dateRangePicker.toggle()
Toggles visibility of the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
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
<a name="DateRangePicker+updateAltInput"></a>

### dateRangePicker.updateAltInput()
Update altInput `<input>` element with selected value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+remove"></a>

### dateRangePicker.remove()
Removes the picker from document

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker.daterangepicker"></a>

### DateRangePicker.daterangepicker(options, callback) ÔçÆ
Initiate a new DateRangePicker

**Kind**: static method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: DateRangePicker  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| callback | [<code>callback</code>](#callback) | Callback function executed when date is changed.<br> Callback function is executed if selected date values has changed, before picker is hidden and before the attached `<input>` element is updated.  As alternative listen to the ["apply.daterangepicker"](#event_apply.daterangepicker) event |

<a name="event_violated.daterangepicker"></a>

## "violated.daterangepicker" (this, picker, result, newDate) ÔçÆ <code>boolean</code>
Emitted when the date is changed through `<input>` element or via [setStartDate](#DateRangePicker+setStartDate) or 
[setRange](#DateRangePicker+setRange) and date is not valid due to 
`minDate`, `maxDate`, `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` constraints.<br>
Event is only triggered when date string is valid and date value is changing<br>

**Kind**: event emitted  
**Returns**: <code>boolean</code> - =undefined - If handler returns `true`, then values from `newDate` object are used  

| Param | Type | Description |
| --- | --- | --- |
| this | <code>Object</code> | The event object |
| picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| result | [<code>InputViolation</code>](#InputViolation) | The violation object, see example of `validateInput()` |
| newDate | <code>Object</code> | Object of {startDate, endDate} |

**Example**  
```js
$('#picker').daterangepicker({
  startDate: DateTime.now(),
  // allow only dates from current year
  minDate: DateTime.now().startOf('year'),
  manDate: DateTime.now().endOf('year'),
  singleDatePicker: true,
  locale: {
     format: DateTime.DATETIME_SHORT
  }
}).on('violated.daterangepicker', (ev, picker, result, newDate) => {
  newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
  return true;
});

// Try to set date outside permitted range at <input> elemet
$('#picker').val(DateTime.now().minus({ years: 10 })).toLocaleString(DateTime.DATETIME_SHORT).trigger('keyup');
// Try to set date outside permitted range by code
const drp = $('#picker').data('daterangepicker').setStartDate(DateTime.now().minus({ years: 10 })

// -> Calendar selects and shows "today - 3 days"
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

## "beforeHide.daterangepicker" (this) ÔçÆ <code>boolean</code>
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
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | Default: `DateTime.now().startOf('day')`<br>The beginning date of the initially selected date range.<br> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br> Date value is rounded to match option `timePickerStepSize`<br> Option `isInvalidDate` and `isInvalidTime` are not evaluated, you may set date/time which is not selectable in calendar.<br> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br> Use `startDate: null` to show calendar without an inital selected date. |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | Defautl: `DateTime.now().endOf('day')`<br>The end date of the initially selected date range.<br> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br> Date value is rounded to match option `timePickerStepSize`<br> Option `isInvalidDate`, `isInvalidTime` and `minSpan`, `maxSpan` are not evaluated, you may set date/time which is not selectable in calendar.<br> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br> |
| minDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The earliest date a user may select or `null` for no limit.<br> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`. |
| maxDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The latest date a user may select or `null` for no limit.<br> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`. |
| minSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The minimum span between the selected start and end dates.<br> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br> Ignored when `singleDatePicker: true` |
| maxSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The maximum  span between the selected start and end dates.<br> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br> Ignored when `singleDatePicker: true` |
| defaultSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The span which is used when endDate is automatically updated due to wrong user input<br> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br> Ignored when `singleDatePicker: true`. Not relevant if `minSpan: null` |
| initalMonth | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | Default: `DateTime.now().startOf('month')`<br> The inital month shown when `startDate: null`. Be aware, the attached `<input>` element must be also empty.<br> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching `locale.format`.<br> When `initalMonth` is used, then `endDate` is ignored and it works only with `timePicker: false` |
| autoApply | <code>boolean</code> | <code>false</code> | Hide the `Apply` and `Cancel` buttons, and automatically apply a new date range as soon as two dates are clicked.<br> Only useful when `timePicker: false` |
| singleDatePicker | <code>boolean</code> | <code>false</code> | Show only a single calendar to choose one date, instead of a range picker with two calendars.<br> If `true`, then `endDate` is always `null`. |
| singleMonthView | <code>boolean</code> | <code>false</code> | Show only a single month calendar, useful when selected ranges are usually short<br> or for smaller viewports like mobile devices.<br> Ignored for `singleDatePicker: true`. |
| showDropdowns | <code>boolean</code> | <code>false</code> | Show year and month select boxes above calendars to jump to a specific month and year |
| minYear | <code>number</code> |  | Default: `DateTime.now().minus({year:100}).year`<br>The minimum year shown in the dropdowns when `showDropdowns: true` |
| maxYear | <code>number</code> |  | Default: `DateTime.now().plus({year:100}).year`<br>The maximum  year shown in the dropdowns when `showDropdowns: true` |
| showWeekNumbers | <code>boolean</code> | <code>false</code> | Show **localized** week numbers at the start of each week on the calendars |
| showISOWeekNumbers | <code>boolean</code> | <code>false</code> | Show **ISO** week numbers at the start of each week on the calendars.<br> Takes precedence over localized `showWeekNumbers` |
| timePicker | <code>boolean</code> | <code>false</code> | Adds select boxes to choose times in addition to dates |
| timePicker24Hour | <code>boolean</code> | <code>true|false</code> | Use 24-hour instead of 12-hour times, removing the AM/PM selection.<br> Default is derived from current locale [Intl.DateTimeFormat.resolvedOptions.hour12](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#hour12). |
| timePickerStepSize | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> |  | Default: `Duration.fromObject({minutes:1})`<br>Set the time picker step size.<br> Must be a `luxon.Duration` or the number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br> Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})`  and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br> Duration must be greater than `minSpan` and smaller than `maxSpan`.<br> For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes.<br> Overwrites `timePickerIncrement` and `timePickerSeconds`, ignored when `timePicker: false` |
| timePickerSeconds | <code>boolean</code> | <code>boolean</code> | **Deprecated**, use `timePickerStepSize`<br>Show seconds in the timePicker |
| timePickerIncrement | <code>boolean</code> | <code>1</code> | **Deprecated**, use `timePickerStepSize`<br>Increment of the minutes selection list for times |
| autoUpdateInput | <code>boolean</code> | <code>true</code> | Indicates whether the date range picker should instantly update the value of the attached `<input>`  element when the selected dates change.<br>The `<input>` element will be always updated on `Apply` and reverted when user clicks on `Cancel`. |
| onOutsideClick | <code>string</code> | <code>&quot;apply&quot;</code> | Defines what picker shall do when user clicks outside the calendar.  `'apply'` or `'cancel'`. Event [onOutsideClick.daterangepicker](#event_outsideClick.daterangepicker) is always emitted. |
| linkedCalendars | <code>boolean</code> | <code>true</code> | When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February),  and both will be advanced when clicking the left or right arrows above the calendars.<br> When disabled, the two calendars can be individually advanced and display any month/year |
| isInvalidDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,<br>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br> Signature: `isInvalidDate(date)`<br> |
| isInvalidTime | <code>function</code> | <code>false</code> | A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br> Signature: `isInvalidTime(time, side, unit)`<br> `side` is `'start'` or `'end'` or `null` for `singleDatePicker: true`<br> `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br> Hours are always given as 24-hour clock<br> Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br> |
| isCustomDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,  and may return a string or array of CSS class names to apply to that date's calendar cell.<br> Signature: `isCustomDate(date)` |
| altInput | <code>string</code> \| <code>Array</code> | <code>null</code> | A [jQuery selector](https://api.jquery.com/category/selectors/) string for an alternative output (typically hidden) `<input>` element. Uses `altFormat` to format the value.<br> Must be a single string for `singleDatePicker: true` or an array of two strings for `singleDatePicker: false`<br> Example: `['#start', '#end']` |
| altFormat | <code>function</code> \| <code>string</code> |  | The output format used for `altInput`.<br> Default: ISO-8601 basic format without time zone, precisison is derived from `timePicker` and `timePickerStepSize`<br> Example `yyyyMMdd'T'HHmm` for `timePicker=true` and display of Minutes<br>  If defined, either a string used with [Format tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or a function.<br> Examples: `"yyyy:MM:dd'T'HH:mm"`,<br>`(date) => date.toUnixInteger()` |
| ~~warnings~~ | <code>boolean</code> |  | Not used anymore. Listen to event `violated.daterangepicker` to react on invalid input data |
| applyButtonClasses | <code>string</code> | <code>&quot;btn-primary&quot;</code> | CSS class names that will be added only to the apply button |
| cancelButtonClasses | <code>string</code> | <code>&quot;btn-default&quot;</code> | CSS class names that will be added only to the cancel button |
| buttonClasses | <code>string</code> |  | Default: `'btn btn-sm'`<br>CSS class names that will be added to both the apply and cancel buttons. |
| weekendClasses | <code>string</code> | <code>&quot;weekend&quot;</code> | CSS class names that will be used to highlight weekend days.<br> Use `null` or empty string if you don't like to highlight weekend days. |
| weekendDayClasses | <code>string</code> | <code>&quot;weekend-day&quot;</code> | CSS class names that will be used to highlight weekend day names.<br> Weekend days are evaluated by [Info.getWeekendWeekdays](https://moment.github.io/luxon/api-docs/index.html#infogetweekendweekdays) and depend on current  locale settings. Use `null` or empty string if you don't like to highlight weekend day names. |
| todayClasses | <code>string</code> | <code>&quot;today&quot;</code> | CSS class names that will be used to highlight the current day.<br> Use `null` or empty string if you don't like to highlight the current day. |
| externalStyle | <code>string</code> | <code>null</code> | External CSS Framework to style the picker. Currently only `'bulma'` is supported. |
| opens | <code>string</code> | <code>&quot;right&quot;</code> | Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.<br> `'left' \| 'right' \| 'center'` |
| drops | <code>string</code> | <code>&quot;down&quot;</code> | Whether the picker appears below or above the HTML element it's attached to.<br> `'down' \| 'up' \| 'auto'` |
| ranges | <code>object</code> | <code>{}</code> | Set predefined date [Ranges](#Ranges) the user can select from. Each key is the label for the range,  and its value an array with two dates representing the bounds of the range. |
| showCustomRangeLabel | <code>boolean</code> | <code>true</code> | Displays "Custom Range" at the end of the list of predefined [Ranges](#Ranges),  when the ranges option is used.<br> This option will be highlighted whenever the current date range selection does not match one of the predefined ranges.<br> Clicking it will display the calendars to select a new range. |
| alwaysShowCalendars | <code>boolean</code> | <code>false</code> | Normally, if you use the ranges option to specify pre-defined date ranges,  calendars for choosing a custom date range are not shown until the user clicks "Custom Range".<br> When this option is set to true, the calendars for choosing a custom date range are always shown instead. |
| showLabel= | <code>boolean</code> |  | Shows selected range next to Apply buttons.<br> Defaults to `false` if anchor element is `<input type="text">`, otherwise `true` |
| locale | <code>object</code> | <code>{}</code> | Allows you to provide localized strings for buttons and labels, customize the date format,  and change the first day of week for the calendars. |
| locale.direction | <code>string</code> | <code>&quot;ltr&quot;</code> | Direction of reading, `'ltr'` or `'rtl'` |
| locale.format | <code>object</code> \| <code>string</code> |  | Default: `DateTime.DATE_SHORT` or `DateTime.DATETIME_SHORT` when `timePicker: true`<br>Date formats.  Either given as string, see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according  to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)<br> I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets). |
| locale.separator | <code>string</code> |  | Defaut: `' - '`<br>Separator for start and end time |
| locale.weekLabel | <code>string</code> | <code>&quot;W&quot;</code> | Label for week numbers |
| locale.daysOfWeek | <code>Array</code> |  | Default: `luxon.Info.weekdays('short')`<br>Array with weekday names, from Monday to Sunday |
| locale.monthNames | <code>Array</code> |  | Default: `luxon.Info.months('long')`<br>Array with month names |
| locale.firstDay | <code>number</code> |  | Default: `luxon.Info.getStartOfWeek()`<br>First day of the week, 1 for Monday through 7 for Sunday |
| locale.applyLabel | <code>string</code> | <code>&quot;Apply&quot;</code> | Label of `Apply` Button |
| locale.cancelLabel | <code>string</code> | <code>&quot;Cancel&quot;</code> | Label of `Cancel` Button |
| locale.customRangeLabel | <code>string</code> | <code>&quot;Custom&quot;</code> | Range - Title for custom ranges |
| locale.durationFormat | <code>object</code> \| <code>string</code> \| <code>function</code> | <code>{}</code> | Format a custom label for selected duration, for example `'5 Days, 12 Hours'`.<br> Define the format either as string, see [Duration.toFormat - Format Tokens](https://moment.github.io/luxon/api-docs/index.html#durationtoformat) or  an object according to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options),  see [Duration.toHuamn](https://moment.github.io/luxon/api-docs/index.html#durationtohuman).<br> Or custom function as `(startDate, endDate) => {}` |

<a name="Ranges"></a>

## Ranges : <code>Object</code>
A set of predefined ranges.<br>
Ranges are not validated against `minDate`, `maxDate`, `minSpan`, `maxSpan` or `timePickerStepSize ` constraints.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the range |
| range | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | Array of 2 elements with `startDate` and `endDate` |

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
| endDate? | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| <code>undefined</code> | Violation of endDate, if existing |
| violations | <code>Array</code> | The constraints which violates the input |
| reason | <code>Array</code> | The type/reson of violation |
| old | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Old value startDate/endDate |
| new? | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Corrected value of startDate/endDate if existing |

<a name="callback"></a>

## callback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected startDate |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected endDate |
| range | <code>string</code> |  |

