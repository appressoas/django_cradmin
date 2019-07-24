import AbstractWidget from 'ievv_jsbase/lib/widget/AbstractWidget'

export default class DisableFormSubmitOnEnter extends AbstractWidget {
  constructor (element, widgetInstanceId) {
    super(element, widgetInstanceId)

    const suppressEnter = (event) => {
      let target = null
      if (event.target) {
        target = event.target
      } else if (event.srcElement) {
        target = event.srcElement
      }

      if (target && event.keyCode === 13 && target.type === 'text') {
        return false
      }
    }
    element.onkeypress = suppressEnter
  }
}
