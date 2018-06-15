import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import { gettext } from 'ievv_jsbase/lib/gettext'

export default class DatePickerToolbar extends React.Component {
  static get defaultProps () {
    return {
      display: null,
      bemBlock: 'paginator',
      bemVariants: [],
      buttonBemVariants: [],
      leftButtonIcon: 'chevron-left',
      rightButtonIcon: 'chevron-right',
      buttonIconBemVariants: [],
      leftButtonTitle: gettext('Previous'),
      rightButtonTitle: gettext('Next'),
      onPrevMonth: null,
      onToggleMode: null,
      onNextMonth: null
    }
  }

  static get propTypes () {
    return {
      display: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      buttonBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      leftButtonIcon: PropTypes.string.isRequired,
      rightButtonIcon: PropTypes.string.isRequired,
      buttonIconBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      leftButtonTitle: PropTypes.string.isRequired,
      rightButtonTitle: PropTypes.string.isRequired,
      onPrevMonth: PropTypes.func.isRequired,
      onToggleMode: PropTypes.func.isRequired,
      onNextMonth: PropTypes.func.isRequired
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  get buttonClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, this.buttonBemVariants)
  }

  get leftButtonIconClassName () {
    return BemUtilities.addVariants('cricon', this.props.buttonIconBemVariants.concat([this.props.leftButtonIcon]))
  }

  get rightButtonIconClassName () {
    return BemUtilities.addVariants('cricon', this.props.buttonIconBemVariants.concat([this.props.rightButtonIcon]))
  }

  get currentDateClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'label')
  }

  renderLeftButton () {
    return <button className={this.buttonClassName} title={this.props.leftButtonTitle} onClick={this.props.onPrevMonth}>
      <span className={this.leftButtonIconClassName} aria-hidden='true' />
    </button>
  }

  renderRightButton () {
    return <button className={this.buttonClassName} title={this.props.rightButtonTitle} onClick={this.props.onNextMonth}>
      <span className={this.rightButtonIconClassName} aria-hidden='true' />
    </button>
  }

  renderCurrentDate () {
    return <button className={this.currentDateClassName} onClick={this.props.onToggleMode}>
      {this.props.display}
    </button>
  }

  render () {
    return <div className={this.className}>
      {this.renderLeftButton()}
      {this.renderCurrentDate()}
      {this.renderRightButton()}
    </div>
  }
}
