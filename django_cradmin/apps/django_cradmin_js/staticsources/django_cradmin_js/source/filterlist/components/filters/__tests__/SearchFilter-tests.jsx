/* eslint-env jest */
import React from 'react'
import {mount, shallow} from 'enzyme'
import { renderFilter } from '../testHelpers'
import SearchFilter from '../SearchFilter'
import {ChildExposedApiMock} from '../../filterlists/testHelpers'

function render (props = {}) {
  return renderFilter(SearchFilter, props)
}

test('label className', () => {
  const component = shallow(render())
  expect(component.prop('className')).toBe('label')
})

test('no label prop', () => {
  const component = shallow(render())
  expect(component.text()).toEqual('')
})

test('label prop', () => {
  const component = shallow(render({
    label: 'Test label'
  }))
  expect(component.text()).toEqual('Test label')
})

test('click clear clears filter value', () => {
  const childExposedApi = new ChildExposedApiMock(true)
  const component = mount(render({
    name: 'search',
    value: 'Test',
    childExposedApi: childExposedApi
  }))
  component.find('button').simulate('click')
  expect(childExposedApi.setFilterValue).toBeCalledWith('search', '')
})
