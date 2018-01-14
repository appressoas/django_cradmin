import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import { COMPONENT_GROUP_EXPANDABLE } from '../../filterListConstants'
import BemUtilities from '../../../utilities/BemUtilities'
import SearchInputExpandCollapseButton from './components/SearchInputExpandCollapseButton'

/**
 * Dropdown search input filter.
 *
 * Works mostly like {@link SearchFilter} except that it expands/collapses
 * the {@link COMPONENT_GROUP_EXPANDABLE} component group when
 * it has focus and any search input (or when the expand button is clicked).
 *
 * See {@link SearchFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "initialValue": "people",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with label and rotating placeholder</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "props": {
 *      "name": "search",
 *      "label": "Search for some people",
 *      "placeholder": ["Thor", "Santa Claus", "Odin"]
 *    }
 * }
 *
 * @example <caption>Spec - full example with something to expand</caption>
 * {
 *   "getItemsApiUrl": "https://example.com/path/to/my/api",
 *   "header": {
 *     "component": "ThreeColumnLayout",
 *     "layout": [{
 *       "component": "DropDownSearchFilter",
 *       "props": {
 *         "name": "search"
 *       }
 *     }]
 *   },
 *   "body": {
 *     "component": "ThreeColumnDropDownLayout",
 *     "props": {
 *       "componentGroups": ["expandable"]
 *     },
 *     "layout": [{
 *       "component": "SelectableList",
 *       "itemSpec": {
 *         "component": "SelectableTitleDescriptionItem",
 *         "props": {
 *           "bemVariants": ["neutral-light", "bordered"]
 *         }
 *       }
 *     }, {
 *       "component": "LoadMorePaginator"
 *     }]
 *   }
 * }
 */
export default class DropDownSearchFilter extends AbstractSearchFilter {
  /**
   * Get default props. Same props as for
   * {@link AbstractSearchFilter.defaultProps}.
   *
   * @return {Object}
   */
  static get defaultProps () {
    return super.defaultProps
  }

  static shouldReceiveFocusEvents (componentSpec) {
    return true
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClickExpandCollapseButton = this.onClickExpandCollapseButton.bind(this)
  }

  onAnyComponentFocus (newFocusComponentInfo, prevFocusComponentInfo, didChangeFilterListFocus) {
    if (newFocusComponentInfo.uniqueComponentKey === this.props.uniqueComponentKey) {
      return
    }
    if (newFocusComponentInfo.componentGroups === null) {
      this.disableExpandableComponentGroup()
    } else if (newFocusComponentInfo.componentGroups.indexOf(this.expandableComponentGroup) === -1) {
      this.disableExpandableComponentGroup()
    }
  }

  onAnyComponentBlur (blurredComponentInfo, didChangeFilterListFocus) {
    if (didChangeFilterListFocus) {
      this.disableExpandableComponentGroup()
    }
  }

  get expandableComponentGroup () {
    return COMPONENT_GROUP_EXPANDABLE
  }

  isExpanded () {
    return this.props.childExposedApi.componentGroupIsEnabled(this.expandableComponentGroup)
  }

  toggleExpandableComponentGroup () {
    this.props.childExposedApi.toggleComponentGroup(this.expandableComponentGroup)
  }

  enableExpandableComponentGroup () {
    this.props.childExposedApi.enableComponentGroup(this.expandableComponentGroup)
  }

  disableExpandableComponentGroup () {
    this.props.childExposedApi.disableComponentGroup(this.expandableComponentGroup)
  }

  onClickExpandCollapseButton () {
    this.toggleExpandableComponentGroup()
  }

  onFocus () {
    this.enableExpandableComponentGroup()
    super.onFocus()
  }

  renderExpandCollapseButton () {
    return <SearchInputExpandCollapseButton
      key={'expand-collapse-button'}
      onClick={this.onClickExpandCollapseButton}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      isExpanded={this.isExpanded()} />
  }

  renderButtons () {
    return [
      // this.renderClearButton(),
      this.renderExpandCollapseButton()
    ]
  }

  // renderSearchInput () {
  //   return <input
  //     type='text'
  //     key='input'
  //     ref={(input) => { this._searchInputRef = input }}
  //     placeholder={this.placeholder}
  //     className={this.searchInputClassName}
  //     value={this.stringValue}
  //     onFocus={this.onFocus}
  //     onBlur={this.onBlur}
  //     onChange={this.onChange} />
  // }
  //
  // renderBodyContent () {
  //   return this.renderSearchInput()
  // }
  //
  // render () {
  //   return <label className={this.labelClassName}>
  //     {this.renderLabelText()}
  //     <div className={this.fieldWrapperClassName}>
  //       <span className={this.bodyClassName}>
  //         {this.renderBodyContent()}
  //       </span>
  //       {this.renderButtons()}
  //     </div>
  //   </label>
  // }
}
