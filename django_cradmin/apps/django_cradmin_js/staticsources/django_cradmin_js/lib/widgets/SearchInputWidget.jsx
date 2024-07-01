import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminSearchInput from "../components/CradminSearchInput";


export default class SearchInputWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminSearchInput {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
