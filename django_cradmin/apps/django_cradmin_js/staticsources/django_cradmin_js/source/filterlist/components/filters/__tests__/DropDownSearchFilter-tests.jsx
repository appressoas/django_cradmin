/* eslint-env jest */
import {mount, shallow} from 'enzyme'
import { renderFilter } from '../testHelpers'
import DropDownSearchFilter from '../DropDownSearchFilter'
import {ChildExposedApiMock} from '../../filterlists/testHelpers'
import { COMPONENT_GROUP_EXPANDABLE } from '../../../filterListConstants'

function render (props = {}) {
  return renderFilter(DropDownSearchFilter, props)
}

describe('DropDownSearchFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  const getExpandCollapseButtonComponent = (component) => {
    return component.find('button')
  }

  const getExpandCollapseButtonIconComponent = (component) => {
    return component.find('button span')
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

  test('expandCollapseButton is rendered', () => {
    const component = shallow(render())
    expect(getExpandCollapseButtonComponent(component).exists()).toBe(true)
  })

  test('expandCollapseButton title', () => {
    const component = shallow(render())
    expect(getExpandCollapseButtonComponent(component).prop('title')).toEqual(
      'Expand')
  })

  test('expandCollapseButton type', () => {
    const component = shallow(render())
    expect(getExpandCollapseButtonComponent(component).prop('type')).toEqual('button')
  })

  test('expandCollapseButton icon not expanded', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    childExposedApi.componentGroupIsEnabled.mockReturnValue(false)
    const component = mount(render({
      childExposedApi: childExposedApi
    }))
    expect(getExpandCollapseButtonIconComponent(component).prop('className')).toEqual(
      'icon-chevron-down')
  })

  test('expandCollapseButton icon expanded', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    childExposedApi.componentGroupIsEnabled.mockReturnValue(true)
    const component = mount(render({
      childExposedApi: childExposedApi
    }))
    expect(getExpandCollapseButtonIconComponent(component).prop('className')).toEqual(
      'icon-chevron-up')
  })

  test('expandCollapseButton click toggles "expandable" componentGroup', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    childExposedApi.componentGroupIsEnabled.mockReturnValue(true)
    const component = mount(render({
      childExposedApi: childExposedApi
    }))
    getExpandCollapseButtonComponent(component).simulate('click')
    expect(childExposedApi.componentGroupIsEnabled).toBeCalledWith(COMPONENT_GROUP_EXPANDABLE)
    expect(childExposedApi.toggleComponentGroup).toBeCalled()
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

  test('searchInput focus expands "expandable" componentGroup', () => {
    const childExposedApi = new ChildExposedApiMock(true)
    const component = mount(render({
      name: 'search',
      childExposedApi: childExposedApi
    }))
    getSearchInputComponent(component).simulate('focus')
    expect(childExposedApi.componentGroupIsEnabled).toBeCalledWith(COMPONENT_GROUP_EXPANDABLE)
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
