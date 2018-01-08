import React from 'react'
import AbstractList from './AbstractList'

export default class BlockList extends AbstractList {
  get bemBlock () {
    return 'blocklist'
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
