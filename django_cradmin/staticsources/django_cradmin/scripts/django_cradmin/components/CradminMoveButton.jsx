import React from "react";
import DomUtilities from "../utilities/DomUtilities";


export default class CradminMoveButton extends React.Component {
  static get defaultProps() {
    return {
      label: '',
      className: 'button',
      moveDirection: null,
      itemIndex: null,
      signalNameSpace: null
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.MoveButton.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.MoveButton');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    if(this.props.moveDirection == null) {
      throw new Error('The moveDirection prop is required.');
    }
    if(this.props.itemIndex == null) {
      throw new Error('The itemIndex prop is required.');
    }
    this.signalHandler = new window.ievv_jsbase_core.SignalHandlerSingleton();
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.signalHandler.send(`${this.props.signalNameSpace}.SortableHtmlList.MoveItem${this.props.moveDirection}`, {
      itemIndex: this.props.itemIndex
    });
  }

  renderButtonContent() {
    return this.props.label;
  }

  render() {
    return <button type="button"
                   className={this.props.className}
                   onClick={this.onClick}>
      {this.renderButtonContent()}
    </button>;
  }
}
