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
    return BemUtilities.buildBemElement(this.props.bemBlock, 'button', ['secondary'])
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

  renderYearSelect () {
    return <label key={'yearSelect'} className='select select--outlined select--size-xsmall'>
      <select aria-label='Year'>
        <option>2000</option>
        <option>2001</option>
        <option>2002</option>
        <option>2003</option>
        <option>2004</option>
        <option>...</option>
      </select>
    </label>
  }

  renderMonthButton () {
    // return <button key={'monthButton'} className={'button button--form-size-xsmall'} onClick={this.props.onToggleMode}>
    //   May
    //   {' '}
    //   <span className="cricon cricon--size-xxsmall cricon--chevron-down" aria-hidden="true" />
    // </button>
    return <label key={'monthSelect'} className='select select--outlined select--size-xsmall'>
      <select aria-label='Month'>
        <option>Jan</option>
        <option>Feb</option>
        <option>Sep</option>
        <option>...</option>
      </select>
    </label>
  }

  renderCurrentDate () {
    // return <button className={this.currentDateClassName} onClick={this.props.onToggleMode}>
    //   {this.props.display}
    // </button>
    return <span>
      {this.renderMonthButton()}
      {' '}
      {this.renderYearSelect()}
    </span>
  }

  render () {
    return <div className={this.className}>
      {this.renderLeftButton()}
      {this.renderCurrentDate()}
      {this.renderRightButton()}
    </div>
  }
}
