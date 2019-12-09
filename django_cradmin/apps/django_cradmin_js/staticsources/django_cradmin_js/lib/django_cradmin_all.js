"use strict";

require("ievv_jsbase/lib/polyfill/all");

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _loglevel = _interopRequireDefault(require("ievv_jsbase/lib/log/loglevel"));

var _WidgetRegistrySingleton = _interopRequireDefault(require("ievv_jsbase/lib/widget/WidgetRegistrySingleton"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _registerAllCradminWidgets = _interopRequireDefault(require("./widgets/registerAllCradminWidgets"));

var _setupDefaultListRegistry = _interopRequireDefault(require("./filterlist/setupDefaultListRegistry"));

var _registerAllDatetimePickerWidgets = _interopRequireDefault(require("./datetimepicker/widgets/registerAllDatetimePickerWidgets"));

var _registerAllHtml5DatetimePickerWidgets = _interopRequireDefault(require("./html5datetimepicker/widgets/registerAllHtml5DatetimePickerWidgets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _onDomReady() {
  new _LoggerSingleton.default().setDefaultLogLevel(_loglevel.default.INFO);
  (0, _registerAllCradminWidgets.default)();
  (0, _registerAllDatetimePickerWidgets.default)();
  (0, _registerAllHtml5DatetimePickerWidgets.default)();
  (0, _setupDefaultListRegistry.default)();
  var widgetRegistry = new _WidgetRegistrySingleton.default();
  widgetRegistry.initializeAllWidgetsWithinElement(document.body);
  widgetRegistry.initializeAllWidgetsWithinElement(document.body);
}

if (document.readyState !== 'loading') {
  _onDomReady();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    _onDomReady();
  });
}