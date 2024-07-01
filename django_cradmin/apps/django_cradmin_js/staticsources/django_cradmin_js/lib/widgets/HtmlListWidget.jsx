import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminHtmlList from "../components/CradminHtmlList";


export default class HtmlListWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminHtmlList {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
