"use strict";

var _enzyme = require("enzyme");

var _testHelpers = require("../testHelpers");

var _SearchFilter = _interopRequireDefault(require("../SearchFilter"));

var _testHelpers2 = require("../../filterlists/testHelpers");

var _SearchInputClearButton = _interopRequireDefault(require("../components/SearchInputClearButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderFilter)(_SearchFilter.default, props);
}

describe('SearchFilter', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });

  var getClearButtonComponent = function getClearButtonComponent(component) {
    return component.find(_SearchInputClearButton.default);
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
  test('clearButton is rendered', function () {
    var component = (0, _enzyme.shallow)(render());
    expect(getClearButtonComponent(component).exists()).toBe(true);
  });
  test('clearButton click clears filter value', function () {
    var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
    var component = (0, _enzyme.mount)(render({
      name: 'search',
      value: 'Test',
      childExposedApi: childExposedApi
    }));
    getClearButtonComponent(component).simulate('click');
    expect(childExposedApi.setFilterValue).toBeCalledWith('search', '');
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
    var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
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
    var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
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
    var component = (0, _enzyme.shallow)(render({
      placeholder: ['people', 'animals']
    }));
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('people');
    jest.runOnlyPendingTimers();
    component.update();
    expect(getSearchInputComponent(component).prop('placeholder')).toEqual('animals');
  });
});