// import DateTimePicker from "./DateTimePicker";
import SelectModalWidget from "./widgets/SelectModalWidget.jsx";


export default class DjangoCradminAll {
  constructor() {
    // this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger("ievv_jsui_demoapp.DjangoCradminAll");
    // this.logger.setLogLevel(window.ievv_jsbase_core.LOGLEVEL.DEBUG);
    // this.logger.debug(`I am a DjangoCradminAll, and I am aliiiiive!`);

    const widgetRegistry = new window.ievv_jsbase_core.WidgetRegistrySingleton();
    // widgetRegistry.registerWidgetClass('cradmin-datetime-picker', DateTimePicker);
    widgetRegistry.registerWidgetClass('cradmin-select-modal', SelectModalWidget);
    widgetRegistry.initializeAllWidgetsWithinElement(document.body);
  }
}

new DjangoCradminAll();
