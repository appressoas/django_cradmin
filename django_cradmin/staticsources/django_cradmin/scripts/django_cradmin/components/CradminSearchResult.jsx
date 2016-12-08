import React from "react";


export default class CradminSearchResult extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist__item blocklist--link',
      titleClassName: 'blocklist__itemtitle blocklist__itemtitle--small',
      descriptionClassName: ''
    }
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    event.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      this.props.selectResultSignalName,
      this.props.resultObject
    );
  }

  renderDescription() {
    if(this.props.resultObject.description && this.props.resultObject.description != '') {
      return <p className={this.props.descriptionClassName}>{this.props.resultObject.description}</p>;
    } else {
      return '';
    }
  }

  renderTitle() {
    return <h3 className={this.props.titleClassName}>{this.props.resultObject.title}</h3>
  }

  get ariaTitle() {
    if(this.props.resultObject.ariaTitle) {
      return this.props.resultObject.ariaTitle;
    } else {
      return this.props.resultObject.title;
    }
  }

  render() {
    return <a href="#" className={this.props.className}
              onClick={this.handleSelect}
              aria-label={this.ariaTitle}
              role="button">
      {this.renderTitle()}
      {this.renderDescription()}
    </a>
  }
}
