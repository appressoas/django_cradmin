import React from "react";
import { createRoot } from 'react-dom/client';
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import CradminLoadMoreButton from "../components/CradminLoadMoreButton";


export default class LoadMoreButtonWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.reactRoot = createRoot(this.element);
    this.reactRoot.render(<CradminLoadMoreButton {...this.config} />);
  }

  destroy() {
    this.reactRoot.unmount();
  }
}
