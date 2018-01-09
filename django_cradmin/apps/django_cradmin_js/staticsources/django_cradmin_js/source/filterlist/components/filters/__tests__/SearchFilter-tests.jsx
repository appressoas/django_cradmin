/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { renderFilter } from '../testHelpers'
import SearchFilter from '../SearchFilter'

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
