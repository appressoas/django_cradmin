import React from 'react'
import PropTypes from 'prop-types'
import AbstractListChild from '../AbstractListChild'

export default class AbstractList extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      cachedItemSpec: PropTypes.object.isRequired,
      listItemsDataArray: PropTypes.array.isRequired,
      selectedListItemsMap: PropTypes.instanceOf(Map).isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      cachedItemSpec: null,
      selectedListItemsMap: null,
      listItemsDataArray: null
    })
  }

  shouldRenderListItem (listItemData) {
    return true
  }

  getItemComponentClass (listItemData) {
    return this.props.cachedItemSpec.componentClass
  }

  getItemComponentProps (listItemData) {
    const listItemId = this.props.childExposedApi.getIdFromListItemData(listItemData)
    return this.makeChildComponentProps(Object.assign(listItemData, this.props.cachedItemSpec.props, {
      key: listItemId,
      isSelected: this.props.childExposedApi.itemIsSelected(listItemId),
      listItemId: listItemId
    }))
  }

  renderListItem (listItemData) {
    return React.createElement(
      this.getItemComponentClass(listItemData),
      this.getItemComponentProps(listItemData))
  }

  renderListItems () {
    const renderedListItems = []
    for (let listItemData of this.props.listItemsDataArray) {
      if (this.shouldRenderListItem(listItemData)) {
        renderedListItems.push(this.renderListItem(listItemData))
      }
    }
    return renderedListItems
  }
}
