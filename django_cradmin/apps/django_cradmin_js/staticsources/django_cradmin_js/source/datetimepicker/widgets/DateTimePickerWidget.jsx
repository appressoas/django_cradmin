import React from 'react'
import ReactDOM from 'react-dom'
import AbstractWidget from 'ievv_jsbase/lib/widget/AbstractWidget'
import moment from 'moment'
import DateTimePickerForWidget from './DateTimePickerForWidget'

export default class DateTimePickerWidget extends AbstractWidget {
  /**
   * @returns {Object}
   * @property moment Something that can be passed into ``moment()`` for the initial date.
   */
  getDefaultConfig () {
    return {
      moment: null,
      locale: 'en',
      showSeconds: false,
      size: 'small'
    }
  }

  constructor (element, widgetInstanceId) {
    super(element, widgetInstanceId)
    let momentObject = moment()
    if (this.config.moment !== null) {
      momentObject = moment(this.config.moment)
    }
    const props = {
      moment: momentObject,
      locale: this.config.locale,
      showSeconds: this.config.showSeconds,
      size: this.config.size
    }
    ReactDOM.render(
      <DateTimePickerForWidget {...props} />,
      this.element
    )
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
