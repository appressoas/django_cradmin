import React from "react";
import CradminSelectableListItem from "./CradminSelectableListItem";


export default class CradminSelectableList extends React.Component {

  static get defaultProps() {
    return {
      className: 'selectable-list',
      keyAttribute: 'id',
      renderSelected: true,
      signalNameSpace: null,
      itemComponentProps: {},
      loadMoreTreshold: 3
    }
  }

  constructor(props) {
    super(props);
    this._name = 'django_cradmin.components.CradminSelectableList';
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this._name);
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onDataChangeSignal = this._onDataChangeSignal.bind(this);
    this._onSelectionChangeSignal = this._onSelectionChangeSignal.bind(this);

    this.renderedItemCount = 0;
    this.state = {
      dataList: [],
      hasMorePages: false,
      selectedItemsMap: new Map()
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DataChange`,
      this._name,
      this._onDataChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      this._name,
      this._onSelectionChangeSignal
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

  _loadMoreIfNeeded() {
    if(this.state.hasMorePages && this.renderedItemCount < this.props.loadMoreTreshold) {
      this.logger.debug('Automatically sending the LoadMore signal because we are below the loadMoreTreshold');
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMore`);
    }
  }

  _onDataChangeSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    }
    this.setState({
      dataList: receivedSignalInfo.data.results,
      hasMorePages: receivedSignalInfo.data.next != null
    });
    this._loadMoreIfNeeded();
  }

  _onSelectionChangeSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    }
    this.setState({
      selectedItemsMap: receivedSignalInfo.data.selectedItemsMap
    });
    this._loadMoreIfNeeded();
  }

  renderItem(itemKey, props) {
    return <CradminSelectableListItem key={itemKey} {...props} />;
  }

  renderItems() {
    const items = [];
    let renderedItemCount = 0;
    for(let itemData of this.state.dataList) {
      let itemKey = itemData[this.props.keyAttribute];
      let isSelected = this.state.selectedItemsMap.has(itemKey);
      if(isSelected && !this.props.renderSelected) {
        continue;
      }
      let props = Object.assign({}, this.props.itemComponentProps, {
        data: itemData,
        isSelected: isSelected,
        signalNameSpace: this.props.signalNameSpace
      });
      items.push(this.renderItem(itemKey, props));
      renderedItemCount ++;
    }
    this.renderedItemCount = renderedItemCount;
    return items;
  }
}
