"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _EmptyBooleanFilter = _interopRequireDefault(require("../EmptyBooleanFilter"));

var _testHelpers = require("../testHelpers");

var _testHelpers2 = require("../../filterlists/testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderFilter)(_EmptyBooleanFilter.default, Object.assign({
    ariaLabel: 'Test'
  }, props));
}

test('className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('select select--outlined');
});
test('aria-label', function () {
  var component = (0, _enzyme.shallow)(render({
    ariaLabel: 'Testlabel'
  }));
  expect(component.find('select').prop('aria-label')).toBe('Testlabel');
});
test('option values', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.find('option').at(0).prop('value')).toBe('empty');
  expect(component.find('option').at(1).prop('value')).toBe('true');
  expect(component.find('option').at(2).prop('value')).toBe('false');
});
test('Select change sets filter value', function () {
  var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: childExposedApi,
    name: 'myfilter',
    value: false
  }));
  component.find('select').simulate('change', {
    target: {
      value: 'true'
    }
  });
  expect(childExposedApi.setFilterValue).toBeCalledWith('myfilter', true);
});