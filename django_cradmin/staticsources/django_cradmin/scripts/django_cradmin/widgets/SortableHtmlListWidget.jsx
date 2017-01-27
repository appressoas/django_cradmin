import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import CradminSortableHtmlList from "../components/CradminSortableHtmlList";


export default class SortableHtmlListWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    ReactDOM.render(
      <CradminSortableHtmlList {...this.config} />,
      this.element
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
