import React from 'react'
import PropTypes from 'prop-types'
import * as gettext from 'ievv_jsbase/lib/gettext'
import BemUtilities from '../../utilities/BemUtilities'
import moment from 'moment/moment'

export default class AbstractOpenPicker extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      momentObjectFormat: null,
      openButtonEmptyLabel: gettext.pgettext('datetimepicker', 'Select'),
      includeNowButton: true,
      nowButtonLabel: null,
      onOpen: null,
      onChange: null,
      wrapperBemVariants: ['xs'],
      buttonBarBemVariants: ['nomargin']
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      momentObjectFormat: PropTypes.string.isRequired,
      openButtonEmptyLabel: PropTypes.string.isRequired,
      includeNowButton: PropTypes.bool,
      nowButtonLabel: PropTypes.string.isRequired,
      onOpen: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
      wrapperBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired
    }
  }

  constructor (props) {
    super(props)
    this.onNowButtonClick = this.onNowButtonClick.bind(this)
  }

  onNowButtonClick () {
    this.props.onChange(moment())
  }

  get wrapperBemBlock () {
    return 'max-width'
  }

  get wrapperClassName () {
    return BemUtilities.addVariants(this.wrapperBemBlock, this.props.wrapperBemVariants)
  }

  get buttonBarBemBlock () {
    return 'buttonbar'
  }

  get buttonBarClassName () {
    return BemUtilities.addVariants(this.buttonBarBemBlock, this.props.buttonBarBemVariants)
  }

  makeButtonClassName (bemVariants = []) {
    return BemUtilities.buildBemElement(this.buttonBarBemBlock, 'button', bemVariants)
  }

  renderIcon (name, bemVariants = []) {
    const className = BemUtilities.addVariants('cricon', [name, ...bemVariants])
    return <span className={className} aria-hidden='true' />
  }

  renderOpenButtonLabel () {
    if (this.props.momentObject === null) {
      return this.props.openButtonEmptyLabel
    }
    return this.props.momentObject.format(this.props.momentObjectFormat)
  }

  renderOpenButtonIcon () {
    return <span>{this.renderIcon('calendar')}{' '}</span>
  }

  renderOpenButton () {
    return <button
      key={'openButton'}
      type={'button'}
      className={this.makeButtonClassName(['input-outlined', 'grow-2', 'width-xsmall'])}
      onClick={this.props.onOpen}
    >
      {this.renderOpenButtonIcon()}
      {this.renderOpenButtonLabel()}
    </button>
  }

  renderNowButtonLabel () {
    return this.props.nowButtonLabel
  }

  renderNowButton () {
    return <button
      key={'nowButton'}
      type={'button'}
      className={this.makeButtonClassName(['fill', 'no-grow'])}
      onClick={this.onNowButtonClick}
    >
      {this.renderNowButtonLabel()}
    </button>
  }

  renderButtons () {
    let buttons = [
      this.renderOpenButton()
    ]
    if (this.props.includeNowButton) {
      buttons.push(this.renderNowButton())
    }
    return buttons
  }

  renderButtonBar () {
    return <div className={this.buttonBarClassName}>
      {this.renderButtons()}
    </div>
  }

  render () {
    return <div className={this.wrapperClassName}>
      {this.renderButtonBar()}
    </div>
  }
}
