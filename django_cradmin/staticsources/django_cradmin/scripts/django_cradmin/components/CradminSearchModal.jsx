import React from "react";
import CradminSearch from "./CradminSearch";
import CradminSearchResultList from "./CradminSearchResultList";
import CradminModal from "./CradminModal";


export default class CradminSelectModal extends CradminModal {
  renderModalContent() {
    const searchProps = Object.assign({}, this.props.ui.search, {
      searchRequestedSignalName: this.props.searchRequestedSignalName,
      autofocus: true
    });

    const resultProps = Object.assign({}, this.props.ui.result, {
      selectResultSignalName: this.props.selectResultSignalName,
      searchCompletedSignalName: this.props.searchCompletedSignalName,
      valueAttribute: this.props.valueAttribute
    });

    return <div>
        <CradminSearch {...searchProps} />
        <CradminSearchResultList {...resultProps} />
      </div>;
  }
}
