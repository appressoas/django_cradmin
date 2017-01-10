import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorYear extends React.Component {
  static get defaultProps() {
    let initialYear = new Date().getUTCFullYear();
    return {
      signalNameSpace: null,
      labelCssClass: "",
      extraSelectProperties: {},
      labelText: "Year",
      minYear: initialYear - 10,
      maxYear: initialYear + 50,
      initialYear: initialYear
    };
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminDateSelectorYear.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminDateSelectorYear');

    this._handleYearChange = this._handleYearChange.bind(this);
    this._postInit = this._postInit.bind(this);
    this.state = {value: 0, disabled: true};

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
    this.setState({disabled: false});
    this._sendDateUpdateSignal(this.props.initialYear)
  }

  _sendDateUpdateSignal(newYear) {
    this.setState({value: newYear});

    if (newYear == 0) {
      newYear = null;
    }

    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.YearValueChange`, newYear, (info) => {
        if (this.logger.isDebug) {
          this.logger.debug(`Update year: \n\tNew year: ${newYear}\n\t${info}`);
        }
      });
  }

  _handleYearChange(event) {
    let newYear = event.target.value;
    this._sendDateUpdateSignal(newYear);
  }

  renderOptions() {
    if (this.state.disabled) {
      return [];
    }
    let yearOptions = [
      <option key={`${this._name}.yearOption.0`} value={0}>{this.props.labelText}</option>
    ];
    for (let year = this.props.minYear; year <= this.props.maxYear; year++) {
      yearOptions.push(
        <option key={`${this._name}.yearOption.${year}`} value={year}>{year}</option>
      );
    }

    return yearOptions
  }

  render() {
    return (
      <label className={this.props.labelCssClass}>
        <select value={this.state.value || 0}
                onChange={this._handleYearChange}
                disabled={this.state.disabled}
                {...this.props.extraSelectProperties}>
          {this.renderOptions()}
        </select>
      </label>
    )
  }
}
