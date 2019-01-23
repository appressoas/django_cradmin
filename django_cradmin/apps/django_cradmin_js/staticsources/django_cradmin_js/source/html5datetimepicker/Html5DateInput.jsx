import React from 'react'
import moment from 'moment'
import * as gettext from 'ievv_jsbase/lib/gettext'
import AbstractHtml5DatetimeInput from './AbstractHtml5DatetimeInput'

export default class Html5DateInput extends AbstractHtml5DatetimeInput {
  valueStringToMoment (stringValue) {
    if (stringValue) {
      const momentValue = moment(stringValue)
      if (momentValue.isValid()) {
        return momentValue
      }
    }
    return null
  }

  get momentValue () {
    return this.valueStringToMoment(this.props.value)
  }

  parseInputValue (stringValue) {
    let momentValue = null
    let isValid = true
    let isoStringValue = ''
    if (stringValue) {
      momentValue = moment(stringValue, this.momentInputFormat)
      if (momentValue.isValid()) {
        isoStringValue = momentValue.format('YYYY-MM-DD')
      } else {
        momentValue = null
        isValid = false
      }
    }
    return {
      isValid: isValid,
      momentValue: momentValue,
      isoStringValue: isoStringValue
    }
  }

  handleChange (stringValue) {
    stringValue = stringValue || ''
    this.setState({
      value: stringValue
    }, () => {
      const parseResult = this.parseInputValue(stringValue)
      this.props.onChange(parseResult.isoStringValue, parseResult.momentValue)
    })
  }

  onBlur (e) {
    let stringValue = e.target.value || ''
    const parseResult = this.parseInputValue(stringValue)
    if (parseResult.isoStringValue !== '') {
      stringValue = parseResult.momentValue.format(this.inputFormat)
    }
    this.setState({
      isBlurred: true,
      value: stringValue
    })
  }

  getInputType () {
    return 'date'
  }

  get inputFormat () {
    if (this.browserFullySupportsDateInput()) {
      return 'YYYY-MM-DD'
    }
    return moment.localeData().longDateFormat('L')
  }

  get humanReadableInputFormat () {
    return gettext.pgettext('date format', this.inputFormat)
  }

  renderInput () {
    return <input {...this.inputProps} key={'date input'} />
  }

  renderInvalidInputText () {
    let prefix = ''
    if (this.state.isBlurred) {
      prefix = `${gettext.gettext('Invalid date format')}. `
    }
    const commonText = gettext.interpolate(
      gettext.gettext('Please type a date using this format: %(format)s'),
      {format: this.humanReadableInputFormat}, true
    )
    return `${prefix}${commonText}`
  }
}


