import React from 'react'
import { ChildExposedApiMock } from '../filterlists/testHelpers'
import { RENDER_AREA_BODY, RENDER_LOCATION_CENTER } from '../../filterListConstants'

export function renderPaginator (paginatorComponentClass, props = {}) {
  const fullProps = Object.assign({
    childExposedApi: new ChildExposedApiMock(),
    renderArea: RENDER_AREA_BODY,
    location: RENDER_LOCATION_CENTER,
    listItemsDataArray: [],
    uniqueComponentKey: 'test'
  }, props)
  return React.createElement(paginatorComponentClass, fullProps)
}
