import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminDateSelector from "../components/CradminDateSelector";
import SignalHandlerSingleton from "ievv_jsbase/lib/SignalHandlerSingleton";


export default class DateSelectorWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminDateSelector {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }

  useAfterInitializeAllWidgets() {
    return true;
  }

  afterInitializeAllWidgets() {
    new SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.initializeValues`);
  }
}
