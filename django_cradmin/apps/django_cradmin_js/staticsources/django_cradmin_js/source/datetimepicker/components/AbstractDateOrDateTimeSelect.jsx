import React from 'react'
import moment from 'moment'
import BemUtilities from '../../utilities/BemUtilities'
import PropTypes from 'prop-types'

export default class AbstractDateOrDateTimeSelect extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      initialFocusMomentObject: moment(),
      locale: null,
      bemBlock: 'datetimepicker',
      bemVariants: [],
      selectedPreviewFormat: null,
      bodyBemVariants: [],
      onChange: null
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      initialFocusMomentObject: PropTypes.any.isRequired,
      locale: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      selectedPreviewFormat: PropTypes.string.isRequired,
      bodyBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onChange: PropTypes.func
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
    this.setDraftMomentObject = this.setDraftMomentObject.bind(this)
    this.triggerOnChange = this.triggerOnChange.bind(this)
  }

  makeInitialState () {
    return {
      draftMomentObject: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      draftMomentObject: props.momentObject
    }
  }

  //
  // Event handling and setting of selected datetime
  //

  triggerOnChange (momentObject, onComplete = null) {
    this.setState({
      draftMomentObject: momentObject
    }, () => {
      if (this.props.onChange !== null) {
        this.props.onChange(momentObject)
      }
      if (onComplete !== null) {
        onComplete()
      }
    })
  }

  setDraftMomentObject (draftMomentObject) {
    throw new Error('Must override setDraftMomentObject()')
  }

  //
  // Easily overridable component props
  //

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  get bodyClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'body', this.props.bodyBemVariants)
  }

  get previewClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'preview')
  }

  get pickerComponentClass () {
    throw new Error('Must override pickerComponentClass getter')
  }

  get pickerComponentProps () {
    return {
      momentObject: this.state.draftMomentObject,
      initialFocusMomentObject: this.props.initialFocusMomentObject,
      locale: this.props.locale,
      onChange: this.setDraftMomentObject
    }
  }

  get draftMomentObjectPreviewFormatted () {
    if (this.state.draftMomentObject === null) {
      return ''
    }
    return this.state.draftMomentObject.format(this.props.selectedPreviewFormat)
  }

  get momentObjectPreviewFormatted () {
    return this.props.momentObject.format(this.props.selectedPreviewFormat)
  }

  //
  // Rendering
  //

  renderSelectedPreview () {
    return <p key={'preview'} className={this.previewClassName}>
      {this.draftMomentObjectPreviewFormatted}
    </p>
  }

  renderPicker () {
    const PickerComponent = this.pickerComponentClass
    return <PickerComponent key={'picker'} {...this.pickerComponentProps} />
  }

  renderBodyContent () {
    return [
      this.renderPicker(),
      this.renderSelectedPreview()
    ]
  }

  renderBody () {
    return <div key={'body'} className={this.bodyClassName}>
      {this.renderBodyContent()}
    </div>
  }

  renderContent () {
    return [
      this.renderBody()
    ]
  }

  render () {
    return <div className={this.className}>
      {this.renderContent()}
    </div>
  }
}
