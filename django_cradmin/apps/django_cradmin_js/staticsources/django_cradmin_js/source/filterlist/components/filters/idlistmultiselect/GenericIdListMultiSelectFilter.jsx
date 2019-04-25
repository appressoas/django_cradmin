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
import { MULTISELECT } from '../../../filterListConstants'

export default class GenericIdListMultiSelectFilter extends AbstractFilter {
  static get propTypes () {
    return {
      ...super.propTypes,
      idListApiUrl: PropTypes.string.isRequired,
      listItemIdName: PropTypes.string.isRequired,
      itemComponentType: PropTypes.any.isRequired,
      itemComponentPropOverrides: PropTypes.object,
      searchFilterLabel: PropTypes.string.isRequired,
      searchFilterName: PropTypes.string.isRequired,
      searchFilterPlaceholders: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
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
      searchFilterPlaceholders: []
    }
  }

  get filterListSearchFieldConfig () {
    return {
      component: DropDownSearchFilter,
      props: {
        name: 'search',
        label: this.props.searchFilterLabel,
        labelIsScreenreaderOnly: true,
        placeholder: [gettext.gettext('Name ...'),
          gettext.gettext('Email ...'),
          gettext.gettext('Phone number ...')]
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
      this.filterListSearchFieldConfig,
      ...this.filterListStaticFilters,
      ...this.filterListExtraFilters
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

  get filterListConfig () {
    return {
      getItemsApiUrl: this.props.idListApiUrl,
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
    return <PageNumberPaginationFilterList {...this.filterListConfig} />
  }
}
