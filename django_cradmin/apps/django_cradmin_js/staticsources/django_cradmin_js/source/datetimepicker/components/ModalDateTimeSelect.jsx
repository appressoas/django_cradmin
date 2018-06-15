import DateTimePicker from './DateTimePicker'
import AbstractModalDateOrDateTimeSelect from './AbstractModalDateOrDateTimeSelect'
import { gettext } from 'ievv_jsbase/lib/gettext'

export default class ModalDateTimeSelect extends AbstractModalDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      selectedPreviewFormat: 'llll',
      noneSelectedButtonLabel: gettext('Select a date/time')
    })
  }

  get pickerComponentClass () {
    return DateTimePicker
  }
}
