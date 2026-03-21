## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
<dt><a href="#DateRangePickerEvent">DateRangePickerEvent</a> ⇐ <code>Event</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#daterangepicker">daterangepicker(elements, options, callback)</a> ⇒ <code>HTMLElement</code> | <code>Array.&lt;HTMLElement&gt;</code></dt>
<dd><p>Initiate a new DateRangePicker</p>
</dd>
<dt><a href="#getDateRangePicker">getDateRangePicker(target)</a> ⇒ <code><a href="#DateRangePicker">DateRangePicker</a></code></dt>
<dd><p>Returns the DateRangePicker. Equivalent to <code>element._daterangepicker</code></p>
</dd>
</dl>

## Events

<dl>
<dt><a href="#event_violate">"violate"</a></dt>
<dd><p>Emitted when the date is changed through <code>&lt;input&gt;</code> element or via <a href="#DateRangePicker+setStartDate">setStartDate</a> or 
<a href="#DateRangePicker+setRange">setRange</a> and date is not valid due to 
<code>minDate</code>, <code>maxDate</code>, <code>minSpan</code>, <code>maxSpan</code>, <code>invalidDate</code> and <code>invalidTime</code> constraints.<br>
Event is only triggered when date string is valid and date value is changing<br></p>
</dd>
<dt><a href="#event_beforeRenderCalendar">"beforeRenderCalendar"</a></dt>
<dd><p>Emitted before the calendar time picker is rendered.</p>
</dd>
<dt><a href="#event_beforeRenderCalendar">"beforeRenderCalendar"</a></dt>
<dd><p>Emitted before the calendar is rendered. Useful to remove any manually added elements.</p>
</dd>
<dt><a href="#event_show">"show"</a></dt>
<dd><p>Emitted when the picker is shown</p>
</dd>
<dt><a href="#event_beforeHide">"beforeHide"</a></dt>
<dd><p>Emitted before the picker will hide.</p>
</dd>
<dt><a href="#event_hide">"hide"</a></dt>
<dd><p>Emitted when the picker is hidden</p>
</dd>
<dt><a href="#event_showCalendar">"showCalendar"</a></dt>
<dd><p>Emitted when the calendar(s) are shown.
Only useful when <a href="#Ranges">Ranges</a> are used.</p>
</dd>
<dt><a href="#event_hideCalendar">"hideCalendar"</a></dt>
<dd><p>Emitted when the calendar(s) are hidden. Only used when <a href="#Ranges">Ranges</a> are used.</p>
</dd>
<dt><a href="#event_outsideClick">"outsideClick"</a></dt>
<dd><p>Emitted when user clicks outside the picker. Use option <code>onOutsideClick</code> to define the default action, then you may not need to handle this event.</p>
</dd>
<dt><a href="#event_dateChange">"dateChange"</a></dt>
<dd><p>Emitted when the date changed. Does not trigger when time is changed, use <a href="#event_timeChange">&quot;timeChange&quot;</a> to handle it</p>
</dd>
<dt><a href="#event_timeChange">"timeChange"</a></dt>
<dd><p>Emitted when the time changed. Does not trigger when date is changed</p>
</dd>
<dt><a href="#event_apply">"apply"</a></dt>
<dd><p>Emitted when the <code>Apply</code> button is clicked, or when a predefined <a href="#Ranges">Ranges</a> is clicked</p>
</dd>
<dt><a href="#event_cancel">"cancel"</a></dt>
<dd><p>Emitted when the <code>Cancel</code> button is clicked</p>
</dd>
<dt><a href="#event_inputChange">"inputChange"</a></dt>
<dd><p>Emitted when the date is changed through <code>&lt;input&gt;</code> element. Event is only triggered when date string is valid and date value has changed</p>
</dd>
<dt><a href="#event_monthViewChange">"monthViewChange"</a></dt>
<dd><p>Emitted after month view changed, for example by click on &#39;prev&#39; or &#39;next&#39;</p>
</dd>
<dt><a href="#event_beforeRenderTimePicker">"beforeRenderTimePicker" (this)</a></dt>
<dd><p>Emitted before the TimePicker is rendered.
Useful to remove any manually added elements.</p>
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
<dt><a href="#NewDate">NewDate</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#callback">callback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="DateRangePicker"></a>

## DateRangePicker
**Kind**: global class  

