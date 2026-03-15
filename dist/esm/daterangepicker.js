import { DateTime, Duration, Info, Settings } from "luxon";
import { $ } from "jquery";
class DateRangePicker {
  #startDate = null;
  #endDate = null;
  constructor(element, options, cb) {
    this.parentEl = "body";
    this.element = $(element);
    this.#startDate = DateTime.now().startOf("day");
    this.#endDate = DateTime.now().plus({ day: 1 }).startOf("day");
    this.minDate = null;
    this.maxDate = null;
    this.maxSpan = null;
    this.minSpan = null;
    this.defaultSpan = null;
    this.initalMonth = DateTime.now().startOf("month");
    this.autoApply = false;
    this.singleDatePicker = false;
    this.singleMonthView = false;
    this.showDropdowns = false;
    this.minYear = DateTime.now().minus({ year: 100 }).year;
    this.maxYear = DateTime.now().plus({ year: 100 }).year;
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.showLabel = !$(this.element).is("input:text");
    this.timePicker = false;
    const usesMeridiems = new Intl.DateTimeFormat(DateTime.now().locale, { hour: "numeric" }).resolvedOptions();
    this.timePicker24Hour = !usesMeridiems.hour12;
    this.timePickerStepSize = Duration.fromObject({ minutes: 1 });
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = false;
    this.isInvalidDate = null;
    this.isInvalidTime = null;
    this.isCustomDate = null;
    this.onOutsideClick = "apply";
    this.opens = this.element.hasClass("pull-right") ? "left" : "right";
    this.drops = this.element.hasClass("dropup") ? "up" : "down";
    this.buttonClasses = "btn btn-sm";
    this.applyButtonClasses = "btn-primary";
    this.cancelButtonClasses = "btn-default";
    this.weekendClasses = "weekend";
    this.weekendDayClasses = "weekend-day";
    this.todayClasses = "today";
    this.altInput = null;
    this.altFormat = null;
    this.externalStyle = null;
    this.ranges = {};
    this.locale = {
      direction: "ltr",
      format: DateTime.DATE_SHORT,
      // or DateTime.DATETIME_SHORT when timePicker: true
      separator: " - ",
      applyLabel: "Apply",
      cancelLabel: "Cancel",
      weekLabel: "W",
      customRangeLabel: "Custom Range",
      daysOfWeek: Info.weekdays("short"),
      monthNames: Info.months("long"),
      firstDay: Info.getStartOfWeek(),
      durationFormat: null
    };
    this.callback = function() {
    };
    this.isShowing = false;
    this.leftCalendar = {};
    this.rightCalendar = {};
    if (typeof options !== "object" || options === null)
      options = {};
    options = $.extend(this.element.data(), options);
    if (typeof options.singleDatePicker === "boolean")
      this.singleDatePicker = options.singleDatePicker;
    if (!this.singleDatePicker && typeof options.singleMonthView === "boolean") {
      this.singleMonthView = options.singleMonthView;
    } else {
      this.singleMonthView = false;
    }
    if (typeof options.externalStyle === "string" && ["bulma"].includes(options.externalStyle))
      this.externalStyle = options.externalStyle;
    if (typeof options.template !== "string" && !(options.template instanceof $)) {
      let template = [
        '<div class="daterangepicker">',
        '<div class="ranges"></div>',
        '<div class="drp-calendar left">',
        '<table class="calendar-table">',
        "<thead></thead>",
        "<tbody></tbody>",
        "<tfoot>",
        '<tr class="calendar-time start-time"></tr>'
      ];
      if (this.singleMonthView)
        template.push('<tr class="calendar-time end-time"></tr>');
      template.push(...[
        "</tfoot>",
        "</table>",
        "</div>"
      ]);
      template.push(...[
        '<div class="drp-calendar right">',
        '<table class="calendar-table">',
        "<thead></thead>",
        "<tbody></tbody>",
        "<tfoot>",
        '<tr class="calendar-time end-time"></tr>',
        "</tfoot>",
        "</table>",
        "</div>"
      ]);
      template.push(...[
        '<div class="drp-buttons">',
        '<div class="drp-duration-label"></div>',
        '<div class="drp-selected"></div>'
      ]);
      if (this.externalStyle === "bulma") {
        template.push(...[
          '<div class="buttons">',
          '<button class="cancelBtn button is-small" type="button"></button>',
          '<button class="applyBtn button is-small" disabled type="button"></button>',
          "</div>"
        ]);
      } else {
        template.push(...[
          "<div>",
          '<button class="cancelBtn" type="button"></button>',
          '<button class="applyBtn" disabled type="button"></button>',
          "</div>"
        ]);
      }
      template.push("</div></div>");
      options.template = template.join("");
    }
    this.parentEl = options.parentEl && $(options.parentEl).length ? $(options.parentEl) : $(this.parentEl);
    this.container = $(options.template).appendTo(this.parentEl);
    if (typeof options.timePicker === "boolean")
      this.timePicker = options.timePicker;
    if (this.timePicker)
      this.locale.format = DateTime.DATETIME_SHORT;
    if (typeof options.locale === "object") {
      for (let key2 of ["separator", "applyLabel", "cancelLabel", "weekLabel"]) {
        if (typeof options.locale[key2] === "string")
          this.locale[key2] = options.locale[key2];
      }
      if (typeof options.locale.direction === "string") {
        if (["rtl", "ltr"].includes(options.locale.direction))
          this.locale.direction = options.locale.direction;
        else
          console.error(`Option 'options.locale.direction' must be 'rtl' or 'ltr'`);
      }
      if (["string", "object"].includes(typeof options.locale.format))
        this.locale.format = options.locale.format;
      if (Array.isArray(options.locale.daysOfWeek)) {
        if (options.locale.daysOfWeek.some((x) => typeof x !== "string"))
          console.error(`Option 'options.locale.daysOfWeek' must be an array of strings`);
        else
          this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
      }
      if (Array.isArray(options.locale.monthNames)) {
        if (options.locale.monthNames.some((x) => typeof x !== "string"))
          console.error(`Option 'locale.monthNames' must be an array of strings`);
        else
          this.locale.monthNames = options.locale.monthNames.slice();
      }
      if (typeof options.locale.firstDay === "number")
        this.locale.firstDay = options.locale.firstDay;
      if (typeof options.locale.customRangeLabel === "string") {
        var elem = document.createElement("textarea");
        elem.innerHTML = options.locale.customRangeLabel;
        var rangeHtml = elem.value;
        this.locale.customRangeLabel = rangeHtml;
      }
      if (["string", "object", "function"].includes(typeof options.locale.durationFormat) && options.locale.durationFormat != null)
        this.locale.durationFormat = options.locale.durationFormat;
    }
    this.container.addClass(this.locale.direction);
    for (let key2 of [
      "timePicker24Hour",
      "showWeekNumbers",
      "showISOWeekNumbers",
      "showDropdowns",
      "linkedCalendars",
      "showCustomRangeLabel",
      "alwaysShowCalendars",
      "autoApply",
      "autoUpdateInput",
      "showLabel"
    ]) {
      if (typeof options[key2] === "boolean")
        this[key2] = options[key2];
    }
    for (let key2 of ["applyButtonClasses", "cancelButtonClasses", "weekendClasses", "weekendDayClasses", "todayClasses"]) {
      if (typeof options[key2] === "string") {
        this[key2] = options[key2];
      } else if (["weekendClasses", "weekendDayClasses", "todayClasses"].includes(key2) && options[key2] === null) {
        this[key2] = options[key2];
      }
    }
    for (let key2 of ["minYear", "maxYear"]) {
      if (typeof options[key2] === "number")
        this[key2] = options[key2];
    }
    for (let key2 of ["isInvalidDate", "isInvalidTime", "isCustomDate"]) {
      if (typeof options[key2] === "function")
        this[key2] = options[key2];
      else
        this[key2] = function() {
          return false;
        };
    }
    if (!this.singleDatePicker) {
      for (let opt of ["minSpan", "maxSpan", "defaultSpan"]) {
        if (["string", "number", "object"].includes(typeof options[opt])) {
          if (Duration.isDuration(options[opt]) && options[opt].isValid) {
            this[opt] = options[opt];
          } else if (Duration.fromISO(options[opt]).isValid) {
            this[opt] = Duration.fromISO(options[opt]);
          } else if (typeof options[opt] === "number" && Duration.fromObject({ seconds: options[opt] }).isValid) {
            this[opt] = Duration.fromObject({ seconds: options[opt] });
          } else if (options[opt] === null) {
            this[opt] = null;
          } else {
            console.error(`Option '${key}' is not valid`);
          }
          ;
        }
      }
      if (this.minSpan && this.maxSpan && this.minSpan > this.maxSpan) {
        this.minSpan = null;
        this.maxSpan = null;
        console.warn(`Ignore option 'minSpan' and 'maxSpan', because 'minSpan' must be smaller than 'maxSpan'`);
      }
      if (this.defaultSpan && this.minSpan && this.minSpan > this.defaultSpan) {
        this.defaultSpan = null;
        console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be greater than 'minSpan'`);
      } else if (this.defaultSpan && this.maxSpan && this.maxSpan < this.defaultSpan) {
        this.defaultSpan = null;
        console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be smaller than 'maxSpan'`);
      }
    }
    if (this.timePicker) {
      if (typeof options.timePickerSeconds === "boolean")
        this.timePickerStepSize = Duration.fromObject({ [options.timePickerSeconds ? "seconds" : "minutes"]: 1 });
      if (typeof options.timePickerIncrement === "number")
        this.timePickerStepSize = Duration.fromObject({ minutes: options.timePickerIncrement });
      if (["string", "object", "number"].includes(typeof options.timePickerStepSize)) {
        let duration;
        if (Duration.isDuration(options.timePickerStepSize) && options.timePickerStepSize.isValid) {
          duration = options.timePickerStepSize;
        } else if (Duration.fromISO(options.timePickerStepSize).isValid) {
          duration = Duration.fromISO(options.timePickerStepSize);
        } else if (typeof options.timePickerStepSize === "number" && Duration.fromObject({ seconds: options.timePickerStepSize }).isValid) {
          duration = Duration.fromObject({ seconds: options.timePickerStepSize });
        } else {
          console.error(`Option 'timePickerStepSize' is not valid`);
          duration = this.timePickerStepSize;
        }
        ;
        var valid = [];
        for (let unit of ["minutes", "seconds"])
          valid.push(...[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].map((x) => {
            return Duration.fromObject({ [unit]: x });
          }));
        valid.push(...[1, 2, 3, 4, 6].map((x) => {
          return Duration.fromObject({ hours: x });
        }));
        if (this.timePicker24Hour)
          valid.push(...[8, 12].map((x) => {
            return Duration.fromObject({ hours: x });
          }));
        if (valid.some((x) => duration.rescale().equals(x))) {
          this.timePickerStepSize = duration.rescale();
        } else {
          console.error(`Option 'timePickerStepSize' ${JSON.stringify(duration.toObject())} is not valid`);
        }
      }
      if (this.maxSpan && this.timePickerStepSize > this.maxSpan)
        console.error(`Option 'timePickerStepSize' ${JSON.stringify(this.timePickerStepSize.toObject())} must be smaller than 'maxSpan'`);
      this.timePickerOpts = {
        showMinutes: this.timePickerStepSize < Duration.fromObject({ hours: 1 }),
        showSeconds: this.timePickerStepSize < Duration.fromObject({ minutes: 1 }),
        hourStep: this.timePickerStepSize >= Duration.fromObject({ hours: 1 }) ? this.timePickerStepSize.hours : 1,
        minuteStep: this.timePickerStepSize >= Duration.fromObject({ minutes: 1 }) ? this.timePickerStepSize.minutes : 1,
        secondStep: this.timePickerStepSize.seconds
      };
    }
    for (let opt of ["startDate", "endDate", "minDate", "maxDate", "initalMonth"]) {
      if (opt === "endDate" && this.singleDatePicker)
        continue;
      if (typeof options[opt] === "object") {
        if (DateTime.isDateTime(options[opt]) && options[opt].isValid) {
          this[opt] = options[opt];
        } else if (options[opt] instanceof Date) {
          this[opt] = DateTime.fromJSDate(options[opt]);
        } else if (options[opt] === null) {
          this[opt] = null;
        } else {
          console.error(`Option '${opt}' must be a luxon.DateTime or Date or string`);
        }
      } else if (typeof options[opt] === "string") {
        const format = typeof this.locale.format === "string" ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
        if (DateTime.fromISO(options[opt]).isValid) {
          this[opt] = DateTime.fromISO(options[opt]);
        } else if (DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale }).isValid) {
          this[opt] = DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale });
        } else {
          const invalid = DateTime.fromFormat(options[opt], format, { locale: DateTime.now().locale }).invalidExplanation;
          console.error(`Option '${opt}' is not a valid string: ${invalid}`);
        }
      }
    }
    if ($(this.element).is("input:text")) {
      const val = $(this.element).val();
      if (val != "") {
        const format = typeof this.locale.format === "string" ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
        if (this.singleDatePicker && typeof options.startDate === "undefined") {
          const start = DateTime.fromFormat(val, format, { locale: DateTime.now().locale });
          if (start.isValid) {
            this.#startDate = start;
          } else {
            console.error(`Value "${val}" in <input> is not a valid string: ${start.invalidExplanation}`);
          }
        } else if (!this.singleDatePicker && typeof options.startDate === "undefined" && typeof options.endDate === "undefined") {
          const split = val.split(this.locale.separator);
          if (split.length === 2) {
            const start = DateTime.fromFormat(split[0], format, { locale: DateTime.now().locale });
            const end = DateTime.fromFormat(split[1], format, { locale: DateTime.now().locale });
            if (start.isValid && end.isValid) {
              this.#startDate = start;
              this.#endDate = end;
            } else {
              console.error(`Value in <input> is not a valid string: ${start.invalidExplanation} - ${end.invalidExplanation}`);
            }
          } else {
            console.error(`Value "${val}" in <input> is not a valid string`);
          }
        }
      }
    }
    if (!this.timePicker) {
      if (this.minDate)
        this.minDate = this.minDate.startOf("day");
      if (this.maxDate)
        this.maxDate = this.maxDate.endOf("day");
    }
    if (this.singleDatePicker) {
      this.#endDate = this.#startDate;
    } else if (this.#endDate < this.#startDate) {
      console.error(`Option 'endDate' ${this.#endDate} must not be earlier than 'startDate' ${this.#startDate}`);
    }
    if (["function", "string"].includes(typeof options.altFormat))
      this.altFormat = options.altFormat;
    if (typeof options.altInput === "string" || Array.isArray(options.altInput)) {
      if (this.singleDatePicker && typeof options.altInput === "string") {
        this.altInput = $(options.altInput).is("input:text") ? options.altInput : null;
      } else if (!this.singleDatePicker && Array.isArray(options.altInput) && options.altInput.length === 2) {
        this.altInput = options.altInput.every((x) => typeof x === "string" && $(x).is("input:text")) ? options.altInput : null;
      } else {
        const note = `Value of "altInput" must be ` + (this.singleDatePicker ? "a string" : "an array of two string elements");
        console.error(`Option 'altInput' ${JSON.stringify(options.altInput)} is not valid
`, note);
      }
    }
    if (options.warnings !== void 0)
      console.warn(`Option 'warnings' not used anymore. Listen to event 'violated.daterangepicker'`);
    if (!this.#startDate && this.initalMonth) {
      this.#endDate = null;
      if (this.timePicker)
        console.error(`Option 'initalMonth' works only with 'timePicker: false'`);
    } else {
      const violations = this.validateInput(null, false);
      if (violations != null) {
        let vio = violations.startDate.violations;
        if (vio.length > 0) {
          if (vio.some((x) => x.reason.startsWith("isInvalid"))) {
            console.error(`Value of startDate "${this.#startDate}" violates ${vio.find((x) => x.reason.startsWith("isInvalid")).reason}`);
          } else {
            const newDate = vio.filter((x) => x.new != null).at(-1).new;
            this.#startDate = newDate;
          }
        }
        if (!this.singleDatePicker) {
          vio = violations.endDate.violations.filter((x) => x.new != null);
          if (vio.length > 0) {
            if (vio.some((x) => x.reason.startsWith("isInvalid"))) {
              console.error(`Value of endDate "${this.#endDate}" violates ${vio.find((x) => x.reason.startsWith("isInvalid")).reason}`);
            } else {
              const newDate = vio.filter((x) => x.new != null).at(-1).new;
              this.#endDate = newDate;
            }
          }
        }
      }
    }
    if (typeof options.opens === "string") {
      if (["left", "right", "center"].includes(options.opens))
        this.opens = options.opens;
      else
        console.error(`Option 'options.opens' must be 'left', 'right' or 'center'`);
    }
    if (typeof options.drops === "string") {
      if (["drop", "down", "auto"].includes(options.drops))
        this.drops = options.drops;
      else
        console.error(`Option 'options.drops' must be 'drop', 'down' or 'auto'`);
    }
    if (Array.isArray(options.buttonClasses)) {
      this.buttonClasses = options.buttonClasses.join(" ");
    } else if (typeof options.buttonClasses === "string") {
      this.buttonClasses = options.buttonClasses;
    }
    if (typeof options.onOutsideClick === "string") {
      if (["cancel", "apply"].includes(options.onOutsideClick))
        this.onOutsideClick = options.onOutsideClick;
      else
        console.error(`Option 'options.onOutsideClick' must be 'cancel' or 'apply'`);
    }
    if (this.locale.firstDay != 1) {
      let iterator = this.locale.firstDay;
      while (iterator > 1) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
        iterator--;
      }
    }
    if (!this.singleDatePicker && typeof options.ranges === "object") {
      for (let range in options.ranges) {
        let start, end;
        if (["string", "object"].includes(typeof options.ranges[range][0])) {
          if (DateTime.isDateTime(options.ranges[range][0]) && options.ranges[range][0].isValid) {
            start = options.ranges[range][0];
          } else if (options.ranges[range][0] instanceof Date) {
            start = DateTime.fromJSDate(options.ranges[range][0]);
          } else if (typeof options.ranges[range][0] === "string" && DateTime.fromISO(options.ranges[range][0]).isValid) {
            start = DateTime.fromISO(options.ranges[range][0]);
          } else {
            console.error(`Option ranges['${range}'] is not am array of valid ISO-8601 string or luxon.DateTime or Date`);
          }
        }
        if (["string", "object"].includes(typeof options.ranges[range][1])) {
          if (DateTime.isDateTime(options.ranges[range][1]) && options.ranges[range][1].isValid) {
            end = options.ranges[range][1];
          } else if (options.ranges[range][1] instanceof Date) {
            end = DateTime.fromJSDate(options.ranges[range][1]);
          } else if (typeof options.ranges[range][1] === "string" && DateTime.fromISO(options.ranges[range][1]).isValid) {
            end = DateTime.fromISO(options.ranges[range][1]);
          } else {
            console.error(`Option ranges['${range}'] is not a valid ISO-8601 string or luxon.DateTime or Date`);
          }
        }
        if (start == null || end == null)
          continue;
        options.ranges[range] = [start, end];
        var elem = document.createElement("textarea");
        elem.innerHTML = range;
        this.ranges[elem.value] = [start, end];
      }
      var list = "<ul>";
      for (let range in this.ranges) {
        list += '<li data-range-key="' + range + '">' + range + "</li>";
      }
      if (this.showCustomRangeLabel) {
        list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + "</li>";
      }
      list += "</ul>";
      this.container.find(".ranges").prepend(list);
      this.container.addClass("show-ranges");
    }
    if (typeof cb === "function")
      this.callback = cb;
    if (!this.timePicker) {
      if (this.#startDate)
        this.#startDate = this.#startDate.startOf("day");
      if (this.#endDate)
        this.#endDate = this.#endDate.endOf("day");
      this.container.find(".calendar-time").hide();
    }
    if (this.timePicker && this.autoApply)
      this.autoApply = false;
    if (this.autoApply)
      this.container.addClass("auto-apply");
    if (this.singleDatePicker || this.singleMonthView) {
      this.container.addClass("single");
      this.container.find(".drp-calendar.left").addClass("single");
      this.container.find(".drp-calendar.left").show();
      this.container.find(".drp-calendar.right").hide();
      if (!this.timePicker && this.autoApply)
        this.container.addClass("auto-apply");
    }
    if (typeof options.ranges === "undefined" && !this.singleDatePicker || this.alwaysShowCalendars)
      this.container.addClass("show-calendar");
    this.container.addClass("opens" + this.opens);
    this.container.find(".applyBtn, .cancelBtn").addClass(this.buttonClasses);
    if (this.applyButtonClasses.length)
      this.container.find(".applyBtn").addClass(this.applyButtonClasses);
    if (this.cancelButtonClasses.length)
      this.container.find(".cancelBtn").addClass(this.cancelButtonClasses);
    this.container.find(".applyBtn").html(this.locale.applyLabel);
    this.container.find(".cancelBtn").html(this.locale.cancelLabel);
    this.container.find(".drp-calendar").on("click.daterangepicker", ".prev", this.clickPrev.bind(this)).on("click.daterangepicker", ".next", this.clickNext.bind(this)).on("mousedown.daterangepicker", "td.available", this.clickDate.bind(this)).on("mouseenter.daterangepicker", "td.available", this.hoverDate.bind(this)).on("change.daterangepicker", "select.yearselect", this.monthOrYearChanged.bind(this)).on("change.daterangepicker", "select.monthselect", this.monthOrYearChanged.bind(this)).on("change.daterangepicker", "select.hourselect,select.minuteselect,select.secondselect,select.ampmselect", this.timeChanged.bind(this));
    this.container.find(".ranges").on("click.daterangepicker", "li", this.clickRange.bind(this)).on("mouseenter.daterangepicker", "li", this.hoverRange.bind(this)).on("mouseleave.daterangepicker", "li", this.leaveRange.bind(this));
    this.container.find(".drp-buttons").on("click.daterangepicker", "button.applyBtn", this.clickApply.bind(this)).on("click.daterangepicker", "button.cancelBtn", this.clickCancel.bind(this));
    if (this.element.is("input") || this.element.is("button")) {
      this.element.on({
        "click.daterangepicker": this.show.bind(this),
        "focus.daterangepicker": this.show.bind(this),
        "keyup.daterangepicker": this.elementChanged.bind(this),
        "keydown.daterangepicker": this.keydown.bind(this)
        //IE 11 compatibility
      });
    } else {
      this.element.on("click.daterangepicker", this.toggle.bind(this));
      this.element.on("keydown.daterangepicker", this.toggle.bind(this));
    }
    this.updateElement();
  }
  /**
   * startDate
   * @type {external:DateTime}
   */
  get startDate() {
    return this.timePicker ? this.#startDate : this.#startDate.startOf("day");
  }
  /**
   * endDate
   * @type {external:DateTime}
   */
  get endDate() {
    return this.singleDatePicker ? null : this.timePicker ? this.#endDate : this.#endDate.endOf("day");
  }
  set startDate(val) {
    this.#startDate = val;
  }
  set endDate(val) {
    this.#endDate = val;
  }
  /**
  * Sets the date range picker's currently selected start date to the provided date.<br>
  * `startDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
  * Invalid date values are handled by {@link #DateRangePicker+violated|violated} Event
  * @param {external:DateTime|external:Date|string} startDate - startDate to be set. In case of ranges, the current `endDate` is used.
  * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
  * @returns {InputViolation} - Object of violations or `null` if no violation have been found
  * @example 
  * const drp = $('#picker').data('daterangepicker');
  * drp.setStartDate(DateTime.now().startOf('hour'));
  */
  setStartDate(startDate, updateView = true) {
    if (!this.singleDatePicker)
      return setRange(startDate, this.#endDate, updateView);
    const oldDate = this.#startDate;
    let newDate = this.parseDate(startDate);
    if (newDate.equals(oldDate))
      return null;
    const violations = this.validateInput([newDate, null], true);
    if (violations != null) {
      if (violations.newDate != null) {
        newDate = violations.newDate.startDate;
      } else {
        return violations;
      }
    }
    this.#startDate = newDate;
    this.#endDate = this.#startDate;
    if (!this.timePicker) {
      this.#startDate = this.#startDate.startOf("day");
      this.#endDate = this.#endDate.endOf("day");
    }
    this.updateElement();
    if (updateView)
      this.updateView();
    return violations;
  }
  /**
  * Sets the date range picker's currently selected start date to the provided date.<br>
  * `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
  * Invalid date values are handled by {@link #DateRangePicker+violated|violated} Event
  * @param {external:DateTime|external:Date|string} endDate - endDate to be set. In case of ranges, the current `startDate` is used.
  * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
  * @returns {InputViolation} - Object of violations or `null` if no violation have been found
  * @example 
  * const drp = $('#picker').data('daterangepicker');
  * drp.setEndDate(DateTime.now().startOf('hour'));
  */
  setEndDate(endDate, updateView = true) {
    return this.singleDatePicker ? null : setRange(this.#startDate, endDate, updateView);
  }
  /**
  * Sets the date range picker's currently selected start date to the provided date.<br>
  * `startDate` and `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
  * Invalid date values are handled by {@link #DateRangePicker+violated|violated} Event
  * @param {external:DateTime|external:Date|string} startDate - startDate to be set
  * @param {external:DateTime|external:Date|string} endDate - endDate to be set
  * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
  * @returns {InputViolation} - Object of violations or `null` if no violation have been found
  * @example 
  * const drp = $('#picker').data('daterangepicker');
  * drp.setRange(DateTime.now().startOf('hour'), DateTime.now().endOf('day'));
  */
  setRange(startDate, endDate, updateView = true) {
    if (this.singleDatePicker)
      return;
    if (!this.#endDate)
      this.#endDate = this.#startDate;
    const oldDate = [this.#startDate, this.#endDate];
    let newDate = [this.parseDate(startDate), this.parseDate(endDate)];
    if (oldDate[0].equals(newDate[0]) && oldDate[1].equals(newDate[1]) || newDate[0] > newDate[1])
      return;
    const violations = this.validateInput([newDate[0], newDate[1]], true);
    if (violations != null) {
      if (violations.newDate != null) {
        newDate[0] = violations.newDate.startDate;
        newDate[1] = violations.newDate.endDate;
      } else {
        return violations;
      }
    }
    this.#startDate = newDate[0];
    this.#endDate = newDate[1];
    if (!this.timePicker) {
      this.#startDate = this.#startDate.startOf("day");
      this.#endDate = this.#endDate.endOf("day");
    }
    this.updateElement();
    if (updateView)
      this.updateView();
    return violations;
  }
  /**
   * Parse date value
   * @param {sting|external:DateTime|Date} value - The value to be parsed
   * @returns {external:DateTime} - DateTime object
   */
  parseDate(value) {
    if (typeof value === "object") {
      if (DateTime.isDateTime(value) && value.isValid) {
        return value;
      } else if (value instanceof Date) {
        return DateTime.fromJSDate(value);
      } else {
        throw RangeError(`Value must be a luxon.DateTime or Date or string`);
      }
    } else if (typeof value === "string") {
      const format = typeof this.locale.format === "string" ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
      if (DateTime.fromISO(value).isValid) {
        return DateTime.fromISO(value);
      } else if (DateTime.fromFormat(value, format, { locale: DateTime.now().locale }).isValid) {
        return DateTime.fromFormat(value, format, { locale: DateTime.now().locale });
      } else {
        const invalid = DateTime.fromFormat(value, format, { locale: DateTime.now().locale }).invalidExplanation;
        throw RangeError(`Value is not a valid string: ${invalid}`);
      }
    }
  }
  logDate(date) {
    return this.timePicker ? date.toISO({ suppressMilliseconds: true }) : date.toISODate();
  }
  /**
   * Format a DateTime object
   * @param {external:DateTime} date - The DateTime to format
   * @param {object|string} format=this.locale.format - The format option
   * @returns {string} - Formatted date string
   */
  formatDate(date, format = this.locale.format) {
    if (typeof format === "object") {
      return date.toLocaleString(format);
    } else {
      if (Settings.defaultLocale === null) {
        const locale = DateTime.now().locale;
        return date.toFormat(format, { locale });
      } else {
        return date.toFormat(format);
      }
    }
  }
  /**
   * Set Duration Label to selected range (if used) and selected dates
   * @private 
   */
  updateLabel() {
    if (this.showLabel) {
      let text = this.formatDate(this.#startDate);
      if (!this.singleDatePicker) {
        text += this.locale.separator;
        if (this.#endDate)
          text += this.formatDate(this.#endDate);
      }
      this.container.find(".drp-selected").html(text);
    }
    if (this.singleDatePicker || this.locale.durationFormat == null)
      return;
    if (!this.#endDate) {
      this.container.find(".drp-duration-label").html("");
      return;
    }
    if (typeof this.locale.durationFormat === "function") {
      this.container.find(".drp-duration-label").html(this.locale.durationFormat(this.#startDate, this.#endDate));
    } else {
      let duration = this.#endDate.plus({ milliseconds: 1 }).diff(this.#startDate).rescale().set({ milliseconds: 0 });
      if (!this.timePicker)
        duration = duration.set({ seconds: 0, minutes: 0, hours: 0 });
      duration = duration.removeZeros();
      if (typeof this.locale.durationFormat === "object") {
        this.container.find(".drp-duration-label").html(duration.toHuman(this.locale.durationFormat));
      } else {
        this.container.find(".drp-duration-label").html(duration.toFormat(this.locale.durationFormat));
      }
    }
  }
  /**
  * Emitted when the date is changed through `<input>` element or via {@link #DateRangePicker+setStartDate|setStartDate} or 
  * {@link #DateRangePicker+setRange|setRange} and date is not valid due to 
  * `minDate`, `maxDate`, `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` constraints.<br>
  * Event is only triggered when date string is valid and date value is changing<br>
  * @event
  * @name "violated.daterangepicker"
  * @param {Object} this - The event object
  * @param {DateRangePicker} picker - The daterangepicker object
  * @param {InputViolation} result - The violation object, see example of `validateInput()`
  * @param {Object} newDate - Object of {startDate, endDate}
  * @return {boolean}=undefined - If handler returns `true`, then values from `newDate` object are used
  * @example
  * 
  * $('#picker').daterangepicker({
  *   startDate: DateTime.now(),
  *   // allow only dates from current year
  *   minDate: DateTime.now().startOf('year'),
  *   manDate: DateTime.now().endOf('year'),
  *   singleDatePicker: true,
  *   locale: {
  *      format: DateTime.DATETIME_SHORT
  *   }
  * }).on('violated.daterangepicker', (ev, picker, result, newDate) => {
  *   newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
  *   return true;
  * });
  *
  * // Try to set date outside permitted range at <input> elemet
  * $('#picker').val(DateTime.now().minus({ years: 10 })).toLocaleString(DateTime.DATETIME_SHORT).trigger('keyup');
  
  * // Try to set date outside permitted range by code
  * const drp = $('#picker').data('daterangepicker').setStartDate(DateTime.now().minus({ years: 10 })
  * 
  * // -> Calendar selects and shows "today - 3 days"
  */
  /**
  * @typedef InputViolation
  * @type {Object}
  * @property {external:DateTime} startDate - Violation of startDate
  * @property {external:DateTime|undefined} endDate? - Violation of endDate, if existing
  * @property {Array} violations - The constraints which violates the input
  * @property {Array} reason - The type/reson of violation
  * @property {external:DateTime} old - Old value startDate/endDate
  * @property {external:DateTime} new? - Corrected value of startDate/endDate if existing
  */
  /**
  * Validate `startDate` and `endDate` against `timePickerStepSize`, `minDate`, `maxDate`, 
  * `minSpan`, `maxSpan`, `invalidDate` and `invalidTime`.
  * @param {Array} range - `[startDate, endDate]`<br>Range to be checked, defaults to current `startDate` and `endDate`
  * @param {boolean} dipatch=false - If `true` then event "violated.daterangepicker" is dispated.<br>
  * If eventHandler returns `true`, then `null` is returned, otherwiese the object of violations.
  * @emits "violated.daterangepicker"
  * @returns {InputViolation|null} - Object of violations and corrected values or `null` if no violation have been found
  * @example 
  * options => {
  *   minDate: DateTime.now().minus({months: 3}).startOf('day'),
  *   maxDate: DateTime.now().minus({day: 3}).startOf('day'),
  *   minSpan: Duration.fromObject({days: 7}),
  *   maxSpan: Duration.fromObject({days: 70}),
  *   timePickerStepSize: Duration.fromObject({hours: 1})
  * }
  * const result = validateInput(DateTime.now(), DateTime.now().plus({day: 3}));
  * 
  * result => {
  *   startDate: {
  *     violations: [
  *       { old: "2026-03-13T10:35:52", reason: "timePickerStepSize", new: "2026-03-13T11:00:00" },
  *       { old: "2026-03-13T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" }
  *     ]
  * },
  *   endDate: {
  *     violations: [
  *       { old: "2026-03-16T10:35:52", reason: "stepSize", new: "2026-03-16T11:00:00" },
  *       { old: "2026-03-16T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" },
  *       { old: "2026-03-10T00:00:00", reason: "minSpan", new: "2026-03-17T00:00:00" }
  *     ]
  *   }
  * }
  */
  validateInput(range, dipatch = false) {
    let startDate = range == null ? this.#startDate : range[0];
    let endDate = range == null ? this.#endDate : range[1];
    if (startDate == null)
      return null;
    let result = { startDate: { violations: [] } };
    let violation = { old: startDate, reason: this.timePicker ? "timePickerStepSize" : "timePicker" };
    if (this.timePicker) {
      const secs = this.timePickerStepSize.as("seconds");
      startDate = DateTime.fromSeconds(secs * Math.round(startDate.toSeconds() / secs));
      violation.new = startDate;
      if (!violation.new.equals(violation.old))
        result.startDate.violations.push(violation);
    } else {
      startDate = startDate.startOf("day");
    }
    const shiftStep = this.timePicker ? this.timePickerStepSize.as("seconds") : Duration.fromObject({ days: 1 }).as("seconds");
    if (this.minDate && startDate < this.minDate) {
      violation = { old: startDate, reason: "minDate" };
      startDate = startDate.plus({ seconds: Math.trunc(this.minDate.diff(startDate).as("seconds") / shiftStep) * shiftStep });
      if (startDate < this.minDate)
        startDate = startDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
      violation.new = startDate;
      if (!violation.new.equals(violation.old))
        result.startDate.violations.push(violation);
    } else if (this.maxDate && startDate > this.maxDate) {
      violation = { old: startDate, reason: "maxDate" };
      startDate = startDate.minus({ seconds: Math.trunc(startDate.diff(this.maxDate).as("seconds") / shiftStep) * shiftStep });
      if (startDate > this.maxDate)
        startDate = startDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
      violation.new = startDate;
      if (!violation.new.equals(violation.old))
        result.startDate.violations.push(violation);
    }
    let units = ["hour"];
    if (this.timePicker) {
      if (this.timePickerOpts.showMinutes)
        units.push("minute");
      if (this.timePickerOpts.showSeconds)
        units.push("second");
      if (!this.timePicker24Hour)
        units.push("ampm");
    }
    if (this.isInvalidDate(startDate))
      result.startDate.violations.push({ old: startDate, reason: "isInvalidDate" });
    if (this.timePicker) {
      for (let unit of units) {
        if (this.isInvalidTime(startDate, unit, "start"))
          result.startDate.violations.push({ old: startDate, reason: "isInvalidTime", unit });
      }
    }
    if (this.singleDatePicker) {
      if (result.startDate.violations.length == 0)
        return null;
      if (dipatch) {
        let newValues = { startDate };
        const ret = this.element.triggerHandler("violated.daterangepicker", [this, result, newValues]);
        if (ret) {
          result.newDate = newValues;
          return result;
        }
        return result;
      } else {
        return result;
      }
    }
    if (endDate == null)
      return null;
    result.endDate = { violations: [] };
    violation = { old: endDate, reason: this.timePicker ? "stepSize" : "timePicker" };
    if (this.timePicker) {
      const secs = this.timePickerStepSize.as("seconds");
      endDate = DateTime.fromSeconds(secs * Math.round(endDate.toSeconds() / secs));
      violation.new = endDate;
      if (!violation.new.equals(violation.old))
        result.endDate.violations.push(violation);
    } else {
      endDate = endDate.endOf("day");
    }
    if (this.maxDate && endDate > this.maxDate) {
      violation = { old: endDate, reason: "maxDate" };
      endDate = endDate.minus({ seconds: Math.trunc(endDate.diff(this.maxDate).as("seconds") / shiftStep) * shiftStep });
      if (endDate > this.maxDate)
        endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
      violation.new = endDate;
      if (!violation.new.equals(violation.old))
        result.endDate.violations.push(violation);
    } else if (this.minDate && endDate < this.minDate) {
      violation = { old: endDate, reason: "minDate" };
      endDate = endDate.plus({ seconds: Math.trunc(this.minDate.diff(endDate).as("seconds") / shiftStep) * shiftStep });
      if (endDate < this.minDate)
        endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
      violation.new = endDate;
      if (!violation.new.equals(violation.old))
        result.endDate.violations.push(violation);
    }
    if (this.maxSpan) {
      const maxDate = startDate.plus(this.maxSpan);
      if (endDate > maxDate) {
        violation = { old: endDate, reason: "maxSpan" };
        endDate = endDate.minus({ seconds: Math.trunc(maxDate.diff(endDate).as("seconds") / shiftStep) * shiftStep });
        if (endDate > maxDate)
          endDate = endDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
        violation.new = endDate;
        if (!violation.new.equals(violation.old))
          result.endDate.violations.push(violation);
      }
    }
    if (this.minSpan) {
      const minDate = startDate.plus(this.defaultSpan ?? this.minSpan);
      if (endDate < minDate) {
        violation = { old: endDate, reason: "minSpan" };
        endDate = endDate.plus({ seconds: Math.trunc(minDate.diff(endDate).as("seconds") / shiftStep) * shiftStep });
        if (endDate < minDate)
          endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
        violation.new = endDate;
        if (!violation.new.equals(violation.old))
          result.endDate.violations.push(violation);
      }
    }
    if (this.isInvalidDate(endDate))
      result.endDate.violations.push({ old: endDate, reason: "isInvalidDate" });
    if (this.timePicker) {
      for (let unit of units) {
        if (this.isInvalidTime(endDate, unit, "end"))
          result.endDate.violations.push({ old: endDate, reason: "isInvalidTime", unit });
      }
    }
    if (result.startDate.violations.length == 0 && result.endDate.violations.length == 0)
      return null;
    if (dipatch) {
      let newValues = { startDate, endDate };
      const ret = this.element.triggerHandler("violated.daterangepicker", [this, result, newValues]);
      if (ret) {
        result.newDate = newValues;
        return result;
      }
      return result;
    } else {
      return result;
    }
  }
  /**
  * Updates the picker when calendar is initiated or any date has been selected. 
  * Could be useful after running {@link #DateRangePicker+setStartDate|setStartDate} or {@link #DateRangePicker+setEndDate|setRange} 
  * @emits "beforeRenderTimePicker.daterangepicker"
  */
  updateView() {
    if (this.timePicker) {
      this.element.trigger("beforeRenderTimePicker.daterangepicker", this);
      this.renderTimePicker("start");
      this.renderTimePicker("end");
      if (!this.#endDate) {
        this.container.find(".calendar-time.end-time select").prop("disabled", true).addClass("disabled");
      } else {
        this.container.find(".calendar-time.end-time select").prop("disabled", false).removeClass("disabled");
      }
    }
    this.updateLabel();
    this.updateMonthsInView();
    this.updateCalendars();
    this.setApplyBtnState();
  }
  /**
  * Shows calendar months based on selected date values
  * @private
  */
  updateMonthsInView() {
    if (this.#endDate) {
      if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.#startDate.hasSame(this.leftCalendar.month, "month") || this.#startDate.hasSame(this.rightCalendar.month, "month")) && (this.#endDate.hasSame(this.leftCalendar.month, "month") || this.#endDate.hasSame(this.rightCalendar.month, "month")))
        return;
      this.leftCalendar.month = this.#startDate.startOf("month");
      if (!this.singleMonthView) {
        if (!this.linkedCalendars && !this.#endDate.hasSame(this.#startDate, "month")) {
          this.rightCalendar.month = this.#endDate.startOf("month");
        } else {
          this.rightCalendar.month = this.#startDate.startOf("month").plus({ month: 1 });
        }
      }
    } else {
      if (!this.#startDate && this.initalMonth) {
        this.leftCalendar.month = this.initalMonth;
        if (!this.singleMonthView)
          this.rightCalendar.month = this.initalMonth.plus({ month: 1 });
      } else {
        if (!this.leftCalendar.month.hasSame(this.#startDate, "month") && !this.rightCalendar.month.hasSame(this.#startDate, "month")) {
          this.leftCalendar.month = this.#startDate.startOf("month");
          this.rightCalendar.month = this.#startDate.startOf("month").plus({ month: 1 });
        }
      }
    }
    if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && !this.singleMonthView && this.rightCalendar.month > this.maxDate) {
      this.rightCalendar.month = this.maxDate.startOf("month");
      this.leftCalendar.month = this.maxDate.startOf("month").minus({ month: 1 });
    }
  }
  /**
  * Updates the selected day value from calendar with selected time values
  * @emits "beforeRenderCalendar.daterangepicker"
  * @private
  */
  updateCalendars() {
    if (this.timePicker) {
      var hour, minute, second;
      if (this.#endDate) {
        hour = parseInt(this.container.find(".start-time .hourselect").val(), 10);
        if (isNaN(hour))
          hour = parseInt(this.container.find(".start-time .hourselect option:last").val(), 10);
        minute = 0;
        if (this.timePickerOpts.showMinutes) {
          minute = parseInt(this.container.find(".start-time .minuteselect").val(), 10);
          if (isNaN(minute))
            minute = parseInt(this.container.find(".start-time .minuteselect option:last").val(), 10);
        }
        second = 0;
        if (this.timePickerOpts.showSeconds) {
          second = parseInt(this.container.find(".start-time .secondselect").val(), 10);
          if (isNaN(second))
            second = parseInt(this.container.find(".start-time .secondselect option:last").val(), 10);
        }
      } else {
        hour = parseInt(this.container.find(".end-time .hourselect").val(), 10);
        if (isNaN(hour))
          hour = parseInt(this.container.find(".end-time .hourselect option:last").val(), 10);
        minute = 0;
        if (this.timePickerOpts.showMinutes) {
          minute = parseInt(this.container.find(".end-time .minuteselect").val(), 10);
          if (isNaN(minute))
            minute = parseInt(this.container.find(".end-time .minuteselect option:last").val(), 10);
        }
        second = 0;
        if (this.timePickerOpts.showSeconds) {
          second = parseInt(this.container.find(".end-time .secondselect").val(), 10);
          if (isNaN(second))
            second = parseInt(this.container.find(".end-time .secondselect option:last").val(), 10);
        }
      }
      this.leftCalendar.month = this.leftCalendar.month.set({ hour, minute, second });
      if (!this.singleMonthView)
        this.rightCalendar.month = this.rightCalendar.month.set({ hour, minute, second });
    } else {
      this.leftCalendar.month = this.leftCalendar.month.set({ hour: 0, minute: 0, second: 0 });
      if (!this.singleMonthView)
        this.rightCalendar.month = this.rightCalendar.month.set({ hour: 0, minute: 0, second: 0 });
    }
    this.element.trigger("beforeRenderCalendar.daterangepicker", this);
    this.renderCalendar("left");
    this.renderCalendar("right");
    this.container.find(".ranges li").removeClass("active");
    if (this.#endDate == null) return;
    this.calculateChosenLabel();
  }
  /**
  * Renders the calendar month
  * @private
  */
  renderCalendar(side) {
    if (side === "right" && this.singleMonthView)
      return;
    var calendar = side === "left" ? this.leftCalendar : this.rightCalendar;
    if (calendar.month == null && !this.#startDate && this.initalMonth)
      calendar.month = this.initalMonth.startOf("month");
    const firstDay = calendar.month.startOf("month");
    const lastDay = calendar.month.endOf("month").startOf("day");
    var theDate = calendar.month.startOf("month").minus({ day: 1 });
    const time = { hour: calendar.month.hour, minute: calendar.month.minute, second: calendar.month.second };
    var calendar = [];
    calendar.firstDay = firstDay;
    calendar.lastDay = lastDay;
    for (var i = 0; i < 6; i++)
      calendar[i] = [];
    while (theDate.weekday != this.locale.firstDay)
      theDate = theDate.minus({ day: 1 });
    for (let col = 0, row = -1; col < 42; col++, theDate = theDate.plus({ day: 1 })) {
      if (col % 7 === 0)
        row++;
      calendar[row][col % 7] = theDate.set(time);
    }
    if (side === "left") {
      this.leftCalendar.calendar = calendar;
    } else {
      this.rightCalendar.calendar = calendar;
    }
    var minDate = side === "left" ? this.minDate : this.#startDate;
    var maxDate = this.maxDate;
    var html = "<tr>";
    if (this.showWeekNumbers || this.showISOWeekNumbers)
      html += "<th></th>";
    if ((!minDate || minDate < calendar.firstDay) && (!this.linkedCalendars || side === "left")) {
      html += '<th class="prev available"><span></span></th>';
    } else {
      html += "<th></th>";
    }
    var dateHtml = `${this.locale.monthNames[calendar.firstDay.month - 1]} ${calendar.firstDay.year}`;
    if (this.showDropdowns) {
      const maxYear = (maxDate && maxDate.year) ?? this.maxYear;
      const minYear = (minDate && minDate.year) ?? this.minYear;
      let div = this.externalStyle === "bulma" ? '<div class="select is-small mr-1">' : "";
      var monthHtml = `${div}<select class="monthselect">`;
      for (var m = 1; m <= 12; m++) {
        monthHtml += `<option value="${m}"${m === calendar.firstDay.month ? " selected" : ""}`;
        if (minDate && calendar.firstDay.set({ month: m }) < minDate.startOf("month") || maxDate && calendar.firstDay.set({ month: m }) > maxDate.endOf("month"))
          monthHtml += ` disabled`;
        monthHtml += `>${this.locale.monthNames[m - 1]}</option>`;
      }
      monthHtml += "</select>";
      if (this.externalStyle === "bulma")
        monthHtml += "</div>";
      div = this.externalStyle === "bulma" ? '<div class="select is-small ml-1">' : "";
      var yearHtml = `${div}<select class="yearselect">`;
      for (var y = minYear; y <= maxYear; y++)
        yearHtml += `<option value="${y}"${y === calendar.firstDay.year ? " selected" : ""}>${y}</option>`;
      yearHtml += "</select>";
      if (this.externalStyle === "bulma")
        yearHtml += "</div>";
      dateHtml = monthHtml + yearHtml;
    }
    html += '<th colspan="5" class="month">' + dateHtml + "</th>";
    if ((!maxDate || maxDate > calendar.lastDay.endOf("day")) && (!this.linkedCalendars || side === "right" || this.singleDatePicker || this.singleMonthView)) {
      html += '<th class="next available"><span></span></th>';
    } else {
      html += "<th></th>";
    }
    html += "</tr>";
    html += "<tr>";
    if (this.showWeekNumbers || this.showISOWeekNumbers)
      html += `<th class="week">${this.locale.weekLabel}</th>`;
    for (let [index, dayOfWeek] of this.locale.daysOfWeek.entries()) {
      html += "<th";
      if (this.weekendDayClasses && this.weekendDayClasses.length && Info.getWeekendWeekdays().includes(index + 1))
        html += ` class="${this.weekendDayClasses}"`;
      html += `>${dayOfWeek}</th>`;
    }
    ;
    html += "</tr>";
    this.container.find(".drp-calendar." + side + " .calendar-table thead").html(html);
    html = "";
    if (this.#endDate == null && this.maxSpan) {
      var maxLimit = this.#startDate.plus(this.maxSpan).endOf("day");
      if (!maxDate || maxLimit < maxDate) {
        maxDate = maxLimit;
      }
    }
    var minLimit;
    if (this.#endDate == null && this.minSpan)
      minLimit = this.#startDate.plus(this.minSpan).startOf("day");
    for (let row = 0; row < 6; row++) {
      html += "<tr>";
      if (this.showISOWeekNumbers)
        html += '<td class="week">' + calendar[row][0].weekNumber + "</td>";
      else if (this.showWeekNumbers)
        html += '<td class="week">' + calendar[row][0].localWeekNumber + "</td>";
      for (let col = 0; col < 7; col++) {
        var classes = [];
        if (this.todayClasses && this.todayClasses.length && calendar[row][col].hasSame(DateTime.now(), "day"))
          classes.push(this.todayClasses);
        if (this.weekendClasses && this.weekendClasses.length && Info.getWeekendWeekdays().includes(calendar[row][col].weekday))
          classes.push(this.weekendClasses);
        if (calendar[row][col].month != calendar[1][1].month)
          classes.push("off", "ends");
        if (this.minDate && calendar[row][col].startOf("day") < this.minDate.startOf("day"))
          classes.push("off", "disabled");
        if (maxDate && calendar[row][col].startOf("day") > maxDate.startOf("day"))
          classes.push("off", "disabled");
        if (minLimit && calendar[row][col].startOf("day") > this.#startDate.startOf("day") && calendar[row][col].startOf("day") < minLimit.startOf("day"))
          classes.push("off", "disabled");
        if (this.isInvalidDate(calendar[row][col]))
          classes.push("off", "disabled");
        if (this.#startDate != null && calendar[row][col].hasSame(this.#startDate, "day"))
          classes.push("active", "start-date");
        if (this.#endDate != null && calendar[row][col].hasSame(this.#endDate, "day"))
          classes.push("active", "end-date");
        if (this.#endDate != null && calendar[row][col] > this.#startDate && calendar[row][col] < this.#endDate)
          classes.push("in-range");
        var isCustom = this.isCustomDate(calendar[row][col]);
        if (isCustom !== false) {
          if (typeof isCustom === "string")
            classes.push(isCustom);
          else
            Array.prototype.push.apply(classes, isCustom);
        }
        if (!classes.includes("disabled"))
          classes.push("available");
        html += `<td class="${classes.join(" ")}" data-title="r${row}c${col}">${calendar[row][col].day}</td>`;
      }
      html += "</tr>";
    }
    this.container.find(".drp-calendar." + side + " .calendar-table tbody").html(html);
  }
  /**
  * Emitted before the TimePicker is rendered.
  * Useful to remove any manually added elements.
  * @event
  * @name "beforeRenderTimePicker.daterangepicker"
  * @param {DateRangePicker} this - The daterangepicker object
  */
  /**
  * Renders the time pickers
  * @private
  * @emits "beforeRenderTimePicker.daterangepicker"
  */
  renderTimePicker(side) {
    if (side === "end" && !this.#endDate) return;
    var selected, minLimit, minDate, maxDate = this.maxDate;
    let html = "";
    if (this.showWeekNumbers || this.showISOWeekNumbers)
      html += "<th></th>";
    if (this.maxSpan && (!this.maxDate || this.#startDate.plus(this.maxSpan) < this.maxDate))
      maxDate = this.#startDate.plus(this.maxSpan);
    if (this.minSpan && side === "end")
      minLimit = this.#startDate.plus(this.defaultSpan ?? this.minSpan);
    if (side === "start") {
      selected = this.#startDate;
      minDate = this.minDate;
    } else if (side === "end") {
      selected = this.#endDate;
      minDate = this.#startDate;
      var timeSelector = this.container.find(".drp-calendar .calendar-time.end-time");
      if (timeSelector.html() != "") {
        selected = selected.set({
          hour: !isNaN(selected.hour) ? selected.hour : timeSelector.find(".hourselect option:selected").val(),
          minute: !isNaN(selected.minute) ? selected.minute : timeSelector.find(".minuteselect option:selected").val(),
          second: !isNaN(selected.second) ? selected.second : timeSelector.find(".secondselect option:selected").val()
        });
      }
      if (selected < this.#startDate)
        selected = this.#startDate;
      if (maxDate && selected > maxDate)
        selected = maxDate;
    }
    html += `<th colspan="7">`;
    if (this.externalStyle === "bulma")
      html += '<div class="select is-small mx-1">';
    html += '<select class="hourselect">';
    const ampm = selected.toFormat("a", { locale: "en-US" });
    let start = 0;
    if (!this.timePicker24Hour)
      start = ampm === "AM" ? 1 : 13;
    for (var i = start; i <= start + 23; i += this.timePickerOpts.hourStep) {
      let time = selected.set({ hour: i % 24 });
      let disabled = false;
      if (minDate && time.set({ minute: 59 }) < minDate)
        disabled = true;
      if (maxDate && time.set({ minute: 0 }) > maxDate)
        disabled = true;
      if (minLimit && time.endOf("hour") < minLimit)
        disabled = true;
      if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, "hour"))
        disabled = true;
      if (this.timePicker24Hour) {
        if (!disabled && i == selected.hour) {
          html += `<option value="${i}" selected>${i}</option>`;
        } else if (disabled) {
          html += `<option value="${i}" disabled class="disabled">${i}</option>`;
        } else {
          html += `<option value="${i}">${i}</option>`;
        }
      } else {
        const i_12 = DateTime.fromFormat(`${i % 24}`, "H").toFormat("h");
        const i_ampm = DateTime.fromFormat(`${i % 24}`, "H").toFormat("a", { locale: "en-US" });
        if (ampm == i_ampm) {
          if (!disabled && i == selected.hour) {
            html += `<option ampm="${i_ampm}" value="${i % 24}" selected>${i_12}</option>`;
          } else if (disabled) {
            html += `<option  ampm="${i_ampm}" value="${i % 24}" disabled class="disabled">${i_12}</option>`;
          } else {
            html += `<option ampm="${i_ampm}" value="${i % 24}">${i_12}</option>`;
          }
        } else {
          html += `<option ampm="${i_ampm}" hidden="hidden" value="${i % 24}">${i_12}</option>`;
        }
      }
    }
    html += "</select>";
    if (this.externalStyle === "bulma")
      html += "</div>";
    if (this.timePickerOpts.showMinutes) {
      html += " : ";
      if (this.externalStyle === "bulma")
        html += '<div class="select is-small mx-1">';
      html += '<select class="minuteselect">';
      for (var i = 0; i < 60; i += this.timePickerOpts.minuteStep) {
        var padded = i < 10 ? "0" + i : i;
        let time = selected.set({ minute: i });
        let disabled = false;
        if (minDate && time.set({ second: 59 }) < minDate)
          disabled = true;
        if (maxDate && time.set({ second: 0 }) > maxDate)
          disabled = true;
        if (minLimit && time.endOf("minute") < minLimit)
          disabled = true;
        if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, "minute"))
          disabled = true;
        if (selected.minute == i && !disabled) {
          html += `<option value="${i}" selected>${padded}</option>`;
        } else if (disabled) {
          html += `<option value="${i}" disabled class="disabled">${padded}</option>`;
        } else {
          html += `<option value="${i}">${padded}</option>`;
        }
      }
      html += "</select>";
      if (this.externalStyle === "bulma")
        html += "</div>";
    }
    if (this.timePickerOpts.showSeconds) {
      html += " : ";
      if (this.externalStyle === "bulma")
        html += '<div class="select is-small mx-1">';
      html += '<select class="secondselect">';
      for (var i = 0; i < 60; i += this.timePickerOpts.secondStep) {
        var padded = i < 10 ? "0" + i : i;
        let time = selected.set({ second: i });
        let disabled = false;
        if (minDate && time < minDate)
          disabled = true;
        if (maxDate && time > maxDate)
          disabled = true;
        if (minLimit && time < minLimit)
          disabled = true;
        if (!disabled && this.isInvalidTime(time, this.singleDatePicker ? null : side, "second"))
          disabled = true;
        if (selected.second == i && !disabled) {
          html += `<option value="${i}" selected>${padded}</option>`;
        } else if (disabled) {
          html += `<option value="${i}" disabled class="disabled">${padded}</option>`;
        } else {
          html += `<option value="${i}">${padded}</option>`;
        }
      }
      html += "</select>";
      if (this.externalStyle === "bulma")
        html += "</div>";
    }
    if (!this.timePicker24Hour) {
      if (this.externalStyle === "bulma")
        html += '<div class="select is-small mx-1">';
      html += '<select class="ampmselect">';
      var am_html = "";
      var pm_html = "";
      let disabled = false;
      if (minDate && selected.startOf("day") < minDate)
        disabled = true;
      if (maxDate && selected.endOf("day") > maxDate)
        disabled = true;
      if (minLimit && selected.startOf("day") < minLimit)
        disabled = true;
      if (disabled) {
        am_html = ' disabled class="disabled "';
        pm_html = ' disabled class="disabled"';
      } else {
        if (this.isInvalidTime(selected, this.singleDatePicker ? null : side, "ampm")) {
          if (selected.toFormat("a", { locale: "en-US" }) === "AM") {
            pm_html = ' disabled class="disabled"';
          } else {
            am_html = ' disabled class="disabled"';
          }
        }
      }
      html += `<option value="AM"${am_html}`;
      if (selected.toFormat("a", { locale: "en-US" }) === "AM")
        html += " selected";
      html += `>${Info.meridiems()[0]}</option><option value="PM"${pm_html}`;
      if (selected.toFormat("a", { locale: "en-US" }) === "PM")
        html += " selected";
      html += `>${Info.meridiems()[1]}</option>`;
      html += "</select>";
      if (this.externalStyle === "bulma")
        html += "</div>";
    }
    html += "</div></th>";
    this.container.find(`.drp-calendar .calendar-time.${side}-time`).html(html);
  }
  /**
  * Disable the `Apply` button if no date value is selected
  * @private
  */
  setApplyBtnState() {
    if (this.singleDatePicker || this.#endDate && this.#startDate <= this.#endDate) {
      this.container.find("button.applyBtn").prop("disabled", false);
    } else {
      this.container.find("button.applyBtn").prop("disabled", true);
    }
  }
  /**
  * Place the picker at the right place in the document
  * @private
  */
  move() {
    var parentOffset = { top: 0, left: 0 }, containerTop, drops = this.drops;
    var parentRightEdge = $(window).width();
    if (!this.parentEl.is("body")) {
      parentOffset = {
        top: this.parentEl.offset().top - this.parentEl.scrollTop(),
        left: this.parentEl.offset().left - this.parentEl.scrollLeft()
      };
      parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
    }
    switch (drops) {
      case "auto":
        containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
        if (containerTop + this.container.outerHeight() >= this.parentEl[0].scrollHeight) {
          containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
          drops = "up";
        }
        break;
      case "up":
        containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
        break;
      default:
        containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
        break;
    }
    this.container.css({
      top: 0,
      left: 0,
      right: "auto"
    });
    var containerWidth = this.container.outerWidth();
    this.container.toggleClass("drop-up", drops === "up");
    if (this.opens === "left") {
      var containerRight = parentRightEdge - this.element.offset().left - this.element.outerWidth();
      if (containerWidth + containerRight > $(window).width()) {
        this.container.css({
          top: containerTop,
          right: "auto",
          left: 9
        });
      } else {
        this.container.css({
          top: containerTop,
          right: containerRight,
          left: "auto"
        });
      }
    } else if (this.opens === "center") {
      var containerLeft = this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 - containerWidth / 2;
      if (containerLeft < 0) {
        this.container.css({
          top: containerTop,
          right: "auto",
          left: 9
        });
      } else if (containerLeft + containerWidth > $(window).width()) {
        this.container.css({
          top: containerTop,
          left: "auto",
          right: 0
        });
      } else {
        this.container.css({
          top: containerTop,
          left: containerLeft,
          right: "auto"
        });
      }
    } else {
      var containerLeft = this.element.offset().left - parentOffset.left;
      if (containerLeft + containerWidth > $(window).width()) {
        this.container.css({
          top: containerTop,
          left: "auto",
          right: 0
        });
      } else {
        this.container.css({
          top: containerTop,
          left: containerLeft,
          right: "auto"
        });
      }
    }
  }
  /**
  * Shows the picker
  * @emits "show.daterangepicker"
  */
  show() {
    if (this.isShowing) return;
    this._outsideClickProxy = function(e) {
      this.outsideClick(e);
    }.bind(this);
    $(document).on("mousedown.daterangepicker", this._outsideClickProxy).on("touchend.daterangepicker", this._outsideClickProxy).on("click.daterangepicker", "[data-toggle=dropdown]", this._outsideClickProxy).on("focusin.daterangepicker", this._outsideClickProxy);
    $(window).on("resize.daterangepicker", function(e) {
      this.move(e);
    }.bind(this));
    this.oldStartDate = this.#startDate;
    this.oldEndDate = this.#endDate;
    this.updateView();
    this.container.show();
    this.move();
    this.element.trigger("show.daterangepicker", this);
    this.isShowing = true;
  }
  /**
  * Hides the picker
  * @emits "beforeHide.daterangepicker"
  * @emits "hide.daterangepicker"
  */
  hide() {
    if (!this.isShowing) return;
    if (!this.#endDate) {
      this.#startDate = this.oldStartDate;
      this.#endDate = this.oldEndDate;
    }
    if (!this.#startDate.equals(this.oldStartDate) || !this.#endDate.equals(this.oldEndDate))
      this.callback(this.startDate, this.endDate, this.chosenLabel);
    this.updateElement();
    if (this.element.triggerHandler("beforeHide.daterangepicker", this))
      return;
    $(document).off(".daterangepicker");
    $(window).off(".daterangepicker");
    this.container.hide();
    this.element.trigger("hide.daterangepicker", this);
    this.isShowing = false;
  }
  /**
  * Toggles visibility of the picker
  */
  toggle() {
    if (this.isShowing) {
      this.hide();
    } else {
      this.show();
    }
  }
  /**
  * Closes the picker when user clicks outside
  * @param {external:jQuery} e - The Event target
  * @emits "outsideClick.daterangepicker"
  * @private
  */
  outsideClick(e) {
    var target = $(e.target);
    if (
      // ie modal dialog fix
      e.type === "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest(".calendar-table").length
    ) return;
    if (this.onOutsideClick === "cancel") {
      this.#startDate = this.oldStartDate;
      this.#endDate = this.oldEndDate;
    }
    this.hide();
    this.element.trigger("outsideClick.daterangepicker", this);
  }
  /**
  * Shows calendar when user selects "Custom Ranges"
  * @emits "showCalendar.daterangepicker"
  */
  showCalendars() {
    this.container.addClass("show-calendar");
    this.move();
    this.element.trigger("showCalendar.daterangepicker", this);
  }
  /**
  * Hides calendar when user selects a predefined range
  * @emits "hideCalendar.daterangepicker"
  */
  hideCalendars() {
    this.container.removeClass("show-calendar");
    this.element.trigger("hideCalendar.daterangepicker", this);
  }
  /**
  * Set date values after user selected a date
  * @param {external:jQuery} e - The Event target
  * @private
  */
  clickRange(e) {
    var label = e.target.getAttribute("data-range-key");
    this.chosenLabel = label;
    if (label == this.locale.customRangeLabel) {
      this.showCalendars();
    } else {
      var dates = this.ranges[label];
      this.#startDate = dates[0];
      this.#endDate = dates[1];
      if (!this.timePicker) {
        this.#startDate.startOf("day");
        this.#endDate.endOf("day");
      }
      if (!this.alwaysShowCalendars)
        this.hideCalendars();
      if (this.element.triggerHandler("beforeHide.daterangepicker", this))
        this.updateView();
      this.clickApply();
    }
  }
  /**
  * Move calendar to previous month
  * @param {external:jQuery} e - The Event target
  * @private
  */
  clickPrev(e) {
    var cal = $(e.target).parents(".drp-calendar");
    if (cal.hasClass("left")) {
      this.leftCalendar.month = this.leftCalendar.month.minus({ month: 1 });
      if (this.linkedCalendars && !this.singleMonthView)
        this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
    } else {
      this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
    }
    this.updateCalendars();
  }
  /**
  * Move calendar to next month
  * @param {external:jQuery} e - The Event target
  * @private
  */
  clickNext(e) {
    var cal = $(e.target).parents(".drp-calendar");
    if (cal.hasClass("left")) {
      this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
    } else {
      this.rightCalendar.month = this.rightCalendar.month.plus({ month: 1 });
      if (this.linkedCalendars)
        this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
    }
    this.updateCalendars();
  }
  /**
  * User hovers over date values
  * @param {external:jQuery} e - The Event target
  * @private
  */
  hoverDate(e) {
    if (!$(e.target).hasClass("available")) return;
    let title = $(e.target).attr("data-title");
    const row = title.substring(1, 2);
    const col = title.substring(3, 4);
    const cal = $(e.target).parents(".drp-calendar");
    var date = cal.hasClass("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
    const leftCalendar = this.leftCalendar;
    const rightCalendar = this.rightCalendar;
    const startDate = this.#startDate;
    const initalMonth = this.initalMonth;
    if (!this.#endDate) {
      this.container.find(".drp-calendar tbody td").each(function(index, el) {
        if ($(el).hasClass("week")) return;
        const title2 = $(el).attr("data-title");
        const row2 = title2.substring(1, 2);
        const col2 = title2.substring(3, 4);
        const cal2 = $(el).parents(".drp-calendar");
        const dt = cal2.hasClass("left") ? leftCalendar.calendar[row2][col2] : rightCalendar.calendar[row2][col2];
        if (!startDate && initalMonth) {
          $(el).removeClass("in-range");
        } else {
          if (dt > startDate && dt < date || dt.hasSame(date, "day")) {
            $(el).addClass("in-range");
          } else {
            $(el).removeClass("in-range");
          }
        }
      });
    }
  }
  /**
  * User hovers over ranges
  * @param {external:jQuery} e - The Event target
  * @private
  */
  hoverRange(e) {
    const label = e.target.getAttribute("data-range-key");
    const previousDates = [this.#startDate, this.#endDate];
    const dates = this.ranges[label] ?? [this.#startDate, this.#endDate];
    const leftCalendar = this.leftCalendar;
    const rightCalendar = this.rightCalendar;
    this.container.find(".drp-calendar tbody td").each(function(index, el) {
      if ($(el).hasClass("week")) return;
      const title = $(el).attr("data-title");
      const row = title.substring(1, 2);
      const col = title.substring(3, 4);
      const cal = $(el).parents(".drp-calendar");
      const dt = cal.hasClass("left") ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];
      let classAdded = false;
      if (dt.hasSame(dates[0], "day"))
        classAdded = $(el).addClass("start-hover").length > 0;
      if (dt.hasSame(previousDates[0], "day"))
        classAdded = $(el).addClass("start-date").length > 0;
      if (dt.hasSame(dates[1], "day"))
        classAdded = $(el).addClass("end-hover").length > 0;
      if (previousDates[1] != null && dt.hasSame(previousDates[1], "day"))
        classAdded = $(el).addClass("end-date").length > 0;
      if (dt.startOf("day") >= dates[0].startOf("day") && dt.startOf("day") <= dates[1].startOf("day"))
        classAdded = $(el).addClass("range-hover").length > 0;
      if (dt.startOf("day") >= previousDates[0].startOf("day") && previousDates[1] != null && dt.startOf("day") <= previousDates[1].startOf("day"))
        classAdded = $(el).addClass("in-range").length > 0;
      if (!classAdded) {
        $(el).removeClass("start-hover");
        $(el).removeClass("end-hover");
        $(el).removeClass("start-date");
        $(el).removeClass("end-date");
        $(el).removeClass("in-range");
        $(el).removeClass("range-hover");
      }
    });
  }
  /**
  * User leave ranges, remove hightlight from dates
  * @param {external:jQuery} e - The Event target
  * @private
  */
  leaveRange(e) {
    this.container.find(".drp-calendar tbody td").each(function(index, el) {
      if ($(el).hasClass("week")) return;
      $(el).removeClass("start-hover");
      $(el).removeClass("end-hover");
      $(el).removeClass("range-hover");
    });
  }
  /**
  * User clicked a date
  * @param {external:jQuery} e - The Event target
  * @emits "dateChange.daterangepicker"
  * @private
  */
  clickDate(e) {
    if (!$(e.target).hasClass("available")) return;
    var title = $(e.target).attr("data-title");
    var row = title.substring(1, 2);
    var col = title.substring(3, 4);
    var cal = $(e.target).parents(".drp-calendar");
    var date = cal.hasClass("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
    let side;
    if (this.#endDate || !this.#startDate || date < this.#startDate.startOf("day")) {
      if (this.timePicker) {
        let hour = parseInt(this.container.find(".start-time .hourselect").val(), 10);
        if (isNaN(hour))
          hour = parseInt(this.container.find(".start-time .hourselect option:last").val(), 10);
        let minute = 0;
        if (this.timePickerOpts.showMinutes) {
          minute = parseInt(this.container.find(".start-time .minuteselect").val(), 10);
          if (isNaN(minute))
            minute = parseInt(this.container.find(".start-time .minuteselect option:last").val(), 10);
        }
        let second = 0;
        if (this.timePickerOpts.showSeconds) {
          second = parseInt(this.container.find(".start-time .secondselect").val(), 10);
          if (isNaN(second))
            second = parseInt(this.container.find(".start-time .secondselect option:last").val(), 10);
        }
        date = date.set({ hour, minute, second });
      } else {
        date = date.startOf("day");
      }
      this.#endDate = null;
      this.#startDate = date;
      side = "start";
    } else if (!this.#endDate && date < this.#startDate) {
      this.#endDate = this.#startDate;
      side = "end";
    } else {
      if (this.timePicker) {
        let hour = parseInt(this.container.find(".end-time .hourselect").val(), 10);
        if (isNaN(hour))
          hour = parseInt(this.container.find(".end-time .hourselect option:last").val(), 10);
        let minute = 0;
        if (this.timePickerOpts.showMinutes) {
          minute = parseInt(this.container.find(".end-time .minuteselect").val(), 10);
          if (isNaN(minute))
            minute = parseInt(this.container.find(".end-time .minuteselect option:last").val(), 10);
        }
        let second = 0;
        if (this.timePickerOpts.showSeconds) {
          second = parseInt(this.container.find(".end-time .secondselect").val(), 10);
          if (isNaN(second))
            second = parseInt(this.container.find(".end-time .secondselect option:last").val(), 10);
        }
        date = date.set({ hour, minute, second });
      } else {
        date = date.endOf("day");
      }
      this.#endDate = date;
      if (this.autoApply) {
        this.calculateChosenLabel();
        this.clickApply();
      }
      side = "end";
    }
    if (this.singleDatePicker) {
      this.#endDate = this.#startDate;
      if (!this.timePicker && this.autoApply)
        this.clickApply();
      side = null;
    }
    this.updateView();
    e.stopPropagation();
    if (this.autoUpdateInput)
      this.updateElement();
    this.element.trigger("dateChange.daterangepicker", [this, side]);
  }
  /**
  * Hightlight selected predefined range in calendar
  * @private
  */
  calculateChosenLabel() {
    var customRange = true;
    var i = 0;
    for (var range in this.ranges) {
      var unit = this.timePicker ? "hour" : "day";
      if (this.timePicker) {
        if (this.timePickerOpts.showMinutes) {
          unit = "minute";
        } else if (this.timePickerOpts.showSeconds) {
          unit = "second";
        }
      }
      if (this.#startDate.startOf(unit).equals(this.ranges[range][0].startOf(unit)) && this.#endDate.startOf(unit).equals(this.ranges[range][1].startOf(unit))) {
        customRange = false;
        this.chosenLabel = this.container.find(".ranges li:eq(" + i + ")").addClass("active").attr("data-range-key");
        break;
      }
      i++;
    }
    if (customRange) {
      if (this.showCustomRangeLabel) {
        this.chosenLabel = this.container.find(".ranges li:last").addClass("active").attr("data-range-key");
      } else {
        this.chosenLabel = null;
      }
      this.showCalendars();
    }
  }
  /**
  * User clicked `Apply` button
  * @emits "apply.daterangepicker"
  * @private
  */
  clickApply() {
    this.hide();
    this.element.trigger("apply.daterangepicker", this);
  }
  /**
  * User clicked `Cancel` button
  * @emits "cancel.daterangepicker"
  * @private
  */
  clickCancel() {
    this.#startDate = this.oldStartDate;
    this.#endDate = this.oldEndDate;
    this.hide();
    this.element.trigger("cancel.daterangepicker", this);
  }
  /**
  * Calender month moved
  * @param {external:jQuery} e - The Event target
  * @private
  */
  monthOrYearChanged(e) {
    var isLeft = $(e.target).closest(".drp-calendar").hasClass("left"), leftOrRight = isLeft ? "left" : "right", cal = this.container.find(".drp-calendar." + leftOrRight);
    var month = parseInt(cal.find(".monthselect").val(), 10);
    var year = cal.find(".yearselect").val();
    if (!isLeft) {
      if (year < this.#startDate.year || year == this.#startDate.year && month < this.#startDate.month) {
        month = this.#startDate.month;
        year = this.#startDate.year;
      }
    }
    if (this.minDate) {
      if (year < this.minDate.year || year == this.minDate.year && month < this.minDate.month) {
        month = this.minDate.month;
        year = this.minDate.year;
      }
    }
    if (this.maxDate) {
      if (year > this.maxDate.year || year == this.maxDate.year && month > this.maxDate.month) {
        month = this.maxDate.month;
        year = this.maxDate.year;
      }
    }
    if (isLeft) {
      this.leftCalendar.month = this.leftCalendar.month.set({ year, month });
      if (this.linkedCalendars)
        this.rightCalendar.month = this.leftCalendar.month.plus({ month: 1 });
    } else {
      this.rightCalendar.month = this.rightCalendar.month.set({ year, month });
      if (this.linkedCalendars)
        this.leftCalendar.month = this.rightCalendar.month.minus({ month: 1 });
    }
    this.updateCalendars();
  }
  /**
  * User clicked a time
  * @param {external:jQuery} e - The Event target
  * @emits "timeChange.daterangepicker"
  * @private
  */
  timeChanged(e) {
    const time = $(e.target).closest(".calendar-time");
    ;
    const side = time.hasClass("start-time") ? "start" : "end";
    var hour = parseInt(time.find(".hourselect").val(), 10);
    if (isNaN(hour))
      hour = parseInt(time.find(".hourselect option:last").val(), 10);
    if (!this.timePicker24Hour) {
      const ampm = time.find(".ampmselect").val();
      if (ampm == null)
        time.find(".ampmselect option:last").val();
      if (ampm != DateTime.fromFormat(`${hour}`, "H").toFormat("a", { locale: "en-US" })) {
        time.find(".hourselect > option").each(function() {
          const hidden = $(this).attr("hidden") || false;
          $(this).attr("hidden", hidden);
        });
        const h = DateTime.fromFormat(`${hour}`, "H").toFormat("h");
        hour = DateTime.fromFormat(`${h}${ampm}`, "ha", { locale: "en-US" }).hour;
      }
    }
    var minute = 0;
    if (this.timePickerOpts.showMinutes) {
      minute = parseInt(time.find(".minuteselect").val(), 10);
      if (isNaN(minute))
        minute = parseInt(time.find(".minuteselect option:last").val(), 10);
    }
    var second = 0;
    if (this.timePickerOpts.showSeconds) {
      second = parseInt(time.find(".secondselect").val(), 10);
      if (isNaN(second))
        second = parseInt(time.find(".secondselect option:last").val(), 10);
    }
    if (side === "start") {
      if (this.#startDate)
        this.#startDate = this.#startDate.set({ hour, minute, second });
      if (this.singleDatePicker) {
        this.#endDate = this.#startDate;
      } else if (this.#endDate && this.#endDate.hasSame(this.#startDate, "day") && this.#endDate < this.#startDate) {
        this.#endDate = this.#startDate;
      }
    } else if (this.#endDate) {
      this.#endDate = this.#endDate.set({ hour, minute, second });
    }
    this.updateCalendars();
    this.setApplyBtnState();
    this.element.trigger("beforeRenderTimePicker.daterangepicker", this);
    this.renderTimePicker("start");
    this.renderTimePicker("end");
    if (this.autoUpdateInput)
      this.updateElement();
    this.element.trigger("timeChange.daterangepicker", [this, this.singleDatePicker ? null : side]);
  }
  /**
  * Update the picker with value from `<input>` element.<br> 
  * Input values must be given in format of `locale.format`. Invalid values are handles by `violated.daterangepicker` Event
  * @emits "inputChanged.daterangepicker"
  * @private
  */
  elementChanged() {
    if (!this.element.is("input:text")) return;
    if (!this.element.val().length) return;
    const format = typeof this.locale.format === "string" ? this.locale.format : DateTime.parseFormatForOpts(this.locale.format);
    const dateString = this.element.val().split(this.locale.separator);
    if (this.singleDatePicker) {
      let newDate = DateTime.fromFormat(this.element.val(), format, { locale: DateTime.now().locale });
      const oldDate = this.#startDate;
      if (!newDate.isValid || oldDate.equals(newDate))
        return;
      const violations = this.validateInput([newDate, null], true);
      if (violations != null) {
        if (violations.newDate != null) {
          newDate = violations.newDate.startDate;
        } else {
          return;
        }
      }
      this.#startDate = newDate;
      this.#endDate = this.#startDate;
      if (!this.timePicker) {
        this.#startDate = this.#startDate.startOf("day");
        this.#endDate = this.#endDate.endOf("day");
      }
    } else if (!this.singleDatePicker && dateString.length === 2) {
      const newDate = [0, 1].map((i) => DateTime.fromFormat(dateString[i], format, { locale: DateTime.now().locale }));
      const oldDate = [this.#startDate, this.#endDate];
      if (!newDate[0].isValid || !newDate[1].isValid || (oldDate[0].equals(newDate[0]) && oldDate[1].equals(newDate[1]) || newDate[0] > newDate[1]))
        return;
      const violations = this.validateInput([newDate[0], newDate[1]], true);
      if (violations != null) {
        if (violations.newDate != null) {
          newDate[0] = violations.newDate.startDate;
          newDate[1] = violations.newDate.endDate;
        } else {
          return;
        }
      }
      this.#startDate = newDate[0];
      this.#endDate = newDate[1];
      if (!this.timePicker) {
        this.#startDate = this.#startDate.startOf("day");
        this.#endDate = this.#endDate.endOf("day");
      }
    } else {
      return;
    }
    this.updateView();
    this.updateElement();
    this.element.trigger("inputChanged.daterangepicker", this);
  }
  /**
  * Handles key press, IE 11 compatibility
  * @param {external:jQuery} e - The Event target
  * @private
  */
  keydown(e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      this.hide();
    }
    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  }
  /**
  * Update attached `<input>` element with selected value
  * @emits external:change
  */
  updateElement() {
    if (this.#startDate == null && this.initalMonth)
      return;
    if (this.element.is("input:text")) {
      let newValue = this.formatDate(this.#startDate);
      if (!this.singleDatePicker) {
        newValue += this.locale.separator;
        if (this.#endDate)
          newValue += this.formatDate(this.#endDate);
      }
      this.updateAltInput();
      if (newValue !== this.element.val())
        this.element.val(newValue).trigger("change");
    } else {
      this.updateAltInput();
    }
  }
  /**
  * Update altInput `<input>` element with selected value
  */
  updateAltInput() {
    if (this.altInput == null)
      return;
    if (this.singleDatePicker)
      $(this.altInput[1]).val(null);
    if (this.altFormat == null) {
      let precision = "day";
      if (this.timePicker) {
        if (this.timePickerOpts.showSeconds) {
          precision = "second";
        } else if (this.timePickerOpts.showMinutes) {
          precision = "minute";
        } else {
          precision = "hour";
        }
      }
      const startDate = this.#startDate.toISO({ format: "basic", precision, includeOffset: false });
      $(this.singleDatePicker ? this.altInput : this.altInput[0]).val(startDate);
      if (!this.singleDatePicker && this.#endDate) {
        const endDate = this.#endDate.toISO({ format: "basic", precision, includeOffset: false });
        $(this.altInput[1]).val(endDate);
      }
    } else {
      const startDate = typeof this.altFormat === "function" ? this.altFormat(this.#startDate) : this.formatDate(this.#startDate, this.altFormat);
      $(this.singleDatePicker ? this.altInput : this.altInput[0]).val(startDate);
      if (!this.singleDatePicker && this.#endDate) {
        const endDate = typeof this.altFormat === "function" ? this.altFormat(this.#endDate) : this.formatDate(this.#endDate, this.altFormat);
        $(this.altInput[1]).val(endDate);
      }
    }
  }
  /**
  * Removes the picker from document
  */
  remove() {
    this.container.remove();
    this.element.off(".daterangepicker");
    this.element.removeData();
  }
}
if (!$.fn.daterangepicker) {
  $.fn.daterangepicker = function(options, callback) {
    const implementOptions = $.extend(true, {}, $.fn.daterangepicker.defaultOptions, options);
    this.each(function() {
      const el = $(this);
      if (el.data("daterangepicker"))
        el.data("daterangepicker").remove();
      el.data("daterangepicker", new DateRangePicker(el, implementOptions, callback));
    });
    return this;
  };
}
var daterangepicker_default = DateRangePicker;
export {
  daterangepicker_default as default
};
