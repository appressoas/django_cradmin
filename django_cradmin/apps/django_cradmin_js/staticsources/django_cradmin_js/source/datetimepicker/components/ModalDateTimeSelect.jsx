import DateTimePicker from './DateTimePicker'
import AbstractModalDateOrDateTimeSelect from './AbstractModalDateOrDateTimeSelect'
import OpenDatePicker from './OpenDatePicker'
import OpenDateTimePicker from './OpenDateTimePicker'

export default class ModalDateTimeSelect extends AbstractModalDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
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

  get openPickerComponentClass () {
    return OpenDateTimePicker
  }
}
