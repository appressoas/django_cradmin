import React from 'react'
import DropDownSearchFilter from './DropDownSearchFilter'
import * as gettext from 'ievv_jsbase/lib/gettext'

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

  getSelectedLabelText () {
    throw new Error('getSelectedLabelText must be overridden by subclasses!')
  }

  renderSelectedLabel () {
    return this.getSelectedLabelText()
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

  get selectedValueAriaLabel () {
    return gettext.interpolate(
      gettext.gettext('"%(selectedValue)s" selected. Hit the enter button to change your selection. %(selectLabel)s'),
      {
        'selectedValue': this.getSelectedLabelText(),
        'selectLabel': this.props.label
      },
      true)
  }

  renderSelectedValue (extraProps) {
    return <button
      className={'searchinput__selected searchinput__selected--single'}
      key={'selected value'}
      onClick={this.onClickSelectedItemBody}
      aria-label={this.selectedValueAriaLabel}
      {...extraProps}>
      <span className={'searchinput__selected_preview'}>
        {this.renderSelectedLabel()}
      </span>
    </button>
  }

  renderBodyContent () {
    const noneStyle = {
      style: {
        display: 'none'
      }
    }

    if (this.props.selectedListItemsMap.size === 0) {
      return [
        this.renderSearchInput(),
        this.renderSelectedValue(noneStyle)
      ]
    }
    return [
      this.renderSearchInput(noneStyle),
      this.renderSelectedValue()
    ]
  }
}
