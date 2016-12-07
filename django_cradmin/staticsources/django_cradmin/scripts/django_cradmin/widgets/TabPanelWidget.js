import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

export default class TabPanelWidget extends AbstractWidget {

  getDefaultConfig() {
    return {
      id: 'default',
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
      `cradmin.TabPanel.${this.config.id}.${this._domId}`,
      this._onActivateTabSignal
    );
  }

  _hasActiveClass() {
    return this.element.classList.contains(this.config.activeClass);
  }

  _activate() {
    if(!this._hasActiveClass()) {
      this.element.classList.add(this.config.activeClass);
    }
  }

  _deactivate() {
    if(this._hasActiveClass()) {
      this.element.classList.remove(this.config.activeClass);
    }
  }

  _onActivateTabSignal(receivedSignalInfo) {
    const tabPanelId = receivedSignalInfo.data.tabPanelId;
    if(this._domId == tabPanelId) {
      this._activate();
    } else {
      this._deactivate();
    }

  }

  destroy() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `cradmin.ActivateTab.${this.config.id}`,
      `cradmin.TabPanel.${this.config.id}.${this._domId}`
    );
  }
}
