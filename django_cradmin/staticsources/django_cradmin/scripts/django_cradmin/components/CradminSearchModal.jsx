import React from "react";
import CradminSearch from "./CradminSearch";
import CradminSearchResultList from "./CradminSearchResultList";
import CradminModal from "./CradminModal";


export default class CradminSelectModal extends CradminModal {
  constructor(props) {
    super(props);
    this.onSelectSignal = this.onSelectSignal.bind(this);
    this._selectSignalName = `${this.props.uniquePrefix}.Select`;
    this.initializeSignalHandlers();
  }

  renderModalContent() {
    const searchSignalName = `${this.props.uniquePrefix}.Search`;

    const searchProps = Object.assign({}, this.props.search);
    searchProps.searchSignalName = searchSignalName;
    searchProps.autofocus = true;

    const resultProps = Object.assign({}, this.props.result);
    resultProps.uniquePrefix = this.props.uniquePrefix;
    resultProps.searchSignalName = searchSignalName;
    resultProps.selectSignalName = this._selectSignalName;

    return <div>
        <CradminSearch {...searchProps} />
        <CradminSearchResultList {...resultProps} />
      </div>;
  }

  onSelectSignal(receivedSignalInfo) {
    this.props.selectCallback(receivedSignalInfo.data);
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this._selectSignalName,
      `${this.props.uniquePrefix}.CradminSelectModal`,
      this.onSelectSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this._selectSignalName,
      `${this.props.uniquePrefix}.CradminSelectModal`
    );
  }
}
