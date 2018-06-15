import AbstractEmbeddedDateOrDateTimeSelect from './AbstractEmbeddedDateOrDateTimeSelect'
import DatePicker from './DatePicker'

export default class EmbeddedDateSelect extends AbstractEmbeddedDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      hiddenFieldFormat: 'YYYY-MM-DD'
    })
  }

  get pickerComponentClass () {
    return DatePicker
  }
}
