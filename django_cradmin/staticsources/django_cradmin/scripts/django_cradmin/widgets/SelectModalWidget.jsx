import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import IevvSearchModal from "../components/IevvSearchModal";

export default class SelectModalWidget extends AbstractWidget {
  constructor(element) {
    super(element);
    this._onClick = this._onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.element.addEventListener('click', this._onClick);
    this._setLoading();
  }

  getDefaultConfig() {
    return {
      // modalCssClass: "modal",
      // backdropCssClass: "modal__backdrop",
      // contentCssClass: "modal__content",
      // closeWrapperCssClass: "modal__close",
      // closeIconCssClass: "icon-close",
      // closeButtonAriaLabel: "Close",
      // search: {
      //   placeholder: 'Søk',
      //   changeDelay: 1000
      // }
      result: {
        valueAttribute: 'id'
      },
      toggleElementsOnValueChange: {
        loading: [],
        hasValue: [],
        noValue: []
      },
      updateElementsWithResult: {}
    }
  }

  _onClick(e) {
    e.preventDefault();
    this.createModalElement();
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
    if(this._modalElement) {
      ReactDOM.unmountComponentAtNode(this._modalElement);
      this._modalElement.remove();
    }
  }

  onClose() {
    ReactDOM.unmountComponentAtNode(this._modalElement);
    this.element.focus();
  }

  setValueTargetValue(value) {
    if(this.config.valueTargetInputId) {
      document.getElementById(this.config.valueTargetInputId).value = value;
    }
  }

  _hideElementById(domId) {
    const element = document.getElementById(domId);
    if(element) {
      element.setAttribute('style', 'display: none');
    }
  }

  _showElementById(domId) {
    const element = document.getElementById(domId);
    if(element) {
      element.setAttribute('style', 'display: block');
    }
  }

  _hideElementsById(domIdArray) {
    for(let domId of domIdArray) {
      this._hideElementById(domId);
    }
  }

  _showElementsById(domIdArray) {
    for(let domId of domIdArray) {
      this._showElementById(domId);
    }
  }

  _updatePreviews(resultObject) {
    for(let attribute of Object.keys(this.config.updateElementsWithResult)) {
      let domIds = this.config.updateElementsWithResult[attribute];
      let value = resultObject[attribute];
      if(value != undefined && value != null) {
        for(let domId of domIds) {
          const element = document.getElementById(domId);
          if(element) {
            element.innerHTML = value;
          }
        }
      }
    }
  }

  _setLoading() {
    this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);
    this._showElementsById(this.config.toggleElementsOnValueChange.loading);
  }

  _handleSelectNull() {
    this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.loading);
    this._showElementsById(this.config.toggleElementsOnValueChange.noValue);
    this.setValueTargetValue('');
  }

  _handleSelectNotNull(resultObject) {
    this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.loading);
    this._showElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this.setValueTargetValue(resultObject[this.config.result.valueAttribute]);
    this._updatePreviews(resultObject);
  }

  onSelect(resultObject) {
    if(resultObject == null) {
      this._handleSelectNull();
    } else {
      this._handleSelectNotNull(resultObject);
    }
    this.onClose();
  }

  createModalElement() {
    this._modalElement = document.createElement('div');
    document.body.appendChild(this._modalElement);
    const props = Object.assign({}, this.config);
    props.closeCallback = this.onClose;
    props.selectCallback = this.onSelect;
    props.uniquePrefix = `ievv_jsui.Select.${this.widgetInstanceId}`;
    props.visibleOnLoad = false;
    const reactElement = <IevvSearchModal {...props} />;
    ReactDOM.render(
      reactElement,
      this._modalElement
    );
  }
}
