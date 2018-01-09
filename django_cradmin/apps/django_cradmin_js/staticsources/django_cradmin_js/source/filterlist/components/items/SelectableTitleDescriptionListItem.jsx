import React from 'react'
import PropTypes from 'prop-types'
import AbstractListItem from './AbstractListItem'

export default class SelectableTitleDescriptionListItem extends AbstractListItem {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.title = PropTypes.string.isRequired
    propTypes.description = PropTypes.string.isRequired
    return propTypes
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    if (this.props.isSelected) {
      this.props.childExposedApi.deselectItem(this.props.listItemId)
    } else {
      this.props.childExposedApi.selectItem(this.props.listItemId)
    }
  }

  get className () {
    let className = 'selectable-list__item'
    if (this.props.isSelected) {
      className = `${className} selectable-list__item--selected`
    }
    return className
  }

  get iconWrapperClassName () {
    return 'selectable-list__icon'
  }

  get iconClassName () {
    return 'icon-check--light'
  }

  get contentClassName () {
    return 'selectable-list__itemcontent'
  }

  get titleClassName () {
    return 'selectable-list__itemtitle'
  }

  get descriptionClassName () {
    return ''
  }

  renderIcon () {
    if (this.props.isSelected) {
      return <i className={this.iconClassName}/>
    }
    return null
  }

  renderIconWrapper () {
    return <div className={this.iconWrapperClassName}>
      {this.renderIcon()}
    </div>
  }

  renderContent () {
    return <div className={this.contentClassName}>
      <h2 className={this.titleClassName}>{this.props.title}</h2>
      <p className={this.descriptionClassName}>
        {this.props.description}
      </p>
    </div>
  }

  render () {
    return <div
      className={this.className}
      tabIndex={0}
      aria-selected={this.props.isSelected}
      onClick={this.onClick}>
      {this.renderIconWrapper()}
      {this.renderContent()}
    </div>
  }
}
