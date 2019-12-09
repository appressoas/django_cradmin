"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerAllDatetimePickerWidgets;

var _WidgetRegistrySingleton = _interopRequireDefault(require("ievv_jsbase/lib/widget/WidgetRegistrySingleton"));

var _EmbeddedDateSelectWidget = _interopRequireDefault(require("./EmbeddedDateSelectWidget"));

var _EmbeddedDateTimeSelectWidget = _interopRequireDefault(require("./EmbeddedDateTimeSelectWidget"));

var _ModalDateSelectWidget = _interopRequireDefault(require("./ModalDateSelectWidget"));

var _ModalDateTimeSelectWidget = _interopRequireDefault(require("./ModalDateTimeSelectWidget"));

var _DropdownDateTimeSelectWidget = _interopRequireDefault(require("./DropdownDateTimeSelectWidget"));

var _DropdownDateSelectWidget = _interopRequireDefault(require("./DropdownDateSelectWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Register all the cradmin widgets for datetimepicker in the ievv_jsbase WidgetRegistrySingleton.
 */
function registerAllDatetimePickerWidgets() {
  var widgetRegistry = new _WidgetRegistrySingleton.default();
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-embedded-date', _EmbeddedDateSelectWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-modal-date', _ModalDateSelectWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-dropdown-date', _DropdownDateSelectWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-embedded-datetime', _EmbeddedDateTimeSelectWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-modal-datetime', _ModalDateTimeSelectWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-dropdown-datetime', _DropdownDateTimeSelectWidget.default);
}