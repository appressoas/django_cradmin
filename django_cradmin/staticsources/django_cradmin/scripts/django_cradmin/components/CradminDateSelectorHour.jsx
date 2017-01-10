import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorHour extends React.Component {
  static get defaultProps() {
    return {
      signalNameSpace: null,
      inputClassName: 'input input--inline-xxsmall input--outlined',
      inputType: 'number',
      extraInputAttributes: {},
      initialHour: 0,
    };
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminDateSelectorHour.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminDateSelectorHour');

    this.state = {
      value: this.props.initialHour,
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
    this.logger.debug(`Hour, afterinitializeall...`);
    this.setState({disabled: false});
    this._sendDateUpdateSignal(this.props.initialHour);
  }

  _sendDateUpdateSignal(newHour) {
    this.setState({value: newHour});

    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.HourValueChange`, newHour, (info) => {
        if (this.logger.isDebug) {
          this.logger.debug(`Update hour: \n\tNew hour: ${newHour}\n\t${info}`);
        }
      });
  }

  _handleValueChange(event) {
    let newHour = event.target.value;
    this._sendDateUpdateSignal(newHour);
  }

  render() {
    return (
      <input value={this.state.value || ""}
             type={this.props.inputType}
             min="0"
             max="24"
             step="1"
             onChange={this._handleValueChange}
             className={this.props.inputClassName}
              {...this.props.extraInputAttributes}>
      </input>
    )
  }
}
