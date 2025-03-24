## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
</dl>

## Events

<dl>
<dt><a href="#event_show">"show" (this)</a></dt>
<dd><p>Emitted when the picker is shown</p>
</dd>
<dt><a href="#event_beforeHide">"beforeHide" (this)</a> ⇒ <code>boolean</code></dt>
<dd><p>Emitted before the picker will hide. When EventHandler returns <code>true</code>, then picker remains visible</p>
</dd>
<dt><a href="#event_hide">"hide" (this)</a></dt>
<dd><p>Emitted when the picker is hidden</p>
</dd>
<dt><a href="#event_outsideClick">"outsideClick" (this)</a></dt>
<dd><p>Emitted when user clicks outside the picker. 
Picker values is not updated, you may trigger <a href="#event_apply">apply</a> or <a href="#event_cancel">cancel</a> in your EventHandler.</p>
</dd>
<dt><a href="#event_showCalendar">"showCalendar" (this)</a></dt>
<dd><p>Emitted when the calendar(s) are shown.
Only useful when <a href="#Options.Ranges">custom ranges</a> are used.</p>
</dd>
<dt><a href="#event_showCalendar">"showCalendar" (this)</a></dt>
<dd><p>Emitted when the calendar(s) are hidden.
Only useful when <a href="#Options.Ranges">custom ranges</a> are used.</p>
</dd>
<dt><a href="#event_dateChange">"dateChange" (this, side)</a></dt>
<dd><p>Emitted when the date changed. Does not trigger when time is changed, use <a href="event_timeChange">timeChange</a> to handle it</p>
</dd>
<dt><a href="#event_apply">"apply" (this)</a></dt>
<dd><p>Emitted when the <code>Apply</code> button is clicked, or when a predefined <a href="#Options.Ranges">range</a> is clicked</p>
</dd>
<dt><a href="#event_cancel">"cancel" (this)</a></dt>
<dd><p>Emitted when the <code>Cancel</code> button is clicked</p>
</dd>
<dt><a href="#event_timeChange">"timeChange" (this, side)</a></dt>
<dd><p>Emitted when the time changed. Does not trigger when date is changed</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a></dt>
<dd><p>Options for DateRangePicker</p>
</dd>
<dt><a href="#callback">callback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="DateRangePicker"></a>

## DateRangePicker
**Kind**: global class  

