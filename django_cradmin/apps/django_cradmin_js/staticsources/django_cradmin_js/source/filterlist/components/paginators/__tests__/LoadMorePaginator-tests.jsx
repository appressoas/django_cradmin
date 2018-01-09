import React from 'react'
import { shallow } from 'enzyme'
import LoadMorePaginator from '../LoadMorePaginator'
import { RENDER_AREA_BODY, RENDER_LOCATION_CENTER } from '../../../filterListConstants'
import { ChildExposedApiMock } from '../../filterlists/testHelpers'


function makeChildExposedApiMock (hasNextPaginationPage) {
  const childExposedApi = new ChildExposedApiMock()
  childExposedApi.hasNextPaginationPage.mockReturnValue(hasNextPaginationPage)
  return childExposedApi
}


function render (props) {
  const fullProps = Object.assign({
    renderArea: RENDER_AREA_BODY,
    location: RENDER_LOCATION_CENTER,
    listItemsDataArray: []
  }, props)
  return React.createElement(LoadMorePaginator, fullProps)
}


test('hasNextPaginationPage() is false', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(false)
  }))
  expect(component.type()).toBeNull()
})


test('hasNextPaginationPage() is true', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(true)
  }))
  expect(component.type()).not.toBeNull()
})


test('Default className', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(true)
  }))
  expect(component.prop('className')).toBe('button')
})


test('Custom className', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(true),
    className: 'myclass'
  }))
  expect(component.prop('className')).toBe('myclass')
})


test('Default label', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(true)
  }))
  expect(component.text()).toEqual('Load more')
})


test('Custom label', () => {
  const component = shallow(render({
    childExposedApi: makeChildExposedApiMock(true),
    label: 'My Label'
  }))
  expect(component.text()).toEqual('My Label')
})


test('Click button calls loadMoreItemsFromApi', () => {
  const childExposedApi = makeChildExposedApiMock(true)
  const component = shallow(render({
    childExposedApi: childExposedApi
  }))
  component.at(0).simulate('click', {preventDefault: jest.fn()})
  expect(childExposedApi.loadMoreItemsFromApi).toBeCalled()
})
