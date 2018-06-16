import AbstractWidget from 'ievv_jsbase/lib/widget/AbstractWidget'
import ModalDateSelect from '../components/ModalDateSelect'

export default class ModalDateSelectWidget extends AbstractWidget {
  getDefaultConfig () {
    return Object.assign({}, super.getDefaultConfig(), {
      hiddenFieldFormat: 'YYYY-MM-DD'
    })
  }

  get componentClass () {
    return ModalDateSelect
  }
}
