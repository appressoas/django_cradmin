import React from 'react'
import PropTypes from 'prop-types'

export default class AbstractPaginator extends React.Component {
  static get propTypes () {
    return {
      paginationState: PropTypes.object.isRequired,

      // Function to call to load more items from the API
      // See {@link AbstractList#loadMoreItemsFromApi}
      loadMoreItemsFromApi: PropTypes.func,

      // Function to call to load next page from the API
      // See {@link AbstractList#loadNextPageFromApi}
      loadNextPageFromApi: PropTypes.func,

      // Function to call to load previous page from the API
      // See {@link AbstractList#loadPreviousPageFromApi}
      loadPreviousPageFromApi: PropTypes.func,

      // Function to call to load a specific page from the API
      // See {@link AbstractList#loadSpecificPageFromApi}
      loadSpecificPageFromApi: PropTypes.func,

      hasNextPage: PropTypes.bool,
      hasPreviousPage: PropTypes.bool
    }
  }

  static get defaultProps () {
    return {
      currentPaginationOptions: null,
      loadMoreItemsFromApi: null,
      loadNextPageFromApi: null,
      loadPreviousPageFromApi: null,
      loadSpecificPageFromApi: null,
      hasNextPage: false,
      hasPreviousPage: false
    }
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
  }

  setupBoundMethods () {}
}
