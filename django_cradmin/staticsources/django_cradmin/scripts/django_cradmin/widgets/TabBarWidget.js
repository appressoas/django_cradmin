import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

export default class TabBarWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      id: 'default',
      tabClass: "tabs__tab",
      activeTabClass: "tabs__tab--active"
    }
  }

  constructor(element) {
    super(element);
    this._tabButtonElements = this._getAllTabButtonElements();
    this._onClickTabButton = this._onClickTabButton.bind(this);
    this._addEventListeners();
  }

  _getAllTabButtonElements() {
    return Array.from(this.element.querySelectorAll(`.${this.config.tabClass}`));
  }

  _addEventListeners() {
    for(let tabButtonElement of this._tabButtonElements) {
      tabButtonElement.addEventListener('click', this._onClickTabButton);
    }
  }

  _removeEventListeners() {
    for(let tabButtonElement of this._tabButtonElements) {
      tabButtonElement.removeEventListener('click', this._onClickTabButton);
    }
  }

  _onClickTabButton(event) {
    event.preventDefault();
    const tabPanelId = event.target.getAttribute('href').substring(1);
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `cradmin.ActivateTab.${this.config.id}`,
      {tabPanelId: tabPanelId}
    );
  }

  destroy() {
    this._removeEventListeners();
  }
}
