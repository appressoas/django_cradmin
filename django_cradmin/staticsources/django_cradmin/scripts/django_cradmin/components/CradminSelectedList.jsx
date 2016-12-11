import React from "react";
import CradminSelectedListItem from "./CradminSelectedListItem";


export default class CradminSelectedList extends React.Component {

  static get defaultProps() {
    return {
      className: 'selectable-list selectable-list--inline',
      keyAttribute: 'id',
      signalNameSpace: null,
      itemComponentProps: {}
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminSelectedList.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminSelectedList');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onSelectionChangeSignal = this._onSelectionChangeSignal.bind(this);
    this._onFocusOnDeSelectableItemSignal = this._onFocusOnDeSelectableItemSignal.bind(this);

    this._focusOnItemData = null;
    this.state = {
      selectedItemsMap: new Map()
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      this._name,
      this._onSelectionChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.FocusOnDeSelectableItem`,
      this._name,
      this._onFocusOnDeSelectableItemSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton()
      .removeAllSignalsFromReceiver(this._name);
  }

  render() {
    return <div className={this.props.className}>
      {this.renderItems()}
    </div>;
  }

  _onSelectionChangeSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    }
    this.setState({
      selectedItemsMap: receivedSignalInfo.data.selectedItemsMap
    });
  }

  _onFocusOnDeSelectableItemSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    }
    this._focusOnItemData = receivedSignalInfo.data;
    this.forceUpdate();
  }


  renderItem(itemKey, props) {
    return <CradminSelectedListItem key={itemKey} {...props} />;
  }

  renderItems() {
    const items = [];
    let itemKeys = Array.from(this.state.selectedItemsMap.keys());
    let previousItemData = null;
    for(let index=0; index < itemKeys.length; index++) {
      let itemKey = itemKeys[index];
      let itemData = this.state.selectedItemsMap.get(itemKey);

      let nextItemData = null;
      let isLast = index == (itemKeys.length - 1);
      if(!isLast) {
        nextItemData = this.state.selectedItemsMap.get(itemKeys[index + 1]);
      }

      let props = Object.assign({}, this.props.itemComponentProps, {
        data: itemData,
        signalNameSpace: this.props.signalNameSpace,
        previousItemData: previousItemData,
        nextItemData: nextItemData
      });
      if(this._focusOnItemData != null) {
        if(this._focusOnItemData[this.props.keyAttribute] == itemKey) {
          props.focus = true;
        }
      }
      items.push(this.renderItem(itemKey, props));
      previousItemData = itemData;
    }
    this._focusOnItemData = null;
    return items;
  }
}
