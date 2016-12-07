import React from "react";


export default class IevvSearch extends React.Component {

  static get defaultProps() {
    return {
      'changeDelay': 200,
      'placeholder': 'Search ...',
      'inputClassName': 'input input--outlined',
      'labelClassName': 'label',
      'autofocus': false
    }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }

  handleChange(event) {
    this._cancelInputTimeout();
    this.setState({value: event.target.value});
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
      this.props.searchSignalName,
      this.state.value
    );
  }

  render() {
    return <label className={this.props.labelClassName}>
      <input type="search"
                  placeholder={this.props.placeholder}
                  className={this.props.inputClassName}
                  value={this.state.value}
                  autoFocus={this.props.autofocus}
                  onChange={this.handleChange} />
    </label>;
  }
}
