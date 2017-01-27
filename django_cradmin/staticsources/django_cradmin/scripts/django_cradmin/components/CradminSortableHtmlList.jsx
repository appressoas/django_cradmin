import React from "react";
import ReactDOM from "react-dom";
import CradminMoveButton from "./CradminMoveButton";


export default class SortableCradminHtmlList extends React.Component {

  static get defaultProps() {
    return {
      className: '',
      itemClassName: '',
      itemContentClassName: '',
      itemSortContainerClassName: '',
      sortUpButtonClassName: 'button',
      sortDownButtonClassName: 'button',
      keyAttribute: 'id',
      signalNameSpace: null,
      htmlAttribute: 'html',
      wrapContentsHtmlTagName: 'div',
      loadMoreTreshold: 6,
      moveApiCallDelayMilliseconds: 2000
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
    this._onMoveItemUpSignal = this._onMoveItemUpSignal.bind(this);
    this._onMoveItemDownSignal = this._onMoveItemDownSignal.bind(this);
    this._onMoveItemCompleteSignal = this._onMoveItemCompleteSignal.bind(this);
    this.signalHandler = new window.ievv_jsbase_core.SignalHandlerSingleton();

    this.state = {
      dataList: [],
      isMovingItemKey: null,
      isCallingMoveApi: false,
      hasMorePages: false
    };

    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    this.signalHandler.addReceiver(
      `${this.props.signalNameSpace}.DataChange`,
      this._name,
      this._onDataChangeSignal
    );
    this.signalHandler.addReceiver(
      `${this.props.signalNameSpace}.SortableHtmlList.MoveItemUp`,
      this._name,
      this._onMoveItemUpSignal
    );
    this.signalHandler.addReceiver(
      `${this.props.signalNameSpace}.SortableHtmlList.MoveItemDown`,
      this._name,
      this._onMoveItemDownSignal
    );
    this.signalHandler.addReceiver(
      `${this.props.signalNameSpace}.MoveItemComplete`,
      this._name,
      this._onMoveItemCompleteSignal
    );
  }

  componentWillUnmount() {
    this.signalHandler.removeAllSignalsFromReceiver(this._name);
  }

  // _getDataListDebugArray() {
  //   let debugArray = [];
  //   for(let itemData of this.state.dataList) {
  //     // debugArray.push(`  - ${itemData[this.props.keyAttribute]}`);
  //     debugArray.push(itemData[this.props.keyAttribute])
  //   }
  //   // return '\n' + debugArray.join('\n');
  //   return debugArray.join(', ')
  // }

  _cancelMoveTimer() {
    if(this._blurTimeoutId != undefined) {
      window.clearTimeout(this._blurTimeoutId);
    }
  }

  _startMoveTimer(callback) {
    this._blurTimeoutId = window.setTimeout(
      callback,
      this.props.moveApiCallDelayMilliseconds);
  }

  _sendMoveSignal(moveBeforeItemKey) {
    this.setState({
      isCallingMoveApi: true
    });
    this.signalHandler.send(`${this.props.signalNameSpace}.MoveItem`, {
      movingItemKey: this.state.isMovingItemKey,
      moveBeforeItemKey: moveBeforeItemKey
    });
  }

  _sendMoveStartedSignal() {
    this.signalHandler.send(`${this.props.signalNameSpace}.MoveItemStarted`);
  }

  _moveItem(from_index, to_index) {
    if(to_index < 0) {
      throw new Error('Can not move a result item to an index smaller than 0');
    } else if(to_index > this.state.dataList.length) {
      throw new Error(
        'Can not move a result item to an index that is larger ' +
        'than the result array size.');
    }
    let itemData = this.state.dataList[from_index];
    let itemKey = itemData[this.props.keyAttribute];
    if(this.state.isMovingItemKey != null && this.state.isMovingItemKey != itemKey) {
      throw new Error(
        `Can not move item with key=${itemKey}. We are already in the ` +
        `process of moving the item with key=${this.state.isMovingItemKey}.`);
    }
    if(this.state.isMovingItemKey == null) {
      this._sendMoveStartedSignal();
    }

    this._cancelMoveTimer();
    let moveLast = to_index == (this.state.dataList.length - 1);
    let moveBeforeItemKey = null;
    this.state.dataList.splice(from_index, 1);
    if(moveLast) {
      this.state.dataList.push(itemData);
    } else {
      this.state.dataList.splice(to_index, 0, itemData);
      moveBeforeItemKey = this.state.dataList[to_index + 1][this.props.keyAttribute];
    }
    this.state.isMovingItemKey = itemData[this.props.keyAttribute];

    this.forceUpdate();
    this._startMoveTimer(() => {
      this._sendMoveSignal(moveBeforeItemKey);
    });
  }

  _onMoveItemUpSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this._moveItem(receivedSignalInfo.data.itemIndex,
      receivedSignalInfo.data.itemIndex - 1);
  }

  _onMoveItemDownSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this._moveItem(receivedSignalInfo.data.itemIndex,
      receivedSignalInfo.data.itemIndex + 1);
  }

  _onMoveItemCompleteSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this.setState({
      isCallingMoveApi: false,
      isMovingItemKey: null
    });
  }

  render() {
    return <div className={this.props.className}>
      {this.renderItems()}
    </div>;
  }

  _loadMoreIfNeeded() {
    if(this.state.hasMorePages && this.state.dataList.length < this.props.loadMoreTreshold) {
      this.logger.debug('Automatically sending the LoadMore signal because we are below the loadMoreTreshold');
      this.signalHandler.send(
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


  renderItemContent(itemData) {
    return React.createElement(
      this.props.wrapContentsHtmlTagName,
      {
        className: this.props.itemContentClassName,
        dangerouslySetInnerHTML: {__html: itemData[this.props.htmlAttribute]}
      }
    );
  }

  canMoveItem(itemData) {
    return !this.state.isCallingMoveApi && (
      this.state.isMovingItemKey == null ||
      this.state.isMovingItemKey == itemData[this.props.keyAttribute]
    );
  }

  renderMoveUpButton(itemIndex, itemData) {
    if(itemIndex > 0 && this.canMoveItem(itemData)) {
      return <CradminMoveButton className={this.props.sortUpButtonClassName}
                                signalNameSpace={this.props.signalNameSpace}
                                itemIndex={itemIndex}
                                moveDirection="Up"
                                label="Up"/>;
    }
    return '';
  }

  renderMoveDownButton(itemIndex, itemData) {
    if(itemIndex < (this.state.dataList.length - 1) && this.canMoveItem(itemData)) {
      return <CradminMoveButton className={this.props.sortDownButtonClassName}
                         signalNameSpace={this.props.signalNameSpace}
                         itemIndex={itemIndex}
                         moveDirection="Down"
                         label="Down"/>;
    }
    return '';
  }

  renderItemSortContainer(itemIndex, itemData) {
    return <div className={this.props.itemSortContainerClassName}>
      {this.renderMoveUpButton(itemIndex, itemData)}
      {this.renderMoveDownButton(itemIndex, itemData)}
    </div>;
  }

  renderItem(itemKey, itemData, itemIndex) {
    return <div key={itemKey} className={this.props.itemClassName}>
      {this.renderItemContent(itemData)}
      {this.renderItemSortContainer(itemIndex, itemData)}
    </div>;
  }

  renderItems() {
    const items = [];
    let itemIndex = 0;
    for(let itemData of this.state.dataList) {
      let itemKey = itemData[this.props.keyAttribute];
      items.push(this.renderItem(itemKey, itemData, itemIndex));
      itemIndex ++;
    }
    return items;
  }
}
