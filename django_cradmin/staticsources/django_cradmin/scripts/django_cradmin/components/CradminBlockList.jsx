import React from "react";
import CradminBlockListItem from "./CradminBlockListItem";


export default class CradminBlockList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist  blocklist--tight',
      keyAttribute: 'id',
      renderSelected: true,
      signalNameSpace: null
    }
  }

  constructor(props) {
    super(props);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminBlockList');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onStateChangeSignal = this._onStateChangeSignal.bind(this);

    this.state = {
      dataList: [],
      selectedItemsMap: new Map()
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.StateChange`,
      'django_cradmin.components.CradminBlockList',
      this._onStateChangeSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.StateChange`,
      'django_cradmin.components.CradminBlockList'
    );
  }

  render() {
    return <div className={this.props.className}>
      {this.renderItems()}
    </div>;
  }

  _onStateChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    const state = receivedSignalInfo.data.state;
    const stateChanges = receivedSignalInfo.data.stateChanges;
    if(stateChanges.has('selection') || stateChanges.has('data')) {
      this.setState({
        dataList: state.data.results,
        selectedItemsMap: state.selectedItemsMap
      });
    }
  }

  renderItem(itemKey, props) {
    return <CradminBlockListItem key={itemKey} {...props} />;
  }

  renderItems() {
    const items = [];
    for(let itemData of this.state.dataList) {
      let itemKey = itemData[this.props.keyAttribute];
      let isSelected = this.state.selectedItemsMap.has(itemKey);
      if(isSelected && !this.props.renderSelected) {
        continue;
      }
      let props = Object.assign({}, this.props.resultComponentProps, {
        data: itemData,
        isSelected: isSelected,
        signalNameSpace: this.props.signalNameSpace
      });
      items.push(this.renderItem(itemKey, props));
    }
    return items;
  }
}
