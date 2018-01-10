import React from 'react'
import AbstractList from './AbstractList'

export default class SelectableList extends AbstractList {
  get bemBlock () {
    return 'selectable-list'
  }

  getItemComponentProps (listItemData) {
    const props = super.getItemComponentProps(listItemData)
    props.bemBlock = this.bemBlock
    return props
  }

  render () {
    return <div className={this.bemBlock}>
      {this.renderListItems()}
    </div>
  }
}
