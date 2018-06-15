import AbstractEmbeddedDateOrDateTimeSelect from './AbstractEmbeddedDateOrDateTimeSelect'
import DateTimePicker from './DateTimePicker'

export default class EmbeddedDateTimeSelect extends AbstractEmbeddedDateOrDateTimeSelect {
  get pickerComponentClass () {
    return DateTimePicker
  }
}
