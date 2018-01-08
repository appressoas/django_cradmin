import React from 'react'
import AbstractList from './AbstractList'

export default class SelectableList extends AbstractList {
  get bemBlock () {
    return 'selectable-list'
  }

  render () {
    return <div className={this.bemBlock}>
      {this.renderListItems()}
    </div>
  }
}
