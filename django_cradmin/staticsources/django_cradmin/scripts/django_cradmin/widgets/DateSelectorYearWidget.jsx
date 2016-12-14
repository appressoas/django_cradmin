import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import CradminDateSelectorYear from "../components/CradminDateSelectorYear";


export default class DateSelectorYearWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    ReactDOM.render(
      <CradminDateSelectorYear {...this.config} />,
      this.element
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element);
  }

  useAfterInitializeAllWidgets() {
    return true;
  }

  afterInitializeAllWidgets() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(`${this.config.signalNameSpace}.initializeValues`, null, (info) => {
      console.log(`Initialize all date-widgets:\n\t${info}`);
    });
  }
}
