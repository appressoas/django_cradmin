"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _CheckboxBooleanFilter = _interopRequireDefault(require("../CheckboxBooleanFilter"));

var _testHelpers = require("../testHelpers");

var _testHelpers2 = require("../../filterlists/testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderFilter)(_CheckboxBooleanFilter.default, Object.assign({
    label: 'Test'
  }, props));
}

test('className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('checkbox checkbox--block');
});
test('Label', function () {
  var component = (0, _enzyme.shallow)(render({
    label: 'Test label'
  }));
  expect(component.text()).toEqual('Test label');
});
test('Change checkbox sets filter value from false to true', function () {
  var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: childExposedApi,
    name: 'myfilter',
    value: false
  }));
  component.find('input').simulate('change');
  expect(childExposedApi.setFilterValue).toBeCalledWith('myfilter', true);
});
test('Change checkbox sets filter value from true to false', function () {
  var childExposedApi = new _testHelpers2.ChildExposedApiMock(true);
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: childExposedApi,
    name: 'myfilter',
    value: true
  }));
  component.find('input').simulate('change');
  expect(childExposedApi.setFilterValue).toBeCalledWith('myfilter', false);
});