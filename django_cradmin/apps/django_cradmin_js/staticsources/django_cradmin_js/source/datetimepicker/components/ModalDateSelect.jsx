import DatePicker from './DatePicker'
import AbstractModalDateOrDateTimeSelect from './AbstractModalDateOrDateTimeSelect'
import { gettext } from 'ievv_jsbase/lib/gettext'

export default class ModalDateSelect extends AbstractModalDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      hiddenFieldFormat: 'YYYY-MM-DD',
      selectedPreviewFormat: 'll',
      noneSelectedButtonLabel: gettext('Select a date')
    })
  }

  get pickerComponentClass () {
    return DatePicker
  }
}
