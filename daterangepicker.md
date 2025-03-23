## Classes

<dl>
<dt><a href="#DateRangePicker">DateRangePicker</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#daterangepicker">daterangepicker</a> ⇒</dt>
<dd><p>constructs DateRangePicker</p>
</dd>
</dl>

## Events

<dl>
<dt><a href="#event_show.daterangepicker">"show.daterangepicker" (this)</a></dt>
<dd></dd>
<dt><a href="#event_hideCalendar.daterangepicker">"hideCalendar.daterangepicker" (this)</a></dt>
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

* [DateRangePicker](#DateRangePicker)
    * [.setStartDate(startDate)](#DateRangePicker+setStartDate)
    * [.setEndDate(handler, [options])](#DateRangePicker+setEndDate)
    * [.show(handler, [options])](#DateRangePicker+show) ℗
    * [.hideCalendars(handler, [options])](#DateRangePicker+hideCalendars)

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

<a name="DateRangePicker+show"></a>

### dateRangePicker.show(handler, [options]) ℗
Create a new Twig parser

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- <code>UnsupportedParser</code> - For an unsupported parser. Currently `expat` and `sax` (default) are supported.

**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>TwigHandler</code> \| <code>Array.&lt;TwigHandler&gt;</code> | Object or array of element specification and function to handle elements |
| [options] | <code>ParserOptions</code> | Object of optional options |

<a name="DateRangePicker+hideCalendars"></a>

### dateRangePicker.hideCalendars(handler, [options])
Create a new Twig parser

**Kind**: instance method of [<code>DateRangePicker</code>](#DateRangePicker)  
**Throws**:

- <code>UnsupportedParser</code> - For an unsupported parser. Currently `expat` and `sax` (default) are supported.

**Emits**: <code>DateRangePicker#h&quot;ideCalendar\.event:daterangepicker</code>  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>TwigHandler</code> \| <code>Array.&lt;TwigHandler&gt;</code> | Object or array of element specification and function to handle elements |
| [options] | <code>ParserOptions</code> | Object of optional options |

<a name="daterangepicker"></a>

## daterangepicker ⇒
constructs DateRangePicker

**Kind**: global variable  
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

<a name="event_hideCalendar.daterangepicker"></a>

## "hideCalendar.daterangepicker" (this)
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
