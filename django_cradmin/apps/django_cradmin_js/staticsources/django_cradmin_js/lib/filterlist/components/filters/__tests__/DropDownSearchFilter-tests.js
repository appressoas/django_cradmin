"use strict";

var _enzyme = require("enzyme");

var _testHelpers = require("../testHelpers");

var _DropDownSearchFilter = _interopRequireDefault(require("../DropDownSearchFilter"));

var _testHelpers2 = require("../../filterlists/testHelpers");

var _filterListConstants = require("../../../filterListConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function makeChildExposedApi() {
  var isExpanded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var childExposedApi = new _testHelpers2.ChildExposedApiMock();
  childExposedApi.componentGroupIsEnabled.mockReturnValue(isExpanded);
  return childExposedApi;
}

function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fullProps = Object.assign({
    childExposedApi: makeChildExposedApi()
  }, props);
  return (0, _testHelpers.renderFilter)(_DropDownSearchFilter.default, fullProps);
}

describe('DropDownSearchFilter', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });

  var getClearButtonComponent = function getClearButtonComponent(component) {
    return component.find('button').at(0);
  };

  var getExpandCollapseButtonComponent = function getExpandCollapseButtonComponent(component) {
    return component.find('button').at(1);
  };

  var getSearchInputComponent = function getSearchInputComponent(component) {
    return component.find('input');
  };

  var getFieldWrapperComponent = function getFieldWrapperComponent(component) {
    return component.find('.searchinput');
  };

  test('label className', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(component.prop('className')).toBe('label');
  });
  test('no label prop', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(component.find('.test-label-text').exists()).toBe(false);
  });
  test('has label prop', function () {
    var component = (0, _enzyme.shallow)(render({
      label: 'Test label'
    }));
    expect(component.find('.test-label-text').exists()).toBe(true);
    expect(component.find('.test-label-text').text()).toEqual('Test label');
  });
  test('fieldWrapper className default', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(getFieldWrapperComponent(component).prop('className')).toEqual('searchinput searchinput--outlined');
  });
  test('fieldWrapper className custom fieldWrapperBemVariants', function () {
    var component = (0, _enzyme.shallow)(render({
      fieldWrapperBemVariants: ['stuff', 'things']
    }));
    expect(getFieldWrapperComponent(component).prop('className')).toEqual('searchinput searchinput--stuff searchinput--things');
  });
  test('clearButton click clears filter value', function () {
    var childExposedApi = makeChildExposedApi(false);
    var component = (0, _enzyme.mount)(render({
      name: 'search',
      value: 'Test',
      childExposedApi: childExposedApi
    }));
    getClearButtonComponent(component).simulate('click');
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', '');
  });
  test('expandCollapseButton icon not expanded', function () {
    var childExposedApi = makeChildExposedApi(false);
    var component = (0, _enzyme.mount)(render({
      childExposedApi: childExposedApi
    }));
    expect(getExpandCollapseButtonComponent(component).find('span').prop('className')).toEqual('searchinput__buttonicon cricon cricon--chevron-down');
  });
  test('expandCollapseButton icon expanded', function () {
    var childExposedApi = makeChildExposedApi(true);
    var component = (0, _enzyme.mount)(render({
      childExposedApi: childExposedApi
    }));
    expect(getExpandCollapseButtonComponent(component).find('span').prop('className')).toEqual('searchinput__buttonicon cricon cricon--chevron-up');
  });
  test('expandCollapseButton click toggles "expandable" componentGroup', function () {
    var childExposedApi = makeChildExposedApi(true);
    var component = (0, _enzyme.mount)(render({
      childExposedApi: childExposedApi
    }));
    getExpandCollapseButtonComponent(component).simulate('click');
    expect(childExposedApi.componentGroupIsEnabled).toBeCalledWith(_filterListConstants.COMPONENT_GROUP_EXPANDABLE);
    expect(childExposedApi.toggleComponentGroup).toBeCalled();
  });
  test('searchInput is rendered', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(getSearchInputComponent(component).exists()).toBe(true);
  });
  test('searchInput className', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(getSearchInputComponent(component).prop('className')).toEqual('searchinput__input');
  });
  test('searchInput default value', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(getSearchInputComponent(component).prop('value')).toEqual('');
  });
  test('searchInput custom value', function () {
    var component = (0, _enzyme.shallow)(render({
      value: 'my search'
    }));
    expect(getSearchInputComponent(component).prop('value')).toEqual('my search');
  });
  test('searchInput change event calls API', function () {
    var childExposedApi = makeChildExposedApi();
    var component = (0, _enzyme.mount)(render({
      name: 'search',
      childExposedApi: childExposedApi
    }));
    getSearchInputComponent(component).simulate('change', {
      target: {
        value: 'testsearch'
      }
    });
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', 'testsearch');
  });
  test('searchInput change event empty value calls API', function () {
    var childExposedApi = makeChildExposedApi();
    var component = (0, _enzyme.mount)(render({
      name: 'search',
      childExposedApi: childExposedApi
    }));
    getSearchInputComponent(component).simulate('change', {
      target: {
        value: ''
      }
    });
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', '');
  });
  test('searchInput focus expands "expandable" componentGroup', function () {
    var childExposedApi = makeChildExposedApi();
    var component = (0, _enzyme.mount)(render({
      name: 'search',
      childExposedApi: childExposedApi
    }));
    getSearchInputComponent(component).simulate('focus');
    expect(childExposedApi.componentGroupIsEnabled).toBeCalledWith(_filterListConstants.COMPONENT_GROUP_EXPANDABLE);
  });
  test('searchInput placeholder string', function () {
    var component = (0, _enzyme.mount)(render({
      placeholder: 'search...'
    }));
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('search...');
  });
  test('searchInput placeholder array initial', function () {
    var component = (0, _enzyme.mount)(render({
      placeholder: ['people', 'animals']
    }));
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('people');
  });
  test('searchInput placeholder array rotate', function () {
    var component = (0, _enzyme.mount)(render({
      placeholder: ['people', 'animals']
    }));
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('people');
    jest.runOnlyPendingTimers();
    component.update();
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('animals');
  });
});