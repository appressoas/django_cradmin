import React from "react";


export default class CradminSelectedListItem extends React.Component {

  static get defaultProps() {
    return {
      className: 'selectable-list__item  selectable-list__item--selected',
      contentClassName: 'selectable-list__itemcontent',
      iconWrapperClassName: 'selectable-list__icon',
      iconClassName: 'icon-close--light',
      titleTagName: 'strong',
      titleClassName: 'selectable-list__itemtitle',
      descriptionClassName: '',
      ariaTitlePrefix: 'Deselect',
      renderMode: 'TitleAndDescription',
      focusClosestSiblingOnDeSelect: true,
      focus: false,
      previousItemData: null,
      nextItemData: null
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
    if(this.props.focusClosestSiblingOnDeSelect) {
      let closestSiblingData = this.props.previousItemData;
      if(closestSiblingData == null) {
        closestSiblingData = this.props.nextItemData;
      }
      if(closestSiblingData == null) {
        new window.ievv_jsbase_core.SignalHandlerSingleton().send(
          `${this.props.signalNameSpace}.FocusOnFallback`,
          closestSiblingData
        );
      } else {
        new window.ievv_jsbase_core.SignalHandlerSingleton().send(
          `${this.props.signalNameSpace}.FocusOnDeSelectableItem`,
          closestSiblingData
        );
      }
    }

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
    return <i className={this.props.iconClassName} />;
  }

  renderIconWrapper() {
    return <div className={this.props.iconWrapperClassName}>
      {this.renderIcon()}
    </div>;
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
    return <a href="#" className={this.props.className}
              ref={(domElement) => { this._domElement = domElement; }}
              onClick={this.handleDeSelect}
              aria-label={this.ariaTitle}
              role="button">
      {this.renderContent()}
      {this.renderIconWrapper()}
    </a>
  }

  componentDidUpdate() {
    if(this.props.focus) {
      this._domElement.focus();
    }
  }
}
