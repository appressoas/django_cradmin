import EmbeddedDateTimeSelect from '../components/EmbeddedDateTimeSelect'
import AbstractDateOrDateTimeSelectWidget from './AbstractDateOrDateTimeSelectWidget'

export default class EmbeddedDateTimeSelectWidget extends AbstractDateOrDateTimeSelectWidget {
  getDefaultConfig () {
    return Object.assign({}, super.getDefaultConfig(), {
      hiddenFieldFormat: 'YYYY-MM-DD HH:mm:ss'
    })
  }

  get componentClass () {
    return EmbeddedDateTimeSelect
  }
}
