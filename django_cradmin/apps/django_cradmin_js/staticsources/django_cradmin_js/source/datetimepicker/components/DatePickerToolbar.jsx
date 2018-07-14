import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import * as gettext from 'ievv_jsbase/lib/gettext'
import YearSelect from './YearSelect'
import MonthSelect from './MonthSelect'

export default class DatePickerToolbar extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      bemBlock: 'paginator',
      bemVariants: [],
      buttonBemVariants: [],
      leftButtonIcon: 'chevron-left',
      rightButtonIcon: 'chevron-right',
      buttonIconBemVariants: [],
      leftButtonTitle: gettext.gettext('Previous'),
      rightButtonTitle: gettext.gettext('Next'),
      onPrevMonth: null,
      onToggleMode: null,
      onNextMonth: null,
      minYear: 1900,
      maxYear: 2100
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
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

  get yearSelectComponentClass () {
    return YearSelect
  }

  get yearSelectComponentProps () {
    return {
      momentObject: this.props.momentObject,
      min: this.props.minYear,
      max: this.props.maxYear
    }
  }

  renderYearSelect () {
    const YearSelectComponent = this.yearSelectComponentClass
    return <YearSelectComponent key={'yearSelect'} {...this.yearSelectComponentProps} />
  }

  get monthSelectComponentClass () {
    return MonthSelect
  }

  get monthSelectComponentProps () {
    return {
      momentObject: this.props.momentObject
    }
  }

  renderMonthSelect () {
    const MonthSelectComponent = this.monthSelectComponentClass
    return <MonthSelectComponent key={'monthSelect'} {...this.monthSelectComponentProps} />
  }

  // renderMonthButton () {
  //   // return <button key={'monthButton'} className={'button button--form-size-xsmall'} onClick={this.props.onToggleMode}>
  //   //   May
  //   //   {' '}
  //   //   <span className="cricon cricon--size-xxsmall cricon--chevron-down" aria-hidden="true" />
  //   // </button>
  // }

  renderCurrentDate () {
    // return <button className={this.currentDateClassName} onClick={this.props.onToggleMode}>
    //   {this.props.display}
    // </button>
    return <span>
      {this.renderMonthSelect()}
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
