import React from "react";
import CradminBlockListItem from "./CradminBlockListItem";


export default class CradminBlockList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist  blocklist--tight',
      keyAttribute: 'id',
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
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onDataChangeSignal = this._onDataChangeSignal.bind(this);
    this._onSelectionChangeSignal = this._onSelectionChangeSignal.bind(this);

    this.state = {
      dataList: [],
      selectedItemsMap: new Map()
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DataListInitialized`,
      'django_cradmin.components.CradminBlockList',
      this._onDataListInitializedSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DataChange`,
      'django_cradmin.components.CradminBlockList',
      this._onDataChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      'django_cradmin.components.CradminBlockList',
      this._onSelectionChangeSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.DataChange`,
      'django_cradmin.components.CradminBlockList'
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      'django_cradmin.components.CradminBlockList'
    );
  }

  render() {
    return <div className={this.props.className}>
      {this.renderItems()}
    </div>;
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    const state = receivedSignalInfo.data;
    this.setState({
      dataList: state.data.results
    });
  }

  _onDataChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this.setState({
      dataList: receivedSignalInfo.data.results
    });
  }

  _onSelectionChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this.setState({
      selectedItemsMap: receivedSignalInfo.data.selectedItemsMap
    });
  }

  renderItem(itemKey, props) {
    return <CradminBlockListItem key={itemKey} {...props} />;
  }

  renderItems() {
    const items = [];
    for(let itemData of this.state.dataList) {
      let itemKey = itemData[this.props.keyAttribute];
      let isSelected = this.state.selectedItemsMap.has(itemKey);
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
