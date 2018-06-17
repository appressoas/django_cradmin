import DatePicker from './DatePicker'
import AbstractDropdownDateOrDateTimeSelect from './AbstractDropdownDateOrDateTimeSelect'

export default class DropdownDateSelect extends AbstractDropdownDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      hiddenFieldFormat: 'YYYY-MM-DD',
      selectedPreviewFormat: 'll'
    })
  }

  get pickerComponentClass () {
    return DatePicker
  }
}
