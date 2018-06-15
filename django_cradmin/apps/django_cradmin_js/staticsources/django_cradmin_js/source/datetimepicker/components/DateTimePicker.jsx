import React from 'react'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import { gettext } from 'ievv_jsbase/lib/gettext'

export default class DateTimePicker extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      showSeconds: false,
      dateIconClassName: 'cricon cricon--calendar-grid',
      timeIconClassName: 'cricon cricon--clock',
      dateButtonLabel: gettext('Date'),
      timeButtonLabel: gettext('Time')
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      showSeconds: PropTypes.bool.isRequired,
      dateIconClassName: PropTypes.string.isRequired,
      timeIconClassName: PropTypes.string.isRequired,
      dateButtonLabel: PropTypes.string.isRequired,
      timeButtonLabel: PropTypes.string.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      tabName: 'date'
    }
  }

  renderDatePicker () {
    return <DatePicker
      key={'datePicker'}
      moment={this.props.moment}
      locale={this.props.locale}
      onChange={this.props.onChange}
    />
  }

  renderTimePicker () {
    return <TimePicker
      key={'timePicker'}
      moment={this.props.moment}
      showSeconds={this.props.showSeconds}
      locale={this.props.locale}
      onChange={this.props.onChange}
    />
  }

  renderPicker () {
    if (this.state.tabName === 'date') {
      return this.renderDatePicker()
    } else {
      return this.renderTimePicker()
    }
  }

  get tabsClassName () {
    return BemUtilities.addVariants('buttonbar', ['stretch', 'tinymargin'])
  }

  makeTabButtonClassName (tabName) {
    const bemVariants = []
    if (tabName === this.state.tabName) {
      bemVariants.push('primary-fill')
    } else {
      bemVariants.push('primary')
    }
    return `${BemUtilities.buildBemElement('buttonbar', 'button')} ${BemUtilities.addVariants('button', bemVariants)}`
  }

  renderTabButton (tabName, label, iconClassName) {
    return <button
      className={this.makeTabButtonClassName(tabName)}
      onClick={this.handleClickTab.bind(this, tabName)}
    >
      <span className={iconClassName} aria-hidden='true' />
      {label}
    </button>
  }

  renderTabs () {
    return <div key={'tabs'} className={this.tabsClassName}>
      {this.renderTabButton('date', this.props.dateButtonLabel, this.props.dateIconClassName)}
      {this.renderTabButton('time', this.props.timeButtonLabel, this.props.timeIconClassName)}
    </div>
  }

  render () {
    return [
      this.renderTabs(),
      this.renderPicker()
    ]
  }

  handleClickTab (tabName, e) {
    e.preventDefault()
    this.setState({tabName: tabName})
  }
}
