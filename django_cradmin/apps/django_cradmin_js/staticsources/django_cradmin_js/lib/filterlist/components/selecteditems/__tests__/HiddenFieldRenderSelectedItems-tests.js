"use strict";

var _enzyme = require("enzyme");

var _HiddenFieldRenderSelectedItems = _interopRequireDefault(require("../HiddenFieldRenderSelectedItems"));

var _testHelpers = require("../testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderSelectedItems)(_HiddenFieldRenderSelectedItems.default, Object.assign({
    name: 'test'
  }, props));
}

test('no selected items - do not render anything', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.type()).toBeNull();
});
test('single selected item renders something', function () {
  var component = (0, _enzyme.shallow)(render({
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.type()).not.toBeNull();
  expect(component.find('input').length).toBe(1);
});
test('single selected item sanity', function () {
  var component = (0, _enzyme.shallow)(render({
    name: 'myfield',
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('input').prop('name')).toEqual('myfield');
  expect(component.find('input').prop('type')).toEqual('hidden');
  expect(component.find('input').prop('defaultValue')).toBe(1);
});
test('multiple selected items sanity', function () {
  var component = (0, _enzyme.shallow)(render({
    name: 'myfield',
    selectedListItemsMap: new Map([[1, {}], [3, {}]])
  }));
  expect(component.find('input').at(0).prop('defaultValue')).toBe(1);
  expect(component.find('input').at(1).prop('defaultValue')).toBe(3);
});
test('debug prop true', function () {
  var component = (0, _enzyme.shallow)(render({
    debug: true,
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('input').prop('type')).toEqual('text');
});