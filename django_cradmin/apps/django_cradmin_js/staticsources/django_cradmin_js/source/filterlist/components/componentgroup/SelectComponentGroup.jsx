import React from 'react'
import AbstractComponentGroup from './AbstractComponentGroup'
import BemUtilities from '../../../utilities/BemUtilities'
import PropTypes from 'prop-types'

export default class SelectComponentGroup extends AbstractComponentGroup {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      selectableComponentGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
      initialEnabled: PropTypes.string.isRequired,
      bemBlock: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      name: PropTypes.string.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      selectableComponentGroups: [],
      initialEnabled: '',
      bemBlock: 'radio',
      name: null,
      bemVariants: ['block'],
      label: '',
      wrapperClassName: 'label'
    })
  }

  componentDidMount () {
    super.componentDidMount()

    this.selectComponentGroup(this.props.initialEnabled)
  }

  componentWillReceiveProps (nextProps) {
    let selected = ''
    for (const componentGroup of nextProps.selectableComponentGroups) {
      if (nextProps.childExposedApi.componentGroupIsEnabled(componentGroup.name)) {
        if (selected) {
          this.selectComponentGroup(selected)
          break
        }
        selected = componentGroup.name
      }
    }

    if (!selected) {
      this.selectComponentGroup(nextProps.initialEnabled)
    }
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.selectComponentGroup = this.selectComponentGroup.bind(this)
    this.selectComponentGroupClickListener = this.selectComponentGroupClickListener.bind(this)
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  selectComponentGroup (enabledComponentGroup) {
    if (!this.props.childExposedApi.componentGroupIsEnabled(enabledComponentGroup)) {
      this.props.childExposedApi.enableComponentGroup(enabledComponentGroup)
    }

    for (const componentGroup of this.props.selectableComponentGroups) {
      if (componentGroup.name !== enabledComponentGroup &&
          this.props.childExposedApi.componentGroupIsEnabled(componentGroup.name)) {
        this.props.childExposedApi.disableComponentGroup(componentGroup.name)
      }
    }
  }

  selectComponentGroupClickListener (event) {
    this.selectComponentGroup(event.target.value)
  }

  renderSelectableComponentGroups () {
    const selectableComponentGroups = []
    for (const componentGroup of this.props.selectableComponentGroups) {
      selectableComponentGroups.push(
        <label className={this.className} key={componentGroup.name}>
          <input
            type={'radio'}
            name={this.props.name}
            value={componentGroup.name}
            checked={this.props.enabledComponentGroups.has(componentGroup.name)}
            onChange={this.selectComponentGroupClickListener} />
          <span className={'radio__control-indicator'} />
          {componentGroup.label}
        </label>
      )
    }

    return selectableComponentGroups
  }

  render () {
    if (this.props.selectableComponentGroups.length === 0) {
      console.warn('attempting to use SelectComponentGroup without passing any selectableComponentGroups - not rendering anything.')
      return null
    }
    return <p className={this.props.wrapperClassName}>
      {this.props.label}
      {this.renderSelectableComponentGroups()}
    </p>
  }
}
