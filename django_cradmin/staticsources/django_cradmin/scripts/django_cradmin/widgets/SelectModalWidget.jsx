import React from "react";
import ReactDOM from "react-dom";
import AbstractSelectWidget from "./AbstractSelectWidget";
import CradminSearchModal from "../components/CradminSearchModal";


export default class SelectModalWidget extends AbstractSelectWidget {
  getDefaultConfig() {
    const defaultConfig = super.getDefaultConfig();
    defaultConfig.componentProps.modal = {};
    return defaultConfig;
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._onClick = this._onClick.bind(this);
    this._onClose = this._onClose.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  _onClick(e) {
    e.preventDefault();
    this.initializeReactComponent();
  }

  _onClose() {
    ReactDOM.unmountComponentAtNode(this._reactWrapperElement);
    this.element.focus();
  }

  onSelectResultSignal(receivedSignalInfo) {
    super.onSelectResultSignal(receivedSignalInfo);
    this._onClose();
  }

  makeReactComponentProps() {
    return Object.assign({}, this.config.componentProps.modal, super.makeReactComponentProps());
  }

  makeReactElement() {
    return <CradminSearchModal {...this.makeReactComponentProps()} />
  }

  addReactWrapperElementToDocument(reactWrapperElement) {
    window.document.body.appendChild(reactWrapperElement);
  }
}
