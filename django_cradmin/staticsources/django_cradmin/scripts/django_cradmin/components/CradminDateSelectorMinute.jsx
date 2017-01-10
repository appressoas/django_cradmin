import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorMinute extends React.Component {
  static get defaultProps() {
    return {
      signalNameSpace: null,
      inputClassName: 'input input--inline-xxsmall input--outlined',
      extraInputAttributes: {},
      initialMinute: 0
    };
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminDateSelectorMinute.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminDateSelectorMinute');

    this.state = {
      value: this.props.initialMinute,
      disabled: true
    };
    this._handleValueChange = this._handleValueChange.bind(this);
    this._postInit = this._postInit.bind(this);
    this._initializeSignalHandlers();
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.initializeValues`,
      this._name,
      this._postInit
    );
  }

  _postInit() {
    if (!this.state.disabled) {
      return;
    }
    this.logger.debug(`Minute, afterinitializeall...`);
    this.setState({disabled: false});
    this._sendDateUpdateSignal(this.props.initialMinute);
  }

  _sendDateUpdateSignal(newMinute) {
    this.setState({value: newMinute});

    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.MinuteValueChange`, newMinute, (info) => {
        if (this.logger.isDebug) {
          this.logger.debug(`Update minute: \n\tNew minute: ${newMinute}\n\t${info}`);
        }
      });
  }

  _handleValueChange(event) {
    let newMinute = event.target.value;
    this._sendDateUpdateSignal(newMinute);
  }

  render() {
    return (
      <input value={this.state.value || ""}
             onChange={this._handleValueChange}
             className={this.props.inputClassName}
              {...this.props.extraInputAttributes}>
      </input>
    )
  }
}
