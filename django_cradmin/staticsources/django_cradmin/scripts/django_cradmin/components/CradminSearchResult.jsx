import React from "react";


export default class CradminSearchResult extends React.Component {

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
  }

  handleSelect(event) {
    event.preventDefault();
    if(this.props.selectCallback == null) {
      throw new Error('No selectCallback specified in props.');
    }
    this.props.selectCallback(this.props.resultObject);
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
              aria-label={this.ariaTitle}
              role="button">
      {this.renderTitle()}
      {this.renderDescription()}
    </a>
  }
}
