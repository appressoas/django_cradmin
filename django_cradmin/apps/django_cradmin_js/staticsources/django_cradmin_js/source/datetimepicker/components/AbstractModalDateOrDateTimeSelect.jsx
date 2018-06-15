import React from 'react'
import AbstractDateOrDateTimeSelect from './AbstractDateOrDateTimeSelect'
import PropTypes from 'prop-types'
import { gettext, pgettext } from 'ievv_jsbase/lib/gettext'
import BemUtilities from '../../utilities/BemUtilities'

export default class AbstractModalDateOrDateTimeSelect extends AbstractDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign({}, super.defaultProps, {
      bemVariants: ['modal'],
      bodyBemVariants: ['modal'],
      openButtonBemBlock: 'button',
      openButtonBemVariants: [],
      useButtonBemBlock: 'button',
      useButtonBemVariants: ['block', 'primary'],
      noneSelectedButtonLabel: null,
      title: null,
      useButtonLabel: pgettext('datetimepicker', 'Use')
    })
  }

  static get propTypes () {
    return Object.assign({}, {
      openButtonBemBlock: PropTypes.string.isRequired,
      openButtonBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      noneSelectedButtonLabel: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      useButtonLabel: PropTypes.string.isRequired
    })
  }

  constructor (props) {
    super(props)
    this.onOpenButtonClick = this.onOpenButtonClick.bind(this)
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
    this.onUseButtonClick = this.onUseButtonClick.bind(this)
  }

  makeInitialState () {
    return Object.assign({}, super.makeInitialState(), {
      isOpen: false
    })
  }

  get openButtonClassName () {
    return BemUtilities.addVariants(this.props.openButtonBemBlock, this.props.openButtonBemVariants)
  }

  get useButtonClassName () {
    return BemUtilities.addVariants(this.props.useButtonBemBlock, this.props.useButtonBemVariants)
  }

  get backdropClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'backdrop')
  }

  get titleClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'title')
  }

  get closeButtonClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'close')
  }

  get closeButtonTitle () {
    return gettext('Close')
  }

  get closeButtonIconClassName () {
    return 'cricon cricon--close'
  }

  onUseButtonClick () {
    console.log('USE!')
  }

  onOpenButtonClick () {
    this.setState({
      isOpen: true
    })
  }

  onCloseButtonClick () {
    this.setState({
      isOpen: false
    })
  }

  renderOpenButtonLabel () {
    if (this.props.moment === null) {
      return this.props.noneSelectedButtonLabel
    }
    return this.selectedMomentPreviewFormatted
  }

  renderOpenButton () {
    return <button type={'button'} className={this.openButtonClassName} onClick={this.onOpenButtonClick}>
      {this.renderOpenButtonLabel()}
    </button>
  }

  renderCloseButton () {
    return <div className={this.closeButtonClassName} key={'closeButton'}>
      <button type='button' title={this.closeButtonTitle} onClick={this.onCloseButtonClick}>
        <span className={this.closeButtonIconClassName} aria-hidden='true' />
      </button>
    </div>
  }

  renderTitle () {
    if (this.props.title === null) {
      return null
    }
    return <div key={'title'} className={this.titleClassName}>
      {this.props.title}
    </div>
  }

  renderUseButtonLabel () {
    return this.props.useButtonLabel
  }

  renderUseButton () {
    return <button key={'useButton'} type={'button'} className={this.useButtonClassName} onClick={this.onUseButtonClick}>
      {this.renderUseButtonLabel()}
    </button>
  }

  renderBodyContent () {
    return [
      this.renderCloseButton(),
      this.renderTitle(),
      ...super.renderBodyContent(),
      this.renderUseButton()
    ]
  }

  renderBackdrop () {
    return <div key={'backdrop'} className={this.backdropClassName} onClick={this.onCloseButtonClick} />
  }

  renderContent () {
    return [
      this.renderBackdrop(),
      ...super.renderContent()
    ]
  }

  renderModal () {
    if (this.state.isOpen) {
      return super.render()
    }
    return null
  }

  render () {
    return <div>
      {this.renderOpenButton()}
      {this.renderModal()}
    </div>
  }
}
