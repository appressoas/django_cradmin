import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import CradminDateSelectorHiddenIsoDate from "../components/CradminDateSelectorHiddenIsoDate";


export default class DateSelectorHiddenIsoDateWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    ReactDOM.render(
      <CradminDateSelectorHiddenIsoDate {...this.config} />,
      this.element
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
