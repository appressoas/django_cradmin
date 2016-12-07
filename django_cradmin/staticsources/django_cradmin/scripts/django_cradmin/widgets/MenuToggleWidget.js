import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

export default class MenuToggleWidget extends AbstractWidget {
  constructor(element) {
    super(element);
    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  getDefaultConfig() {
    return {
      id: 'mainmenu'
    }
  }

  _onClick(e) {
    e.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `cradmin.ToggleMenu.${this.config.id}`
    );
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
  }
}
