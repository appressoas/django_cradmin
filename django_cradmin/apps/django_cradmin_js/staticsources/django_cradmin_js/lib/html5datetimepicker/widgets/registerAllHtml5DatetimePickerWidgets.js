"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerAllDatetimePickerWidgets;

var _WidgetRegistrySingleton = _interopRequireDefault(require("ievv_jsbase/lib/widget/WidgetRegistrySingleton"));

var _Html5DateInputWidget = _interopRequireDefault(require("./Html5DateInputWidget"));

var _Html5TimeInputWidget = _interopRequireDefault(require("./Html5TimeInputWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Register all the cradmin widgets for datetimepicker in the ievv_jsbase WidgetRegistrySingleton.
 */
function registerAllDatetimePickerWidgets() {
  var widgetRegistry = new _WidgetRegistrySingleton.default();
  widgetRegistry.registerWidgetClass('cradmin-html5-datepicker', _Html5DateInputWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-html5-timepicker', _Html5TimeInputWidget.default);
}