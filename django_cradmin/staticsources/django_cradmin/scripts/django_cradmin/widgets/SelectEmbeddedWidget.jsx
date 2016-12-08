import React from "react";
import AbstractSelectWidget from "./AbstractSelectWidget";
import CradminSearchEmbedded from "../components/CradminSearchEmbedded";


export default class SelectEmbeddedWidget extends AbstractSelectWidget {
  getDefaultConfig() {
    const defaultConfig = super.getDefaultConfig();
    defaultConfig.componentProps.wrapper = {};
    return defaultConfig;
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.initializeReactComponent();
  }

  makeReactComponentProps() {
    return Object.assign({}, this.config.componentProps.wrapper, super.makeReactComponentProps());
  }

  makeReactElement() {
    return <CradminSearchEmbedded {...this.makeReactComponentProps()} />
  }
}
