import React from "react";


export default class CradminBlockList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist__item blocklist--link',
      selectedClassName: 'blocklist__item--selected',
      titleClassName: 'blocklist__itemtitle blocklist__itemtitle--small',
      descriptionClassName: '',
      isSelected: false,
      selectCallback: null
    }
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleSelect(event) {
    event.preventDefault();
    if(this.props.isSelected) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.DeSelectItem`,
        this.props.data
      );
    } else {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.SelectItem`,
        this.props.data
      );
    }
  }

  handleFocus() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Focus`
    );
  }

  handleBlur() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Blur`
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
      return this.props.data.title;
    }
  }

  get fullClassName() {
    let className = this.props.className;
    if(this.props.isSelected) {
      className = `${className} ${this.props.selectedClassName}`
    }
    return className;
  }

  render() {
    return <a href="#" className={this.fullClassName}
              onClick={this.handleSelect}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              aria-label={this.ariaTitle}
              role="button">
      {this.renderTitle()}
      {this.renderDescription()}
    </a>
  }
}
