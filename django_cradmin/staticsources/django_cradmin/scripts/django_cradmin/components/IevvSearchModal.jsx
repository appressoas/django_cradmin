import React from "react";
import IevvSearch from "./IevvSearch";
import IevvSearchResultList from "./IevvSearchResultList";
import IevvModal from "./IevvModal";


export default class IevvSelectModal extends IevvModal {
  constructor(props) {
    super(props);
    this.onSelectSignal = this.onSelectSignal.bind(this);
    this._selectSignalName = `${this.props.uniquePrefix}.Select`
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
        <IevvSearch {...searchProps} />
        <IevvSearchResultList {...resultProps} />
      </div>;
  }

  onSelectSignal(receivedSignalInfo) {
    this.props.selectCallback(receivedSignalInfo.data);
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this._selectSignalName,
      `${this.props.uniquePrefix}.IevvSelectModal`,
      this.onSelectSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this._selectSignalName,
      `${this.props.uniquePrefix}.IevvSelectModal`
    );
  }
}
