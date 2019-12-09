"use strict";

var _enzyme = require("enzyme");

var _SubmitSelectedItems = _interopRequireDefault(require("../SubmitSelectedItems"));

var _testHelpers = require("../testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderSelectedItems)(_SubmitSelectedItems.default, Object.assign({
    hiddenFieldName: 'test',
    formAction: 'testaction'
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
  expect(component.find('button').length).toBe(1);
});
test('label', function () {
  var component = (0, _enzyme.shallow)(render({
    label: 'test label',
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('button').text()).toEqual('test label');
});
test('type', function () {
  var component = (0, _enzyme.shallow)(render({
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('button').prop('type')).toEqual('submit');
});
test('single selected item hidden fields sanity', function () {
  var component = (0, _enzyme.mount)(render({
    hiddenFieldName: 'myfield',
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('input').prop('name')).toEqual('myfield');
  expect(component.find('input').prop('type')).toEqual('hidden');
  expect(component.find('input').prop('defaultValue')).toBe(1);
});
test('multiple selected items sanity', function () {
  var component = (0, _enzyme.mount)(render({
    hiddenFieldName: 'myfield',
    selectedListItemsMap: new Map([[1, {}], [3, {}]])
  }));
  expect(component.find('input').at(0).prop('defaultValue')).toBe(1);
  expect(component.find('input').at(1).prop('defaultValue')).toBe(3);
});
test('debug prop true', function () {
  var component = (0, _enzyme.mount)(render({
    debug: true,
    selectedListItemsMap: new Map([[1, {}]])
  }));
  expect(component.find('input').prop('type')).toEqual('text');
});
test('extraHiddenFields', function () {
  var component = (0, _enzyme.mount)(render({
    debug: true,
    selectedListItemsMap: new Map([[1, {}]]),
    extraHiddenFields: {
      myExtraField: 1
    }
  }));
  expect(component.find('input').at(1).prop('type')).toEqual('hidden');
  expect(component.find('input').at(1).prop('name')).toEqual('myExtraField');
  expect(component.find('input').at(1).prop('defaultValue')).toEqual(1);
});