import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminHtmlListWithMovableItems from "../components/CradminHtmlListWithMovableItems";


export default class HtmlListWithMovableItemsWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminHtmlListWithMovableItems {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
