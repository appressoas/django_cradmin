import React from 'react'
import PropTypes from 'prop-types'
import AbstractListChild from '../AbstractListChild'

export default class AbstractList extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      bemBlock: PropTypes.string.isRequired,
      selectItemCallback: PropTypes.func.isRequired,
      selectItemsCallback: PropTypes.func.isRequired,
      deselectItemCallback: PropTypes.func.isRequired,
      deselectItemsCallback: PropTypes.func.isRequired,
      itemIsSelected: PropTypes.func.isRequired,
      cachedItemSpec: PropTypes.object.isRequired,
      listItemsDataArray: PropTypes.object.array.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      bemBlock: null,
      selectItemCallback: null,
      selectItemsCallback: null,
      deselectItemCallback: null,
      deselectItemsCallback: null,
      itemIsSelected: null,
      cachedItemSpec: null,
      listItemsDataArray: []
    })
  }

  shouldRenderListItem (listItemData) {
    return true
  }

  getItemComponentClass (listItemData) {
    return this.props.cachedItemSpec.componentClass
  }

  getItemComponentProps (listItemData) {
    const listItemId = this.getIdFromListItemData(listItemData)
    return Object.assign({}, listItemData, this.props.cachedItemSpec.props, {
      key: listItemId,
      isSelected: this.props.itemIsSelected(listItemId),
      listItemId: listItemId,
      selectItemCallback: this.props.selectItem,
      selectItemsCallback: this.props.selectItems,
      deselectItemCallback: this.props.deselectItem,
      deselectItemsCallback: this.props.deselectItems,
    })
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

  render () {
    return <div className={this.bemBlock}>
      {this.renderListItems()}
    </div>
  }
}
