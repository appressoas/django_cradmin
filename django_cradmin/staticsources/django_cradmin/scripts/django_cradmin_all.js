// import DateTimePicker from "./DateTimePicker";
import "babel-polyfill";
import "ievv_jsbase/lib/polyfill/all";

import LoggerSingleton from "ievv_jsbase/lib/log/LoggerSingleton";
import LOGLEVEL from "ievv_jsbase/lib/log/loglevel";
import WidgetRegistrySingleton from "ievv_jsbase/lib/widget/WidgetRegistrySingleton";
import MenuToggleWidget from "./widgets/MenuToggleWidget";
import ToggleableMenuWidget from "./widgets/ToggleableMenuWidget";
import TabButtonWidget from "./widgets/TabButtonWidget";
import TabPanelWidget from "./widgets/TabPanelWidget";
import SearchInputWidget from "./widgets/SearchInputWidget";
import SelectableListWidget from "./widgets/SelectableListWidget";
import SelectedListWidget from "./widgets/SelectedListWidget";
import HtmlListWidget from "./widgets/HtmlListWidget";
import StaticDataListWidget from "./widgets/StaticDataListWidget";
import ApiDataListWidget from "./widgets/ApiDataListWidget";
import DataListDisplayByStateWidget from "./widgets/DataListDisplayByStateWidget";
import LoadMoreButtonWidget from "./widgets/LoadMoreButtonWidget";
import HiddenInputListWidget from "./widgets/HiddenInputListWidget";
import SignalRouterWidget from "./widgets/SignalRouterWidget";
import PopUpWidget from "./widgets/PopUpWidget";
import ShowPopupOnClickWidget from "./widgets/ShowPopupOnClickWidget";
import HidePopupOnClickWidget from "./widgets/HidePopupOnClickWidget";
import FilterCheckboxFilter from "./widgets/FilterCheckboxWidget";
import FilterRadioButtonWidget from "./widgets/FilterRadioButtonWidget";
import FilterRadioButtonWithCustomChoiceWidget from "./widgets/FilterRadioButtonWithCustomChoiceWidget";
import AutoSubmitFormAfterCountdownWidget from "./widgets/AutoSubmitFormAfterCountdownWidget";
import PrintOnClickWidget from "./widgets/PrintOnClickWidget";
import DateSelectorWidget from "./widgets/DateSelectorWidget";
import HtmlListWithMovableItemsWidget from "./widgets/HtmlListWithMovableItemsWidget";
import GeoLocationWidget from './widgets/GeoLocationWidget';
import GeoLocationFilterWidget from './widgets/GeoLocationFilterWidget';


export default class DjangoCradminAll {
  constructor() {
    new LoggerSingleton().setDefaultLogLevel(LOGLEVEL.INFO);
    // this.logger = new LoggerSingleton().getLogger("ievv_jsui_demoapp.DjangoCradminAll");
    // this.logger.setLogLevel(window.ievv_jsbase_core.LOGLEVEL.INFO);
    // this.logger.debug(`I am a DjangoCradminAll, and I am aliiiiive!`);

    const widgetRegistry = new WidgetRegistrySingleton();
    // widgetRegistry.registerWidgetClass('cradmin-datetime-picker', DateTimePicker);
    widgetRegistry.registerWidgetClass('cradmin-menutoggle', MenuToggleWidget);
    widgetRegistry.registerWidgetClass('cradmin-toggleable-menu', ToggleableMenuWidget);
    widgetRegistry.registerWidgetClass('cradmin-tab-button', TabButtonWidget);
    widgetRegistry.registerWidgetClass('cradmin-tab-panel', TabPanelWidget);
    widgetRegistry.registerWidgetClass('cradmin-search-input', SearchInputWidget);
    widgetRegistry.registerWidgetClass('cradmin-static-data-list', StaticDataListWidget);
    widgetRegistry.registerWidgetClass('cradmin-api-data-list', ApiDataListWidget);
    widgetRegistry.registerWidgetClass('cradmin-data-list-display-by-state', DataListDisplayByStateWidget);
    widgetRegistry.registerWidgetClass('cradmin-selectable-list', SelectableListWidget);
    widgetRegistry.registerWidgetClass('cradmin-selected-list', SelectedListWidget);
    widgetRegistry.registerWidgetClass('cradmin-html-list', HtmlListWidget);
    widgetRegistry.registerWidgetClass('cradmin-html-list-with-movable-items', HtmlListWithMovableItemsWidget);
    widgetRegistry.registerWidgetClass('cradmin-load-more-button', LoadMoreButtonWidget);
    widgetRegistry.registerWidgetClass('cradmin-hidden-input-list', HiddenInputListWidget);
    widgetRegistry.registerWidgetClass('cradmin-signal-router', SignalRouterWidget);
    widgetRegistry.registerWidgetClass('cradmin-popup', PopUpWidget);
    widgetRegistry.registerWidgetClass('cradmin-show-popup', ShowPopupOnClickWidget);
    widgetRegistry.registerWidgetClass('cradmin-hide-popup', HidePopupOnClickWidget);
    widgetRegistry.registerWidgetClass('cradmin-filter-checkbox', FilterCheckboxFilter);
    widgetRegistry.registerWidgetClass('cradmin-filter-radio-button', FilterRadioButtonWidget);
    widgetRegistry.registerWidgetClass('cradmin-filter-radio-button-with-custom-choice', FilterRadioButtonWithCustomChoiceWidget);
    widgetRegistry.registerWidgetClass('cradmin-dateselector', DateSelectorWidget);
    widgetRegistry.registerWidgetClass('cradmin-auto-submit-form-after-countdown', AutoSubmitFormAfterCountdownWidget);
    widgetRegistry.registerWidgetClass('cradmin-print-on-click', PrintOnClickWidget);
    widgetRegistry.registerWidgetClass('cradmin-geolocation', GeoLocationWidget);
    widgetRegistry.registerWidgetClass('cradmin-geolocation-filter', GeoLocationFilterWidget);

    if (document.readyState != 'loading'){
      widgetRegistry.initializeAllWidgetsWithinElement(document.body);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        widgetRegistry.initializeAllWidgetsWithinElement(document.body);
      });
    }
  }
}

new DjangoCradminAll();
