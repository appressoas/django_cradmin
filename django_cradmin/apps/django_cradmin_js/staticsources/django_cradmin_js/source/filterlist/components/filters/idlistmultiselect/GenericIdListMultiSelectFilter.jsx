import React from 'react'
import PropTypes from 'prop-types'
import AbstractFilter from '../AbstractFilter'
import AbstractGenericIdListMultiSelectItem from './AbstractGenericIdListMultiSelectItem'
import PageNumberPaginationFilterList from '../../filterlists/PageNumberPaginationFilterList'
import ThreeColumnLayout from '../../layout/ThreeColumnLayout'
import LoadMorePaginator from '../../paginators/LoadMorePaginator'
import DropDownSearchFilter from '../DropDownSearchFilter'
import * as gettext from 'ievv_jsbase/lib/gettext'
import SelectableList from '../../lists/SelectableList'
import GenericFilterListItemWrapper from './GenericFilterListItemWrapper'
import GenericSearchFilterWrapper from './GenericSearchFilterWrapper'
import { MULTISELECT } from '../../../filterListConstants'

export default class GenericIdListMultiSelectFilter extends AbstractFilter {
  static get propTypes () {
    return {
      ...super.propTypes,
      idListApiUrl: PropTypes.string.isRequired,
      listItemIdName: PropTypes.string.isRequired,
      itemComponentType: PropTypes.any.isRequired,
      itemComponentPropOverrides: PropTypes.object,
      searchFilterComponentType: PropTypes.any,
      SearchFilterComponentPropOverrides: PropTypes.object,
      searchFilterLabel: PropTypes.string.isRequired,
      searchFilterName: PropTypes.string.isRequired,
      searchFilterPlaceholders: PropTypes.arrayOf(PropTypes.string.isRequired)
    }
  }

  static get defaultProps () {
    return {
      ...super.defaultProps,
      idListApiUrl: null,
      listItemIdName: 'id',
      itemComponentType: null,
      itemComponentPropOverrides: {},
      searchFilterLabel: gettext.pgettext('cradmin GenericIdListMultiSelect searchFilterLabel', 'Search'),
      searchFilterName: 'search',
      searchFilterPlaceholders: [gettext.gettext('Search ...')],
      searchFilterComponentType: DropDownSearchFilter
    }
  }

  get filterListSearchFieldConfig () {
    return {
      component: GenericSearchFilterWrapper,
      props: {
        name: 'search',
        componentType: this.props.searchFilterComponentType,
        label: this.props.searchFilterLabel,
        labelIsScreenreaderOnly: true,
        placeholder: this.props.searchFilterPlaceholders,
        ...this.props.SearchFilterComponentPropOverrides
      }
    }
  }

  get filterListStaticFilters () {
    return []
  }

  get filterListExtraFilters () {
    return []
  }

  get filterListFilterConfig () {
    return [
      ...this.filterListStaticFilters,
      ...this.filterListExtraFilters,
      this.filterListSearchFieldConfig
    ]
  }

  get itemComponentType () {
    if (!this.props.itemComponentType) {
      console.error(
        'No itemComponentType given in props. ' +
        'Falling back to AbstractGenericIdListMultiSelectItem. ' +
        'You should make a subclass of that component and pass it as "itemComponentType" in props!')
      return AbstractGenericIdListMultiSelectItem
    }
    return this.props.itemComponentType
  }

  get filterListItemListConfig () {
    return {
      component: SelectableList,
      itemSpec: {
        component: GenericFilterListItemWrapper,
        props: {
          listItemIdName: this.props.listItemIdName,
          componentType: this.itemComponentType,
          componentProps: this.props.itemComponentProps
        }
      }
    }
  }

  constructor (props) {
    super(props)
    this.fitlerListRef = React.createRef()
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.handleSelectItems = this.handleSelectItems.bind(this)
    this.handleDiselectItems = this.handleDiselectItems.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  handleSelectItems (data) {
    this.setFilterValue(this.fitlerListRef.selectedItemIdsAsArray())
  }

  handleDiselectItems (data) {
    this.setFilterValue(this.fitlerListRef.selectedItemIdsAsArray())
  }

  handleClear () {

  }

  get filterListConfig () {
    return {
      getItemsApiUrl: this.props.idListApiUrl,
      onSelectItems: this.handleSelectItems,
      onDeselectItems: this.handleDiselectItems,
      selectMode: MULTISELECT,
      components: [{
        component: ThreeColumnLayout,
        layout: this.filterListFilterConfig
      }, {
        component: ThreeColumnLayout,
        props: {
          componentGroups: ['expandable'],
          dropdownContentBemVariants: []
        },
        layout: [
          this.filterListItemListConfig,
          {
            component: LoadMorePaginator,
            props: {
              location: 'bottom'
            }
          }]
      }]
    }
  }

  render () {
    return <PageNumberPaginationFilterList {...this.filterListConfig} ref={ref => { this.fitlerListRef = ref }} />
  }
}
