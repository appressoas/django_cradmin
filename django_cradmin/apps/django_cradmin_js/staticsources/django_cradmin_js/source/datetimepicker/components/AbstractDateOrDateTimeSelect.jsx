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
      bodyBemVariants: []
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
      bodyBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      selectedMoment: this.props.moment
    }
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
      onChange: (moment) => {
        this.setState({selectedMoment: moment})
      }
    }
  }

  get selectedMomentPreviewFormatted () {
    return this.state.selectedMoment.format(this.props.selectedPreviewFormat)
  }

  renderPreview () {
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
      this.renderPreview()
    ]
  }

  renderBody () {
    return <div key={'body'} className={this.bodyClassName}>
      {this.renderBodyContent()}
    </div>
  }

  get hiddenFieldValue () {
    return this.state.selectedMoment.format(this.props.hiddenFieldFormat)
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
      this.renderBody(),
      this.renderHiddenField()
    ]
  }

  render () {
    return <div className={this.className}>
      {this.renderContent()}
    </div>
  }
}
