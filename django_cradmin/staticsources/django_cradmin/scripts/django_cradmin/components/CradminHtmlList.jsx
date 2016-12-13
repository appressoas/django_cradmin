import React from "react";
import ReactDOM from "react-dom";


export default class CradminHtmlList extends React.Component {

  static get defaultProps() {
    return {
      className: 'selectable-list',
      keyAttribute: 'id',
      signalNameSpace: null,
      htmlAttribute: 'html',
      wrapContentsHtmlTagName: 'div',
      loadMoreTreshold: 3
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminHtmlList.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminHtmlList');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onDataChangeSignal = this._onDataChangeSignal.bind(this);

    this.state = {
      dataList: [],
      hasMorePages: false,
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DataChange`,
      this._name,
      this._onDataChangeSignal
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
    if(this.state.hasMorePages && this.state.dataList.length < this.props.loadMoreTreshold) {
      this.logger.debug('Automatically sending the LoadMore signal because we are below the loadMoreTreshold');
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMore`);
    }
  }

  _onDataChangeSignal(receivedSignalInfo) {
    if(this.logger.isDebug) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    }
    const dataList = receivedSignalInfo.data.results;
    this.setState({
      dataList: dataList,
      hasMorePages: receivedSignalInfo.data.next != null
    });
    this._loadMoreIfNeeded();
  }

  renderItem(itemKey, itemData) {
    return React.createElement(
      this.props.wrapContentsHtmlTagName,
      {
        key: itemKey,
        className: this.props.itemClassName,
        dangerouslySetInnerHTML: {__html: itemData[this.props.htmlAttribute]}
      }
    );
  }

  renderItems() {
    const items = [];
    for(let itemData of this.state.dataList) {
      let itemKey = itemData[this.props.keyAttribute];
      items.push(this.renderItem(itemKey, itemData));
    }
    return items;
  }
}
