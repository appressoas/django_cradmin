import React from "react";
import CradminSelectedListItem from "./CradminSelectedListItem";


export default class CradminSelectedList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist  blocklist--tight',
      keyAttribute: 'id',
      signalNameSpace: null,
      itemComponentProps: {}
    }
  }

  constructor(props) {
    super(props);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminSelectedList');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onSelectionChangeSignal = this._onSelectionChangeSignal.bind(this);

    this.state = {
      selectedItemsMap: new Map()
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      'django_cradmin.components.CradminSelectedList',
      this._onSelectionChangeSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.SelectionChange`,
      'django_cradmin.components.CradminSelectedList'
    );
  }

  render() {
    return <div className={this.props.className}>
      {this.renderItems()}
    </div>;
  }

  _onSelectionChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this.setState({
      selectedItemsMap: receivedSignalInfo.data.selectedItemsMap
    });
  }

  renderItem(itemKey, props) {
    return <CradminSelectedListItem key={itemKey} {...props} />;
  }

  renderItems() {
    const items = [];
    for(let [itemKey, itemData] of this.state.selectedItemsMap) {
      let props = Object.assign({}, this.props.itemComponentProps, {
        data: itemData,
        signalNameSpace: this.props.signalNameSpace
      });
      items.push(this.renderItem(itemKey, props));
    }
    return items;
  }
}
