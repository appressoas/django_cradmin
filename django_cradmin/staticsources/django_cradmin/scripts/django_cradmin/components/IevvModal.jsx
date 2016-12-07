import React from "react";


export default class IevvModal extends React.Component {
  static get defaultProps() {
    return {
      modalCssClass: "modal",
      backdropCssClass: "modal__backdrop",
      contentCssClass: "modal__content",
      closeWrapperCssClass: "modal__close",
      closeIconCssClass: "icon-close",
      closeButtonAriaLabel: "Close"
    }
  }

  renderModalContent() {
    return <em>You should override renderModalContent() to put content here!</em>
  }

  render() {
    return <div className={this.props.modalCssClass}>
      <div className={this.props.backdropCssClass}></div>

      <div className={this.props.contentCssClass}>
        <div className={this.props.closeWrapperCssClass}>
          <button type="button" aria-label={this.props.closeButtonAriaLabel}
                  onClick={() => this.close()}>
            <i className={this.props.closeIconCssClass}></i>
          </button>
        </div>

        {this.renderModalContent()}
      </div>
    </div>;
  }

  close() {
    this.props.closeCallback();
  }
}
