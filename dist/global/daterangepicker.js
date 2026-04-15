var DateRangePicker = (function(exports, luxon2) {
  "use strict";
  class DateRangePicker2 {
    #startDate = null;
    #endDate = null;
    constructor(element, options, cb) {
      if (typeof element === "string" && document.querySelectorAll(element).length > 1)
        throw new RangeError(`Option 'element' must match to one element only`);
      this.parentEl = "body";
      this.element = element instanceof HTMLElement ? element : document.querySelector(element);
      this.isInputText = this.element instanceof HTMLInputElement && this.element.type === "text";
      this.button = null;
      this.showOnClick = true;
      this.#startDate = luxon2.DateTime.now().startOf("day");
      this.#endDate = luxon2.DateTime.now().plus({ day: 1 }).startOf("day");
      this.minDate = null;
      this.maxDate = null;
      this.maxSpan = null;
      this.minSpan = null;
      this.defaultSpan = null;
      this.initialMonth = luxon2.DateTime.now().startOf("month");
      this.autoApply = false;
      this.singleDatePicker = false;
      this.singleMonthView = false;
      this.showDropdowns = false;
      this.minYear = luxon2.DateTime.now().minus({ year: 100 }).year;
      this.maxYear = luxon2.DateTime.now().plus({ year: 100 }).year;
      this.showWeekNumbers = false;
      this.showISOWeekNumbers = false;
      this.showCustomRangeLabel = true;
      this.showLabel = !this.isInputText;
      this.timePicker = false;
      const usesMeridiems = new Intl.DateTimeFormat(luxon2.DateTime.now().locale, { hour: "numeric" }).resolvedOptions();
      this.timePicker24Hour = !usesMeridiems.hour12;
      this.timePickerStepSize = luxon2.Duration.fromObject({ minutes: 1 });
      this.linkedCalendars = true;
      this.autoUpdateInput = true;
      this.alwaysShowCalendars = false;
      this.isInvalidDate = null;
      this.isInvalidTime = null;
      this.isCustomDate = null;
      this.onOutsideClick = "apply";
      this.opens = this.element?.classList.contains("pull-right") ? "left" : "right";
      this.drops = this.element?.classList.contains("dropup") ? "up" : "down";
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
        format: luxon2.DateTime.DATE_SHORT,
        // or DateTime.DATETIME_SHORT when timePicker: true
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel",
        weekLabel: "W",
        customRangeLabel: "Custom Range",
        daysOfWeek: luxon2.Info.weekdays("short"),
        monthNames: luxon2.Info.months("long"),
        firstDay: luxon2.Info.getStartOfWeek(),
        durationFormat: null
      };
      if (this.element == null)
        return;
      this.callback = null;
      this.isShowing = false;
      this.leftCalendar = {};
      this.rightCalendar = {};
      if (typeof options !== "object" || options === null)
        options = {};
      let dataOptions = {};
      const data = Array.from(this.element.attributes).filter((x) => x.name.startsWith("data-"));
      for (let item of data) {
        const name = item.name.replace(/^data-/g, "").replace(/-([a-z])/g, function(str) {
          return str[1].toUpperCase();
        });
        if (!Object.keys(this).concat(["startDate", "endDate"]).includes(name) || Object.keys(options).includes(name))
          continue;
        let ts = luxon2.DateTime.fromISO(item.value);
        const isDate = ["startDate", "endDate", "minDate", "maxDate", "initialMonth"].includes(name);
        dataOptions[name] = ts.isValid && isDate ? ts : JSON.parse(item.value);
      }
      options = { ...dataOptions, ...options };
      if (["string", "object"].includes(typeof options.button)) {
        let button = options.button;
        if (typeof button === "string" && document.querySelectorAll(button).length === 1)
          button = document.querySelector(button);
        if (button instanceof HTMLButtonElement) {
          this.button = button;
        } else {
          console.error(`Option 'button' cannot resolved to a HTMLButtonElement`);
        }
      }
      if (typeof options.singleDatePicker === "boolean")
        this.singleDatePicker = options.singleDatePicker;
      if (!this.singleDatePicker && typeof options.singleMonthView === "boolean") {
        this.singleMonthView = options.singleMonthView;
      } else {
        this.singleMonthView = false;
      }
      if (!(options.externalStyle === null)) {
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle && typeof bodyStyle[Symbol.iterator] === "function" && [...bodyStyle].some((x) => x.startsWith("--bulma-")))
          this.externalStyle = "bulma";
      }
      if (typeof options.template === "string" || options.template instanceof HTMLElement) {
        this.container = typeof options.template === "string" ? createElementFromHTML(options.template) : options.template;
      } else {
        let template = [
          '<div class="daterangepicker">',
          '<div class="ranges"></div>',
          '<div class="drp-calendar left">',
          '<table class="calendar-table">',
          "<thead></thead>",
          "<tbody></tbody>",
          "<tfoot>",
          '<tr class="calendar-time start-time"></tr>',
          this.singleMonthView ? '<tr class="calendar-time end-time"></tr>' : "",
          "</tfoot>",
          "</table>",
          "</div>"
        ];
        template.push(...[
          '<div class="drp-calendar right">',
          '<table class="calendar-table">',
          "<thead></thead>",
          "<tbody></tbody>",
          "<tfoot>",
          this.singleMonthView ? "" : '<tr class="calendar-time end-time"></tr>',
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
        this.container = createElementFromHTML(options.template);
      }
      this.parentEl = document.querySelector(typeof options.parentEl === "string" ? options.parentEl : this.parentEl);
      this.parentEl.appendChild(this.container);
      if (typeof options.timePicker === "boolean")
        this.timePicker = options.timePicker;
      if (this.timePicker)
        this.locale.format = luxon2.DateTime.DATETIME_SHORT;
      if (typeof options.locale === "object") {
        for (let key2 of ["separator", "applyLabel", "cancelLabel", "weekLabel"]) {
          if (typeof options.locale[key2] === "string")
            this.locale[key2] = options.locale[key2];
        }
        if (typeof options.locale.direction === "string") {
          if (["rtl", "ltr"].includes(options.locale.direction))
            this.locale.direction = options.locale.direction;
          else
            console.error(`Option 'locale.direction' must be 'rtl' or 'ltr'`);
        }
        if (["string", "object"].includes(typeof options.locale.format))
          this.locale.format = options.locale.format;
        if (Array.isArray(options.locale.daysOfWeek)) {
          if (options.locale.daysOfWeek.some((x) => typeof x !== "string"))
            console.error(`Option 'locale.daysOfWeek' must be an array of strings`);
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
      this.container.classList.add(this.locale.direction);
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
        "showLabel",
        "showOnClick"
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
            if (luxon2.Duration.isDuration(options[opt]) && options[opt].isValid) {
              this[opt] = options[opt];
            } else if (luxon2.Duration.fromISO(options[opt]).isValid) {
              this[opt] = luxon2.Duration.fromISO(options[opt]);
            } else if (typeof options[opt] === "number" && luxon2.Duration.fromObject({ seconds: options[opt] }).isValid) {
              this[opt] = luxon2.Duration.fromObject({ seconds: options[opt] });
            } else if (options[opt] === null) {
              this[opt] = null;
            } else {
              console.error(`Option '${key}' is not valid`);
            }
          }
        }
        if (this.minSpan && this.maxSpan && this.minSpan > this.maxSpan) {
          this.minSpan = null;
          this.maxSpan = null;
          console.warn(`Ignore option 'minSpan' and 'maxSpan', because 'minSpan' must be smaller than 'maxSpan'`);
        }
        if (this.defaultSpan) {
          if (this.minSpan && this.minSpan > this.defaultSpan) {
            this.defaultSpan = null;
            console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be greater than 'minSpan'`);
          } else if (this.maxSpan && this.maxSpan < this.defaultSpan) {
            this.defaultSpan = null;
            console.warn(`Ignore option 'defaultSpan', because 'defaultSpan' must be smaller than 'maxSpan'`);
          }
        }
      }
      if (this.timePicker) {
        if (["string", "object", "number"].includes(typeof options.timePickerStepSize)) {
          let duration;
          if (luxon2.Duration.isDuration(options.timePickerStepSize) && options.timePickerStepSize.isValid) {
            duration = options.timePickerStepSize;
          } else if (luxon2.Duration.fromISO(options.timePickerStepSize).isValid) {
            duration = luxon2.Duration.fromISO(options.timePickerStepSize);
          } else if (typeof options.timePickerStepSize === "number" && luxon2.Duration.fromObject({ seconds: options.timePickerStepSize }).isValid) {
            duration = luxon2.Duration.fromObject({ seconds: options.timePickerStepSize });
          } else {
            console.error(`Option 'timePickerStepSize' is not valid`);
            duration = this.timePickerStepSize;
          }
          var valid = [];
          for (let unit of ["minutes", "seconds"])
            valid.push(...[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].map((x) => {
              return luxon2.Duration.fromObject({ [unit]: x });
            }));
          valid.push(...[1, 2, 3, 4, 6].map((x) => {
            return luxon2.Duration.fromObject({ hours: x });
          }));
          if (this.timePicker24Hour)
            valid.push(...[8, 12].map((x) => {
              return luxon2.Duration.fromObject({ hours: x });
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
          showMinutes: this.timePickerStepSize < luxon2.Duration.fromObject({ hours: 1 }),
          showSeconds: this.timePickerStepSize < luxon2.Duration.fromObject({ minutes: 1 }),
          hourStep: this.timePickerStepSize >= luxon2.Duration.fromObject({ hours: 1 }) ? this.timePickerStepSize.hours : 1,
          minuteStep: this.timePickerStepSize >= luxon2.Duration.fromObject({ minutes: 1 }) ? this.timePickerStepSize.minutes : 1,
          secondStep: this.timePickerStepSize.seconds
        };
      }
      for (let opt of ["startDate", "endDate", "minDate", "maxDate", "initialMonth"]) {
        if (opt === "endDate" && this.singleDatePicker)
          continue;
        if (typeof options[opt] === "object") {
          if (luxon2.DateTime.isDateTime(options[opt]) && options[opt].isValid) {
            this[opt] = options[opt];
          } else if (options[opt] instanceof Date) {
            this[opt] = luxon2.DateTime.fromJSDate(options[opt]);
          } else if (options[opt] === null) {
            this[opt] = null;
          } else {
            console.error(`Option '${opt}' must be a luxon.DateTime or Date or string`);
          }
        } else if (typeof options[opt] === "string") {
          const format = typeof this.locale.format === "string" ? this.locale.format : luxon2.DateTime.parseFormatForOpts(this.locale.format);
          if (luxon2.DateTime.fromISO(options[opt]).isValid) {
            this[opt] = luxon2.DateTime.fromISO(options[opt]);
          } else if (luxon2.DateTime.fromFormat(options[opt], format, { locale: luxon2.DateTime.now().locale }).isValid) {
            this[opt] = luxon2.DateTime.fromFormat(options[opt], format, { locale: luxon2.DateTime.now().locale });
          } else {
            const invalid = luxon2.DateTime.fromFormat(options[opt], format, { locale: luxon2.DateTime.now().locale }).invalidExplanation;
            console.error(`Option '${opt}' is not a valid string: ${invalid}`);
          }
        }
      }
      if (this.isInputText) {
        if (this.element.value != "") {
          const format = typeof this.locale.format === "string" ? this.locale.format : luxon2.DateTime.parseFormatForOpts(this.locale.format);
          if (this.singleDatePicker && typeof options.startDate === "undefined") {
            const start = luxon2.DateTime.fromFormat(this.element.value, format, { locale: luxon2.DateTime.now().locale });
            if (start.isValid) {
              this.#startDate = start;
            } else {
              console.error(`Value "${this.element.value}" in <input> is not a valid string: ${start.invalidExplanation}`);
            }
          } else if (!this.singleDatePicker && typeof options.startDate === "undefined" && typeof options.endDate === "undefined") {
            const split = this.element.value.split(this.locale.separator);
            if (split.length === 2) {
              const start = luxon2.DateTime.fromFormat(split[0], format, { locale: luxon2.DateTime.now().locale });
              const end = luxon2.DateTime.fromFormat(split[1], format, { locale: luxon2.DateTime.now().locale });
              if (start.isValid && end.isValid) {
                this.#startDate = start;
                this.#endDate = end;
              } else {
                console.error(`Value in <input> is not a valid string: ${start.invalidExplanation} - ${end.invalidExplanation}`);
              }
            } else {
              console.error(`Value "${this.element.value}" in <input> is not a valid string`);
            }
          }
        }
      }
      if (this.singleDatePicker) {
        this.#endDate = this.#startDate;
      } else if (this.#endDate < this.#startDate) {
        console.error(`Option 'endDate' ${this.#endDate} must not be earlier than 'startDate' ${this.#startDate}`);
      }
      if (!this.timePicker) {
        if (this.minDate) this.minDate = this.minDate.startOf("day");
        if (this.maxDate) this.maxDate = this.maxDate.endOf("day");
        if (this.#startDate) this.#startDate = this.#startDate.startOf("day");
        if (this.#endDate) this.#endDate = this.#endDate.endOf("day");
      }
      if (!this.#startDate && this.initialMonth) {
        this.#endDate = null;
        if (this.timePicker)
          console.error(`Option 'initialMonth' works only with 'timePicker: false'`);
      } else {
        const violations = this.validateInput(null, false);
        if (violations != null) {
          let vio = violations.startDate;
          if (vio.length > 0) {
            if (vio.some((x) => x.reason.startsWith("isInvalid"))) {
              console.error(`Value of startDate "${this.#startDate}" violates ${vio.find((x) => x.reason.startsWith("isInvalid")).reason}`);
            } else {
              const newDate = vio.filter((x) => x.new != null).at(-1).new;
              if (typeof process !== "undefined" && process.env.JEST_WORKER_ID == null)
                console.warn(`Correcting startDate from ${this.#startDate} to ${newDate}`);
              this.#startDate = newDate;
            }
          }
          if (!this.singleDatePicker) {
            vio = violations.endDate.filter((x) => x.new != null);
            if (vio.length > 0) {
              if (vio.some((x) => x.reason.startsWith("isInvalid"))) {
                console.error(`Value of endDate "${this.#endDate}" violates ${vio.find((x) => x.reason.startsWith("isInvalid")).reason}`);
              } else {
                const newDate = vio.filter((x) => x.new != null).at(-1).new;
                if (typeof process !== "undefined" && process.env.JEST_WORKER_ID == null)
                  console.warn(`Correcting endDate from ${this.#endDate} to ${newDate}`);
                this.#endDate = newDate;
              }
            }
          }
        }
      }
      if (this.singleDatePicker) {
        if (typeof options.altInput === "string") {
          const el = document.querySelector(options.altInput);
          this.altInput = el instanceof HTMLInputElement && el.type === "text" ? el : null;
        } else if (options.altInput instanceof HTMLElement) {
          this.altInput = options.altInput instanceof HTMLInputElement && options.altInput.type === "text" ? options.altInput : null;
        }
      } else if (!this.singleDatePicker && Array.isArray(options.altInput) && options.altInput.length === 2) {
        this.altInput = [];
        for (let item of options.altInput) {
          const el = typeof item === "string" ? document.querySelector(item) : item;
          if (el instanceof HTMLInputElement && el.type === "text")
            this.altInput.push(el);
        }
        if (this.altInput.length !== 2)
          this.altInput = null;
      } else if (options.altInput != null) {
        console.warn(`Option 'altInput' ${JSON.stringify(options.altInput)} is not valid`);
      }
      if (options.altInput && ["function", "string"].includes(typeof options.altFormat))
        this.altFormat = options.altFormat;
      if (typeof options.opens === "string") {
        if (["left", "right", "center"].includes(options.opens))
          this.opens = options.opens;
        else
          console.error(`Option 'opens' must be 'left', 'right' or 'center'`);
      }
      if (typeof options.drops === "string") {
        if (["up", "down", "auto"].includes(options.drops))
          this.drops = options.drops;
        else
          console.error(`Option 'drops' must be 'up', 'down' or 'auto'`);
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
          console.error(`Option 'onOutsideClick' must be 'cancel' or 'apply'`);
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
            if (luxon2.DateTime.isDateTime(options.ranges[range][0]) && options.ranges[range][0].isValid) {
              start = options.ranges[range][0];
            } else if (options.ranges[range][0] instanceof Date) {
              start = luxon2.DateTime.fromJSDate(options.ranges[range][0]);
            } else if (typeof options.ranges[range][0] === "string" && luxon2.DateTime.fromISO(options.ranges[range][0]).isValid) {
              start = luxon2.DateTime.fromISO(options.ranges[range][0]);
            } else {
              console.error(`Option ranges['${range}'] is not am array of valid ISO-8601 string or luxon.DateTime or Date`);
            }
          }
          if (["string", "object"].includes(typeof options.ranges[range][1])) {
            if (luxon2.DateTime.isDateTime(options.ranges[range][1]) && options.ranges[range][1].isValid) {
              end = options.ranges[range][1];
            } else if (options.ranges[range][1] instanceof Date) {
              end = luxon2.DateTime.fromJSDate(options.ranges[range][1]);
            } else if (typeof options.ranges[range][1] === "string" && luxon2.DateTime.fromISO(options.ranges[range][1]).isValid) {
              end = luxon2.DateTime.fromISO(options.ranges[range][1]);
            } else {
              console.error(`Option ranges['${range}'] is not a valid ISO-8601 string or luxon.DateTime or Date`);
            }
          }
          if (start == null || end == null)
            continue;
          var elem = document.createElement("textarea");
          elem.innerHTML = range;
          this.ranges[elem.value] = [start, end];
        }
        var list = "<ul>";
        for (let range in this.ranges)
          list += `<li data-range-key="${range}">${range}</li>`;
        if (this.showCustomRangeLabel)
          list += `<li data-range-key="${this.locale.customRangeLabel}">${this.locale.customRangeLabel}</li>`;
        list += "</ul>";
        this.container.querySelector(".ranges").prepend(createElementFromHTML(list));
        this.container.classList.add("show-ranges");
      }
      if (typeof cb === "function")
        this.callback = cb;
      if (!this.timePicker)
        this.container.querySelectorAll(".calendar-time").forEach((el) => {
          el.style.display = "none";
        });
      if (this.timePicker && this.autoApply)
        this.autoApply = false;
      if (this.autoApply)
        this.container.classList.add("auto-apply");
      if (this.singleDatePicker || this.singleMonthView) {
        this.container.classList.add("single");
        this.container.querySelector(".drp-calendar.left").classList.add("single");
        this.container.querySelector(".drp-calendar.left").style.display = "";
        this.container.querySelector(".drp-calendar.right").style.display = "none";
        if (!this.timePicker && this.autoApply)
          this.container.classList.add("auto-apply");
      }
      if (this.singleDatePicker || !Object.keys(this.ranges).length || this.alwaysShowCalendars)
        this.container.classList.add("show-calendar");
      this.container.classList.add(`opens${this.opens}`);
      this.container.querySelectorAll(".applyBtn, .cancelBtn").forEach((el) => {
        el.classList.add(...this.buttonClasses.split(" "));
      });
      if (this.applyButtonClasses.length)
        this.container.querySelector(".applyBtn").classList.add(...this.applyButtonClasses.split(" "));
      if (this.cancelButtonClasses.length)
        this.container.querySelector(".cancelBtn").classList.add(...this.cancelButtonClasses.split(" "));
      this.container.querySelector(".applyBtn").innerHTML = this.locale.applyLabel;
      this.container.querySelector(".cancelBtn").innerHTML = this.locale.cancelLabel;
      this.addListener(".drp-calendar", "click", ".prev", this.clickPrev.bind(this));
      this.addListener(".drp-calendar", "click", ".next", this.clickNext.bind(this));
      this.addListener(".drp-calendar", "mousedown", "td.available", this.clickDate.bind(this));
      this.addListener(".drp-calendar", "mouseenter", "td.available", this.hoverDate.bind(this));
      this.addListener(".drp-calendar", "change", "select.yearselect,select.monthselect", this.monthOrYearChanged.bind(this));
      this.addListener(".drp-calendar", "change", "select.hourselect,select.minuteselect,select.secondselect,select.ampmselect", this.timeChanged.bind(this));
      this.addListener(".ranges", "click", "li", this.clickRange.bind(this));
      this.addListener(".ranges", "mouseenter", "li", this.hoverRange.bind(this));
      this.addListener(".ranges", "mouseleave", "li", this.leaveRange.bind(this));
      this.addListener(".drp-buttons", "click", "button.applyBtn", this.clickApply.bind(this));
      this.addListener(".drp-buttons", "click", "button.cancelBtn", this.clickCancel.bind(this));
      if (this.showOnClick) {
        if (this.element.matches("input") || this.element.matches("button")) {
          this.element.addEventListener("click", this.#showProxy);
          this.element.addEventListener("focus", this.#showProxy);
          this.element.addEventListener("keyup", this.#elementChangedProxy);
          this.element.addEventListener("keydown", this.#keydownProxy);
        } else {
          this.element.addEventListener("click", this.#toggleProxy);
          this.element.addEventListener("keydown", this.#toggleProxy);
        }
      }
      if (this.button)
        this.button.addEventListener("click", this.#showProxy);
      this.updateElement();
    }
    /**
     * startDate
     * @type {external:DateTime}
     */
    get startDate() {
      return this.timePicker ? this.#startDate : this.#startDate?.startOf("day") ?? null;
    }
    /**
     * endDate
     * @type {external:DateTime}
     */
    get endDate() {
      return this.singleDatePicker ? null : (this.timePicker ? this.#endDate : this.#endDate?.endOf("day")) ?? null;
    }
    set startDate(val) {
      this.#startDate = val;
    }
    set endDate(val) {
      this.#endDate = val;
    }
    /**
     * DateRangePicker specific events
     */
    #events = {
      /**
      * Emitted when the date is changed through `<input>` element or via {@link #DateRangePicker+setStartDate|setStartDate} or 
      * {@link #DateRangePicker+setRange|setRange} and date is not valid due to 
      * `minDate`, `maxDate`, `minSpan`, `maxSpan`, `invalidDate` and `invalidTime` constraints.<br>
      * Event is only triggered when date string is valid and date value is changing<br>
      * @event
      * @name "violate"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {InputViolation} event.violation - The daterangepicker object
      * @property {NewDate} event.newDate - Object of corrected date values
      * @property {boolean} event.cancelable=true - By calling `event.preventDefault()` the `newDate` values will apply
      * @example
      * daterangepicker('#picker', {
      *   startDate: DateTime.now(),
      *   // allow only dates from current year
      *   minDate: DateTime.now().startOf('year'),
      *   manDate: DateTime.now().endOf('year'),
      *   singleDatePicker: true,
      *   locale: {
      *      format: DateTime.DATETIME_SHORT
      *   }
      * }).addEventListener('violate', (ev) => {
      *   ev.newDate.startDate = DateTime.now().minus({ days: 3 }).startOf('day');
      *   ev.preventDefault();
      * });
      *
      * // Try to set date outside permitted range at <input> elemet
      * const input = document.querySelector('#picker');
      * input.value = DateTime.now().minus({ years: 10 })).toLocaleString(DateTime.DATETIME_SHORT)
      * input.dispatchEvent(new Event('keyup'));
      
      * // Try to set date outside permitted range by code
      * const drp = getDateRangePicker('#picker');
      * drp.setStartDate(DateTime.now().minus({ years: 10 });
      * 
      * // -> Calendar selects and shows "today - 3 days"
      */
      onViolate: { type: "violate", param: (violation, newDate) => {
        return { ...violation, ...{ cancelable: true } };
      } },
      /**
      * Emitted before the calendar time picker is rendered.
      * @event
      * @name "beforeRenderTimePicker"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onBeforeRenderTimePicker: { type: "beforeRenderTimePicker" },
      /**
      * Emitted before the calendar is rendered.
      * @event
      * @name "beforeRenderCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onBeforeRenderCalendar: { type: "beforeRenderCalendar" },
      /**
      * Emitted when the picker is shown 
      * @event
      * @name "show"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onShow: { type: "show" },
      /**
      * Emitted before the picker will hide.
      * @event
      * @name "beforeHide"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {boolean} event.cancelable=true - Hide is canceled  by calling `event.preventDefault()`
      */
      onBeforeHide: { type: "beforeHide", param: { cancelable: true } },
      /**
      * Emitted when the picker is hidden
      * @event
      * @name "hide"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onHide: { type: "hide" },
      /**
      * Emitted when the calendar(s) are shown.
      * Only useful when {@link #Ranges|Ranges} are used.
      * @event
      * @name "showCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onShowCalendar: { type: "showCalendar" },
      /**
      * Emitted when the calendar(s) are hidden. Only used when {@link #Ranges|Ranges} are used.
      * @event
      * @name "hideCalendar"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onHideCalendar: { type: "hideCalendar" },
      /**
      * Emitted when user clicks outside the picker. Use option `onOutsideClick` to define the default action, then you may not need to handle this event.
      * @event
      * @name "outsideClick"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {boolean} event.cancelable=true - Call `event.preventDefault()` to prevent default behaviour.<br>
      * Useful to define custome areas where click shall not hide the picker
      */
      onOutsideClick: { type: "outsideClick", param: { cancelable: true } },
      /**
      * Emitted when the date changed. Does not trigger when time is changed, use {@link #event_timeChange|"timeChange"} to handle it
      * @event
      * @name "dateChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {string} event.side - Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker
      */
      onDateChange: { type: "dateChange", param: (side) => {
        return side;
      } },
      /**
      * Emitted when the time changed. Does not trigger when date is changed
      * @event
      * @name "timeChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {string} event.side - Either `'start'` or `'end'` indicating whether `startDate` or `endDate` was changed. `null` for singleDatePicker
      */
      onTimeChange: { type: "timeChange", param: (side) => {
        return side;
      } },
      /**
      * Emitted when the `Apply` button is clicked, or when a predefined {@link #Ranges|Ranges} is clicked 
      * @event
      * @name "apply"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onApply: { type: "apply" },
      /**
      * Emitted when the `Cancel` button is clicked
      * @event
      * @name "cancel"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onCancel: { type: "cancel" },
      /**
      * Emitted when the date is changed through `<input>` element. Event is only triggered when date string is valid and date value has changed
      * @event
      * @name "inputChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      */
      onInputChange: { type: "inputChange" },
      /**
      * Emitted after month view changed, for example by click on 'prev' or 'next'
      * @event
      * @name "monthViewChange"
      * @property {DateRangePickerEvent} event - The Event object
      * @property {DateRangePicker} event.picker - The daterangepicker object
      * @property {external:DateTime} event.left - The first day of month in left-hand calendar
      * @property {external:DateTime} event.right - The first day of month in left-hand calendar or `null` for singleDatePicker
      */
      onMonthViewChange: {
        type: "monthViewChange",
        param: (left, right) => {
          return {
            left: this.leftCalendar.month.startOf("month"),
            right: this.singleMonthView || this.singleDatePicker ? null : this.rightCalendar.month.startOf("month")
          };
        }
      }
    };
    /**
     * Getter for all DateRangePickerEvents
     */
    get events() {
      return this.#events;
    }
    #outsideClickProxy = this.outsideClick.bind(this);
    #onResizeProxy = this.move.bind(this);
    #dropdownClickWrapper = (e) => {
      const match = e.target.closest('[data-toggle="dropdown"]');
      if (match && document.contains(match))
        this.#outsideClickProxy(e);
    };
    #showProxy = this.show.bind(this);
    #elementChangedProxy = this.elementChanged.bind(this);
    #keydownProxy = this.keydown.bind(this);
    #toggleProxy = this.toggle.bind(this);
    /* #region Set startDate/endDate */
    /**
    * Sets the date range picker's currently selected start date to the provided date.<br>
    * `startDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
    * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
    * @param {external:DateTime|external:Date|string} startDate - startDate to be set. In case of ranges, the current `endDate` is used.
    * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
    * @returns {InputViolation} - Object of violations or `null` if no violation have been found
    * @example 
    * const drp = getDateRangePicker('#picker');
    * drp.setStartDate(DateTime.now().startOf('hour'));
    */
    setStartDate(startDate, updateView = true) {
      if (!this.singleDatePicker)
        return this.setRange(startDate, this.#endDate, updateView);
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
      const monthChange = !this.#startDate.hasSame(newDate, "month");
      this.#startDate = newDate;
      this.#endDate = this.#startDate;
      if (!this.timePicker) {
        this.#startDate = this.#startDate.startOf("day");
        this.#endDate = this.#endDate.endOf("day");
      }
      this.updateElement();
      if (updateView)
        this.updateView(monthChange);
      return violations;
    }
    /**
    * Sets the date range picker's currently selected start date to the provided date.<br>
    * `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
    * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
    * @param {external:DateTime|external:Date|string} endDate - endDate to be set. In case of ranges, the current `startDate` is used.
    * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
    * @returns {InputViolation} - Object of violations or `null` if no violation have been found
    * @example 
    * const drp = getDateRangePicker('#picker');
    * drp.setEndDate(DateTime.now().startOf('hour'));
    */
    setEndDate(endDate, updateView = true) {
      return this.singleDatePicker ? null : this.setRange(this.#startDate, endDate, updateView);
    }
    /**
    * Sets the date range picker's currently selected start date to the provided date.<br>
    * `startDate` and `endDate` must be a `luxon.DateTime` or `Date` or `string` according to {@link ISO-8601} or a string matching `locale.format`.<br>
    * Invalid date values are handled by {@link #DateRangePicker+violate|violate} Event
    * @param {external:DateTime|external:Date|string} startDate - startDate to be set
    * @param {external:DateTime|external:Date|string} endDate - endDate to be set
    * @param {boolean} updateView=true - If `true`, then calendar UI is updated to new value. Otherwise only internal values are set.
    * @returns {InputViolation} - Object of violations or `null` if no violation have been found
    * @example 
    * const drp = getDateRangePicker('#picker');
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
      const monthChange = !this.#startDate.hasSame(newDate[0], "month") || !this.#endDate.hasSame(newDate[1], "month");
      this.#startDate = newDate[0];
      this.#endDate = newDate[1];
      if (!this.timePicker) {
        this.#startDate = this.#startDate.startOf("day");
        this.#endDate = this.#endDate.endOf("day");
      }
      this.updateElement();
      if (updateView)
        this.updateView(monthChange);
      return violations;
    }
    /**
     * Parse date value
     * @param {sting|external:DateTime|Date} value - The value to be parsed
     * @returns {external:DateTime} - DateTime object
     */
    parseDate(value) {
      if (typeof value === "object") {
        if (luxon2.DateTime.isDateTime(value) && value.isValid) {
          return value;
        } else if (value instanceof Date) {
          return luxon2.DateTime.fromJSDate(value);
        } else {
          throw RangeError(`Value must be a luxon.DateTime or Date or string`);
        }
      } else if (typeof value === "string") {
        const format = typeof this.locale.format === "string" ? this.locale.format : luxon2.DateTime.parseFormatForOpts(this.locale.format);
        if (luxon2.DateTime.fromISO(value).isValid) {
          return luxon2.DateTime.fromISO(value);
        } else if (luxon2.DateTime.fromFormat(value, format, { locale: luxon2.DateTime.now().locale }).isValid) {
          return luxon2.DateTime.fromFormat(value, format, { locale: luxon2.DateTime.now().locale });
        } else {
          const invalid = luxon2.DateTime.fromFormat(value, format, { locale: luxon2.DateTime.now().locale }).invalidExplanation;
          throw RangeError(`Value is not a valid string: ${invalid}`);
        }
      }
    }
    /* #endregion */
    /**
     * Format a DateTime object
     * @param {external:DateTime} date - The DateTime to format
     * @param {object|string} format=this.locale.format - The format option
     * @returns {string} - Formatted date string
     */
    formatDate(date, format = this.locale.format) {
      if (date === null)
        return null;
      if (typeof format === "object") {
        return date.toLocaleString(format);
      } else {
        if (luxon2.Settings.defaultLocale === null) {
          const locale = luxon2.DateTime.now().locale;
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
        this.container.querySelector(".drp-selected").innerHTML = text;
      }
      if (this.singleDatePicker || this.locale.durationFormat == null)
        return;
      if (!this.#endDate) {
        this.container.querySelector(".drp-duration-label").innerHTML = "";
        return;
      }
      if (typeof this.locale.durationFormat === "function") {
        this.container.querySelector(".drp-duration-label").innerHTML = this.locale.durationFormat(this.#startDate, this.#endDate);
      } else {
        let duration = this.#endDate.plus({ milliseconds: 1 }).diff(this.#startDate).rescale().set({ milliseconds: 0 });
        if (!this.timePicker)
          duration = duration.set({ seconds: 0, minutes: 0, hours: 0 });
        duration = duration.removeZeros();
        if (typeof this.locale.durationFormat === "object") {
          this.container.querySelector(".drp-duration-label").innerHTML = duration.toHuman(this.locale.durationFormat);
        } else {
          this.container.querySelector(".drp-duration-label").innerHTML = duration.toFormat(this.locale.durationFormat);
        }
      }
    }
    /**
    * @typedef InputViolation
    * @type {Object}
    * @typedef {object} Violation
    * @property {string} reason - The type/reason of violation
    * @property {external:DateTime} old - Old value startDate/endDate
    * @property {external:DateTime} new? - Corrected value of startDate/endDate if existing
    * @typedef {object} NewDate
    * @property {external:DateTime} newDate.startDate- Object with corrected values
    * @property {external:DateTime} newDate.endDate - Object with corrected values
    * @property {Violation[]} startDate - The constraints which violates the input
    * @property {Violation[]?} endDate - The constraints which violates the input or `null` for singleDatePicker
    * @property {NewDate} newDate - Object with corrected values
    */
    /**
    * Validate `startDate` and `endDate` against `timePickerStepSize`, `minDate`, `maxDate`, 
    * `minSpan`, `maxSpan`, `invalidDate` and `invalidTime`.
    * @param {Array} range - `[startDate, endDate]`<br>Range to be checked, defaults to current `startDate` and `endDate`
    * @param {boolean} dipatch=false - If `true` then event "violate" is dispated.<br>
    * If eventHandler returns `true`, then `null` is returned, otherwiese the object of violations.
    * @emits "violate"
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
    *   startDate: [
    *     { old: "2026-03-13T10:35:52", reason: "timePickerStepSize", new: "2026-03-13T11:00:00" },
    *     { old: "2026-03-13T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" }
    *   ],
    *   endDate: {
    *     { old: "2026-03-16T10:35:52", reason: "stepSize", new: "2026-03-16T11:00:00" },
    *     { old: "2026-03-16T11:00:00", reason: "maxDate", new: "2026-03-10T00:00:00" },
    *     { old: "2026-03-10T00:00:00", reason: "minSpan", new: "2026-03-17T00:00:00" }
    *   ],
    *   newDate: { 
    *     startDate: "2026-03-10T00:00:00", 
    *     endDate: "2026-03-17T00:00:00"
    *   }
    * }
    */
    validateInput(range, dipatch = false) {
      let startDate = range == null ? this.#startDate : range[0];
      let endDate = range == null ? this.#endDate : range[1];
      if (startDate == null)
        return null;
      let result = { startDate: [] };
      let violation = { old: startDate, reason: this.timePicker ? "timePickerStepSize" : "timePicker" };
      if (this.timePicker) {
        const secs = this.timePickerStepSize.as("seconds");
        startDate = luxon2.DateTime.fromSeconds(secs * Math.round(startDate.toSeconds() / secs));
        violation.new = startDate;
        if (!violation.new.equals(violation.old))
          result.startDate.push(violation);
      } else {
        startDate = startDate.startOf("day");
      }
      const shiftStep = this.timePicker ? this.timePickerStepSize.as("seconds") : luxon2.Duration.fromObject({ days: 1 }).as("seconds");
      if (this.minDate && startDate < this.minDate) {
        violation = { old: startDate, reason: "minDate" };
        startDate = startDate.plus({ seconds: Math.trunc(this.minDate.diff(startDate).as("seconds") / shiftStep) * shiftStep });
        if (startDate < this.minDate)
          startDate = startDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
        violation.new = startDate;
        if (!violation.new.equals(violation.old))
          result.startDate.push(violation);
      } else if (this.maxDate && startDate > this.maxDate) {
        violation = { old: startDate, reason: "maxDate" };
        startDate = startDate.minus({ seconds: Math.trunc(startDate.diff(this.maxDate).as("seconds") / shiftStep) * shiftStep });
        if (startDate > this.maxDate)
          startDate = startDate.minus(this.timePicker ? this.timePickerStepSize : { days: 1 });
        violation.new = startDate;
        if (!violation.new.equals(violation.old))
          result.startDate.push(violation);
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
        result.startDate.push({ old: startDate, reason: "isInvalidDate" });
      if (this.timePicker) {
        for (let unit of units) {
          if (this.isInvalidTime(startDate, unit, "start"))
            result.startDate.push({ old: startDate, reason: "isInvalidTime", unit });
        }
      }
      if (this.singleDatePicker) {
        if (result.startDate.length == 0)
          return null;
        if (dipatch) {
          let newValues = { startDate };
          const event = this.triggerEvent(this.#events.onViolate, { violation: result, newDate: newValues });
          if (event.defaultPrevented) {
            result.newDate = event.newDate;
            return result;
          }
          return result;
        } else {
          return result;
        }
      }
      if (endDate == null)
        return null;
      result.endDate = [];
      violation = { old: endDate, reason: this.timePicker ? "stepSize" : "timePicker" };
      if (this.timePicker) {
        const secs = this.timePickerStepSize.as("seconds");
        endDate = luxon2.DateTime.fromSeconds(secs * Math.round(endDate.toSeconds() / secs));
        violation.new = endDate;
        if (!violation.new.equals(violation.old))
          result.endDate.push(violation);
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
          result.endDate.push(violation);
      } else if (this.minDate && endDate < this.minDate) {
        violation = { old: endDate, reason: "minDate" };
        endDate = endDate.plus({ seconds: Math.trunc(this.minDate.diff(endDate).as("seconds") / shiftStep) * shiftStep });
        if (endDate < this.minDate)
          endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
        violation.new = endDate;
        if (!violation.new.equals(violation.old))
          result.endDate.push(violation);
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
            result.endDate.push(violation);
        }
      }
      if (this.minSpan) {
        const minDate = startDate.plus(this.minSpan);
        if (endDate < minDate) {
          violation = { old: endDate, reason: "minSpan" };
          if (this.defaultSpan) {
            endDate = startDate.plus({ seconds: Math.trunc(this.defaultSpan.as("seconds") / shiftStep) * shiftStep });
          } else {
            endDate = startDate.plus({ seconds: Math.trunc(this.minSpan.as("seconds") / shiftStep) * shiftStep });
          }
          if (endDate < minDate)
            endDate = endDate.plus(this.timePicker ? this.timePickerStepSize : { days: 1 });
          violation.new = endDate;
          if (!violation.new.equals(violation.old))
            result.endDate.push(violation);
        }
      }
      if (this.isInvalidDate(endDate))
        result.endDate.push({ old: endDate, reason: "isInvalidDate" });
      if (this.timePicker) {
        for (let unit of units) {
          if (this.isInvalidTime(endDate, unit, "end"))
            result.endDate.push({ old: endDate, reason: "isInvalidTime", unit });
        }
      }
      if (result.startDate.length == 0 && result.endDate.length == 0)
        return null;
      if (dipatch) {
        let newValues = { startDate, endDate };
        const event = this.triggerEvent(this.#events.onViolate, { violation: result, newDate: newValues });
        if (event.defaultPrevented) {
          result.newDate = event.newDate;
          return result;
        }
        return result;
      } else {
        return result;
      }
    }
    /* #region Rendering */
    /**
    * Updates the picker when calendar is initiated or any date has been selected. 
    * Could be useful after running {@link #DateRangePicker+setStartDate|setStartDate} or {@link #DateRangePicker+setEndDate|setRange} 
    * @param {boolean} monthChange - If `true` then monthView changed
    * @emits "beforeRenderTimePicker"
    */
    updateView(monthChange) {
      if (this.timePicker) {
        this.triggerEvent(this.#events.onBeforeRenderTimePicker);
        this.renderTimePicker("start");
        this.renderTimePicker("end");
        this.container.querySelectorAll(".calendar-time.end-time select").forEach((el) => {
          el.disabled = !this.#endDate;
        });
        this.container.querySelectorAll(".calendar-time.end-time select").forEach((el) => {
          el.classList.toggle("disabled", !this.#endDate);
        });
      }
      this.updateLabel();
      this.updateMonthsInView();
      this.updateCalendars(monthChange);
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
        if (!this.#startDate && this.initialMonth) {
          this.leftCalendar.month = this.initialMonth;
          if (!this.singleMonthView)
            this.rightCalendar.month = this.initialMonth.plus({ month: 1 });
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
    * @emits "beforeRenderCalendar"
    * @emits "monthViewChange"
    * @param {boolean} monthChange - If `true` then monthView changed
    * @private
    */
    updateCalendars(monthChange) {
      if (this.timePicker) {
        var hour, minute, second;
        if (this.#endDate) {
          hour = parseInt(this.container.querySelector(".start-time .hourselect").value, 10);
          if (isNaN(hour))
            hour = parseInt(this.container.querySelector(".start-time .hourselect option:last-child").value, 10);
          minute = 0;
          if (this.timePickerOpts.showMinutes) {
            minute = parseInt(this.container.querySelector(".start-time .minuteselect").value, 10);
            if (isNaN(minute))
              minute = parseInt(this.container.querySelector(".start-time .minuteselect option:last-child").value, 10);
          }
          second = 0;
          if (this.timePickerOpts.showSeconds) {
            second = parseInt(this.container.querySelector(".start-time .secondselect").value, 10);
            if (isNaN(second))
              second = parseInt(this.container.querySelector(".start-time .secondselect option:last-child").value, 10);
          }
        } else {
          hour = parseInt(this.container.querySelector(".end-time .hourselect").value, 10);
          if (isNaN(hour))
            hour = parseInt(this.container.querySelector(".end-time .hourselect option:last-child").value, 10);
          minute = 0;
          if (this.timePickerOpts.showMinutes) {
            minute = parseInt(this.container.querySelector(".end-time .minuteselect").value, 10);
            if (isNaN(minute))
              minute = parseInt(this.container.querySelector(".end-time .minuteselect option:last-child").value, 10);
          }
          second = 0;
          if (this.timePickerOpts.showSeconds) {
            second = parseInt(this.container.querySelector(".end-time .secondselect").value, 10);
            if (isNaN(second))
              second = parseInt(this.container.querySelector(".end-time .secondselect option:last-child").value, 10);
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
      this.triggerEvent(this.#events.onBeforeRenderCalendar);
      this.renderCalendar("left");
      this.renderCalendar("right");
      if (monthChange)
        this.triggerEvent(this.#events.onMonthViewChange);
      this.container.querySelectorAll(".ranges li").forEach((el) => {
        el.classList.remove("active");
      });
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
      if (calendar.month == null && !this.#startDate && this.initialMonth)
        calendar.month = this.initialMonth.startOf("month");
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
        if (this.weekendDayClasses && this.weekendDayClasses.length && luxon2.Info.getWeekendWeekdays().includes(index + 1))
          html += ` class="${this.weekendDayClasses}"`;
        html += `>${dayOfWeek}</th>`;
      }
      html += "</tr>";
      this.container.querySelector(`.drp-calendar.${side} .calendar-table thead`).innerHTML = html;
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
          html += `<td class="week">${calendar[row][0].weekNumber}</td>`;
        else if (this.showWeekNumbers)
          html += `<td class="week">${calendar[row][0].localWeekNumber}</td>`;
        for (let col = 0; col < 7; col++) {
          var classes = [];
          if (this.todayClasses && this.todayClasses.length && calendar[row][col].hasSame(luxon2.DateTime.now(), "day"))
            classes.push(this.todayClasses);
          if (this.weekendClasses && this.weekendClasses.length && luxon2.Info.getWeekendWeekdays().includes(calendar[row][col].weekday))
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
          if (isCustom !== false)
            typeof isCustom === "string" ? classes.push(isCustom) : classes.push(...isCustom);
          if (!classes.includes("disabled"))
            classes.push("available");
          html += `<td class="${classes.join(" ")}" data-title="r${row}c${col}">${calendar[row][col].day}</td>`;
        }
        html += "</tr>";
      }
      this.container.querySelector(`.drp-calendar.${side} .calendar-table tbody`).innerHTML = html;
    }
    /**
    * Renders the time pickers
    * @private
    * @emits "beforeRenderTimePicker"
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
        minLimit = this.#startDate.plus(this.minSpan);
      if (side === "start") {
        selected = this.#startDate;
        minDate = this.minDate;
      } else if (side === "end") {
        selected = this.#endDate;
        minDate = this.#startDate;
        let timeSelector = this.container.querySelector(".drp-calendar .calendar-time.end-time");
        if (timeSelector.innerHTML != "") {
          selected = selected.set({
            hour: !isNaN(selected.hour) ? selected.hour : timeSelector.querySelector(".hourselect option:selected").value,
            minute: !isNaN(selected.minute) ? selected.minute : timeSelector.querySelector(".minuteselect option:selected").value,
            second: !isNaN(selected.second) ? selected.second : timeSelector.querySelector(".secondselect option:selected").value
          });
        }
        if (selected < this.#startDate)
          selected = this.#startDate;
        if (maxDate && selected > maxDate)
          selected = maxDate;
      }
      let disabledHours = [];
      let disabledMinutes = [];
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
          const i_12 = luxon2.DateTime.fromFormat(`${i % 24}`, "H").toFormat("h");
          const i_ampm = luxon2.DateTime.fromFormat(`${i % 24}`, "H").toFormat("a", { locale: "en-US" });
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
        disabledHours.push(disabled);
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
          if (disabledHours.every((x) => x))
            disabled = true;
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
          disabledMinutes.push(disabled);
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
          if (disabledMinutes.every((x) => x))
            disabled = true;
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
        if (disabledHours.every((x) => x))
          disabled = true;
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
        html += `>${luxon2.Info.meridiems()[0]}</option><option value="PM"${pm_html}`;
        if (selected.toFormat("a", { locale: "en-US" }) === "PM")
          html += " selected";
        html += `>${luxon2.Info.meridiems()[1]}</option>`;
        html += "</select>";
        if (this.externalStyle === "bulma")
          html += "</div>";
      }
      html += "</div></th>";
      this.container.querySelector(`.drp-calendar .calendar-time.${side}-time`).innerHTML = html;
    }
    /**
    * Disable the `Apply` button if no date value is selected
    * @private
    */
    setApplyBtnState() {
      const state = this.singleDatePicker || this.#endDate && this.#startDate <= this.#endDate;
      this.container.querySelector("button.applyBtn").disabled = !state;
    }
    /* #endregion */
    /* #region Move/Show/Hide */
    /**
    * Place the picker at the right place in the document
    */
    move() {
      let parentOffset = { top: 0, left: 0 };
      let containerTop;
      let containerLeft;
      let drops = this.drops;
      let parentRightEdge = window.innerWidth;
      if (!this.parentEl.matches("body")) {
        parentOffset = {
          top: offset(this.parentEl).top - this.parentEl.scrollTop(),
          left: offset(this.parentEl).left - this.parentEl.scrollLeft()
        };
        parentRightEdge = this.parentEl[0].clientWidth + offset(this.parentEl).left;
      }
      switch (this.drops) {
        case "auto":
          containerTop = offset(this.element).top + outerHeight(this.element) - parentOffset.top;
          if (containerTop + outerHeight(this.container) >= this.parentEl.scrollHeight) {
            containerTop = offset(this.element).top - outerHeight(this.container) - parentOffset.top;
            drops = "up";
          }
          break;
        case "up":
          containerTop = offset(this.element).top - outerHeight(this.container) - parentOffset.top;
          break;
        case "down":
          containerTop = offset(this.element).top + outerHeight(this.element) - parentOffset.top;
          break;
        default:
          console.error(`Option drops '${drops}' not defined`);
          break;
      }
      for (const [key2, value] of Object.entries({ top: 0, left: 0, right: "auto" }))
        this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
      const containerWidth = outerWidth(this.container);
      this.container.classList.toggle("drop-up", drops === "up");
      switch (this.opens) {
        case "left":
          const containerRight = parentRightEdge - offset(this.element).left - outerWidth(this.element);
          if (containerWidth + containerRight > window.innerWidth) {
            for (const [key2, value] of Object.entries({ top: containerTop, right: "auto", left: 9 }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          } else {
            for (const [key2, value] of Object.entries({ top: containerTop, right: containerRight, left: "auto" }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          }
          break;
        case "center":
          containerLeft = offset(this.element).left - parentOffset.left + outerWidth(this.element) / 2 - containerWidth / 2;
          if (containerLeft < 0) {
            for (const [key2, value] of Object.entries({ top: containerTop, right: "auto", left: 9 }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          } else if (containerLeft + containerWidth > window.innerWidth) {
            for (const [key2, value] of Object.entries({ top: containerTop, left: "auto", right: 0 }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          } else {
            for (const [key2, value] of Object.entries({ top: containerTop, left: containerLeft, right: "auto" }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          }
          break;
        case "right":
          containerLeft = offset(this.element).left - parentOffset.left;
          if (containerLeft + containerWidth > window.innerWidth) {
            for (const [key2, value] of Object.entries({ top: containerTop, left: "auto", right: 0 }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          } else {
            for (const [key2, value] of Object.entries({ top: `${containerTop}px`, left: containerLeft, right: "auto" }))
              this.container.style[key2] = typeof value === "number" && value > 0 ? `${value}px` : value;
          }
          break;
        default:
          console.error(`Option opens '${this.opens}' not defined`);
          break;
      }
    }
    /**
    * Shows the picker
    * @emits "show"
    */
    show() {
      if (this.isShowing) return;
      document.addEventListener("mousedown", this.#outsideClickProxy);
      document.addEventListener("touchend", this.#outsideClickProxy);
      document.addEventListener("click", this.#dropdownClickWrapper);
      document.addEventListener("focusin", this.#outsideClickProxy);
      window.addEventListener("resize", this.#onResizeProxy);
      this.oldStartDate = this.#startDate;
      this.oldEndDate = this.#endDate;
      this.updateView(false);
      this.container.style.display = "block";
      this.move();
      this.triggerEvent(this.#events.onShow);
      this.isShowing = true;
    }
    /**
    * Hides the picker
    * @emits "beforeHide"
    * @emits "hide"
    */
    hide() {
      if (!this.isShowing) return;
      if (!this.#endDate) {
        this.#startDate = this.oldStartDate;
        this.#endDate = this.oldEndDate;
      }
      if (typeof this.callback === "function") {
        if (this.#startDate && !this.#startDate.equals(this.oldStartDate ?? luxon2.DateTime) || this.#endDate && !this.singleDatePicker && !this.#endDate.equals(this.oldEndDate ?? luxon2.DateTime))
          this.callback(this.startDate, this.endDate, this.chosenLabel);
      }
      this.updateElement();
      const event = this.triggerEvent(this.#events.onBeforeHide);
      if (event.defaultPrevented)
        return;
      document.removeEventListener("mousedown", this.#outsideClickProxy);
      document.removeEventListener("touchend", this.#outsideClickProxy);
      document.removeEventListener("focusin", this.#outsideClickProxy);
      document.removeEventListener("click", this.#dropdownClickWrapper);
      window.removeEventListener("resize", this.#onResizeProxy);
      this.container.style.display = "none";
      this.triggerEvent(this.#events.onHide);
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
    * Shows calendar when user selects "Custom Ranges"
    * @emits "showCalendar"
    */
    showCalendars() {
      this.container.classList.add("show-calendar");
      this.move();
      this.triggerEvent(this.#events.onShowCalendar);
    }
    /**
    * Hides calendar when user selects a predefined range
    * @emits "hideCalendar"
    */
    hideCalendars() {
      this.container.classList.remove("show-calendar");
      this.triggerEvent(this.#events.onHideCalendar);
    }
    /* #endregion */
    /* #region Handle mouse related events */
    /**
    * Closes the picker when user clicks outside
    * @param {external:Event} e - The Event target
    * @emits "outsideClick"
    * @private
    */
    outsideClick(e) {
      const target = e.target;
      function closest2(el, selector) {
        if (selector == null)
          return null;
        let parent = el;
        while (parent) {
          if (parent == selector)
            return parent;
          parent = parent.parentElement;
        }
        return null;
      }
      if (
        // ie modal dialog fix
        e.type === "focusin" || closest2(target, this.element) || closest2(target, this.container) || closest2(target, this.button) || target.closest(".calendar-table")
      ) return;
      const event = this.triggerEvent(this.#events.onOutsideClick);
      if (event.defaultPrevented)
        return;
      if (this.onOutsideClick === "cancel") {
        this.#startDate = this.oldStartDate;
        this.#endDate = this.oldEndDate;
      }
      this.hide();
    }
    /**
    * Move calendar to previous month
    * @param {external:Event} e - The Event target
    * @private
    */
    clickPrev(e) {
      let cal = e.target.closest(".drp-calendar");
      if (cal.classList.contains("left")) {
        this.leftCalendar.month = this.leftCalendar.month.minus({ month: 1 });
        if (this.linkedCalendars && !this.singleMonthView)
          this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      } else {
        this.rightCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      }
      this.updateCalendars(true);
    }
    /**
    * Move calendar to next month
    * @param {external:Event} e - The Event target
    * @private
    */
    clickNext(e) {
      let cal = e.target.closest(".drp-calendar");
      if (cal.classList.contains("left")) {
        this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      } else {
        this.rightCalendar.month = this.rightCalendar.month.plus({ month: 1 });
        if (this.linkedCalendars)
          this.leftCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      }
      this.updateCalendars(true);
    }
    /**
    * User hovers over date values
    * @param {external:Event} e - The Event target
    * @private
    */
    hoverDate(e) {
      if (!e.target.classList.contains("available")) return;
      let title = e.target.dataset.title;
      const row = title.substring(1, 2);
      const col = title.substring(3, 4);
      const cal = e.target(closest, ".drp-calendar");
      var date = cal.classList.contains("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
      const leftCalendar = this.leftCalendar;
      const rightCalendar = this.rightCalendar;
      const startDate = this.#startDate;
      const initialMonth = this.initialMonth;
      if (!this.#endDate) {
        this.container.querySelectorAll(".drp-calendar tbody td").forEach((el) => {
          if (el.classList.contains("week")) return;
          const title2 = el.dataset.title;
          const row2 = title2.substring(1, 2);
          const col2 = title2.substring(3, 4);
          const cal2 = el.closest(".drp-calendar");
          const dt = cal2.classList.contains("left") ? leftCalendar.calendar[row2][col2] : rightCalendar.calendar[row2][col2];
          if (!startDate && initialMonth) {
            el.classList.remove("in-range");
          } else {
            el.classList.toggle("in-range", dt > startDate && dt < date || dt.hasSame(date, "day"));
          }
        });
      }
    }
    /**
    * User hovers over ranges
    * @param {external:Event} e - The Event target
    * @private
    */
    hoverRange(e) {
      const label = e.target.dataset.rangeKey;
      const previousDates = [this.#startDate, this.#endDate];
      const dates = this.ranges[label] ?? [this.#startDate, this.#endDate];
      const leftCalendar = this.leftCalendar;
      const rightCalendar = this.rightCalendar;
      this.container.querySelectorAll(".drp-calendar tbody td").forEach((el) => {
        if (el.classList.contains("week")) return;
        const title = el.dataset.ttitle;
        const row = title.substring(1, 2);
        const col = title.substring(3, 4);
        const cal = el.closest(".drp-calendar");
        const dt = cal.classList.contains("left") ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];
        el.classList.toggle("start-hover", dt.hasSame(dates[0], "day"));
        el.classList.toggle("start-date", dt.hasSame(previousDates[0], "day"));
        el.classList.toggle("end-hover", dt.hasSame(dates[1], "day"));
        el.classList.toggle("end-date", previousDates[1] != null && dt.hasSame(previousDates[1], "day"));
        el.classList.toggle("range-hover", dt.startOf("day") >= dates[0].startOf("day") && dt.startOf("day") <= dates[1].startOf("day"));
        el.classList.toggle("in-range", dt.startOf("day") >= previousDates[0].startOf("day") && previousDates[1] != null && dt.startOf("day") <= previousDates[1].startOf("day"));
      });
    }
    /**
    * User leave ranges, remove hightlight from dates
    * @private
    */
    leaveRange() {
      this.container.querySelectorAll(".drp-calendar tbody td").forEach((el) => {
        if (el.classList.contains("week")) return;
        el.classList.remove("start-hover");
        el.classList.remove("end-hover");
        el.classList.remove("range-hover");
      });
    }
    /* #endregion */
    /* #region Select values by Mouse  */
    /**
    * Set date values after user selected a date
    * @param {external:Event} e - The Event target
    * @private
    */
    clickRange(e) {
      let label = e.target.getAttribute("data-range-key");
      this.chosenLabel = label;
      if (label == this.locale.customRangeLabel) {
        this.showCalendars();
      } else {
        let newDate = this.ranges[label];
        const monthChange = !this.#startDate.hasSame(newDate[0], "month") || !this.#endDate.hasSame(newDate[1], "month");
        this.#startDate = newDate[0];
        this.#endDate = newDate[1];
        if (!this.timePicker) {
          this.#startDate.startOf("day");
          this.#endDate.endOf("day");
        }
        if (!this.alwaysShowCalendars)
          this.hideCalendars();
        const event = this.triggerEvent(this.#events.onBeforeHide);
        if (event.defaultPrevented)
          this.updateView(monthChange);
        this.clickApply();
      }
    }
    /**
    * User clicked a date
    * @param {external:Event} e - The Event target
    * @emits "dateChange"
    * @private
    */
    clickDate(e) {
      if (!e.target.classList.contains("available")) return;
      let title = e.target.dataset.title;
      let row = title.substring(1, 2);
      let col = title.substring(3, 4);
      let cal = e.target.closest(".drp-calendar");
      let date = cal.classList.contains("left") ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
      let side;
      if (this.#endDate || !this.#startDate || date < this.#startDate.startOf("day")) {
        if (this.timePicker) {
          let hour = parseInt(this.container.querySelector(".start-time .hourselect").value, 10);
          if (isNaN(hour))
            hour = parseInt(this.container.querySelector(".start-time .hourselect option:last-child").value, 10);
          let minute = 0;
          if (this.timePickerOpts.showMinutes) {
            minute = parseInt(this.container.querySelector(".start-time .minuteselect").value, 10);
            if (isNaN(minute))
              minute = parseInt(this.container.querySelector(".start-time .minuteselect option:last-child").value, 10);
          }
          let second = 0;
          if (this.timePickerOpts.showSeconds) {
            second = parseInt(this.container.querySelector(".start-time .secondselect").value, 10);
            if (isNaN(second))
              second = parseInt(this.container.querySelector(".start-time .secondselect option:last-child").value, 10);
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
          let hour = parseInt(this.container.querySelector(".end-time .hourselect").value, 10);
          if (isNaN(hour))
            hour = parseInt(this.container.querySelector(".end-time .hourselect option:last-child").value, 10);
          let minute = 0;
          if (this.timePickerOpts.showMinutes) {
            minute = parseInt(this.container.querySelector(".end-time .minuteselect").value, 10);
            if (isNaN(minute))
              minute = parseInt(this.container.querySelector(".end-time .minuteselect option:last-child").value, 10);
          }
          let second = 0;
          if (this.timePickerOpts.showSeconds) {
            second = parseInt(this.container.querySelector(".end-time .secondselect").value, 10);
            if (isNaN(second))
              second = parseInt(this.container.querySelector(".end-time .secondselect option:last-child").value, 10);
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
      this.updateView(false);
      e.stopPropagation();
      if (this.autoUpdateInput)
        this.updateElement();
      this.triggerEvent(this.#events.onDateChange, { side });
    }
    /**
    * Hightlight selected predefined range in calendar
    * @private
    */
    calculateChosenLabel() {
      if (Object.keys(this.ranges).length === 0)
        return;
      let customRange = true;
      let unit = this.timePicker ? "hour" : "day";
      if (this.timePicker) {
        if (this.timePickerOpts.showMinutes) {
          unit = "minute";
        } else if (this.timePickerOpts.showSeconds) {
          unit = "second";
        }
      }
      for (const [key2, [start, end]] of Object.entries(this.ranges)) {
        if (this.#startDate.startOf(unit).equals(start.startOf(unit)) && this.#endDate.startOf(unit).equals(end.startOf(unit))) {
          customRange = false;
          const range = this.container.querySelector(`.ranges li[data-range-key="${key2}"]`);
          this.chosenLabel = key2;
          range.classList.add("active");
          break;
        }
      }
      if (customRange) {
        if (this.showCustomRangeLabel) {
          const range = this.container.querySelector(".ranges li:last-child");
          this.chosenLabel = range.dataset.rangeKey;
          range.classList.add("active");
        } else {
          this.chosenLabel = null;
        }
        this.showCalendars();
      }
    }
    /**
    * User clicked a time
    * @param {external:Event} e - The Event target
    * @emits "timeChange"
    * @private
    */
    timeChanged(e) {
      const time = e.target.closest(".calendar-time");
      const side = time.classList.contains("start-time") ? "start" : "end";
      var hour = parseInt(time.querySelector(".hourselect").value, 10);
      if (isNaN(hour))
        hour = parseInt(time.querySelector(".hourselect option:last-child").value, 10);
      if (!this.timePicker24Hour) {
        const ampm = time.querySelector(".ampmselect").value;
        if (ampm == null)
          time.querySelector(".ampmselect option:last-child").value;
        if (ampm != luxon2.DateTime.fromFormat(`${hour}`, "H").toFormat("a", { locale: "en-US" })) {
          time.querySelectorAll(".hourselect > option").forEach((el) => {
            el.hidden = !el.hidden;
          });
          const h = luxon2.DateTime.fromFormat(`${hour}`, "H").toFormat("h");
          hour = luxon2.DateTime.fromFormat(`${h}${ampm}`, "ha", { locale: "en-US" }).hour;
        }
      }
      var minute = 0;
      if (this.timePickerOpts.showMinutes) {
        minute = parseInt(time.querySelector(".minuteselect").value, 10);
        if (isNaN(minute))
          minute = parseInt(time.querySelector(".minuteselect option:last-child").value, 10);
      }
      var second = 0;
      if (this.timePickerOpts.showSeconds) {
        second = parseInt(time.querySelector(".secondselect").value, 10);
        if (isNaN(second))
          second = parseInt(time.querySelector(".secondselect option:last-child").value, 10);
      }
      if (side === "start") {
        if (this.#startDate)
          this.#startDate = this.#startDate.set({ hour, minute, second });
        if (this.singleDatePicker) {
          this.#endDate = this.#startDate;
        } else if (this.#endDate && this.#endDate.hasSame(this.#startDate, "day")) {
          if (this.defaultSpan && this.#endDate < this.#startDate.plus(this.minSpan)) {
            this.#endDate = this.#startDate.plus(this.defaultSpan);
          } else if (this.minSpan && this.#endDate < this.#startDate.plus(this.minSpan)) {
            this.#endDate = this.#startDate.plus(this.minSpan);
          } else if (this.#endDate < this.#startDate) {
            this.#endDate = this.#startDate;
          }
        }
      } else if (this.#endDate) {
        this.#endDate = this.#endDate.set({ hour, minute, second });
        if (this.#endDate < this.#startDate)
          this.#endDate = this.#startDate.plus(this.minSpan ?? luxon2.Duration.fromObject({}));
      }
      this.updateCalendars(false);
      this.setApplyBtnState();
      this.triggerEvent(this.#events.onBeforeRenderTimePicker);
      this.renderTimePicker("start");
      this.renderTimePicker("end");
      if (this.autoUpdateInput)
        this.updateElement();
      this.triggerEvent(this.#events.onTimeChange, { side: this.singleDatePicker ? null : side });
    }
    /**
    * Calender month moved
    * @param {external:Event} e - The Event target
    * @private
    */
    monthOrYearChanged(e) {
      const isLeft = e.target.closest(".drp-calendar").classList.contains("left");
      const leftOrRight = isLeft ? "left" : "right";
      const cal = this.container.querySelector(`.drp-calendar.${leftOrRight}`);
      let month = parseInt(cal.querySelector(".monthselect").value, 10);
      let year = cal.querySelector(".yearselect").value;
      let monthChange = false;
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
        monthChange = !luxon2.DateTime.fromObject({ year, month }).hasSame(this.leftCalendar.month, "month");
        this.leftCalendar.month = this.leftCalendar.month.set({ year, month });
        if (this.linkedCalendars)
          this.rightCalendar.month = this.leftCalendar.month.plus({ month: 1 });
      } else {
        monthChange = !luxon2.DateTime.fromObject({ year, month }).hasSame(this.leftCalendar.month, "month");
        this.rightCalendar.month = this.rightCalendar.month.set({ year, month });
        if (this.linkedCalendars)
          this.leftCalendar.month = this.rightCalendar.month.minus({ month: 1 });
      }
      this.updateCalendars(monthChange);
    }
    /**
    * User clicked `Apply` button
    * @emits "apply"
    * @private
       */
    clickApply() {
      this.hide();
      this.triggerEvent(this.#events.onApply);
    }
    /**
    * User clicked `Cancel` button
    * @emits "cancel"
    * @private
    */
    clickCancel() {
      this.#startDate = this.oldStartDate;
      this.#endDate = this.oldEndDate;
      this.hide();
      this.triggerEvent(this.#events.onCancel);
    }
    /* #endregion */
    /**
    * Update the picker with value from `<input>` element.<br> 
    * Input values must be given in format of `locale.format`. Invalid values are handles by `violate` Event
    * @emits "inputChange"
    * @private
    */
    elementChanged() {
      if (!this.isInputText) return;
      if (!this.element.value.length) return;
      const format = typeof this.locale.format === "string" ? this.locale.format : luxon2.DateTime.parseFormatForOpts(this.locale.format);
      const dateString = this.element.value.split(this.locale.separator);
      let monthChange = false;
      if (this.singleDatePicker) {
        let newDate = luxon2.DateTime.fromFormat(this.element.value, format, { locale: luxon2.DateTime.now().locale });
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
        monthChange = !this.#startDate.hasSame(newDate, "month");
        this.#startDate = newDate;
        this.#endDate = this.#startDate;
        if (!this.timePicker) {
          this.#startDate = this.#startDate.startOf("day");
          this.#endDate = this.#endDate.endOf("day");
        }
      } else if (!this.singleDatePicker && dateString.length === 2) {
        const newDate = [0, 1].map((i) => luxon2.DateTime.fromFormat(dateString[i], format, { locale: luxon2.DateTime.now().locale }));
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
        monthChange = !this.#startDate.hasSame(newDate[0], "month") || !this.#endDate.hasSame(newDate[1], "month");
        this.#startDate = newDate[0];
        this.#endDate = newDate[1];
        if (!this.timePicker) {
          this.#startDate = this.#startDate.startOf("day");
          this.#endDate = this.#endDate.endOf("day");
        }
      } else {
        return;
      }
      this.updateView(monthChange);
      this.updateElement();
      this.triggerEvent(this.#events.onInputChange);
    }
    /**
    * Handles key press, IE 11 compatibility
    * @param {external:Event} e - The Event target
    * @private
    */
    keydown(e) {
      if ([9, 11].includes(e.keyCode))
        this.hide();
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
      if (this.#startDate == null && this.initialMonth)
        return;
      if (this.isInputText) {
        let newValue = this.formatDate(this.#startDate);
        if (!this.singleDatePicker) {
          newValue += this.locale.separator;
          if (this.#endDate)
            newValue += this.formatDate(this.#endDate);
        }
        this.updateAltInput();
        if (newValue !== this.element.value) {
          this.element.value = newValue;
          this.element.dispatchEvent(new Event("change", { bubbles: true }));
        }
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
        (this.singleDatePicker ? this.altInput : this.altInput[0]).value = startDate;
        if (!this.singleDatePicker && this.#endDate) {
          const endDate = this.#endDate.toISO({ format: "basic", precision, includeOffset: false });
          this.altInput[1].value = endDate;
        }
      } else {
        const startDate = typeof this.altFormat === "function" ? this.altFormat(this.#startDate) : this.formatDate(this.#startDate, this.altFormat);
        (this.singleDatePicker ? this.altInput : this.altInput[0]).value = startDate;
        if (!this.singleDatePicker && this.#endDate) {
          const endDate = typeof this.altFormat === "function" ? this.altFormat(this.#endDate) : this.formatDate(this.#endDate, this.altFormat);
          this.altInput[1].value = endDate;
        }
      }
    }
    /**
    * Removes the picker from document
    */
    remove() {
      this.element.removeEventListener("click", this.#showProxy);
      this.element.removeEventListener("focus", this.#showProxy);
      this.element.removeEventListener("keyup", this.#elementChangedProxy);
      this.element.removeEventListener("keydown", this.#keydownProxy);
      this.element.removeEventListener("click", this.#toggleProxy);
      this.element.removeEventListener("keydown", this.#toggleProxy);
      this.container.remove();
    }
    /**
     * Helper function to dispatch events
     * @param {object} ev - Event template from this.#events
     * @param  {...object} args - Additional parameters if needed
     */
    triggerEvent(ev, ...args) {
      if (args.length === 0) {
        const event = new DateRangePickerEvent(this, ev);
        this.element.dispatchEvent(event);
        return event;
      } else {
        const event = new DateRangePickerEvent(this, ev, ...args);
        this.element.dispatchEvent(event);
        return event;
      }
    }
    /**
     * Helper function to add eventListener similar to jQuery .on( events [, selector ] [, data ] )
     * @param {string} element - Query selector of element where listener is added
     * @param {string} eventName - Name of the event
     * @param {string} selector - Query selector string to filter the descendants of the element
     * @param {function} delegate - Handler data
     * @private
     */
    addListener(element, eventName, selector, delegate) {
      this.container.querySelectorAll(element).forEach((el) => {
        el.addEventListener(eventName, function(event) {
          const target = event.target.closest(selector);
          if (target && el.contains(target))
            delegate.call(target, event);
        });
      });
    }
  }
  function createElementFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }
  class DateRangePickerEvent extends Event {
    #picker;
    constructor(drp, ev, args = {}) {
      let param = {};
      if (ev.param)
        param = typeof ev.param === "function" ? ev.param() : ev.param;
      param = { ...param, ...args };
      super(ev.type, param);
      this.#picker = drp;
      for (const [key2, value] of Object.entries(param)) {
        if (Object.getOwnPropertyNames(Event.prototype).includes(key2)) continue;
        this[key2] = value;
      }
    }
    get picker() {
      return this.#picker;
    }
  }
  function offset(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }
  function outerWidth(el, withMargin = false) {
    if (!withMargin)
      return el.offsetWidth;
    const style = getComputedStyle(el);
    return el.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }
  function outerHeight(el, withMargin = false) {
    if (!withMargin)
      return el.offsetHeight;
    const style = getComputedStyle(el);
    return el.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
  }
  function daterangepicker(elements, options, callback) {
    if (typeof elements === "string")
      return daterangepicker(document.querySelectorAll(elements), options, callback);
    if (elements instanceof HTMLElement)
      elements = [elements];
    if (elements instanceof NodeList || elements instanceof HTMLCollection)
      elements = Array.from(elements);
    if (elements == null)
      return new DateRangePicker2(null, options || {}, callback);
    elements.forEach((el) => {
      if (el._daterangepicker && typeof el._daterangepicker.remove === "function")
        el._daterangepicker.remove();
      el._daterangepicker = new DateRangePicker2(el, options || {}, callback);
    });
    return elements.length === 1 ? elements[0] : elements;
  }
  function getDateRangePicker(target) {
    if (typeof target === "string")
      target = document.querySelector(target);
    return target instanceof HTMLElement ? target._daterangepicker : void 0;
  }
  if (window.jQuery?.fn) {
    jQuery.fn.daterangepicker = function(options, callback) {
      return this.each(function() {
        daterangepicker(this, options, callback);
      });
    };
  }
  function registerJqueryPlugin(jq) {
    if (!jq?.fn) return;
    jq.fn.daterangepicker = function(options, callback) {
      return this.each(function() {
        daterangepicker(this, options, callback);
      });
    };
  }
  Object.defineProperty(window, "jQuery", {
    configurable: true,
    set(value) {
      this._jQuery = value;
      registerJqueryPlugin(value);
    },
    get() {
      return this._jQuery;
    }
  });
  exports.DateRangePicker = DateRangePicker2;
  exports.daterangepicker = daterangepicker;
  exports.getDateRangePicker = getDateRangePicker;
  return exports;
})({}, luxon);
//# sourceMappingURL=daterangepicker.js.map
