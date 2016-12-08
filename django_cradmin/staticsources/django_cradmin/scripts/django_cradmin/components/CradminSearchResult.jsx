import React from "react";


export default class CradminSearchResult extends React.Component {

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
      this.props.resultObject
    );
  }

  render() {
    return <a href="#" className={this.props.className}
              onClick={this.handleSelect}
              aria-label={this.props.resultObject.title}
              role="button">
      <h3 className={this.props.titleClassName}>{this.props.resultObject.title}</h3>
      <p className={this.props.descriptionClassName}>{this.props.resultObject.description}</p>
    </a>
  }
}
