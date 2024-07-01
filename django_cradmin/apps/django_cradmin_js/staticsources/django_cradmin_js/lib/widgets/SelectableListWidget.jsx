import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminSelectableList from "../components/CradminSelectableList";


export default class SelectableListWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminSelectableList {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
