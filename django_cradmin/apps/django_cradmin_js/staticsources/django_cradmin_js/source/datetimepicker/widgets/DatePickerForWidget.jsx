import React from 'react'
import DatePicker from '../components/DatePicker'
import BemUtilities from '../../utilities/BemUtilities'
import PropTypes from 'prop-types'

export default class DatePickerForWidget extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      bemBlock: 'datetimepicker',
      bemVariants: ['sane-max-width']
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      inputMoment: this.props.moment
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  get bodyClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'body', ['outlined'])
  }

  get previewClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'preview')
  }

  get datePickerComponentClass () {
    return DatePicker
  }

  get datePickerComponentProps () {
    return {
      moment: this.state.inputMoment,
      locale: this.props.locale,
      onChange: (moment) => {
        this.setState({inputMoment: moment})
      }
    }
  }

  renderPreview () {
    return <p className={this.previewClassName}>{this.state.inputMoment.format('ll')}</p>
  }

  renderDatePicker () {
    const DatePickerComponent = this.datePickerComponentClass
    return <DatePickerComponent {...this.datePickerComponentProps} />
  }

  render () {
    return <div className={this.className}>
      <div className={this.bodyClassName}>
        {this.renderPreview()}
        {this.renderDatePicker()}
      </div>
    </div>
  }
}
