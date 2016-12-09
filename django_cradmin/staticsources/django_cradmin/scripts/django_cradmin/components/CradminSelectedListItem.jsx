import React from "react";


export default class CradminSelectedListItem extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist__item blocklist--link  blocklist__item--selected',
      titleClassName: 'blocklist__itemtitle blocklist__itemtitle--large',
      descriptionClassName: '',
      ariaTitlePrefix: 'Deselect'
    }
  }

  constructor(props) {
    super(props);
    this.handleDeSelect = this.handleDeSelect.bind(this);
  }

  handleDeSelect(event) {
    event.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.DeSelectItem`,
      this.props.data
    );
  }

  renderDescription() {
    if(this.props.data.description && this.props.data.description != '') {
      return <p className={this.props.descriptionClassName}>{this.props.data.description}</p>;
    } else {
      return '';
    }
  }

  renderTitle() {
    return <h3 className={this.props.titleClassName}>{this.props.data.title}</h3>
  }

  get ariaTitle() {
    if(this.props.data.ariaTitle) {
      return this.props.data.ariaTitle;
    } else {
      let ariaTitle = this.props.data.title;
      if(this.props.ariaTitlePrefix) {
        ariaTitle = `${this.props.ariaTitlePrefix} ${ariaTitle}`;
      }
      return ariaTitle;
    }
  }

  render() {
    return <a href="#" className={this.props.className}
              onClick={this.handleDeSelect}
              aria-label={this.ariaTitle}
              role="button">
      {this.renderTitle()}
      {this.renderDescription()}
    </a>
  }
}
