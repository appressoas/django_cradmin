"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerAllCradminWidgets;

var _WidgetRegistrySingleton = _interopRequireDefault(require("ievv_jsbase/lib/widget/WidgetRegistrySingleton"));

var _MenuToggleWidget = _interopRequireDefault(require("./MenuToggleWidget"));

var _ToggleableMenuWidget = _interopRequireDefault(require("./ToggleableMenuWidget"));

var _TabButtonWidget = _interopRequireDefault(require("./TabButtonWidget"));

var _TabPanelWidget = _interopRequireDefault(require("./TabPanelWidget"));

var _SearchInputWidget = _interopRequireDefault(require("./SearchInputWidget"));

var _SelectableListWidget = _interopRequireDefault(require("./SelectableListWidget"));

var _SelectedListWidget = _interopRequireDefault(require("./SelectedListWidget"));

var _HtmlListWidget = _interopRequireDefault(require("./HtmlListWidget"));

var _StaticDataListWidget = _interopRequireDefault(require("./StaticDataListWidget"));

var _ApiDataListWidget = _interopRequireDefault(require("./ApiDataListWidget"));

var _DataListDisplayByStateWidget = _interopRequireDefault(require("./DataListDisplayByStateWidget"));

var _LoadMoreButtonWidget = _interopRequireDefault(require("./LoadMoreButtonWidget"));

var _HiddenInputListWidget = _interopRequireDefault(require("./HiddenInputListWidget"));

var _SignalRouterWidget = _interopRequireDefault(require("./SignalRouterWidget"));

var _PopUpWidget = _interopRequireDefault(require("./PopUpWidget"));

var _ShowPopupOnClickWidget = _interopRequireDefault(require("./ShowPopupOnClickWidget"));

var _HidePopupOnClickWidget = _interopRequireDefault(require("./HidePopupOnClickWidget"));

var _FilterCheckboxWidget = _interopRequireDefault(require("./FilterCheckboxWidget"));

var _FilterRadioButtonWidget = _interopRequireDefault(require("./FilterRadioButtonWidget"));

var _FilterRadioButtonWithCustomChoiceWidget = _interopRequireDefault(require("./FilterRadioButtonWithCustomChoiceWidget"));

var _AutoSubmitFormAfterCountdownWidget = _interopRequireDefault(require("./AutoSubmitFormAfterCountdownWidget"));

var _PrintOnClickWidget = _interopRequireDefault(require("./PrintOnClickWidget"));

var _DateSelectorWidget = _interopRequireDefault(require("./DateSelectorWidget"));

var _HtmlListWithMovableItemsWidget = _interopRequireDefault(require("./HtmlListWithMovableItemsWidget"));

var _GeoLocationWidget = _interopRequireDefault(require("./GeoLocationWidget"));

var _GeoLocationFilterWidget = _interopRequireDefault(require("./GeoLocationFilterWidget"));

var _GeoLocationDebugWidget = _interopRequireDefault(require("./GeoLocationDebugWidget"));

var _RotatingPlaceholderWidget = _interopRequireDefault(require("./RotatingPlaceholderWidget"));

var _FilterListWidget = _interopRequireDefault(require("./FilterListWidget"));

var _DisableFormSubmitOnEnter = _interopRequireDefault(require("./DisableFormSubmitOnEnter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Register all the cradmin widgets in the ievv_jsbase WidgetRegistrySingleton.
 */
function registerAllCradminWidgets() {
  var widgetRegistry = new _WidgetRegistrySingleton.default(); // widgetRegistry.registerWidgetClass('cradmin-datetime-picker', DateTimePicker);

  widgetRegistry.registerWidgetClass('cradmin-menutoggle', _MenuToggleWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-toggleable-menu', _ToggleableMenuWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-tab-button', _TabButtonWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-tab-panel', _TabPanelWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-search-input', _SearchInputWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-static-data-list', _StaticDataListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-api-data-list', _ApiDataListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-data-list-display-by-state', _DataListDisplayByStateWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-selectable-list', _SelectableListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-selected-list', _SelectedListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-html-list', _HtmlListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-html-list-with-movable-items', _HtmlListWithMovableItemsWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-load-more-button', _LoadMoreButtonWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-hidden-input-list', _HiddenInputListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-signal-router', _SignalRouterWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-popup', _PopUpWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-show-popup', _ShowPopupOnClickWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-hide-popup', _HidePopupOnClickWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-filter-checkbox', _FilterCheckboxWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-filter-radio-button', _FilterRadioButtonWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-filter-radio-button-with-custom-choice', _FilterRadioButtonWithCustomChoiceWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-dateselector', _DateSelectorWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-auto-submit-form-after-countdown', _AutoSubmitFormAfterCountdownWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-print-on-click', _PrintOnClickWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-geolocation', _GeoLocationWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-geolocation-debug', _GeoLocationDebugWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-geolocation-filter', _GeoLocationFilterWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-rotating-placeholder', _RotatingPlaceholderWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-filterlist', _FilterListWidget.default);
  widgetRegistry.registerWidgetClass('cradmin-disable-form-submit-on-enter', _DisableFormSubmitOnEnter.default);
}