* [DateRangePicker](#DateRangePicker)
    * [new DateRangePicker(element, options, cb)](#new_DateRangePicker_new)
    * _instance_
        * [.setStartDate(startDate)](#DateRangePicker+setStartDate)
        * [.setEndDate(endDate)](#DateRangePicker+setEndDate)
        * [.setPeriod(startDate, endDate)](#DateRangePicker+setPeriod)
        * [.updateView()](#DateRangePicker+updateView)
        * [.updateMonthsInView()](#DateRangePicker+updateMonthsInView) ℗
        * [.updateCalendars()](#DateRangePicker+updateCalendars) ℗
        * [.renderCalendar()](#DateRangePicker+renderCalendar) ℗
        * [.renderTimePicker()](#DateRangePicker+renderTimePicker) ℗
        * [.updateFormInputs()](#DateRangePicker+updateFormInputs) ℗
        * [.move()](#DateRangePicker+move) ℗
        * [.show(e)](#DateRangePicker+show) ℗
        * [.hide(e)](#DateRangePicker+hide) ℗
        * [.toggle(e)](#DateRangePicker+toggle) ℗
        * [.outsideClick(e)](#DateRangePicker+outsideClick) ℗
        * [.showCalendars()](#DateRangePicker+showCalendars) ℗
        * [.hideCalendars()](#DateRangePicker+hideCalendars) ℗
        * [.clickRange(e)](#DateRangePicker+clickRange) ℗
        * [.clickPrev(e)](#DateRangePicker+clickPrev) ℗
        * [.clickNext(e)](#DateRangePicker+clickNext) ℗
        * [.hoverDate(e)](#DateRangePicker+hoverDate) ℗
        * [.hoverRange(e)](#DateRangePicker+hoverRange) ℗
        * [.clickDate(e)](#DateRangePicker+clickDate) ℗
        * [.calculateChosenLabel(e)](#DateRangePicker+calculateChosenLabel) ℗
        * [.clickApply(e)](#DateRangePicker+clickApply) ℗
        * [.clickCancel(e)](#DateRangePicker+clickCancel) ℗
        * [.monthOrYearChanged(e)](#DateRangePicker+monthOrYearChanged) ℗
        * [.timeChanged(e)](#DateRangePicker+timeChanged) ℗
        * [.elementChanged()](#DateRangePicker+elementChanged) ℗
        * [.keydown(e)](#DateRangePicker+keydown) ℗
        * [.updateElement()](#DateRangePicker+updateElement) ℗
        * [.remove()](#DateRangePicker+remove) ℗
    * _static_
        * [.daterangepicker(options, callback)](#DateRangePicker.daterangepicker) ⇒

<a name="new_DateRangePicker_new"></a>

### new DateRangePicker(element, options, cb)

| Param | Type | Description |
| --- | --- | --- |
| element | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | jQuery selector of the parent element that the date range picker will be added to |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| cb | <code>function</code> | Callback function executed when |

<a name="DateRangePicker+setStartDate"></a>

### dateRangePicker.setStartDate(startDate)
Sets the date range picker's currently selected start date to the provided date.<br/>`startDate` be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format).Functions `isInvalidDate()` and `isInvalidTime()` are not evaluated, you may set date/time which is not selectable in calendar.<br/>If the `startDate` does not fall into `minDate` and `maxDate` then `startDate` is shifted and a warning is written to console.

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | startDate to be set |

<a name="DateRangePicker+setEndDate"></a>

### dateRangePicker.setEndDate(endDate)
Sets the date range picker's currently selected end date to the provided date.<br/>`endDate` be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format).Functions `isInvalidDate()` and `isInvalidTime()` are not evaluated, you may set date/time which is not selectable in calendar.<br/>If the `endDate` does not fall into `minDate` and `maxDate` then `endDate` or `minSpan` and `maxSpan` is shifted and a warning is written to console.

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Description |
| --- | --- | --- |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | endDate to be set |

<a name="DateRangePicker+setPeriod"></a>

### dateRangePicker.setPeriod(startDate, endDate)
Shortcut for [setStartDate](#setStartDate) and  [setEndDate](#setEndDate)

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- `RangeError` for invalid date values.


| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | startDate to be set |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | endDate to be set |

<a name="DateRangePicker+updateView"></a>

### dateRangePicker.updateView()
Updates the picker when calendar is initiated or any date has been selected. Could be useful after running `setStartDate()` or `setEndDate()`

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
<a name="DateRangePicker+updateMonthsInView"></a>

### dateRangePicker.updateMonthsInView() ℗
Displays the months

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+updateCalendars"></a>

### dateRangePicker.updateCalendars() ℗
Updates the custome ranges

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+renderCalendar"></a>

### dateRangePicker.renderCalendar() ℗
Renders the calendar month

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+renderTimePicker"></a>

### dateRangePicker.renderTimePicker() ℗
Renders the time pickers

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+updateFormInputs"></a>

### dateRangePicker.updateFormInputs() ℗
Update the linke `<input>` element with selected date

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+move"></a>

### dateRangePicker.move() ℗
Positions the calendar

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+show"></a>

### dateRangePicker.show(e) ℗
Shows the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>show</code>](#event_show)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+hide"></a>

### dateRangePicker.hide(e) ℗
Hides the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>beforeHide</code>](#event_beforeHide), [<code>hide</code>](#event_hide)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+toggle"></a>

### dateRangePicker.toggle(e) ℗
Toggles visibility of the picker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+outsideClick"></a>

### dateRangePicker.outsideClick(e) ℗
Closes the picker when user clicks outside

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>outsideClick</code>](#event_outsideClick)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+showCalendars"></a>

### dateRangePicker.showCalendars() ℗
Shows calendar when user selects "Custom Ranges"

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>showCalendar</code>](#event_showCalendar)  
**Access**: private  
<a name="DateRangePicker+hideCalendars"></a>

### dateRangePicker.hideCalendars() ℗
Hides calendar when user selects a predefined range

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:hideCalendar</code>  
**Access**: private  
<a name="DateRangePicker+clickRange"></a>

### dateRangePicker.clickRange(e) ℗
Set date values after user selected a date

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+clickPrev"></a>

### dateRangePicker.clickPrev(e) ℗
Move calendar to previous month

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+clickNext"></a>

### dateRangePicker.clickNext(e) ℗
Move calendar to next month

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+hoverDate"></a>

### dateRangePicker.hoverDate(e) ℗
User hovers over date values

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+hoverRange"></a>

### dateRangePicker.hoverRange(e) ℗
User hovers over ranges

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+clickDate"></a>

### dateRangePicker.clickDate(e) ℗
User clicked a date

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>dateChange</code>](#event_dateChange)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+calculateChosenLabel"></a>

### dateRangePicker.calculateChosenLabel(e) ℗
Hightlight selected predefined range in calendar

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+clickApply"></a>

### dateRangePicker.clickApply(e) ℗
User clicked `Apply` button

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>apply</code>](#event_apply)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+clickCancel"></a>

### dateRangePicker.clickCancel(e) ℗
User clicked `Cancel` button

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>cancel</code>](#event_cancel)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+monthOrYearChanged"></a>

### dateRangePicker.monthOrYearChanged(e) ℗
Calender month moved

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+timeChanged"></a>

### dateRangePicker.timeChanged(e) ℗
User clicked a time

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>timeChange</code>](#event_timeChange)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+elementChanged"></a>

### dateRangePicker.elementChanged() ℗
User inserted value into `<input>`

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+keydown"></a>

### dateRangePicker.keydown(e) ℗
Handles key press

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | The Event target |

<a name="DateRangePicker+updateElement"></a>

### dateRangePicker.updateElement() ℗
Update linked `<input>` element with selected value

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker+remove"></a>

### dateRangePicker.remove() ℗
Remove the picker from document

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: private  
<a name="DateRangePicker.daterangepicker"></a>

### DateRangePicker.daterangepicker(options, callback) ⇒
Initiate a new DateRangePicker

**Kind**: static method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: DateRangePicker  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| callback | [<code>callback</code>](#callback) | Callback function executed when date is changed. As alternative listen to the [apply](#event_apply) event |

<a name="event_show"></a>

## "show" (this)
Emitted when the picker is shown

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_beforeHide"></a>

## "beforeHide" (this) ⇒ <code>boolean</code>
Emitted before the picker will hide. When EventHandler returns `true`, then picker remains visible

**Kind**: event emitted  
**Returns**: <code>boolean</code> - cancel - If `true`, then the picker remains visible  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_hide"></a>

## "hide" (this)
Emitted when the picker is hidden

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_outsideClick"></a>

## "outsideClick" (this)
Emitted when user clicks outside the picker. Picker values is not updated, you may trigger [apply](#event_apply) or [cancel](#event_cancel) in your EventHandler.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_showCalendar"></a>

## "showCalendar" (this)
Emitted when the calendar(s) are shown.Only useful when [custom ranges](#Options.Ranges) are used.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_showCalendar"></a>

## "showCalendar" (this)
Emitted when the calendar(s) are hidden.Only useful when [custom ranges](#Options.Ranges) are used.

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_dateChange"></a>

## "dateChange" (this, side)
Emitted when the date changed. Does not trigger when time is changed, use [timeChange](event_timeChange) to handle it

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether startDate or endDate was changed. `null` when `singleDatePicker: true` |

<a name="event_apply"></a>

## "apply" (this)
Emitted when the `Apply` button is clicked, or when a predefined [range](#Options.Ranges) is clicked

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_cancel"></a>

## "cancel" (this)
Emitted when the `Cancel` button is clicked

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |

<a name="event_timeChange"></a>

## "timeChange" (this, side)
Emitted when the time changed. Does not trigger when date is changed

**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | The daterangepicker object |
| side | <code>string</code> | Either `'start'` or `'end'` indicating whether startDate or endDate was changed |

<a name="Options"></a>

## Options
Options for DateRangePicker

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| parentEl | <code>string</code> | <code>&quot;body&quot;</code> | [jQuery](external:jQuery) selector of the parent element that the date range picker will be added to |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | <code>DateTime.now().startOf(&#x27;day&#x27;)</code> | The beginning date of the initially selected date range.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format).<br/> Functions `isInvalidDate()` and `isInvalidTime()` are not evaluated, you may set date/time which is not selectable in calendar.<br/> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console. |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | <code>DateTime.now().endOf(&#x27;day&#x27;)</code> | The end date of the initially selected date range.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format).<br/> Functions `isInvalidDate()` and `isInvalidTime()` are not evaluated, you may set date/time which is not selectable in calendar.<br/> If the date does not fall into `minDate` and `maxDate` then date is shifted and a warning is written to console.<br/> Option `minSpan` and `maxSpan` are not evaluated.<br/> |
| minDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The earliest date a user may select or `null` for no limit.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format). |
| maxDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> \| <code>null</code> |  | The latest date a user may select or `null` for no limit.<br/> Must be a `luxon.DateTime` or `Date` or `string` according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) or a string matching [locale.format](#Locale.format). |
| minSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The maximum span between the selected start and end dates.<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) duration.<br/> Ignored when `singleDatePicker: true` |
| maxSpan | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> \| <code>number</code> \| <code>null</code> |  | The minimum span between the selected start and end dates.<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) duration.<br/> Ignored when `singleDatePicker: true` |
| autoApply | <code>boolean</code> | <code>false</code> | Hide the `Apply` and `Cancel` buttons, and automatically apply a new date range as soon as two dates are clicked.<br/> Only useful when `timePicker: false` |
| singleDatePicker | <code>boolean</code> | <code>false</code> | Show only a single calendar to choose one date, instead of a range picker with two calendars.<br/> The start and end dates provided to your callback will be the same single date chosen. |
| showDropdowns | <code>boolean</code> | <code>false</code> | Show year and month select boxes above calendars to jump to a specific month and year |
| minYear | <code>number</code> | <code>DateTime.now().minus({year:100}).year</code> | The minimum year shown in the dropdowns when `showDropdowns: true` |
| maxYear | <code>number</code> | <code>DateTime.now().plus({year:100}).year</code> | The maximum  year shown in the dropdowns when `showDropdowns: true` |
| showWeekNumbers | <code>boolean</code> | <code>false</code> | Show **localized** week numbers at the start of each week on the calendars |
| showISOWeekNumbers | <code>boolean</code> | <code>false</code> | Show **ISO** week numbers at the start of each week on the calendars |
| timePicker | <code>boolean</code> | <code>false</code> | Adds select boxes to choose times in addition to dates |
| timePicker24Hour | <code>boolean</code> | <code>false</code> | Use 24-hour instead of 12-hour times, removing the AM/PM selection |
| timePickerStepSize | [<code>Duration</code>](https://moment.github.io/luxon/api-docs/index.html#duration) \| <code>string</code> | <code>Duration.fromObject({minutes:1})</code> | Set the time picker step size.<br/> Must be a `luxon.Duration` or number of seconds or a string according to [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) duration.<br/> Valid values are 1,2,3,4,5,6,10,12,15,20,30 for `Duration.fromObject({seconds: ...})` and `Duration.fromObject({minutes: ...})`  and 1,2,3,4,6,(8,12) for `Duration.fromObject({hours: ...})`.<br/> Duration must be greater than `minSpan` and smaller than `maxSpan`.<br/> For example `timePickerStepSize: 600` will disable time picker seconds and time picker minutes are set to step size of 10 Minutes.<br/> Overwrites #timePickerIncrement and #timePickerSeconds |
| timePickerSeconds | <code>boolean</code> | <code>boolean</code> | **Deprecated**, use `timePickerStepSize`<br/>Show seconds in the timePicker, use `timePickerStepSize` |
| timePickerIncrement | <code>boolean</code> | <code>1</code> | **Deprecated**, use `timePickerStepSize`<br/>Increment of the minutes selection list for times |
| autoUpdateInput | <code>boolean</code> | <code>true</code> | Indicates whether the date range picker should automatically update the value of the `<input>` element it's attached to at initialization and when the selected dates change. |
| linkedCalendars | <code>boolean</code> | <code>true</code> | When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars.<br/> When disabled, the two calendars can be individually advanced and display any month/year |
| isInvalidDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed,<br/>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/> Signature: `isInvalidDate(date)` Function has no effect on date values set by `startDate`, `endDate`, `ranges`, `setStartDate()`, `setEndDate()`. |
| isInvalidTime | <code>function</code> | <code>false</code> | A function that is passed each hour/minute/second/am-pm in the two calendars before they are displayed,<br/>  and may return `true` or `false` to indicate whether that date should be available for selection or not.<br/> Signature: `isInvalidDate(time, side, unit)`<br/> `side` is 'start' or 'end' or `null` for `singleDatePicker = true`<br/> `unit` is `'hour'`, `'minute'`, `'second'` or `'ampm'`<br/> Function has no effect on time values set by `startDate`, `endDate`, `ranges`, `setStartDate()`, `setEndDate()`.<br/> Ensure that your function returns `false` for at least one item. Otherwise the calender is not rendered.<br/> |
| isCustomDate | <code>function</code> | <code>false</code> | A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.<br/> Signature: `isCustomDate(date)` |
| applyButtonClasses | <code>string</code> | <code>&quot;btn-primary&quot;</code> | CSS class names that will be added only to the apply button |
| cancelButtonClasses | <code>string</code> | <code>&quot;btn-default&quot;</code> | CSS class names that will be added only to the cancel button |
| buttonClasses | <code>string</code> | <code>&quot;btn&quot;</code> | btn-sm - CSS class names that will be added to both the apply and cancel buttons. |
| opens | <code>string</code> | <code>&quot;right&quot;</code> | Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.<br/> `'left' \| 'right' \| 'center'` |
| drops | <code>string</code> | <code>&quot;down&quot;</code> | Whether the picker appears below or above the HTML element it's attached to.<br/> `'down' \| 'up' \| 'auto'` |
| ranges | <code>Options.Ranges</code> | <code>{}</code> | Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. |
| showCustomRangeLabel | <code>boolean</code> | <code>true</code> | Displays "Custom Range" at the end of the list of predefined [ranges](Options.Ranges), when the ranges option is used.<br> This option will be highlighted whenever the current date range selection does not match one of the predefined ranges.<br/> Clicking it will display the calendars to select a new range. |
| alwaysShowCalendars | <code>boolean</code> | <code>false</code> | Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range".<br/> When this option is set to true, the calendars for choosing a custom date range are always shown instead. |
| locale | [<code>Locale</code>](#Options.Locale) | <code>{}</code> | Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. |

<a name="Options.Locale"></a>

### Options.Locale
Locale options for DateRangePicker

**Kind**: static typedef of [<code>Options</code>](#Options)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| direction | <code>string</code> | <code>&quot;ltr&quot;</code> | Direction of reading, `'ltr'` or `'rtl'` |
| format | <code>object</code> \| <code>string</code> | <code>DateTime.DATE_SHORT</code> | Date formats. Either given as string,  see [Format Tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) or an object according to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)<br/> I recommend to use the luxon [Presets](https://moment.github.io/luxon/#/formatting?id=presets). |
| separator= | <code>string</code> |  | Defaut: `' - '` - Separator for start and end time |
| weekLabel | <code>string</code> | <code>&quot;W&quot;</code> | Label for week numbers |
| daysOfWeek | <code>Array(string)</code> | <code>Info.weekdays(&#x27;short&#x27;)</code> | Array with weekday names, from Monday to Sunday |
| monthNames | <code>Array(string)</code> | <code>Info.months(&#x27;long&#x27;)</code> | Array with month names |
| Info.getStartOfWeek() | <code>number</code> | <code>1</code> | First day of the week, 1 for Monday through 7 for Sunday |
| applyLabel | <code>string</code> | <code>&quot;Apply&quot;</code> | Label of `Apply` Button |
| cancelLabel | <code>string</code> | <code>&quot;Cancel&quot;</code> | Label of `Cancel` Button |
| customRangeLabel | <code>string</code> | <code>&quot;Custom&quot;</code> | Range - Title for custom ranges |
| durationLabel | <code>object</code> \| <code>string</code> | <code>{}</code> | Format a custom label for selected duration, for example '5 Days, 12 Hours'.<br/> Define the format either as string, see [Duration.toFormat - Format Tokens](https://moment.github.io/luxon/api-docs/index.html#durationtoformat) or  an object according to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options), see [Duration.toHuamn](https://moment.github.io/luxon/api-docs/index.html#durationtohuman). |

<a name="callback"></a>

## callback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected startDate |
| endDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) | Selected endDate |
| range | <code>string</code> |  |

