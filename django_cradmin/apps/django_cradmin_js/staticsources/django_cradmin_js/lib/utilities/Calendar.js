"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonthlyCalendarCoordinator = exports.CalendarCoordinator = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//NOTE: This file was originally converted from coffeescript to ES6 using decaffeinate. If you see something weird,
//      please rewrite it to something readable :)

/**
Get an array of the short names for all the weekdays
in the current locale, in the the correct order for the
current locale.
*/
var getWeekdaysShortForCurrentLocale = function getWeekdaysShortForCurrentLocale() {
  var weekdays = [];
  var weekdaysWithSundayFirst = moment.weekdaysShort();
  var firstDayOfWeek = moment.localeData().firstDayOfWeek();

  for (var _index = firstDayOfWeek; _index <= firstDayOfWeek + 6; _index++) {
    if (_index > 6) {
      _index = Math.abs(7 - _index);
    }

    var weekday = weekdaysWithSundayFirst[_index];
    weekdays.push(weekday);
  }

  return weekdays;
};

var Month =
/*#__PURE__*/
function () {
  function Month(firstDayOfMonth) {
    _classCallCheck(this, Month);

    this.firstDayOfMonth = firstDayOfMonth;
    this.lastDayOfMonth = this.firstDayOfMonth.clone().add({
      days: this.firstDayOfMonth.daysInMonth() - 1
    });
  }

  _createClass(Month, [{
    key: "getDaysInMonth",
    value: function getDaysInMonth() {
      return this.firstDayOfMonth.daysInMonth();
    }
  }]);

  return Month;
}();

var CalendarDay =
/*#__PURE__*/
function () {
  function CalendarDay(momentObject, isInCurrentMonth, isDisabled, nowMomentObject) {
    _classCallCheck(this, CalendarDay);

    this.momentObject = momentObject;
    this.isInCurrentMonth = isInCurrentMonth;
    this.nowMomentObject = nowMomentObject;
    this._isDisabled = isDisabled;
  }

  _createClass(CalendarDay, [{
    key: "getNumberInMonth",
    value: function getNumberInMonth() {
      return this.momentObject.format('D');
    }
  }, {
    key: "isToday",
    value: function isToday() {
      return this.momentObject.isSame(this.nowMomentObject, 'day');
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      return this._isDisabled;
    }
  }]);

  return CalendarDay;
}();

var CalendarWeek =
/*#__PURE__*/
function () {
  function CalendarWeek() {
    _classCallCheck(this, CalendarWeek);

    this.calendarDays = [];
  }

  _createClass(CalendarWeek, [{
    key: "addDay",
    value: function addDay(calendarDay) {
      return this.calendarDays.push(calendarDay);
    }
  }, {
    key: "getDayCount",
    value: function getDayCount() {
      return this.calendarDays.length;
    }
  }, {
    key: "prettyOneLineFormat",
    value: function prettyOneLineFormat() {
      var formattedDays = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.calendarDays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var calendarDay = _step.value;
          var formattedDay = calendarDay.momentObject.format('DD');

          if (calendarDay.isInCurrentMonth) {
            formattedDay = " ".concat(formattedDay, " ");
          } else {
            formattedDay = "(".concat(formattedDay, ")");
          }

          formattedDays.push(formattedDay);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return formattedDays.join(' ');
    }
  }]);

  return CalendarWeek;
}();

