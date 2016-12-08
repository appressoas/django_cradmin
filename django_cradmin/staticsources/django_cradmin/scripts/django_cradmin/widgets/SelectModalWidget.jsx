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
    this._showHideBasedOnHasValue(this.config.initialValue);
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
      }
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
    document.getElementById(domId).setAttribute('style', 'display: none');
  }

  _showElementById(domId) {
    document.getElementById(domId).setAttribute('style', 'display: block');
  }

  _showHideBasedOnHasValue(hasValue) {
    if(hasValue) {
      if(this.config.hasValueWrapperId) {
        this._hideElementById(this.config.hasValueWrapperId);
      }
      if(this.config.noValueWrapperId) {
        this._showElementById(this.config.noValueWrapperId);
      }
    } else {
      if(this.config.noValueWrapperId) {
        this._hideElementById(this.config.noValueWrapperId);
      }
      if(this.config.hasValueWrapperId) {
        this._showElementById(this.config.hasValueWrapperId);
      }
    }
  }

  _setPreviewTitle(dataObject) {
    if(this.config.titlePreviewId && dataObject.title) {
      document.getElementById(this.config.titlePreviewId)
        .innerHTML = dataObject.title;
    }
  }

  _setPreviewDescription(dataObject) {
    if(this.config.descriptionPreviewId && dataObject.description) {
      document.getElementById(this.config.descriptionPreviewId)
        .innerHTML = dataObject.description;
    }
  }

  _handleSelectNull() {
    this.setValueTargetValue('');
  }

  _handleSelectNotNull(dataObject) {
    this.setValueTargetValue(dataObject[this.config.result.valueAttribute]);
    this._setPreviewTitle(dataObject);
    this._setPreviewDescription(dataObject);
  }

  onSelect(dataObject) {
    this._showHideBasedOnHasValue(dataObject != null);
    if(dataObject == null) {
      this._handleSelectNull();
    } else {
      this._handleSelectNotNull(dataObject);
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
    const reactElement = <IevvSearchModal {...props} />;
    ReactDOM.render(
      reactElement,
      this._modalElement
    );
  }
}
