import React from 'react'
import PropTypes from 'prop-types'
import * as reduxApiUtilities from 'ievv_jsbase/lib/utils/reduxApiUtilities'
import LoadingIndicator from '../../../../components/LoadingIndicator'

/**
 * Generic IdListMultiselectItem. You need to subclass this when using {@link GenericIdListMultiSelectFilter} and
 * override renderContents.
 *
 * You will also need to use redux' `connect` and make a function like {@link abstractIdListItemMapStateToProps} to map
 * `idListItemMap` and `getIdListItemAction`.
 *
 * If your redux-structure is not compatible with the one build by {@link reduxApiUtilities}, or you are not using redux
 * at all, you will also need to override {@link getDerivedStateFromProps}.
 */
export default class AbstractGenericIdListMultiSelectItem extends React.Component {
  static get propTypes () {
    return {
      id: PropTypes.number.isRequired,
      idListItemMap: PropTypes.object.isRequired,
      getIdListItemAction: PropTypes.func.isRequired
    }
  }

  static get defaultProps () {
    return {
      idListItemMap: new Map(),
      getIdListItemAction: () => {
        console.log('getIdListItemAction not given in props!')
        return null
      }
    }
  }

  constructor (props) {
    super(props)

    this.state = this.makeInitialState()
    this.setupBoundFunctions()
  }

  /**
   * make and return the initial React-state. Defaults to `{hasAllReduxData: false}`
   */
  makeInitialState () {
    return {
      hasAllReduxData: false
    }
  }

  /**
   * only here to be overridden. A place to setup bound functions
   */
  setupBoundFunctions () {}

  /**
   * Override this to use something other than `null` as a fallback if `this.props.id` is not found in
   * `this.props.idListItemMap`.
   * @return {null}
   */
  get idListItemNotFoundFallback () {
    return null
  }

  /**
   * Util to get idListItem.
   *
   * @return {*} lookup for `['data', this.props.id]` in `this.props.idListItemMap`, or
   *    `this.idListItemNotFoundFallback` if not found.
   */
  get idListItem () {
    return this.props.idListItemMap.getIn(['data', this.props.id], this.idListItemNotFoundFallback)
  }

  renderContents () {
    console.warn(`You should make a subclass of AbstractIdGenericListMultiselectItem, and override renderContents()!`)
    console.log(`Got id: ${this.props.id}`)
    console.log(`And item: `, this.idListItem)
    return <p>Got id: {this.props.id}</p>
  }

  renderLoadingIndicator () {
    return <LoadingIndicator />
  }

  render () {
    if (!this.state.hasAllReduxData) {
      return this.renderLoadingIndicator()
    }
    return this.renderContents()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let nextState = null
    let hasAllReduxData = true

    function setValueInNextState (valueObject) {
      nextState = {
        ...(nextState === null ? {} : nextState),
        ...valueObject
      }
    }

    function ensureIdListItemInStore () {
      const idListItem = reduxApiUtilities.getObjectFromReduxMapOrNullIfLoading(
        nextProps.idListItemMap,
        nextProps.id,
        nextProps.getIdListItemAction,
        nextProps.dispatch
      )
      if (idListItem === null) {
        hasAllReduxData = false
      }
    }

    ensureIdListItemInStore()

    if (hasAllReduxData !== prevState.hasAllReduxData) {
      setValueInNextState({ hasAllReduxData })
    }

    return nextState
  }
}

/**
 * example mapStateToProps in order to use {@link AbstractGenericIdListMultiSelectItem}.
 *
 * @param state redux-state
 * @return {{getIdListItemAction: null, idListItemMap: never, idListItemId: *}}
 */
export function abstractIdListItemMapStateToProps (state) {
  return {
    idListItemMap: new Map(),
    getIdListItemAction: null
  }
}
