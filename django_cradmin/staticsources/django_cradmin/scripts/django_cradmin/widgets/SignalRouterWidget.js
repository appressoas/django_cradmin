import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class SignalRouterWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      signalNameSpace: null,
      signalMap: {
        // - SearchDownKey
        // - FocusBeforeFirstSelectableItem
        // - FocusAfterLastSelectableItem
      }
    };
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._widgetInstanceId = widgetInstanceId;
    this._name = `django_cradmin.widgets.SignalRouterWidget.${widgetInstanceId}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.widgets.SignalRouterWidget');
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this.signalMap = new Map();
    for(let key of Object.keys(this.config.signalMap)) {
      this.signalMap.set(
        `${this.config.signalNameSpace}.${key}`,
        this.config.signalMap[key]);
    }
    this._onRouteSignal = this._onRouteSignal.bind(this);
    this._signalHandler = new window.ievv_jsbase_core.SignalHandlerSingleton();
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    for(let signalName of this.signalMap.keys()) {
      this._signalHandler.addReceiver(signalName, this._name, this._onRouteSignal);
    }
  }

  destroy() {
    this._signalHandler.removeAllSignalsFromReceiver(this._name);
  }

  _onRouteSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(
        receivedSignalInfo.toString(), receivedSignalInfo.data,
        'Sending:', this.signalMap.get(receivedSignalInfo.signalName));
    }
    for(let signalName of this.signalMap.get(receivedSignalInfo.signalName)) {
      this._signalHandler.send(`${this.config.signalNameSpace}.${signalName}`);
    }

  }
}
