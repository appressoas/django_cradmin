import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminSelectedList from "../components/CradminSelectedList";


export default class SelectedListWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminSelectedList uniqueId={widgetInstanceId} {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
