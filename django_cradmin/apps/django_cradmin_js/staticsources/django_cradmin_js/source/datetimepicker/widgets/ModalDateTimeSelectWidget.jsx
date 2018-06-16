import ModalDateTimeSelect from '../components/ModalDateTimeSelect'
import AbstractDateOrDateTimeSelectWidget from './AbstractDateOrDateTimeSelectWidget'

export default class ModalDateTimeSelectWidget extends AbstractDateOrDateTimeSelectWidget {
  getDefaultConfig () {
    return Object.assign({}, super.getDefaultConfig(), {
      hiddenFieldFormat: 'YYYY-MM-DD HH:mm:ss'
    })
  }

  get componentClass () {
    return ModalDateTimeSelect
  }
}
