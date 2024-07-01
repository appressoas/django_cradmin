import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminFilterRadioButton from "../components/CradminFilterRadioButton";


export default class FilterRadioButtonWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminFilterRadioButton {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
