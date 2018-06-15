import React from 'react'
import DateTimePicker from '../components/DateTimePicker'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'

export default class DateTimePickerForWidget extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      bemBlock: 'datetimepicker',
      bemVariants: [],
      showSeconds: false
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      showSeconds: PropTypes.bool.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      inputMoment: this.props.moment,
      showSeconds: this.props.showSeconds,
      locale: this.props.locale
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  get previewClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'preview')
  }

  get dateTimePickerComponentClass () {
    return DateTimePicker
  }

  get dateTimePickerComponentProps () {
    return {
      moment: this.state.inputMoment,
      locale: this.props.locale,
      showSeconds: this.props.showSeconds,
      onChange: (moment) => {
        this.setState({inputMoment: moment})
      }
    }
  }

  renderPreview () {
    return <p className={this.previewClassName}>{this.state.inputMoment.format('llll')}</p>
  }

  renderDateTimePicker () {
    const DateTimePickerComponent = this.dateTimePickerComponentClass
    return <DateTimePickerComponent {...this.dateTimePickerComponentProps} />
  }

  render () {
    return <div className={this.className}>
      {this.renderPreview()}
      {this.renderDateTimePicker()}
    </div>
  }
}
