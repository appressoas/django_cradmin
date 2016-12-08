import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import CradminSearchModal from "../components/CradminSearchModal";
import HttpDjangoJsonRequest from 'ievv_jsbase/http/HttpDjangoJsonRequest';


export default class SelectModalWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.widgets.SelectModalWidget');
    this._onClick = this._onClick.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onSelectResultSignal = this._onSelectResultSignal.bind(this);
    this._onSearchRequestedSignal = this._onSearchRequestedSignal.bind(this);

    this.uniquePrefix = `django_cradmin.Select.${this.widgetInstanceId}`;
    this.searchRequestedSignalName = `${this.uniquePrefix}.SearchRequested`;
    this.searchCompletedSignalName = `${this.uniquePrefix}.SearchCompleted`;
    this.selectResultSignalName = `${this.uniquePrefix}.SelectResult`;

    this._initializeSignalHandlers();
    this.element.addEventListener('click', this._onClick);
    this._setLoading();
  }

  getDefaultConfig() {
    return {
      valueAttribute: 'id',
      toggleElementsOnValueChange: {
        loading: [],
        hasValue: [],
        noValue: []
      },
      updateElementsWithResult: {},
      clientsideSearch: {},
      searchApi: {
        url: null,
        staticData: {},
        searchParameter: "search",
        method: "get"
      },
      ui: {
        modal: {},
        search: {},
        resultList: {},
        result: {}
      }
    }
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this.searchRequestedSignalName,
      'django_cradmin.widgets.SelectModalWidget',
      this._onSearchRequestedSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this.selectResultSignalName,
      'django_cradmin.widgets.SelectModalWidget',
      this._onSelectResultSignal
    );
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this.searchRequestedSignalName,
      'django_cradmin.widgets.SelectModalWidget'
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this.selectResultSignalName,
      'django_cradmin.widgets.SelectModalWidget'
    );
    if(this._modalElement) {
      ReactDOM.unmountComponentAtNode(this._modalElement);
      this._modalElement.remove();
    }
  }

  _onClick(e) {
    e.preventDefault();
    this.createModalElement();
  }

  _onClose() {
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
    this.setValueTargetValue(resultObject[this.config.valueAttribute]);
    this._updatePreviews(resultObject);
  }

  _onSelectResultSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString());
    let resultObject = receivedSignalInfo.data;
    if(resultObject == null) {
      this._handleSelectNull();
    } else {
      this._handleSelectNotNull(resultObject);
    }
    this._onClose();
  }

  createModalElement() {
    this._modalElement = document.createElement('div');
    document.body.appendChild(this._modalElement);

    const modalProps = Object.assign({}, this.config.ui.modal, {
      closeCallback: this._onClose,
      selectResultSignalName: this.selectResultSignalName,
      searchCompletedSignalName: this.searchCompletedSignalName,
      searchRequestedSignalName: this.searchRequestedSignalName,
      valueAttribute: this.config.valueAttribute,
      ui: this.config.ui
    });

    const reactElement = <CradminSearchModal {...modalProps} />;
    ReactDOM.render(
      reactElement,
      this._modalElement
    );
  }

  _onSearchRequestedSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString());
    const searchString = receivedSignalInfo.data;
    if(this.config.searchApi.url) {
      this._performServerSideSearch(searchString);
    } else {
      this._performClientSideSearch(searchString);
    }
  }

  _sendSearchCompletedSignal(resultObjectArray) {
    this.logger.debug('Search complete. Result:', resultObjectArray);
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      this.searchCompletedSignalName,
      resultObjectArray
    );
  }

  _isClientSideSearchMatch(searchString, resultObject) {
    for(let attribute of this.config.clientsideSearch.searchAttributes) {
      if(resultObject[attribute] != undefined && resultObject[attribute] != null) {
        if(resultObject[attribute].toLowerCase().indexOf(searchString) != -1) {
          return true;
        }
      }
    }
    return false;
  }

  _performClientSideSearch(searchString) {
    const resultObjectArray = [];
    searchString = searchString.toLowerCase();
    for(let resultObject of this.config.clientsideSearch.data) {
      if(this._isClientSideSearchMatch(searchString, resultObject)) {
        resultObjectArray.push(resultObject);
      }
    }
    this._sendSearchCompletedSignal(resultObjectArray);
  }

  _performServerSideSearch(searchString) {
    const request = new HttpDjangoJsonRequest(this.config.searchApi.url);
    let data = undefined;
    if(this.config.searchApi.method == 'get') {
      for(let attribute of Object.keys(this.config.searchApi.staticData)) {
        request.urlParser.queryString.set(
          attribute, this.config.searchApi.staticData[attribute]);
      }
      request.urlParser.queryString.set(
        this.config.searchApi.searchParameter, searchString);
    } else {
      data = Object.assign({}, this.config.searchApi.staticData);
      data[this.config.searchApi.searchParameter] = searchString;
    }
    request.send(this.config.searchApi.method, data)
      .then((response) => {
        this._sendSearchCompletedSignal(response.bodydata);
      })
      .catch((error) => {
        throw error;
      });
  }
}
