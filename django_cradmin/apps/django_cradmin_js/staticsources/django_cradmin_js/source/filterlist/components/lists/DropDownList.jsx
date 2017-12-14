import React from 'react'
import AbstractList from './AbstractList'

export default class DropDownList extends AbstractList {
  // componentDidMount () {
    // super.componentDidMount()
    // this.loadFirstPageFromApi()
  // }

  getInitialState () {
    const state = super.getInitialState()
    state.isExpanded = false
    return state
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onExpandCollapseToggle = this.onExpandCollapseToggle.bind(this)
  }

  get listClassName () {
    return 'blocklist'
  }

  get bodyClassName () {
    return `${this.props.bemBlock}__body ${this.props.bemBlock}__body--spaced`
  }

  get dropdownClassName () {
    return 'dropdown'
  }

  get dropdownContentClassName () {
    return `${this.dropdownClassName}__content`
  }

  onExpandCollapseToggle () {
    this.setState((prevState, props) => {
      return {
        isExpanded: !prevState.isExpanded
      }
    })
  }

  getFilterComponentProps (filterSpec) {
    const props = super.getFilterComponentProps(filterSpec)
    props.expandCollapseToggleCallback = this.onExpandCollapseToggle
    props.isExpanded = this.state.isExpanded
    return props
  }

  renderBody () {
    if (this.state.isExpanded) {
      const body = super.renderBody()
      return <div className={this.dropdownClassName}>
        <div className={this.dropdownContentClassName}>
          {body}
        </div>
      </div>
    }
    return null
  }
}
