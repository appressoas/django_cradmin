import React from "react";


export default class CradminSelectableList extends React.Component {

  static get defaultProps() {
    return {
      className: 'selectable-list__item',
      selectedClassName: 'selectable-list__item--selected',
      contentClassName: 'selectable-list__itemcontent',
      renderIcon: false,
      iconWrapperClassName: 'selectable-list__icon',
      selectedIconClassName: 'icon-check--light',
      titleTagName: 'strong',
      titleClassName: 'selectable-list__itemtitle',
      descriptionClassName: '',
      isSelected: false,
      selectCallback: null,
      setDataListFocus: true,
      renderMode: 'TitleAndDescription'
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
    if(this.props.setDataListFocus) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.Focus`
      );
    }
  }

  handleBlur() {
    if(this.props.setDataListFocus) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.Blur`
      );
    }
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

  renderTitle() {
    return React.createElement(this.props.titleTagName, {
      className: this.props.titleClassName
    }, this.props.data.title);
  }

  renderDescription() {
    if(this.props.data.description && this.props.data.description != '') {
      return <p className={this.props.descriptionClassName}>{this.props.data.description}</p>;
    } else {
      return '';
    }
  }

  renderIcon() {
    if(this.props.isSelected) {
      return <i className={this.props.selectedIconClassName} />;
    } else {
      return '';
    }
  }

  renderIconWrapper() {
    if(this.props.renderIcon) {
      return <div className={this.props.iconWrapperClassName}>
        {this.renderIcon()}
      </div>;
    } else {
      return '';
    }
  }

  renderContentModeTitleAndDescription() {
    return <div className={this.props.contentClassName}>
      {this.renderTitle()}
      {this.renderDescription()}
    </div>;
  }

  renderContentModeTitleOnly() {
    return <div className={this.props.contentClassName}>
      {this.props.data.title}
    </div>;
  }

  renderContentModeHtml() {
    return <div className={this.props.contentClassName}
                dangerouslySetInnerHTML={{__html: this.props.data.html}}></div>;
  }

  renderContent() {
    if(this.props.renderMode == 'TitleAndDescription') {
      return this.renderContentModeTitleAndDescription();
    } else if(this.props.renderMode == 'TitleOnly') {
      return this.renderContentModeTitleOnly();
    } else if(this.props.renderMode == 'html') {
      return this.renderContentModeHtml();
    } else {
      throw new Error(`Invalid renderMode: ${this.props.renderMode}`);
    }
  }


  render() {
    return <a href="#" className={this.fullClassName}
              onClick={this.handleSelect}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              aria-label={this.ariaTitle}
              role="button">
      {this.renderIconWrapper()}
      {this.renderContent()}
    </a>
  }
}
