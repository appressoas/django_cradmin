import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import CradminDateSelectorHiddenIsoDateTime from "../components/CradminDateSelectorHiddenIsoDateTime";


export default class DateSelectorHiddenIsoDateTimeWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    ReactDOM.render(
      <CradminDateSelectorHiddenIsoDateTime {...this.config} />,
      this.element
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
