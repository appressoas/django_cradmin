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
    this.state = {searchResultArray: this.props.clientsideData};
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
        searchResultArray: this.performClientSideSearch(searchString)
      });
  }

  isClientSideSearchMatch(searchString, dataObject) {
    for(let attribute of this.props.clientsideSearchAttributes) {
      if(dataObject[attribute] != undefined && dataObject[attribute] != null) {
        if(dataObject[attribute].toLowerCase().indexOf(searchString) != -1) {
          return true;
        }
      }
    }
    return false;
  }

  performClientSideSearch(searchString) {
    const searchResultArray = [];
    searchString = searchString.toLowerCase();
    for(let dataObject of this.props.clientsideData) {
      if(this.isClientSideSearchMatch(searchString, dataObject)) {
        searchResultArray.push(dataObject);
      }
    }
    return searchResultArray;
  }

  render() {
    return <div className={this.props.className}>
      {this.renderResults()}
    </div>;
  }

  renderResults() {
    const searchResults = [];
    for(let searchResult of this.state.searchResultArray) {
      let props = {
        data: searchResult,
        selectSignalName: this.props.selectSignalName
      };
      searchResults.push(<IevvSearchResult key={searchResult.value} {...props} />)
    }
    return searchResults;
  }
}
