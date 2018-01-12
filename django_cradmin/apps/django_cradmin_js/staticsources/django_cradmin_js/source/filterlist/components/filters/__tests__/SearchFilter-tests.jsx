/* eslint-env jest */
import {mount, shallow} from 'enzyme'
import { renderFilter } from '../testHelpers'
import SearchFilter from '../SearchFilter'
import {ChildExposedApiMock} from '../../filterlists/testHelpers'

function render (props = {}) {
  return renderFilter(SearchFilter, props)
}

describe('SearchFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  const getClearButtonComponent = (component) => {
    return component.find('button')
  }

  const getSearchInputComponent = (component) => {
    return component.find('input')
  }

  test('label className', () => {
    const component = shallow(render())
    expect(component.prop('className')).toBe('label')
  })

  test('no label prop', () => {
    const component = shallow(render())
    expect(component.text()).toEqual('')
  })

  test('has label prop', () => {
    const component = shallow(render({
      label: 'Test label'
    }))
    expect(component.text()).toEqual('Test label')
  })

  test('clearButton is rendered', () => {
    const component = shallow(render())
    expect(getClearButtonComponent(component).exists()).toBe(true)
  })

  test('clearButton title', () => {
    const component = shallow(render())
    expect(getClearButtonComponent(component).prop('title')).toEqual('Clear search field')
  })

  test('clearButton type', () => {
    const component = shallow(render())
    expect(getClearButtonComponent(component).prop('type')).toEqual('button')
  })

  test('clearButton click clears filter value', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    const component = mount(render({
      name: 'search',
      value: 'Test',
      childExposedApi: childExposedApi
    }))
    getClearButtonComponent(component).simulate('click')
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', '')
  })

  test('searchInput is rendered', () => {
    const component = shallow(render())
    expect(getSearchInputComponent(component).exists()).toBe(true)
  })

  test('searchInput className', () => {
    const component = shallow(render())
    expect(getSearchInputComponent(component).prop('className')).toEqual(
      'searchinput__input input input--outlined')
  })

  test('searchInput className custom inputBemVariants', () => {
    const component = shallow(render({
      inputBemVariants: ['stuff', 'things']
    }))
    expect(getSearchInputComponent(component).prop('className')).toEqual(
      'searchinput__input input input--stuff input--things')
  })

  test('searchInput default value', () => {
    const component = shallow(render())
    expect(getSearchInputComponent(component).prop('value')).toEqual('')
  })

  test('searchInput custom value', () => {
    const component = shallow(render({
      value: 'my search'
    }))
    expect(getSearchInputComponent(component).prop('value')).toEqual(
      'my search')
  })

  test('searchInput change event calls API', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    const component = mount(render({
      name: 'search',
      childExposedApi: childExposedApi
    }))
    getSearchInputComponent(component).simulate('change', {
      target: {value: 'testsearch'}
    })
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', 'testsearch')
  })

  test('searchInput change event empty value calls API', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    const component = mount(render({
      name: 'search',
      childExposedApi: childExposedApi
    }))
    getSearchInputComponent(component).simulate('change', {
      target: {value: ''}
    })
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', '')
  })

  test('searchInput placeholder string', () => {
    const component = mount(render({
      placeholder: 'search...'
    }))
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual(
      'search...')
  })

  test('searchInput placeholder array initial', () => {
    const component = mount(render({
      placeholder: ['people', 'animals']
    }))
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual(
      'people')
  })

  test('searchInput placeholder array rotate', () => {
    const component = mount(render({
      placeholder: ['people', 'animals']
    }))
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual(
      'people')
    jest.runOnlyPendingTimers()
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual(
      'animals')
  })
})
