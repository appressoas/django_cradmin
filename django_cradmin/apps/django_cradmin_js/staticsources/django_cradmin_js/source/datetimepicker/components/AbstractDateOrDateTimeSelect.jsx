import React from 'react'
import BemUtilities from '../../utilities/BemUtilities'
import PropTypes from 'prop-types'

export default class AbstractDateOrDateTimeSelect extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      bemBlock: 'datetimepicker',
      bemVariants: [],
      hiddenFieldName: null,
      hiddenFieldFormat: 'YYYY-MM-DD HH:mm:ss',
      selectedPreviewFormat: null,
      bodyBemVariants: [],
      onChange: null
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      hiddenFieldName: PropTypes.string,
      hiddenFieldFormat: PropTypes.string.isRequired,
      selectedPreviewFormat: PropTypes.string.isRequired,
      bodyBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onChange: PropTypes.func
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      selectedMoment: this.props.moment,

      // Only set when the user actually triggers the action that triggers onChange
      useMoment: null
    }
  }

  triggerOnChange (useMoment, onComplete = null) {
    this.setState({
      selectedMoment: useMoment,
      useMoment: useMoment
    }, () => {
      if (this.props.onChange !== null) {
        this.props.onChange(useMoment)
      }
      if (onComplete !== null) {
        onComplete()
      }
    })
  }

  setSelectedMoment (selectedMoment) {
    throw new Error('Must override setSelectedMoment()')
  }

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
      moment: this.state.selectedMoment,
      locale: this.props.locale,
      onChange: (selectedMoment) => {
        this.setSelectedMoment(selectedMoment)
      }
    }
  }

  get selectedMomentPreviewFormatted () {
    return this.state.selectedMoment.format(this.props.selectedPreviewFormat)
  }

  get useMomentPreviewFormatted () {
    return this.state.useMoment.format(this.props.selectedPreviewFormat)
  }

  renderSelectedPreview () {
    return <p key={'preview'} className={this.previewClassName}>
      {this.selectedMomentPreviewFormatted}
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

  get hiddenFieldValue () {
    if (this.state.useMoment !== null) {
      return this.state.useMoment.format(this.props.hiddenFieldFormat)
    }
    return ''
  }

  renderHiddenField () {
    if (this.props.hiddenFieldName === null) {
      return null
    }
    return <input
      key={'hiddenField'}
      type={'hidden'}
      name={this.props.hiddenFieldName}
      value={this.hiddenFieldValue}
      readOnly
    />
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
