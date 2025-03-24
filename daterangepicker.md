## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
</dl>

## Events

<dl>
<dt><a href="#event_show.daterangepicker">"show.daterangepicker" (this)</a></dt>
<dd></dd>
<dt><a href="#event_hideCalendar">"hideCalendar" (this)</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a></dt>
<dd><p>Options for DateRangePicker</p>
</dd>
</dl>

<a name="DateRangePicker"></a>

## DateRangePicker
**Kind**: global class  
**Requires**: <code>module:jQuery</code>, <code>module:luxon</code>  

* [DateRangePicker](#DateRangePicker)
    * [new DateRangePicker(element, options, cb)](#new_DateRangePicker_new)
    * _instance_
        * [.setStartDate(startDate)](#DateRangePicker+setStartDate)
        * [.setEndDate(handler, [options])](#DateRangePicker+setEndDate)
        * [.show(e)](#DateRangePicker+show) ℗
        * [.hideCalendars()](#DateRangePicker+hideCalendars)
    * _static_
        * [.daterangepicker(options, callback)](#DateRangePicker.daterangepicker) ⇒

<a name="new_DateRangePicker_new"></a>

### new DateRangePicker(element, options, cb)

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Selector</code> | jQuery selector of the parent element that the date range picker will be added to |
| options | [<code>Options</code>](#Options) | Object to configure the DateRangePicker |
| cb | <code>function</code> | Callback function executed when |

<a name="DateRangePicker+setStartDate"></a>

### dateRangePicker.setStartDate(startDate)
Create a new Twig parser

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  

| Param | Type | Description |
| --- | --- | --- |
| startDate | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | Object or array of element specification and function to handle elements |

<a name="DateRangePicker+setEndDate"></a>

### dateRangePicker.setEndDate(handler, [options])
Create a new Twig parser

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>TwigHandler</code> \| <code>Array.&lt;TwigHandler&gt;</code> | Object or array of element specification and function to handle elements |
| [options] | <code>ParserOptions</code> | Object of optional options |

**Example**  
```js
var picker = $('#daterange').data('daterangepicker'); picker.setEndDate(DateTime.now().startOf('day'));
```
<a name="DateRangePicker+show"></a>

### dateRangePicker.show(e) ℗
Shows the daterangepicker

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: <code>event:&quot;show.daterangepicker&quot;</code>  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> | The event fired from calendar |

<a name="DateRangePicker+hideCalendars"></a>

### dateRangePicker.hideCalendars()
Create a new Twig parser

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Emits**: [<code>hideCalendar</code>](#event_hideCalendar)  
<a name="DateRangePicker.daterangepicker"></a>

### DateRangePicker.daterangepicker(options, callback) ⇒
Initiate a new DateRangePicker

**Kind**: static method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Returns**: DateRangePicker  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#Options) | - |
| callback | <code>function</code> | Callback function executed when |

<a name="event_show.daterangepicker"></a>

## "show.daterangepicker" (this)
**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | Object of optional options |

<a name="event_hideCalendar"></a>

## "hideCalendar" (this)
**Kind**: event emitted  

| Param | Type | Description |
| --- | --- | --- |
| this | [<code>DateRangePicker</code>](#DateRangePicker) | Object of optional options |

<a name="Options"></a>

## Options
Options for DateRangePicker

**Kind**: global typedef  
**Default**: <code>{ method: &#x27;sax&#x27;, xmlns: false, trim: true, resumeAfterError: false, partial: false }</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| method | <code>&#x27;sax&#x27;</code> \| <code>&#x27;expat&#x27;</code> | The underlying parser. Either `'sax'`, `'expat'`. |
| xmlns | [<code>jQuery</code>](https://learn.jquery.com/using-jquery-core/jquery-object/) | jQuery selector of the parent element that the date range picker will be added to |
| [trim] | [<code>DateTime</code>](https://moment.github.io/luxon/api-docs/index.html#datetime) \| [<code>Date</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) \| <code>string</code> | If `true`, then turn any whitespace into a single space. Text and comments are trimmed. |
| [resumeAfterError] | <code>boolean</code> | If `true` then parser continues reading after an error. Otherwise it throws exception. |
| [locale] | [<code>Locale</code>](#Options.Locale) | If `true` then unhandled elements are purged. |
| [file] | <code>string</code> | Optional. The name of file to be parsed. Just used for information and logging purpose. |

**Example**  
```js
{ method: 'expat', xmlns: true }
```
<a name="Options.Locale"></a>

### Options.Locale
Locale options for DateRangePicker

**Kind**: static typedef of [<code>Options</code>](#Options)  
**Default**: <code>{ method: &#x27;sax&#x27;, xmlns: false, trim: true, resumeAfterError: false, partial: false }</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [method] | <code>&#x27;sax&#x27;</code> \| <code>&#x27;expat&#x27;</code> | The underlying parser. Either `'sax'`, `'expat'`. |
| [xmlns] | <code>boolean</code> | If `true`, then namespaces are accessible by `namespace` property. |
| [trim] | <code>boolean</code> | If `true`, then turn any whitespace into a single space. Text and comments are trimmed. |
| [resumeAfterError] | <code>boolean</code> | If `true` then parser continues reading after an error. Otherwise it throws exception. |
| [partial] | <code>boolean</code> | If `true` then unhandled elements are purged. |
| [file] | <code>string</code> | Optional. The name of file to be parsed. Just used for information and logging purpose. |

**Example**  
```js
{ method: 'expat', xmlns: true }
```
