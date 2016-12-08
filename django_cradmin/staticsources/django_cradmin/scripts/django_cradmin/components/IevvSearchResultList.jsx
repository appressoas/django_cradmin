import React from "react";
import IevvSearchResult from "./IevvSearchResult";


export default class IevvSearchResultList extends React.Component {

  static get defaultProps() {
    return {
      loadingMessage: 'Loading ...',
      className: 'blocklist  blocklist--tight',
      clientsideData: [],
      clientsideSearchAttributes: ['title', 'description']
    }
  }

  constructor(props) {
    super(props);
    this.onSearchSignal = this.onSearchSignal.bind(this);
    this.state = {resultObjectArray: this.props.clientsideData};
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      this.props.searchSignalName,
      `${this.props.uniquePrefix}.IevvSearchResultList`,
      this.onSearchSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      this.props.searchSignalName,
      `${this.props.uniquePrefix}.IevvSearchResultList`
    );
  }

  onSearchSignal(receivedSignalInfo) {
      const searchString = receivedSignalInfo.data;
      this.setState({
        resultObjectArray: this.performClientSideSearch(searchString)
      });
  }

  isClientSideSearchMatch(searchString, resultObject) {
    for(let attribute of this.props.clientsideSearchAttributes) {
      if(resultObject[attribute] != undefined && resultObject[attribute] != null) {
        if(resultObject[attribute].toLowerCase().indexOf(searchString) != -1) {
          return true;
        }
      }
    }
    return false;
  }

  performClientSideSearch(searchString) {
    const resultObjectArray = [];
    searchString = searchString.toLowerCase();
    for(let resultObject of this.props.clientsideData) {
      if(this.isClientSideSearchMatch(searchString, resultObject)) {
        resultObjectArray.push(resultObject);
      }
    }
    return resultObjectArray;
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
        selectSignalName: this.props.selectSignalName
      };
      resultObjects.push(<IevvSearchResult key={resultObject[this.props.valueAttribute]} {...props} />);
    }
    return resultObjects;
  }
}
