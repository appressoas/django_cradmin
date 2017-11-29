import React from 'react'
import AbstractListItem from './AbstractListItem'

export default class BaseListItem extends AbstractListItem {
  render() {
    return <div>
      {this.props.listItemId}
    </div>
  }
}
