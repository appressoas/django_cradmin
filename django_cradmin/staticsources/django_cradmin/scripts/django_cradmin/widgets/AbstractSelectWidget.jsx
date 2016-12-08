import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";
import HttpDjangoJsonRequest from 'ievv_jsbase/http/HttpDjangoJsonRequest';


export default class AbstractSelectWidget extends AbstractWidget {
  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.widgets.AbstractSelectWidget');
    this._onClick = this._onClick.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onSelectResultSignal = this._onSelectResultSignal.bind(this);
    this._onSearchRequestedSignal = this._onSearchRequestedSignal.bind(this);

    this._uniquePrefix = `django_cradmin.Select.${this.widgetInstanceId}`;
    this._searchRequestedSignalName = `${this._uniquePrefix}.SearchRequested`;
    this._searchCompletedSignalName = `${this._uniquePrefix}.SearchCompleted`;
    this._selectResultSignalName = `${this._uniquePrefix}.SelectResult`;

    this.initialValue = this._getInitialValue();
    this.logger.debug(`initialValue: "${this.initialValue}"`);
    this._initializeSignalHandlers();
    this.element.addEventListener('click', this._onClick);
    if(this.initialValue != '') {
      this._loadPreviewForInitialValue();
    } else {
      this._updateUiForEmptyValue();
    }
  }

  getDefaultConfig() {
    return {
      valueAttribute: 'id',
      toggleElementsOnValueChange: {
        loading: [],
        hasValue: [],
        noValue: []
      },
      updateInnerHtmlWithResult: {},
      clientsideSearch: {},
      searchApi: {
        url: null,
        staticData: {}
      },
      componentProps: {
        search: {},
        resultList: {},
        result: {}
      }
    }
  }

  _getInitialValue() {
    if(this.config.valueTargetInputId) {
      let initialValue = document.getElementById(this.config.valueTargetInputId).value;
      if(initialValue != undefined && initialValue != null) {
        return initialValue;
      }
    } else if (this.config.initialValue) {
      return this.config.initialValue;
    }
    return '';
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this._searchRequestedSignalName,
      'django_cradmin.widgets.AbstractSelectWidget',
      this._onSearchRequestedSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this._selectResultSignalName,
      'django_cradmin.widgets.AbstractSelectWidget',
      this._onSelectResultSignal
    );
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this._searchRequestedSignalName,
      'django_cradmin.widgets.AbstractSelectWidget'
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this._selectResultSignalName,
      'django_cradmin.widgets.AbstractSelectWidget'
    );
    if(this._reactWrapperElement) {
      ReactDOM.unmountComponentAtNode(this._reactWrapperElement);
      this._reactWrapperElement.remove();
    }
  }

  _onClick(e) {
    e.preventDefault();
    this._initializeReactComponent();
  }

  _onClose() {
    ReactDOM.unmountComponentAtNode(this._reactWrapperElement);
    this.element.focus();
  }

  _setValueTargetValue(value) {
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
    for(let attribute of Object.keys(this.config.updateInnerHtmlWithResult)) {
      let domIds = this.config.updateInnerHtmlWithResult[attribute];
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

  _getValueFromResultObject(resultObject) {
    return resultObject[this.config.valueAttribute];
  }

  _setLoading() {
    this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);
    this._showElementsById(this.config.toggleElementsOnValueChange.loading);
  }

  _updateUiForEmptyValue() {
    this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.loading);
    this._showElementsById(this.config.toggleElementsOnValueChange.noValue);
    this._setValueTargetValue('');
  }

  _updateUiFromResultObject(resultObject) {
    this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);
    this._hideElementsById(this.config.toggleElementsOnValueChange.loading);
    this._showElementsById(this.config.toggleElementsOnValueChange.hasValue);
    this._setValueTargetValue(this._getValueFromResultObject(resultObject));
    this._updatePreviews(resultObject);
  }

  _onSelectResultSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString());
    let resultObject = receivedSignalInfo.data;
    if(resultObject == null) {
      this._updateUiForEmptyValue();
    } else {
      this._updateUiFromResultObject(resultObject);
    }
    this._onClose();
  }

  _useServerSideSearch() {
    return this.config.searchApi.url != undefined && this.config.searchApi.url != null;
  }

  _onSearchRequestedSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString());
    const searchString = receivedSignalInfo.data;
    if(this._useServerSideSearch()) {
      this._performServerSideSearch(searchString);
    } else {
      this._performClientSideSearch(searchString);
    }
  }

  _sendSearchCompletedSignal(resultObjectArray) {
    this.logger.debug('Search complete. Result:', resultObjectArray);
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      this._searchCompletedSignalName,
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
    for(let attribute of Object.keys(this.config.searchApi.staticData)) {
      request.urlParser.queryString.set(
        attribute, this.config.searchApi.staticData[attribute]);
    }
    request.urlParser.queryString.set('search', searchString);
    request.get()
      .then((response) => {
        this._sendSearchCompletedSignal(response.bodydata);
      })
      .catch((error) => {
        throw error;
      });
  }

  _requestSingleResultServerSide(value) {
    let url = this.config.searchApi.url;
    if(!this.config.searchApi.url.endsWith('/')) {
      url = `${url}/`;
    }
    url = `${url}${value}`;
    const request = new HttpDjangoJsonRequest(url);
    return new Promise((resolve, reject) => {
      request.get()
        .then((response) => {
          resolve(response.bodydata);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  _requestSingleResultClientSide(value) {
    return new Promise((resolve, reject) => {
      for(let resultObject of this.config.clientsideSearch.data) {
        if(this._getValueFromResultObject(resultObject) == value) {
          resolve(resultObject);
        }
      }
      reject(new Error(
        `config.clientsideSearch.data does not contain an ` +
        `object with ${this.config.valueAttribute} = "${value}"`
      ));
    });
  }

  _requestSingleResult(value) {
    if(this._useServerSideSearch()) {
      return this._requestSingleResultServerSide(value);
    } else {
      return this._requestSingleResultClientSide(value);
    }
  }

  _loadPreviewForInitialValue() {
    this._setLoading();
    this._requestSingleResult(this.initialValue)
      .then((resultObject) => {
        this.logger.debug(`Loaded data for initialValue ("${this.initialValue}"):`, resultObject);
        this._updateUiFromResultObject(resultObject);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to load data for initialValue: "${this.initialValue}". ` +
          `Error details: ${error.toString()}`);
      });
  }

  _initializeReactComponent() {
    this._reactWrapperElement = document.createElement('div');
    document.body.appendChild(this._reactWrapperElement);
    const reactElement = this.makeReactElement();
    ReactDOM.render(
      reactElement,
      this._reactWrapperElement
    );
  }

  makeReactComponentProps() {
    return {
      closeCallback: this._onClose,
      selectResultSignalName: this._selectResultSignalName,
      searchCompletedSignalName: this._searchCompletedSignalName,
      searchRequestedSignalName: this._searchRequestedSignalName,
      valueAttribute: this.config.valueAttribute,
      searchComponentProps: this.config.componentProps.search,
      resultListComponentProps: this.config.componentProps.resultList,
      resultComponentProps: this.config.componentProps.result,
    }
  }

  makeReactElement() {
    throw new Error('You must override makeReactElement()');
  }
}
