import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminFilterRadioButtonWithCustomChoice from "../components/CradminFilterRadioButtonWithCustomChoice";


export default class FilterRadioButtonWithCustomChoiceWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminFilterRadioButtonWithCustomChoice {...this.config} />,);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
