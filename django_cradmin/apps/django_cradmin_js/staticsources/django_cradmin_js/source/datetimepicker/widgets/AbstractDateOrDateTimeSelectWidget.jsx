import React from 'react'
import ReactDOM from 'react-dom'
import AbstractWidget from 'ievv_jsbase/lib/widget/AbstractWidget'
import moment from 'moment'
import PropTypes from 'prop-types'

export default class AbstractDateOrDateTimeSelectWidget extends AbstractWidget {
  /**
   * @returns {Object}
   * @property datetime Something that can be passed into ``moment()`` for the initial date.
   */
  getDefaultConfig () {
    return {
      datetime: null,
      locale: 'en',
      hiddenFieldName: null,
      hiddenFieldFormat: null,
      debug: true
    }
  }

  get componentClass () {
    throw new Error('componentClass getter must be implemented in subclasses')
  }

  get wrapperProps () {
    let momentObject = moment()
    if (this.config.datetime !== null) {
      momentObject = moment(this.config.datetime)
    }
    let componentProps = Object.assign({}, this.config)
    delete componentProps.hiddenFieldName
    delete componentProps.hiddenFieldFormat
    delete componentProps.moment
    return {
      componentProps: componentProps,
      componentClass: this.componentClass,
      momentObject: momentObject,
      hiddenFieldName: this.config.hiddenFieldName,
      hiddenFieldFormat: this.config.hiddenFieldFormat,
      debug: this.config.debug
    }
  }

  renderWrapper () {
    return <DateOrDateTimeSelectWrapper {...this.wrapperProps} />
  }

  constructor (element, widgetInstanceId) {
    super(element, widgetInstanceId)
    ReactDOM.render(
      this.renderWrapper(),
      this.element
    )
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}

export class DateOrDateTimeSelectWrapper extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      hiddenFieldName: null,
      hiddenFieldFormat: null,
      componentClass: null,
      componentProps: null,
      debug: false
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      hiddenFieldName: PropTypes.string.isRequired,
      hiddenFieldFormat: PropTypes.string.isRequired,
      componentClass: PropTypes.any.isRequired,
      componentProps: PropTypes.object.isRequired,
      debug: PropTypes.bool.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      useMoment: this.props.momentObject
    }
  }

  onChange (momentObject) {
    this.setState({
      useMoment: momentObject
    })
  }

  renderComponent () {
    const ComponentClass = this.props.componentClass
    return <ComponentClass
      key={'datetimeComponent'}
      moment={this.state.useMoment}
      onChange={this.onChange}
      {...this.props.componentProps}
    />
  }

  get hiddenFieldValue () {
    if (this.state.useMoment !== null) {
      return this.state.useMoment.format(this.props.hiddenFieldFormat)
    }
    return ''
  }

  get hiddenFieldType () {
    if (this.props.debug) {
      return 'text'
    }
    return 'hidden'
  }

  renderHiddenField () {
    return <input
      key={'hiddenField'}
      type={this.hiddenFieldType}
      name={this.props.hiddenFieldName}
      value={this.hiddenFieldValue}
      readOnly
    />
  }

  render () {
    return [
      this.renderComponent(),
      this.renderHiddenField()
    ]
  }
}
