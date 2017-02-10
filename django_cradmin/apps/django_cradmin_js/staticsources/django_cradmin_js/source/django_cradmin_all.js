import "babel-polyfill";
import "ievv_jsbase/lib/polyfill/all";

import LoggerSingleton from "ievv_jsbase/lib/log/LoggerSingleton";
import LOGLEVEL from "ievv_jsbase/lib/log/loglevel";
import WidgetRegistrySingleton from "ievv_jsbase/lib/widget/WidgetRegistrySingleton";
import registerAllCradminWidgets from "./widgets/registerAllCradminWidgets";

export default class DjangoCradminAll {
  constructor() {
    new LoggerSingleton().setDefaultLogLevel(LOGLEVEL.INFO);
    registerAllCradminWidgets();

    const widgetRegistry = new WidgetRegistrySingleton();
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