var CalendarMonth =
/*#__PURE__*/
function () {
  function CalendarMonth(calendarCoordinator, momentObject) {
    _classCallCheck(this, CalendarMonth);

    this.calendarCoordinator = calendarCoordinator;
    this.changeMonth(momentObject);
  }

  _createClass(CalendarMonth, [{
    key: "changeMonth",
    value: function changeMonth(momentObject) {
      var firstDayOfMonthMomentObject = momentObject.clone().set({
        date: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      });
      this.month = new Month(firstDayOfMonthMomentObject);
      this.calendarWeeks = [new CalendarWeek()];
      this.currentWeekIndex = 0;
      this.daysPerWeek = 7;
      this.totalWeeks = 6;
      this.currentDayCount = 0;
      this.lastDay = null;
      return this._build();
    }
  }, {
    key: "_buildPrefixedDays",
    value: function _buildPrefixedDays() {
      if (this.month.firstDayOfMonth.weekday() > 0) {
        var momentObject;

        for (var _index2 = 1; _index2 <= this.month.firstDayOfMonth.weekday(); _index2++) {
          momentObject = this.month.firstDayOfMonth.clone().subtract({
            days: _index2
          });

          this._addMomentObject(momentObject, false);
        }
      }
    }
  }, {
    key: "_buildSuffixedDays",
    value: function _buildSuffixedDays() {
      var _this = this;

      var totalDayCount = this.totalWeeks * this.daysPerWeek;
      return function () {
        var result = [];

        while (_this.currentDayCount < totalDayCount) {
          var momentObject = _this.lastDay.momentObject.clone().add({
            days: 1
          });

          result.push(_this._addMomentObject(momentObject, false));
        }

        return result;
      }();
    }
  }, {
    key: "_buildDaysBelongingInMonth",
    value: function _buildDaysBelongingInMonth() {
      var momentObject;

      for (var dayIndex = 1; dayIndex <= this.month.getDaysInMonth(); dayIndex++) {
        momentObject = this.month.firstDayOfMonth.clone().date(dayIndex);

        this._addMomentObject(momentObject, true);
      }
    }
  }, {
    key: "_build",
    value: function _build(momentFirstDayOfMonth) {
      this._buildPrefixedDays();

      this._buildDaysBelongingInMonth();

      return this._buildSuffixedDays();
    }
  }, {
    key: "_addMomentObject",
    value: function _addMomentObject(momentObject, isInCurrentMonth) {
      var week = this.calendarWeeks[this.currentWeekIndex];

      if (week.getDayCount() >= this.daysPerWeek) {
        this.calendarWeeks.push(new CalendarWeek());
        this.currentWeekIndex += 1;
        week = this.calendarWeeks[this.currentWeekIndex];
      }

      var isDisabled = !this.calendarCoordinator.momentObjectIsAllowed(momentObject);
      var calendarDay = new CalendarDay(momentObject, isInCurrentMonth, isDisabled, this.calendarCoordinator.nowMomentObject);
      week.addDay(calendarDay);
      this.currentDayCount += 1;
      return this.lastDay = calendarDay;
    }
  }, {
    key: "prettyprint",
    value: function prettyprint() {
      var rowFormatted;

      for (week in this.calendarWeeks) {
        rowFormatted = [];
        console.log(week.prettyOneLineFormat());
      }
    }
  }]);

  return CalendarMonth;
}();
/**
Coordinates the common calendar data no matter what kind of
view we present.
*/


var CalendarCoordinator =
/*#__PURE__*/
function () {
  function CalendarCoordinator(_ref) {
    var selectedMomentObject = _ref.selectedMomentObject,
        minimumDatetime = _ref.minimumDatetime,
        maximumDatetime = _ref.maximumDatetime,
        nowMomentObject = _ref.nowMomentObject;

    _classCallCheck(this, CalendarCoordinator);

    // We operate with two momentObjects:
    // - selectedMomentObject: This is the actual moment object
    //   that the user has selected. This can be null if the user
    //   has not selected a value yet.
    // - shownMomentObject: This reflects the value shown on the screen
    //   at any given moment (E.g.: It changes each time a user changes
    //   the day, month, hour, etc). This is never ``null``.
    this.selectedMomentObject = selectedMomentObject;
    this.minimumDatetime = minimumDatetime;
    this.maximumDatetime = maximumDatetime;
    this.nowMomentObject = nowMomentObject;

    if (this.selectedMomentObject != null) {
      this.shownMomentObject = this.selectedMomentObject.clone();
    } else {
      // We set this to start the date picker on the current date
      this.setToNow(); // If the current time is not allowed, pick the first allowed value

      if (!this.momentObjectIsAllowed(this.shownMomentObject)) {
        this.shownMomentObject = this.minimumDatetime.clone();
      }
    }
  }

  _createClass(CalendarCoordinator, [{
    key: "selectShownValue",
    value: function selectShownValue() {
      return this.selectedMomentObject = this.shownMomentObject.clone();
    }
  }, {
    key: "clearSelectedMomentObject",
    value: function clearSelectedMomentObject() {
      return this.selectedMomentObject = null;
    }
  }, {
    key: "momentObjectIsAllowed",
    value: function momentObjectIsAllowed(momentObject) {
      var ignoreTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var isAllowed = true;

      if (this.minimumDatetime != null) {
        var minimumDatetime = this.minimumDatetime;

        if (ignoreTime) {
          minimumDatetime = minimumDatetime.clone().set({
            hour: 0,
            minute: 0,
            second: 0
          });
        }

        isAllowed = !momentObject.isBefore(minimumDatetime);
      }

      if (isAllowed && this.maximumDatetime != null) {
        var maximumDatetime = this.maximumDatetime;

        if (ignoreTime) {
          maximumDatetime = maximumDatetime.clone().set({
            hour: 23,
            minute: 59,
            second: 59
          });
        }

        isAllowed = !momentObject.isAfter(maximumDatetime);
      }

      return isAllowed;
    }
  }, {
    key: "todayIsValidValue",
    value: function todayIsValidValue() {
      return this.momentObjectIsAllowed(this.nowMomentObject);
    }
  }, {
    key: "nowIsValidValue",
    value: function nowIsValidValue() {
      return this.momentObjectIsAllowed(this.nowMomentObject, false);
    }
  }, {
    key: "shownDateIsToday",
    value: function shownDateIsToday() {
      return this.shownMomentObject.isSame(this.nowMomentObject, 'day');
    }
  }, {
    key: "shownDateIsTodayAndNowIsValid",
    value: function shownDateIsTodayAndNowIsValid() {
      return this.shownDateIsToday() && this.nowIsValidValue();
    }
  }, {
    key: "setToNow",
    value: function setToNow() {
      return this.shownMomentObject = this.nowMomentObject.clone();
    }
  }]);

  return CalendarCoordinator;
}();
/**
Coordinates the common calendar data for a month-view.
*/


