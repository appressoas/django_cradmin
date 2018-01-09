import React from 'react'
import { ChildExposedApiMock } from '../filterlists/testHelpers'
import { RENDER_AREA_BODY, RENDER_LOCATION_CENTER } from '../../filterListConstants'

export function renderFilter (filterComponentClass, props = {}) {
  const fullProps = Object.assign({
    childExposedApi: new ChildExposedApiMock(),
    renderArea: RENDER_AREA_BODY,
    location: RENDER_LOCATION_CENTER,
    name: 'test'
  }, props)
  return React.createElement(filterComponentClass, fullProps)
}
