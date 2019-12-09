"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _TightLabeledEmptyBooleanFilter = _interopRequireDefault(require("../TightLabeledEmptyBooleanFilter"));

var _testHelpers = require("../testHelpers");

var _testHelpers2 = require("../../filterlists/testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderFilter)(_TightLabeledEmptyBooleanFilter.default, Object.assign({
    label: 'Test'
  }, props));
}

test('className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.find('label').prop('className')).toBe('select select--outlined select--size-xsmall select--width-xxsmall');
});
test('wrapperClassName', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('paragraph paragraph--xtight');
});
test('label', function () {
  var component = (0, _enzyme.shallow)(render({
    label: 'Testlabel'
  }));
  expect(component.find('span').text()).toBe('Testlabel');
});
test('aria-label defaults to label', function () {
  var component = (0, _enzyme.shallow)(render({
    label: 'Testlabel'
  }));
  expect(component.find('select').prop('aria-label')).toBe('Testlabel');
});
test('custom aria-label', function () {
  var component = (0, _enzyme.shallow)(render({
    ariaLabel: 'Test Aria label'
  }));
  expect(component.find('select').prop('aria-label')).toBe('Test Aria label');
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