import AbstractEmbeddedDateOrDateTimeSelect from './AbstractEmbeddedDateOrDateTimeSelect'
import DateTimePicker from './DateTimePicker'

export default class EmbeddedDateTimeSelect extends AbstractEmbeddedDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign({}, super.defaultProps, {
      selectedPreviewFormat: 'llll',
      showSeconds: false
    })
  }

  get pickerComponentProps () {
    return Object.assign({}, super.pickerComponentProps, {
      showSeconds: this.props.showSeconds
    })
  }

  get pickerComponentClass () {
    return DateTimePicker
  }
}
