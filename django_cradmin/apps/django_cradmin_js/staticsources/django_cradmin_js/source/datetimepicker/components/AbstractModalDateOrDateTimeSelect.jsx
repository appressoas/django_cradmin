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
      openButtonEmptyLabel: pgettext('datetimepicker', 'Select')
    })
  }

  static get propTypes () {
    return Object.assign({}, {
      noneSelectedButtonLabel: PropTypes.string,
      title: PropTypes.string.isRequired,
      useButtonLabel: PropTypes.string.isRequired,
      openButtonEmptyLabel: PropTypes.string.isRequired
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

  setDraftMomentObject (draftMomentObject) {
    this.setState({
      draftMomentObject: draftMomentObject
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

  triggerOnChange (momentObject, onComplete = null) {
    super.triggerOnChange(momentObject, () => {
      this.setState({
        isOpen: false
      }, onComplete)
    })
  }

  onUseButtonClick () {
    this.triggerOnChange(this.state.draftMomentObject)
  }

  onOpenButtonClick () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onCloseButtonClick () {
    this.setState({
      isOpen: false
    })
  }

  renderOpenButtonLabel () {
    if (this.props.momentObject === null) {
      return this.props.openButtonEmptyLabel
    }
    return this.momentObjectPreviewFormatted
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
      {this.props.openButtonEmptyLabel}
    </button>
  }

  get openPickerComponentProps () {
    return {
      momentObject: this.props.momentObject,
      onOpen: this.onOpenButtonClick,
      onChange: this.triggerOnChange
    }
  }

  get openPickerComponentClass () {
    throw new Error('The openPickerComponentClass getter must be implemented in subclasses')
  }

  renderOpenPicker () {
    const OpenPickerComponent = this.openPickerComponentClass
    return <OpenPickerComponent {...this.openPickerComponentProps} />
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
      {this.renderOpenPicker()}
      {this.renderModal()}
    </div>
  }
}
