import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminFilterCheckbox from "../components/CradminFilterCheckbox";


export default class FilterCheckboxFilter extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminFilterCheckbox {...this.config} />,);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
