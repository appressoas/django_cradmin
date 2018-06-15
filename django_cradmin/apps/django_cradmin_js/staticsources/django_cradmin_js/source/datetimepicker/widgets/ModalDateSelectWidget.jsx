import React from 'react'
import ReactDOM from 'react-dom'
import AbstractWidget from 'ievv_jsbase/lib/widget/AbstractWidget'
import moment from 'moment'
import ModalDateSelect from '../components/ModalDateSelect'

export default class ModalDateSelectWidget extends AbstractWidget {
  /**
   * @returns {Object}
   * @property moment Something that can be passed into ``moment()`` for the initial date.
   */
  getDefaultConfig () {
    return {
      moment: null,
      locale: 'en',
      hiddenFieldName: null,
      title: null
    }
  }

  constructor (element, widgetInstanceId) {
    super(element, widgetInstanceId)
    let momentObject = moment()
    if (this.config.moment !== null) {
      momentObject = moment(this.config.moment)
    }
    const props = Object.assign({}, this.config, {
      moment: momentObject
    })
    ReactDOM.render(
      <ModalDateSelect {...props} />,
      this.element
    )
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
