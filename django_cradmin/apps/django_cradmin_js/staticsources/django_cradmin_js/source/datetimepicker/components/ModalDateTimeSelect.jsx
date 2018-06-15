import DateTimePicker from './DateTimePicker'
import AbstractModalDateOrDateTimeSelect from './AbstractModalDateOrDateTimeSelect'

export default class ModalDateTimeSelect extends AbstractModalDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      selectedPreviewFormat: 'llll'
    })
  }

  get pickerComponentClass () {
    return DateTimePicker
  }
}
