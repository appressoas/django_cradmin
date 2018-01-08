import React from 'react'
import AbstractList from './AbstractList'

export default class BlockList extends AbstractList {
  get bemBlock () {
    return 'blocklist'
  }

  render () {
    return <div className={this.bemBlock}>
      {this.renderListItems()}
    </div>
  }
}
