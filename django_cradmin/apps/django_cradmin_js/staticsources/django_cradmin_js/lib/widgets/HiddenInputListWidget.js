import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminHiddenInputList from "../components/CradminHiddenInputList";


export default class HiddenInputListWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminHiddenInputList {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
