import DateTimePicker from './DateTimePicker'
import AbstractDropdownDateOrDateTimeSelect from './AbstractDropdownDateOrDateTimeSelect'
import OpenDateTimePicker from './OpenDateTimePicker'

export default class DropdownDateTimeSelect extends AbstractDropdownDateOrDateTimeSelect {
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
