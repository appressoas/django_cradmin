import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import ElementCreator from "./utilities/ElementCreator";

import moment from 'moment';


export default class DateTimePicker extends AbstractWidget {
  constructor(element) {
    super(element);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger("ievv_jsui.DateTimePicker");
    this.logger.setLogLevel(window.ievv_jsbase_core.LOGLEVEL.DEBUG);

    this._initializeCalendarCoordinators();

    this.elementCreator = new ElementCreator();
    this._buildCalendarTable();
    this.logger.debug(`Got moment: \n`, moment);
  }

  _initializeCalendarCoordinators() {
    this.selectedMomentObject = null;
    this.nowMomentObject = moment(this.config.now);

    this.calendarCoordinator = new CalendarCoordinator({
      selectedMomentObject: this.selectedMomentObject,
      minimumDatetime: this.config.minimumDatetime,
      maximumDatetime: this.config.maximumDatetime,
      nowMomentObject: this.nowMomentObject
    });

    this.monthlyCalendarCoordinator = new MonthlyCalendarCoordinator({
      calendarCoordinator: this.calendarCoordinator,
      yearselectValues: this.config.yearselect_values,
      hourselectValues: this.config.hourselect_values,
      minuteselectValues: this.config.minuteselect_values,
      yearFormat: this.config.yearselect_momentjs_format,
      monthFormat: this.config.monthselect_momentjs_format,
      dayOfMonthSelectFormat: this.config.dayofmonthselect_momentjs_format,
      dayOfMonthTableCellFormat: this.config.dayofmonthtablecell_momentjs_format,
      hourFormat: this.config.hourselect_momentjs_format,
      minuteFormat: this.config.minuteselect_momentjs_format
    });

  }

  /**
   * Table caption must be set using HTMLTableElement.createCaption()... so cant use {@link ElementCreator} for this one
   *
   * @param {HTMLTableElement} tableElement  the table as it looks by now..
   * @returns {HTMLTableElement}  the same tableElement, only with caption set according to values from this.config
   * @private
   */
  _setupTableCaption(tableElement) {
    tableElement.createCaption();
    tableElement.caption.innerHTML = this.config.dateselectorTableScreenreaderCaptionText;
    tableElement.caption.classList.add(this.config.dateselectorTableScreenreaderCaptionCssClass);
    return tableElement;
  }

  /**
   * build a plain table row and return it
   * @returns {HTMLTableRowElement}
   * @private
   */
  _buildTableRowElement() {
    this.elementCreator.reset('tr');
    return this.elementCreator.renderElement();
  }

  /**
   * build the full table header, with a row containing days of week and such.
   *
   * @returns {HTMLTableSectionElement}
   * @private
   */
  _buildTableHeadElement() {
    this.elementCreator.reset('thead');
    const tableHead = this.elementCreator.renderElement();
    tableHead.appendChild(this._buildTableRowElement());
    //TODO: loop monthlyCalendarCoordinator.shortWeekdays and make <th> elements

    return tableHead;
  }

  _buildTableBodyElement() {
    this.elementCreator.reset('tbody');
    const tableBody = this.elementCreator.renderElement();

    return tableBody;
  }

  /**
   * Build the full calendar table element and return it
   * uses most of the other `_build...()` functions to build the actual table parts
   *
   * @returns {HTMLTableElement}
   * @private
   */
  _buildCalendarTable() {
    this.elementCreator.reset('table');
    this.elementCreator.addCssClass(this.config.tableCssClass);
    let tableElement = this.elementCreator.renderElement();
    tableElement = this._setupTableCaption(tableElement);

    tableElement.appendChild(this._buildTableHeadElement());
    tableElement.appendChild(this._buildTableBodyElement());
    this.logger.debug("got table:\n", tableElement);
    this.logger.debug("as html: \n", tableElement.outerHTML);

    return tableElement
  }

  getDefaultConfig() {
    return {
      tableCssClass: "django-cradmin-datetime-selector-table",
      dateselectorTableScreenreaderCaptionCssClass: "sr-only",
      dateselectorTableScreenreaderCaptionText: "Select date",
      now: null,
      minimumDatetime: null,
      maximumDatetime: null,
      yearselect_values: [],
      hourselect_values: [],
      minuteselect_values: [],
      yearselect_momentjs_format: "YYYY",
      monthselect_momentjs_format: "MMM",
      dayofmonthselect_momentjs_format: "DD",
      dayofmonthtablecell_momentjs_format: "D",
      hourselect_momentjs_format: "HH",
      minuteselect_momentjs_format: "mm"
    };
  }

  destroy() {

  }
}