// import React from 'react'
// import PropTypes from 'prop-types'
// import moment from 'moment'
// import BemUtilities from '../utilities/BemUtilities'
// import * as is from 'is_js'
// import * as gettext from 'ievv_jsbase/lib/gettext'
// import UniqueDomIdSingleton from 'ievv_jsbase/lib/dom/UniqueDomIdSingleton'
// export default class Html5DateInput extends React.Component {
//   static get defaultProps () {
//     return {
//       value: null,
//       bemBlock: 'input',
//       bemVariants: ['outlined'],
//       errorBemVariants: ['error'],
//       messageBemBlock: 'message',
//       messageErrorBemVariants: ['error'],
//       messageInfoBemVariants: ['info'],
//       onChange: null,
//       ariaLabel: null,
//       ariaLabelledBy: null,
//       ariaDescribedBy: null,
//       min: null,
//       max: null,
//       readOnly: false,
//       required: false
//     }
//   }
//
//   static get propTypes () {
//     return {
//       value: PropTypes.string,
//       bemBlock: PropTypes.string.isRequired,
//       bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
//       errorBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
//       messageBemBlock: PropTypes.string.isRequired,
//       messageErrorBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
//       messageInfoBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
//       onChange: PropTypes.func,
//       ariaLabel: PropTypes.string,
//       ariaLabelledBy: PropTypes.string,
//       ariaDescribedBy: PropTypes.string,
//       min: PropTypes.string,
//       max: PropTypes.string,
//       readOnly: PropTypes.bool.isRequired,
//       required: PropTypes.bool.isRequired
//     }
//   }
//
//   constructor (props) {
//     super(props)
//     this.onChange = this.onChange.bind(this)
//     this.onBlur = this.onBlur.bind(this)
//     this.onFocus = this.onFocus.bind(this)
//     this.messageDomId = new UniqueDomIdSingleton().generate()
//     this.state = {
//       value: this.props.value || '',
//       isBlurred: false
//     }
//   }
//
//   valueStringToMoment (stringValue) {
//     if (stringValue) {
//       const momentValue = moment(stringValue)
//       if (momentValue.isValid()) {
//         return momentValue
//       }
//     }
//     return null
//   }
//
//   get momentValue () {
//     return this.valueStringToMoment(this.props.value)
//   }
//
//   parseInputValue (stringValue) {
//     let momentValue = null
//     let isValid = true
//     let isoStringValue = ''
//     if (stringValue) {
//       momentValue = moment(stringValue, this.momentInputFormat)
//       if (momentValue.isValid()) {
//         isoStringValue = momentValue.format('YYYY-MM-DD')
//       } else {
//         momentValue = null
//         isValid = false
//       }
//     }
//     return {
//       isValid: isValid,
//       momentValue: momentValue,
//       isoStringValue: isoStringValue
//     }
//   }
//
//   handleChange (stringValue) {
//     stringValue = stringValue || ''
//     this.setState({
//       value: stringValue
//     }, () => {
//       const parseResult = this.parseInputValue(stringValue)
//       this.props.onChange(parseResult.isoStringValue, parseResult.momentValue)
//     })
//   }
//
//   onChange (e) {
//     this.handleChange(e.target.value)
//   }
//
//   onBlur (e) {
//     let stringValue = e.target.value || ''
//     const parseResult = this.parseInputValue(stringValue)
//     if (parseResult.isoStringValue !== '') {
//       stringValue = parseResult.momentValue.format(this.momentInputFormat)
//     }
//     this.setState({
//       isBlurred: true,
//       value: stringValue
//     })
//   }
//
//   onFocus () {
//     this.setState({
//       isBlurred: false
//     })
//   }
//
//   get className () {
//     let bemVariants = this.props.bemVariants
//     if (!this.hasValidInput()) {
//       bemVariants = this.props.errorBemVariants
//     }
//     return BemUtilities.buildBemBlock(this.props.bemBlock, bemVariants)
//   }
//
//   get messageClassName () {
//     let bemVariants = this.props.messageInfoBemVariants
//     if (this.state.isBlurred) {
//       bemVariants = this.props.messageErrorBemVariants
//     }
//     return BemUtilities.buildBemBlock(this.props.messageBemBlock, bemVariants)
//   }
//
//   get inputType () {
//     if (this.browserFullySupportsDateInput()) {
//       return 'date'
//     }
//     return 'text'
//   }
//
//   get momentInputFormat () {
//     if (this.browserFullySupportsDateInput()) {
//       return 'YYYY-MM-DD'
//     }
//     return moment.localeData().longDateFormat('L')
//   }
//
//   get humanReadableInputFormat () {
//     return gettext.pgettext('date format', this.momentInputFormat)
//   }
//
//   browserFullySupportsDateInput () {
//     // NOTE: This can be simplified, but is not for readability
//     // return false
//     if (is.chrome() || is.firefox() || is.opera() || is.edge()) {
//       return true
//     }
//     if (is.safari() && !is.desktop()) {
//       return true
//     }
//     return false
//   }
//
//   get placeholder () {
//     if (this.browserFullySupportsDateInput()) {
//       return null
//     }
//
//     return this.humanReadableInputFormat
//   }
//
//   get inputProps () {
//     let ariaDescribedByArray = []
//     let props = {
//       type: this.inputType,
//       placeholder: this.placeholder,
//       min: this.props.min,
//       max: this.props.max,
//       value: this.state.value,
//       readOnly: this.props.readOnly,
//       required: this.props.required,
//       'aria-label': this.props.ariaLabel,
//       'aria-labelledby': this.props.ariaLabelledBy,
//       onChange: this.onChange,
//       onBlur: this.onBlur,
//       onFocus: this.onFocus,
//       className: this.className
//     }
//
//     if (!this.hasValidInput()) {
//       ariaDescribedByArray.push(this.messageDomId)
//       if (this.state.isBlurred) {
//         props['aria-invalid'] = true
//       }
//     }
//     if (this.props.ariaDescribedBy) {
//       ariaDescribedByArray.push(this.props.ariaDescribedBy)
//     }
//     if (ariaDescribedByArray.length > 0) {
//       props['aria-describedby'] = ariaDescribedByArray.join(' ')
//     }
//
//     return props
//   }
//
//   renderInput () {
//     return <input {...this.inputProps} key={'date input'} />
//   }
//
//   hasValidInput () {
//     const currentValue = this.state.value
//     if (!currentValue) {
//       return true
//     }
//     const parseResult = this.parseInputValue(currentValue)
//     return parseResult.isValid
//   }
//
//   renderInvalidInputText () {
//     let prefix = ''
//     if (this.state.isBlurred) {
//       prefix = `${gettext.gettext('Invalid date format')}. `
//     }
//     const commonText = gettext.interpolate(
//       gettext.gettext('Please type a date using this format: %(format)s'),
//       {format: this.humanReadableInputFormat}, true
//     )
//     return `${prefix}${commonText}`
//   }
//
//   renderInvalidInputMessage () {
//     return <p className={this.messageClassName} id={this.messageDomId}>
//       {this.renderInvalidInputText()}
//     </p>
//   }
//
//   renderErrors () {
//     if (this.hasValidInput()) {
//       return null
//     }
//     return this.renderInvalidInputMessage()
//   }
//
//   render () {
//     return <React.Fragment>
//       {this.renderInput()}
//       {this.renderErrors()}
//     </React.Fragment>
//   }
// }
