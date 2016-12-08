import React from "react";
import AbstractSelectWidget from "./AbstractSelectWidget";
import CradminSearchModal from "../components/CradminSearchModal";


export default class SelectModalWidget extends AbstractSelectWidget {
  getDefaultConfig() {
    const defaultConfig = super.getDefaultConfig();
    defaultConfig.componentProps.modal = {};
    return defaultConfig;
  }

  makeReactComponentProps() {
    return Object.assign({}, this.config.componentProps.modal, super.makeReactComponentProps());
  }

  makeReactElement() {
    return <CradminSearchModal {...this.makeReactComponentProps()} />
  }
}
