import React from 'react'
import PropTypes from 'prop-types'
import AbstractListItem from './AbstractListItem'

export default class TitleDescriptionListItem extends AbstractListItem {
  static get propTypes() {
    const propTypes = super.propTypes
    propTypes.title = PropTypes.string.isRequired
    propTypes.description = PropTypes.string.isRequired
    return propTypes
  }

  get className () {
    return 'blocklist__item'
  }

  get titleClassName () {
    return 'blocklist__itemtitle'
  }

  get descriptionClassName () {
    return ''
  }

  render () {
    return <div className={this.className}>
      <h2 className={this.titleClassName}>{this.props.title}</h2>
      <p className={this.descriptionClassName}>
        {this.props.description}
      </p>
    </div>
  }
}
