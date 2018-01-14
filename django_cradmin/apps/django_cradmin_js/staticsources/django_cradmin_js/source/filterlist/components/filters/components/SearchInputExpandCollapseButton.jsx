import PropTypes from 'prop-types'
import AbstractSearchInputButton from './AbstractSearchInputButton'
import 'ievv_jsbase/lib/utils/i18nFallbacks'

/**
 * Renders a expand/collapse ``searchinput__button``.
 *
 * See {@link SearchInputExpandCollapseButton.defaultProps} for documentation for
 * props and their defaults.
 */
export default class SearchInputExpandCollapseButton extends AbstractSearchInputButton {
  static get propTypes () {
    return Object.assign({}, super.propTypes, {
      isExpanded: PropTypes.bool.isRequired
    })
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractSearchInputButton.defaultProps}.
   *
   * @return {Object}
   * @property {bool} isExpanded Render as expanded?
   */
  static get defaultProps () {
    return Object.assign({}, super.defaultProps, {
      isExpanded: null
    })
  }

  get iconClassName () {
    if (this.props.isExpanded) {
      return 'icon-chevron-up'
    } else {
      return 'icon-chevron-down'
    }
  }

  get label () {
    if (this.props.isExpanded) {
      return window.gettext('Collapse')
    } else {
      return window.gettext('Expand')
    }
  }
}