exports.CalendarCoordinator = CalendarCoordinator;

var MonthlyCalendarCoordinator =
/*#__PURE__*/
function () {
  function MonthlyCalendarCoordinator(_ref2) {
    var calendarCoordinator = _ref2.calendarCoordinator,
        yearselectValues = _ref2.yearselectValues,
        hourselectValues = _ref2.hourselectValues,
        minuteselectValues = _ref2.minuteselectValues,
        yearFormat = _ref2.yearFormat,
        monthFormat = _ref2.monthFormat,
        dayOfMonthSelectFormat = _ref2.dayOfMonthSelectFormat,
        dayOfMonthTableCellFormat = _ref2.dayOfMonthTableCellFormat,
        hourFormat = _ref2.hourFormat,
        minuteFormat = _ref2.minuteFormat;

    _classCallCheck(this, MonthlyCalendarCoordinator);

    this.calendarCoordinator = calendarCoordinator;
    this.yearselectValues = yearselectValues;
    this.hourselectValues = hourselectValues;
    this.minuteselectValues = minuteselectValues;
    this.yearFormat = yearFormat;
    this.monthFormat = monthFormat;
    this.dayOfMonthSelectFormat = dayOfMonthSelectFormat;
    this.dayOfMonthTableCellFormat = dayOfMonthTableCellFormat;
    this.hourFormat = hourFormat;
    this.minuteFormat = minuteFormat;
    this.dayobjects = null; // Updated in @_changeSelectedDate()

    this._initWeekdays();

    this._initMonthObjects();

    this._initYearObjects();

    this._initHourObjects();

    this._initMinuteObjects();

    this._changeSelectedDate();
  }

  _createClass(MonthlyCalendarCoordinator, [{
    key: "_sortConfigObjectsByValue",
    value: function _sortConfigObjectsByValue(configObjects) {
      var compareFunction = function compareFunction(a, b) {
        if (a.value < b.value) {
          return -1;
        }

        if (a.value > b.value) {
          return 1;
        }

        return 0;
      };

      return configObjects.sort(compareFunction);
    }
  }, {
    key: "_initWeekdays",
    value: function _initWeekdays() {
      return this.shortWeekdays = getWeekdaysShortForCurrentLocale();
    }
  }, {
    key: "_initYearObjects",
    value: function _initYearObjects() {
      var selectedYearValue = this.calendarCoordinator.shownMomentObject.year();
      var hasSelectedYearValue = false;
      var formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0
      });
      this._yearsMap = {};
      this.yearselectConfig = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.yearselectValues[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var year = _step2.value;
          var label = formatMomentObject.set({
            year: year
          }).format(this.yearFormat);
          var yearConfig = {
            value: year,
            label: label
          };
          this.yearselectConfig.push(yearConfig);
          this._yearsMap[year] = yearConfig;

          if (year === selectedYearValue) {
            hasSelectedYearValue = true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!hasSelectedYearValue) {
        // Since we do not include all years in the yearList, we need
        // to handle the case when the given datetimes year is not in the
        // list. We handle this by adding it to the end of the list.
        var label = formatMomentObject.set({
          year: selectedYearValue
        }).format(this.yearFormat);
        var yearConfig = {
          value: selectedYearValue,
          label: label
        };
        this.yearselectConfig.push(yearConfig);
        this._yearsMap[yearConfig.value] = yearConfig; // Sort the config to put the newly added config in
        // its natural place.

        return this._sortConfigObjectsByValue(this.yearselectConfig);
      }
    }
  }, {
    key: "_initMonthObjects",
    value: function _initMonthObjects() {
      var label;
      var monthObject;
      this.monthselectConfig = [];
      this._monthsMap = {};
      var formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0
      });

      for (var monthnumber = 0; monthnumber < 12; monthnumber++) {
        label = formatMomentObject.set({
          month: monthnumber
        }).format(this.monthFormat);
        monthObject = {
          value: monthnumber,
          label: label
        };
        this.monthselectConfig.push(monthObject);
        this._monthsMap[monthnumber] = monthObject;
      }
    }
  }, {
    key: "_initHourObjects",
    value: function _initHourObjects() {
      var selectedHourValue = this.calendarCoordinator.shownMomentObject.hour();
      var hasSelectedHourValue = false;
      var formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
        minute: 0,
        second: 0
      });
      this._hoursMap = {};
      this.hourselectConfig = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.hourselectValues[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var hour = _step3.value;
          var label = formatMomentObject.set({
            hour: hour
          }).format(this.hourFormat);
          var hourConfig = {
            value: hour,
            label: label
          };
          this.hourselectConfig.push(hourConfig);
          this._hoursMap[hourConfig.value] = hourConfig;

          if (hourConfig.value === selectedHourValue) {
            hasSelectedHourValue = true;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (!hasSelectedHourValue) {
        // Since we do not include all hours in the hourList, we need
        // to handle the case when the given datetimes hour is not in the
        // list. We handle this by adding it to the end of the list.
        var label = formatMomentObject.set({
          hour: selectedHourValue
        }).format(this.hourFormat);
        var hourConfig = {
          value: selectedHourValue,
          label: label
        };
        this.hourselectConfig.push(hourConfig);
        this._hoursMap[hourConfig.value] = hourConfig;
        return this._sortConfigObjectsByValue(this.hourselectConfig);
      }
    }
  }, {
    key: "_initMinuteObjects",
    value: function _initMinuteObjects() {
      var selectedMinuteValue = this.calendarCoordinator.shownMomentObject.minute();
      var hasSelectedMinuteValue = false;
      var formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
        second: 0
      });
      this._minutesMap = {};
      this.minuteselectConfig = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.minuteselectValues[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var minute = _step4.value;
          var label = formatMomentObject.set({
            minute: minute
          }).format(this.minuteFormat);
          var minuteConfig = {
            value: minute,
            label: label
          };
          this.minuteselectConfig.push(minuteConfig);
          this._minutesMap[minuteConfig.value] = minuteConfig;

          if (minuteConfig.value === selectedMinuteValue) {
            hasSelectedMinuteValue = true;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (!hasSelectedMinuteValue) {
        // Since we do not include all minutes in the minuteList, we need
        // to handle the case when the given datetimes minute is not in the
        // list. We handle this by adding it to the end of the list.
        var label = formatMomentObject.set({
          minute: selectedMinuteValue
        }).format(this.minuteFormat);
        var minuteConfig = {
          value: selectedMinuteValue,
          label: label
        };
        this.minuteselectConfig.push(minuteConfig);
        this._minutesMap[minuteConfig.value] = minuteConfig;
        return this._sortConfigObjectsByValue(this.minuteselectConfig);
      }
    }
  }, {
    key: "_setCurrentYear",
    value: function _setCurrentYear() {
      var currentYearNumber = this.calendarMonth.month.firstDayOfMonth.year();
      this.currentYearObject = this._yearsMap[currentYearNumber];

      if (this.currentYearObject == null) {
        console.warn("The given year, ".concat(currentYearNumber, " is not one of the available choices"));
      }
    }
  }, {
    key: "_setCurrentMonth",
    value: function _setCurrentMonth() {
      var currentMonthNumber = this.calendarMonth.month.firstDayOfMonth.month();
      this.currentMonthObject = this._monthsMap[currentMonthNumber];

      if (this.currentMonthObject == null) {
        console.warn("The given month number, ".concat(currentMonthNumber, " is not one of the available choices"));
      }
    }
  }, {
    key: "_setCurrentHour",
    value: function _setCurrentHour() {
      var currentHourNumber = this.calendarCoordinator.shownMomentObject.hour();
      this.currentHourObject = this._hoursMap[currentHourNumber];

      if (this.currentHourObject == null) {
        console.warn("The given hour, ".concat(currentHourNumber, " is not one of the available choices"));
      }
    }
  }, {
    key: "_setCurrentMinute",
    value: function _setCurrentMinute() {
      var currentMinuteNumber = this.calendarCoordinator.shownMomentObject.minute();
      this.currentMinuteObject = this._minutesMap[currentMinuteNumber];

      if (this.currentMinuteObject == null) {
        console.warn("The given minute, ".concat(currentMinuteNumber, " is not one of the available choices"));
      }
    }
  }, {
    key: "_updateDayObjects",
    value: function _updateDayObjects() {
      var label;
      var dayNumberObject;
      var formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
        hour: 0,
        minute: 0,
        second: 0
      });
      this.dayobjects = [];

      for (var daynumber = 1; index <= this.calendarMonth.month.getDaysInMonth(); index++) {
        label = formatMomentObject.set({
          date: daynumber
        }).format(this.dayOfMonthSelectFormat);
        dayNumberObject = {
          value: daynumber,
          label: label
        };
        this.dayobjects.push(dayNumberObject);
      }
    }
    /*
    Change month to the month containing the given momentObject,
    and select the date.
     As long as you change ``@calendarCoordinator.shownMomentObject``, this
    will update everything to mirror the change (selected day, month, year, ...).
    */

  }, {
    key: "_changeSelectedDate",
    value: function _changeSelectedDate() {
      this.calendarMonth = new CalendarMonth(this.calendarCoordinator, this.calendarCoordinator.shownMomentObject);

      this._setCurrentYear();

      this._setCurrentMonth();

      this._setCurrentHour();

      this._setCurrentMinute();

      this._updateDayObjects();

      return this.currentDayObject = this.dayobjects[this.calendarCoordinator.shownMomentObject.date() - 1];
    }
  }, {
    key: "handleDayChange",
    value: function handleDayChange(momentObject) {
      this.calendarCoordinator.shownMomentObject = momentObject.clone().set({
        hour: this.currentHourObject.value,
        minute: this.currentMinuteObject.value
      });
      return this._changeSelectedDate();
    }
  }, {
    key: "handleCurrentDayObjectChange",
    value: function handleCurrentDayObjectChange() {
      var momentObject = moment({
        year: this.currentYearObject.value,
        month: this.currentMonthObject.value,
        day: this.currentDayObject.value
      });
      return this.handleDayChange(momentObject);
    }
  }, {
    key: "handleCalendarDayChange",
    value: function handleCalendarDayChange(calendarDay) {
      return this.handleDayChange(calendarDay.momentObject);
    }
  }, {
    key: "handleCurrentMonthChange",
    value: function handleCurrentMonthChange() {
      this.calendarCoordinator.shownMomentObject.set({
        month: this.currentMonthObject.value
      });
      return this._changeSelectedDate();
    }
  }, {
    key: "handleCurrentYearChange",
    value: function handleCurrentYearChange() {
      this.calendarCoordinator.shownMomentObject.set({
        year: this.currentYearObject.value
      });
      return this._changeSelectedDate();
    }
  }, {
    key: "handleCurrentHourChange",
    value: function handleCurrentHourChange() {
      this.calendarCoordinator.shownMomentObject.set({
        hour: this.currentHourObject.value
      });
      return this._changeSelectedDate();
    }
  }, {
    key: "handleCurrentMinuteChange",
    value: function handleCurrentMinuteChange() {
      this.calendarCoordinator.shownMomentObject.set({
        minute: this.currentMinuteObject.value
      });
      return this._changeSelectedDate();
    }
  }, {
    key: "handleFocusOnCalendarDay",
    value: function handleFocusOnCalendarDay(calendarDay) {
      return this.lastFocusedMomentObject = calendarDay.momentObject;
    }
  }, {
    key: "getLastFocusedMomentObject",
    value: function getLastFocusedMomentObject() {
      if (this.lastFocusedMomentObject != null) {
        return this.lastFocusedMomentObject;
      } else {
        return this.calendarCoordinator.shownMomentObject;
      }
    }
  }, {
    key: "getDayOfMonthLabelForTableCell",
    value: function getDayOfMonthLabelForTableCell(calendarDay) {
      return calendarDay.momentObject.format(this.dayOfMonthTableCellFormat);
    }
  }, {
    key: "setToToday",
    value: function setToToday() {
      return this.handleDayChange(this.calendarCoordinator.nowMomentObject.clone());
    }
  }]);

  return MonthlyCalendarCoordinator;
}();

exports.MonthlyCalendarCoordinator = MonthlyCalendarCoordinator;