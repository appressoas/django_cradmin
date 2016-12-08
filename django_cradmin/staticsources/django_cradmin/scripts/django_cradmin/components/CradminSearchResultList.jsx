import React from "react";
import CradminSearchResult from "./CradminSearchResult";


export default class CradminSearchResultList extends React.Component {

  static get defaultProps() {
    return {
      className: 'blocklist  blocklist--tight',
      selectedValue: null
    }
  }

  constructor(props) {
    super(props);
    this._onSearchCompletedSignal = this._onSearchCompletedSignal.bind(this);
    this._selectCallback = this._selectCallback.bind(this);

    this.state = {
      resultObjectArray: [],
      selectedValue: this.props.selectedValue
    };
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
      resultObjectArray: receivedSignalInfo.data.results
    });
  }

  render() {
    return <div className={this.props.className}>
      {this.renderResults()}
    </div>;
  }

  _selectCallback(resultObject) {
    event.preventDefault();
    this.setState({
      selectedValue: resultObject[this.props.valueAttribute]
    });
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      this.props.selectResultSignalName,
      resultObject
    );
  }

  renderResults() {
    const resultObjects = [];
    for(let resultObject of this.state.resultObjectArray) {
      let value = resultObject[this.props.valueAttribute];
      let props = Object.assign({}, this.props.resultComponentProps, {
        resultObject: resultObject,
        selectResultSignalName: this.props.selectResultSignalName,
        selectCallback: this._selectCallback,
        isSelected: this.state.selectedValue != null && this.state.selectedValue == value
      });
      resultObjects.push(<CradminSearchResult key={value} {...props} />);
    }
    return resultObjects;
  }
}
