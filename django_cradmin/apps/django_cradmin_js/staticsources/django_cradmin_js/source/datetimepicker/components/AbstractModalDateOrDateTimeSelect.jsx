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
      useButtonBemBlock: 'button',
      useButtonBemVariants: ['block', 'primary'],
      noneSelectedButtonLabel: null,
      title: null,
      useButtonLabel: pgettext('datetimepicker', 'Use'),
      openModalButtonLabel: pgettext('datetimepicker', 'Select')
    })
  }

  static get propTypes () {
    return Object.assign({}, {
      noneSelectedButtonLabel: PropTypes.string,
      title: PropTypes.string.isRequired,
      useButtonLabel: PropTypes.string.isRequired,
      openModalButtonLabel: PropTypes.string.isRequired
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

  setSelectedMoment (selectedMoment) {
    this.setState({
      selectedMoment: selectedMoment
    })
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

  triggerOnChange (useMoment, onComplete = null) {
    super.triggerOnChange(useMoment, () => {
      this.setState({
        isOpen: false
      }, onComplete)
    })
  }

  onUseButtonClick () {
    this.triggerOnChange(this.state.selectedMoment)
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

  renderOpenButton () {
    return <button
      type={'button'}
      key={'openButton'}
      className={'buttonbar__button buttonbar__button--secondary'}
      onClick={this.onOpenButtonClick}
    >
      <span className='cricon cricon--calendar' aria-hidden='true' />
      {' '}
      {this.props.openModalButtonLabel}
    </button>
  }

  renderUsePreviewLabel () {
    let label = this.props.noneSelectedButtonLabel
    if (this.state.useMoment !== null) {
      label = this.useMomentPreviewFormatted
    }
    if (label === null) {
      return null
    }
    return <span className='datetime-preview__label'>
      {label}
    </span>
  }

  renderUsePreviewButtons () {
    return [
      this.renderOpenButton()
    ]
  }

  renderUsePreviewBox () {
    return <div>
      <div className='datetime-preview'>
        {this.renderUsePreviewLabel()}
        <span className='buttonbar buttonbar--inline buttonbar--nomargin'>
          {this.renderUsePreviewButtons()}
        </span>
      </div>
    </div>
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
      return <div className={this.className}>
        {this.renderContent()}
      </div>
    }
    return null
  }

  render () {
    return <div>
      {this.renderUsePreviewBox()}
      {this.renderModal()}
    </div>
  }
}
