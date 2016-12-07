import React from "react";


export default class IevvSearchResult extends React.Component {

  static get defaultProps() {
    return {
      'className': 'blocklist__item blocklist--link',
      'titleClassName': 'blocklist__itemtitle blocklist__itemtitle--small',
      'descriptionClassName': ''
    }
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    event.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      this.props.selectSignalName,
      this.props.data
    );
  }

  render() {
    return <a href="#" className={this.props.className} onClick={this.handleSelect}>
      <h3 className={this.props.titleClassName}>{this.props.data.title}</h3>
      <p className={this.props.descriptionClassName}>{this.props.data.description}</p>
    </a>
  }
}
