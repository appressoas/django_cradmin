import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

export default class TabPanelWidget extends AbstractWidget {

  getDefaultConfig() {
    return {
      id: 'defaultTab',
      activeClass: "tabs__panel--active"
    }
  }

  constructor(element) {
    super(element);
    if(!this._domId) {
      throw new Error('A TabPanelWidget element must have an id attribute.');
    }
    this._onActivateTabSignal = this._onActivateTabSignal.bind(this);
    this._initializeSignalHandlers();
  }

  get _domId() {
    return this.element.getAttribute('id');
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `cradmin.ActivateTab.${this.config.id}`,
      `cradmin.TabPanelWidget.${this.config.id}.${this._domId}`,
      this._onActivateTabSignal
    );
  }

  destroy() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `cradmin.ActivateTab.${this.config.id}`,
      `cradmin.TabPanel.${this.config.id}.${this._domId}`
    );
  }

  _hasActiveClass() {
    return this.element.classList.contains(this.config.activeClass);
  }

  _isAriaHidden() {
    return this.element.getAttribute('aria-hidden') == 'true';
  }

  _activate() {
    if(!this._hasActiveClass()) {
      this.element.classList.add(this.config.activeClass);
    }
    if(this._isAriaHidden()) {
      this.element.setAttribute('aria-hidden', 'false');
    }
  }

  _deactivate() {
    if(this._hasActiveClass()) {
      this.element.classList.remove(this.config.activeClass);
    }
    if(!this._isAriaHidden()) {
      this.element.setAttribute('aria-hidden', 'true');
    }
  }

  _onActivateTabSignal(receivedSignalInfo) {
    const tabPanelDomId = receivedSignalInfo.data.tabPanelDomId;
    if(this._domId == tabPanelDomId) {
      this._activate();
    } else {
      this._deactivate();
    }
  }

  initializeFromTabButton(isActive, tabButtonDomId) {
    this.element.setAttribute('aria-labelledby', tabButtonDomId);
    if(isActive) {
      this._activate();
    } else {
      this._deactivate();
    }
  }
}