* [DateRangePicker](#DateRangePicker)
    * [new DateRangePicker(element, options, cb)](#new_DateRangePicker_new)
    * [.startDate](#DateRangePicker+startDate) : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
    * [.endDate](#DateRangePicker+endDate) : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
    * [.events](#DateRangePicker+events)
    * [.setStartDate(startDate, updateView)](#DateRangePicker+setStartDate) ⇒ <code>InputViolation</code>
    * [.setEndDate(endDate, updateView)](#DateRangePicker+setEndDate) ⇒ <code>InputViolation</code>
    * [.setRange(startDate, endDate, updateView)](#DateRangePicker+setRange) ⇒ <code>InputViolation</code>
    * [.parseDate(value)](#DateRangePicker+parseDate) ⇒ [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
    * [.formatDate(date, format)](#DateRangePicker+formatDate) ⇒ <code>string</code>
    * [.validateInput(range, dipatch)](#DateRangePicker+validateInput) ⇒ <code>InputViolation</code> \| <code>null</code>
    * [.updateView(monthChange)](#DateRangePicker+updateView)
    * [.show()](#DateRangePicker+show)
    * [.hide()](#DateRangePicker+hide)
    * [.toggle()](#DateRangePicker+toggle)
    * [.showCalendars()](#DateRangePicker+showCalendars)
    * [.hideCalendars()](#DateRangePicker+hideCalendars)
    * [.updateElement()](#DateRangePicker+updateElement)
    * [.updateAltInput()](#DateRangePicker+updateAltInput)
    * [.remove()](#DateRangePicker+remove)
    * [.addListener(element, eventName, selector, delegate)](#DateRangePicker+addListener)

<a name="new_DateRangePicker_new"></a>

### new DateRangePicker(element, options, cb)

| Param | Type | Description |
| --- | --- | --- |
| element | <code>string</code> \| [<code>HTMLElement</code>](https://developer.mozilla.org/de/docs/Web/API/HTMLElement) | A DOM HTMLElement or querySelector string of element where DateRangePicker is attached. Often a `<input>` element. |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| cb | <code>function</code> | Callback function executed when new date values applied |

<a name="DateRangePicker+startDate"></a>

### dateRangePicker.startDate : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
startDate

**Kind**: instance property of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+endDate"></a>

### dateRangePicker.endDate : [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
endDate

**Kind**: instance property of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+events"></a>

### dateRangePicker.events
Getter for all DateRangePickerEvents

**Kind**: instance property of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+setStartDate"></a>

### dateRangePicker.setStartDate(startDate, updateView) ⇒ <code>InputViolation</code>
Sets the date range picker's currently selected start date to the provided date.<br>
`startDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violate](#DateRangePicker+violate) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>InputViolation</code> - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set. In case of ranges, the current `endDate` is used. |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = getDateRangePicker('#picker');
drp.setStartDate(DateTime.now().startOf('hour'));
```
<a name="DateRangePicker+setEndDate"></a>

### dateRangePicker.setEndDate(endDate, updateView) ⇒ <code>InputViolation</code>
Sets the date range picker's currently selected start date to the provided date.<br>
`endDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violate](#DateRangePicker+violate) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>InputViolation</code> - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set. In case of ranges, the current `startDate` is used. |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = getDateRangePicker('#picker');
drp.setEndDate(DateTime.now().startOf('hour'));
```
<a name="DateRangePicker+setRange"></a>

### dateRangePicker.setRange(startDate, endDate, updateView) ⇒ <code>InputViolation</code>
Sets the date range picker's currently selected start date to the provided date.<br>
`startDate` and `endDate` must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](ISO-8601) or a string matching `locale.format`.<br>
Invalid date values are handled by [violate](#DateRangePicker+violate) Event

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>InputViolation</code> - - Object of violations or `null` if no violation have been found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | startDate to be set |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> |  | endDate to be set |
| updateView | <code>boolean</code> | <code>true</code> | If `true`, then calendar UI is updated to new value. Otherwise only internal values are set. |

**Example**  
```js
const drp = getDateRangePicker('#picker');
drp.setRange(DateTime.now().startOf('hour'), DateTime.now().endOf('day'));
```
<a name="DateRangePicker+parseDate"></a>

### dateRangePicker.parseDate(value) ⇒ [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime)
Parse date value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) - - DateTime object  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>sting</code> \| [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| <code>Date</code> | The value to be parsed |

<a name="DateRangePicker+formatDate"></a>

### dateRangePicker.formatDate(date, format) ⇒ <code>string</code>
Format a DateTime object

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>string</code> - - Formatted date string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) |  | The DateTime to format |
| format | <code>object</code> \| <code>string</code> | <code>this.locale.format</code> | The format option |

<a name="DateRangePicker+validateInput"></a>

### dateRangePicker.validateInput(range, dipatch) ⇒ <code>InputViolation</code> \| <code>null</code>
Validate `startDate` and `endDate` against `timePickerStepSize`, `minDate`, `maxDate`, 
`minSpan`, `maxSpan`, `invalidDate` and `invalidTime`.

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: <code>InputViolation</code> \| <code>null</code> - - Object of violations and corrected values or `null` if no violation have been found  
**Emits**: <code>event:&quot;violate&quot;</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| range | <code>Array</code> |  | `[startDate, endDate]`<br>Range to be checked, defaults to current `startDate` and `endDate` |
| dipatch | <code>boolean</code> | <code>false</code> | If `true` then event "violate" is dispated.<br> If eventHandler returns `true`, then `null` is returned, otherwiese the object of violations. |

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
  startDate: [
    { old: "2026-03-13T10:35:52", reason: "timePickerStepSize", new: "2026-03-13T11:00:00" },
    { old: "2026-03-13T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" }
  ],
  endDate: {
    { old: "2026-03-16T10:35:52", reason: "stepSize", new: "2026-03-16T11:00:00" },
    { old: "2026-03-16T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" },
    { old: "2026-03-10T00:00:00", reason: "minSpan", new: "2026-03-17T00:00:00" }
  ],
  newDate: { 
    startDate: "2026-03-10T00:00:00", 
    endDate: "2026-03-17T00:00:00"
  }
}
```
<a name="DateRangePicker+updateView"></a>

### dateRangePicker.updateView(monthChange)
Updates the picker when calendar is initiated or any date has been selected. 
Could be useful after running [setStartDate](#DateRangePicker+setStartDate) or [setRange](#DateRangePicker+setEndDate)

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;beforeRenderTimePicker&quot;</code>  

| Param | Type | Description |
| --- | --- | --- |
| monthChange | <code>boolean</code> | If `true` then monthView changed |

<a name="DateRangePicker+show"></a>

### dateRangePicker.show()
Shows the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;show&quot;</code>  
<a name="DateRangePicker+hide"></a>

### dateRangePicker.hide()
Hides the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;beforeHide&quot;</code>, <code>event:&quot;hide&quot;</code>  
<a name="DateRangePicker+toggle"></a>

### dateRangePicker.toggle()
Toggles visibility of the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+showCalendars"></a>

### dateRangePicker.showCalendars()
Shows calendar when user selects "Custom Ranges"

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;showCalendar&quot;</code>  
<a name="DateRangePicker+hideCalendars"></a>

### dateRangePicker.hideCalendars()
Hides calendar when user selects a predefined range

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;hideCalendar&quot;</code>  
<a name="DateRangePicker+updateElement"></a>

### dateRangePicker.updateElement()
Update attached `<input>` element with selected value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>change</code>](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)  
<a name="DateRangePicker+updateAltInput"></a>

### dateRangePicker.updateAltInput()
Update altInput `<input>` element with selected value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+remove"></a>

### dateRangePicker.remove()
Removes the picker from document

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+addListener"></a>

### dateRangePicker.addListener(element, eventName, selector, delegate)
Helper function to add eventListener similar to jQuery .on( events [, selector ] [, data ] )

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>string</code> | Query selector of element where listener is added |
| eventName | <code>string</code> | Name of the event |
| selector | <code>string</code> | Query selector string to filter the descendants of the element |
| delegate | <code>any</code> | Handler data |

<a name="DateRangePickerEvent"></a>

## DateRangePickerEvent ⇐ <code>Event</code>
**Kind**: global class  
**Extends**: <code>Event</code>  
<a name="daterangepicker"></a>

## daterangepicker(elements, options, callback) ⇒ <code>HTMLElement</code> \| <code>Array.&lt;HTMLElement&gt;</code>
Initiate a new DateRangePicker

**Kind**: global function  
**Returns**: <code>HTMLElement</code> \| <code>Array.&lt;HTMLElement&gt;</code> - The input `element` instance or an array of HTMLElement instances if `elements` matches more than one element  

| Param | Type | Description |
| --- | --- | --- |
| elements | <code>string</code> \| [<code>HTMLElement</code>](https://developer.mozilla.org/de/docs/Web/API/HTMLElement) | Element where DateRangePicker is attached |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| callback | [<code>callback</code>](#callback) | Callback function executed when date is changed.<br/> Callback function is executed if selected date values has changed, before picker is hidden and before the attached `<input>` element is updated.  As alternative listen to the ["apply"](#event_apply) event |

<a name="getDateRangePicker"></a>

## getDateRangePicker(target) ⇒ [<code>DateRangePicker</code>](#DateRangePicker)
Returns the DateRangePicker. Equivalent to `element._daterangepicker`

**Kind**: global function  
**Returns**: [<code>DateRangePicker</code>](#DateRangePicker) - - The attached DateRangePicker  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>HTMLElement</code> \| <code>string</code> | The HTMLElement or querySelector string where the DateRangePicker is attached. |

<a name="event_violate"></a>

## "violate"
Emitted when the date is changed through `<input>` element or via [setStartDate](#DateRangePicker+setStartDate) or 
[setRange](#DateRangePicker+setRange) and date is not valid due to 
`minDate`, `maxDate`, `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` constraints.<br>
Event is only triggered when date string is valid and date value is changing<br>

**Kind**: event emitted  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) |  | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) |  | The daterangepicker object |
| event.violation | <code>InputViolation</code> |  | The daterangepicker object |
| event.newDate | [<code>NewDate</code>](#NewDate) |  | Object of corrected date values |
| event.cancelable | <code>boolean</code> | <code>true</code> | By calling `event.preventDefault()` the `newDate` values will apply |

**Example**  
```js
daterangepicker('#picker', {
  startDate: DateTime.now(),
  // allow only dates from current year
  minDate: DateTime.now().startOf('year'),
  manDate: DateTime.now().endOf('year'),
  singleDatePicker: true,
  locale: {
     format: DateTime.DATETIME_SHORT
  }
}).addEventListener('violate', (ev) => {
  ev.newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
  ev.preventDefault();
});

// Try to set date outside permitted range at <input> elemet
const input = document.querySelector('#picker');
input.value = DateTime.now().minus({ years: 10 })).toLocaleString(DateTime.DATETIME_SHORT)
input.dispatchEvent(new Event('keyup'));
// Try to set date outside permitted range by code
const drp = getDateRangePicker('#picker');
drp.setStartDate(DateTime.now().minus({ years: 10 });

// -> Calendar selects and shows "today - 3 days"
```
<a name="event_beforeRenderCalendar"></a>

## "beforeRenderCalendar"
Emitted before the calendar time picker is rendered.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_beforeRenderCalendar"></a>

## "beforeRenderCalendar"
Emitted before the calendar is rendered. Useful to remove any manually added elements.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_show"></a>

## "show"
Emitted when the picker is shown

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_beforeHide"></a>

## "beforeHide"
Emitted before the picker will hide.

**Kind**: event emitted  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) |  | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) |  | The daterangepicker object |
| event.cancelable | <code>boolean</code> | <code>true</code> | Hide is canceled  by calling `event.preventDefault()` |

<a name="event_hide"></a>

## "hide"
Emitted when the picker is hidden

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_showCalendar"></a>

## "showCalendar"
Emitted when the calendar(s) are shown.
Only useful when [Ranges](#Ranges) are used.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_hideCalendar"></a>

## "hideCalendar"
Emitted when the calendar(s) are hidden. Only used when [Ranges](#Ranges) are used.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_outsideClick"></a>

## "outsideClick"
Emitted when user clicks outside the picker. Use option `onOutsideClick` to define the default action, then you may not need to handle this event.

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_dateChange"></a>

## "dateChange"
Emitted when the date changed. Does not trigger when time is changed, use ["timeChange"](#event_timeChange) to handle it

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker |

<a name="event_timeChange"></a>

## "timeChange"
Emitted when the time changed. Does not trigger when date is changed

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker |

<a name="event_apply"></a>

## "apply"
Emitted when the `Apply` button is clicked, or when a predefined [Ranges](#Ranges) is clicked

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_cancel"></a>

## "cancel"
Emitted when the `Cancel` button is clicked

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_inputChange"></a>

## "inputChange"
Emitted when the date is changed through `<input>` element. Event is only triggered when date string is valid and date value has changed

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_monthViewChange"></a>

## "monthViewChange"
Emitted after month view changed, for example by click on 'prev' or 'next'

**Kind**: event emitted  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>DateRangePickerEvent</code>](#DateRangePickerEvent) | The Event object |
| event.picker | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| left | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | The first day of month in left-hand calendar |
| right | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | The first day of month in left-hand calendar or `null` for singleDatePicker |

<a name="event_beforeRenderTimePicker"></a>

## "beforeRenderTimePicker" (this)
Emitted before the TimePicker is rendered.
Useful to remove any manually added elements.

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
| parentEl | <code>string</code> \| [<code>HTMLElement</code>](https://developer.mozilla.org/de/docs/Web/API/HTMLElement) | <code>&quot;body&quot;</code> | [Document querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#selectors)  or `HTMLElement` of the parent element that the date range picker will be added to |
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
| timePickerStepSize | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> |  | Default: `Duration.fromObject({minutes:1})`<br>Set the time picker step size.<br> Must be a `luxon.Duration` or the number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) duration.<br> Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})`  and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br> Duration must be greater than `minSpan` and smaller than `maxSpan`.<br> For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes. |
| autoUpdateInput | <code>boolean</code> | <code>true</code> | Indicates whether the date range picker should instantly update the value of the attached `<input>`  element when the selected dates change.<br>The `<input>` element will be always updated on `Apply` and reverted when user clicks on `Cancel`. |
| onOutsideClick | <code>string</code> | <code>&quot;apply&quot;</code> | Defines what picker shall do when user clicks outside the calendar.  `'apply'` or `'cancel'`. Event [onOutsideClick](#event_outsideClick) is always emitted. |
| linkedCalendars | <code>boolean</code> | <code>true</code> | When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February),  and both will be advanced when clicking the left or right arrows above the calendars.<br> When disabled, the two calendars can be individually advanced and display any month/year |
| isInvalidDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,<br>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br> Signature: `isInvalidDate(date)`<br> |
| isInvalidTime | <code>function</code> | <code>false</code> | A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br> Signature: `isInvalidTime(time, side, unit)`<br> `side` is `'start'` or `'end'` or `null` for `singleDatePicker: true`<br> `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br> Hours are always given as 24-hour clock<br> Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br> |
| isCustomDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,  and may return a string or array of CSS class names to apply to that date's calendar cell.<br> Signature: `isCustomDate(date)` |
| altInput | <code>string</code> \| <code>Array</code> \| [<code>HTMLInputElement</code>](https://developer.mozilla.org/de/docs/Web/API/HTMLInputElement) | <code>null</code> | A [Document querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#selectors)<br> string or `HTMLElement`  for an alternative output (typically hidden) `<input>` element. Uses `altFormat` to format the value.<br> Must be a single string/HTMLElement for `singleDatePicker: true` or an array of two strings or HTMLElement for `singleDatePicker: false`<br> Example: `['#start', '#end']` |
| altFormat | <code>function</code> \| <code>string</code> |  | The output format used for `altInput`.<br> Default: ISO-8601 basic format without time zone, precisison is derived from `timePicker` and `timePickerStepSize`<br> Example `yyyyMMdd'T'HHmm` for `timePicker=true` and display of Minutes<br>  If defined, either a string used with [Format tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or a function.<br> Examples: `"yyyy:MM:dd'T'HH:mm"`,<br>`(date) => date.toUnixInteger()` |
| applyButtonClasses | <code>string</code> | <code>&quot;btn-primary&quot;</code> | CSS class names that will be added only to the apply button |
| cancelButtonClasses | <code>string</code> | <code>&quot;btn-default&quot;</code> | CSS class names that will be added only to the cancel button |
| buttonClasses | <code>string</code> |  | Default: `'btn btn-sm'`<br>CSS class names that will be added to both the apply and cancel buttons. |
| weekendClasses | <code>string</code> | <code>&quot;weekend&quot;</code> | CSS class names that will be used to highlight weekend days.<br> Use `null` or empty string if you don't like to highlight weekend days. |
| weekendDayClasses | <code>string</code> | <code>&quot;weekend-day&quot;</code> | CSS class names that will be used to highlight weekend day names.<br> Weekend days are evaluated by [Info.getWeekendWeekdays](https://moment.github.io/luxon/api-docs/index.html#infogetweekendweekdays) and depend on current  locale settings. Use `null` or empty string if you don't like to highlight weekend day names. |
| todayClasses | <code>string</code> | <code>&quot;today&quot;</code> | CSS class names that will be used to highlight the current day.<br> Use `null` or empty string if you don't like to highlight the current day. |
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
| END_OF_OPTIONS |  |  |  |

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
<a name="NewDate"></a>

## NewDate : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reason | <code>string</code> | The type/reason of violation |
| old | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Old value startDate/endDate |
| new? | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Corrected value of startDate/endDate if existing |
| newDate.startDate- | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Object with corrected values |
| newDate.endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Object with corrected values |
| startDate | <code>Array.&lt;Violation&gt;</code> | The constraints which violates the input |
| endDate | <code>Array.&lt;Violation&gt;</code> | The constraints which violates the input or `null` for singleDatePicker |
| newDate | [<code>NewDate</code>](#NewDate) | Object with corrected values |

<a name="callback"></a>

## callback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected startDate |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected endDate |
| range | <code>string</code> |  |

