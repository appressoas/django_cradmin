import React from "react";
import CradminSearchResult from "./CradminSearchResult";


export default class CradminSearchResultList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist  blocklist--tight'
    }
  }

  constructor(props) {
    super(props);
    this._onSearchCompletedSignal = this._onSearchCompletedSignal.bind(this);
    this.state = {resultObjectArray: []};
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this.props.searchCompletedSignalName,
      'django_cradmin.components.CradminSearchResultList',
      this._onSearchCompletedSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this.props.searchCompletedSignalName,
      'django_cradmin.components.CradminSearchResultList'
    );
  }

  _onSearchCompletedSignal(receivedSignalInfo) {
      this.setState({
        resultObjectArray: receivedSignalInfo.data
      });
  }

  render() {
    return <div className={this.props.className}>
      {this.renderResults()}
    </div>;
  }

  renderResults() {
    const resultObjects = [];
    for(let resultObject of this.state.resultObjectArray) {
      let props = {
        resultObject: resultObject,
        selectResultSignalName: this.props.selectResultSignalName
      };
      resultObjects.push(<CradminSearchResult key={resultObject[this.props.valueAttribute]} {...props} />);
    }
    return resultObjects;
  }
}
