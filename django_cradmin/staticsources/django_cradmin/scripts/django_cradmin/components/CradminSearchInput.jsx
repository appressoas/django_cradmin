import React from "react";


export default class CradminSearchInput extends React.Component {
  static get defaultProps() {
    return {
      changeDelay: 400,
      placeholder: 'Search ...',
      inputClassName: 'input input--outlined',
      labelClassName: 'label',
      autofocus: false,
      signalNameSpace: null
    }
  }

  constructor(props) {
    super(props);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminSearchInput');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this.handleChange = this.handleChange.bind(this);
    this.state = {searchString: ''};
  }

  handleChange(event) {
    this._cancelInputTimeout();
    this.setState({searchString: event.target.value});
    this._timeoutId = window.setTimeout(
      () => {this._onChangeDelayed()},
      this.props.changeDelay);
  }

  _cancelInputTimeout() {
    if(this._timeoutId != undefined) {
      window.clearTimeout(this._timeoutId);
    }
  }

  _onChangeDelayed() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchValueChange`,
      this.state.searchString,
      (sentSignalInfo) => {
        this.logger.debug(sentSignalInfo.toString());
      }
    );
  }

  render() {
    return <label className={this.props.labelClassName}>
      <input type="search"
                  placeholder={this.props.placeholder}
                  className={this.props.inputClassName}
                  value={this.state.searchString}
                  autoFocus={this.props.autofocus}
                  onChange={this.handleChange} />
    </label>;
  }
}
