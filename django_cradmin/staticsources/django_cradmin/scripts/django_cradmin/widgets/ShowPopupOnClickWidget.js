import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

export default class ShowPopupOnClickWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      signalNameSpace: null
    };
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._widgetInstanceId = widgetInstanceId;
    this._name = `django_cradmin.widgets.ShowPopupOnClickWidget.${widgetInstanceId}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.widgets.ShowPopupOnClickWidget');
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
  }

  _onClick(event) {
    console.log('CLICK');
    event.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.ShowPopup`);
  }
}
