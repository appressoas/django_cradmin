// import DateTimePicker from "./DateTimePicker";
import MenuToggleWidget from "./widgets/MenuToggleWidget";
import ToggleableMenuWidget from "./widgets/ToggleableMenuWidget";
import TabButtonWidget from "./widgets/TabButtonWidget";
import TabPanelWidget from "./widgets/TabPanelWidget";
import SearchInputWidget from "./widgets/SearchInputWidget";
import SelectableListWidget from "./widgets/SelectableListWidget";
import SelectedListWidget from "./widgets/SelectedListWidget";
import StaticDataListWidget from "./widgets/StaticDataListWidget";
import ApiDataListWidget from "./widgets/ApiDataListWidget";
import DataListDisplayByStateWidget from "./widgets/DataListDisplayByStateWidget";
import LoadMoreWidget from "./widgets/LoadMoreWidget";
import HiddenInputListWidget from "./widgets/HiddenInputListWidget";
import SignalRouterWidget from "./widgets/SignalRouterWidget";
// import SelectModalWidget from "./widgets/SelectModalWidget.jsx";
// import SelectEmbeddedWidget from "./widgets/SelectEmbeddedWidget";


export default class DjangoCradminAll {
  constructor() {
    new window.ievv_jsbase_core.LoggerSingleton().setDefaultLogLevel(
      window.ievv_jsbase_core.LOGLEVEL.INFO);
    // this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger("ievv_jsui_demoapp.DjangoCradminAll");
    // this.logger.setLogLevel(window.ievv_jsbase_core.LOGLEVEL.DEBUG);
    // this.logger.debug(`I am a DjangoCradminAll, and I am aliiiiive!`);

    const widgetRegistry = new window.ievv_jsbase_core.WidgetRegistrySingleton();
    // widgetRegistry.registerWidgetClass('cradmin-datetime-picker', DateTimePicker);
    widgetRegistry.registerWidgetClass('cradmin-menutoggle', MenuToggleWidget);
    widgetRegistry.registerWidgetClass('cradmin-toggleable-menu', ToggleableMenuWidget);
    widgetRegistry.registerWidgetClass('cradmin-tab-button', TabButtonWidget);
    widgetRegistry.registerWidgetClass('cradmin-tab-panel', TabPanelWidget);
    // widgetRegistry.registerWidgetClass('cradmin-select-modal', SelectModalWidget);
    // widgetRegistry.registerWidgetClass('cradmin-select-embedded', SelectEmbeddedWidget);
    widgetRegistry.registerWidgetClass('cradmin-search-input', SearchInputWidget);
    widgetRegistry.registerWidgetClass('cradmin-static-data-list', StaticDataListWidget);
    widgetRegistry.registerWidgetClass('cradmin-api-data-list', ApiDataListWidget);
    widgetRegistry.registerWidgetClass('cradmin-data-list-display-by-state', DataListDisplayByStateWidget);
    widgetRegistry.registerWidgetClass('cradmin-selectable-list', SelectableListWidget);
    widgetRegistry.registerWidgetClass('cradmin-selected-list', SelectedListWidget);
    widgetRegistry.registerWidgetClass('cradmin-load-more', LoadMoreWidget);
    widgetRegistry.registerWidgetClass('cradmin-hidden-input-list', HiddenInputListWidget);
    widgetRegistry.registerWidgetClass('cradmin-signal-router', SignalRouterWidget);
    widgetRegistry.initializeAllWidgetsWithinElement(document.body);
  }
}

new DjangoCradminAll();
