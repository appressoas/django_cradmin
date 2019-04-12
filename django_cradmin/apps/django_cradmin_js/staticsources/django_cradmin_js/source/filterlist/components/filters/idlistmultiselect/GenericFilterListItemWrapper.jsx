import React from 'react'
import PropTypes from 'prop-types'
import AbstractListItem from 'django_cradmin_js/lib/filterlist/components/items/AbstractListItem'

export default class GenericFilterListItemWrapper extends AbstractListItem {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      componentType: PropTypes.func.isRequired,
      componentProps: PropTypes.object,
      listItemIdName: PropTypes.string.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      componentType: null,
      componentProps: {},
      listItemIdName: null
    })
  }

  render () {
    const Type = this.props.componentType
    const {componentType, componentProps, ...typeProps} = this.props
    const props = {
      [this.props.listItemIdName]: this.props.listItemId,
      ...typeProps,
      ...componentProps
    }
    return <Type {...props} />
  }
}
