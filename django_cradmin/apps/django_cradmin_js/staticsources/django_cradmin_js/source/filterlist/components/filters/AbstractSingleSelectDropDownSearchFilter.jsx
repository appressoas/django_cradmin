import React from 'react'
import DropDownSearchFilter from './DropDownSearchFilter'

export default class AbstractSingleSelectDropDownSearchFilter extends DropDownSearchFilter {
  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClickSelectedItemBody = this.onClickSelectedItemBody.bind(this)
  }

  onClickClearButton () {
    this.props.childExposedApi.deselectAllItems()
    super.onClickClearButton()
  }

  onClickSelectedItemBody () {
    this.onClickClearButton()
  }

  renderSelectedLabel () {
    throw new Error('renderSelectedLabel must be overridden by subclasses!')
  }

  get selectedItemKey () {
    if (this.props.selectedListItemsMap.size === 0) {
      return null
    }
    return this.props.selectedListItemsMap.keys().next().value
  }

  get selectedItemValue () {
    if (this.props.selectedListItemsMap.size === 0) {
      return null
    }
    return this.props.selectedListItemsMap.get(this.selectedItemKey)
  }

  renderSelectedValue (extraProps) {
    return <span {...extraProps} className={'searchinput__selected searchinput__selected--single'} key={'selected value'}>
      <span className={'searchinput__selected_preview'}>
        {this.renderSelectedLabel()}
      </span>
    </span>
  }

  renderBodyContent () {
    const blockStyle = {
      style: {
        display: 'block'
      }
    }
    const noneStyle = {
      style: {
        display: 'none'
      }
    }

    if (this.props.selectedListItemsMap.size === 0) {
      return [
        this.renderSearchInput(blockStyle),
        this.renderSelectedValue(noneStyle)
      ]
    }
    return [
      this.renderSearchInput(noneStyle),
      this.renderSelectedValue(blockStyle)
    ]
  }
}
