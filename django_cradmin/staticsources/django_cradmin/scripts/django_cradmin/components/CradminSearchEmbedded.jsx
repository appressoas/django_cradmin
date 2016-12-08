import React from "react";
import CradminSearch from "./CradminSearch";
import CradminSearchResultList from "./CradminSearchResultList";


export default class CradminSelectModal extends React.Component {
  static get defaultProps() {
    return {
      className: ''
    }
  }

  render() {
    const searchProps = Object.assign({}, this.props.searchComponentProps, {
      searchRequestedSignalName: this.props.searchRequestedSignalName,
      autofocus: true
    });

    const resultProps = Object.assign({}, this.props.resultListComponentProps, {
      selectResultSignalName: this.props.selectResultSignalName,
      searchCompletedSignalName: this.props.searchCompletedSignalName,
      valueAttribute: this.props.valueAttribute,
      resultComponentProps: this.props.resultComponentProps
    });

    return <div className={this.props.cssClass}>
        <CradminSearch {...searchProps} />
        <CradminSearchResultList {...resultProps} />
    </div>;
  }
}
