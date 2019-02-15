import React from 'react'
import PropTypes from 'prop-types'
import AbstractFilter from 'django_cradmin_js/lib/filterlist/components/filters/AbstractFilter'
import Html5FromToDateSelectors from '../../../html5datetimepicker/Html5FromToDateSelectors'

/**
 * Html5FromToDateFilter filter that does something.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "Html5FromToDateFilter",
 *    "props": {
 *      "name": "<some name here>",
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "Html5FromToDateFilter",
 *    "initialValue": "2018-12-24,2019-04-29",
 *    "props": {
 *      "name": "christmas_range",
 *      "fromDateOptions": {
 *        "label": "Christmas lasts from",
 *      },
 *      "toDateOptions": {
 *        "label": "Christmas lasts to"
 *      },
 *      "showToDateInitially": true
 *    }
 * }
 */
export default class Html5FromToDateFilter extends AbstractFilter {
  static get propTypes () {
    return {
      ...super.propTypes,
      value: PropTypes.string.isRequired,
      dateSelectorProps: PropTypes.shape({
        fromDateOptions: PropTypes.shape({
          label: PropTypes.string.isRequired
        }).isRequired,
        toDateOptions: PropTypes.shape({
          label: PropTypes.string.isRequired
        }).isRequired,
        commonDateOptions: PropTypes.shape({}).isRequired,
        showToFieldInitially: PropTypes.bool.isRequired
      })
    }
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  get datesAsList () {
    if (!this.props.value) {
      return ['', '']
    }
    const split = this.props.value.split(',', 2)
    if (split.length === 0) {
      return ['', '']
    }
    if (split.length === 1) {
      return [split[0], split[0]]
    }
    if (split.length > 2) {
      return ['', '']
    }
    return split
  }

  get fromDate () {
    return this.datesAsList[0]
  }

  get toDate () {
    return this.datesAsList[1]
  }

  handleDateChange (fromDate, toDate) {
    console.log(`Got fromDate: ${fromDate}, and toDate: ${toDate}`)
    this.setFilterValue(`${fromDate},${toDate}`)
  }

  render () {
    const config = {
      ...this.props.dateSelectorProps,
      fromDateValue: this.fromDate,
      toDateValue: this.toDate,
      onChange: this.handleDateChange
    }

    return <Html5FromToDateSelectors {...config} />
  }
}
