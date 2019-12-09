"use strict";

var _enzyme = require("enzyme");

var _SelectableListRenderSelectedItems = _interopRequireDefault(require("../SelectableListRenderSelectedItems"));

var _testHelpers = require("../testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderSelectedItems)(_SelectableListRenderSelectedItems.default, Object.assign({
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
  expect(component.find('.selectable-list__item').length).toBe(1);
});
test('single selected item sanity', function () {
  var component = (0, _enzyme.shallow)(render({
    name: 'myfield',
    selectedListItemsMap: new Map([[1, {
      title: 'test title'
    }]])
  }));
  expect(component.find('.selectable-list__itemcontent').text()).toEqual('test title');
});
test('multiple selected items sanity', function () {
  var component = (0, _enzyme.shallow)(render({
    name: 'myfield',
    selectedListItemsMap: new Map([[1, {
      title: 'test title 1'
    }], [2, {
      title: 'test title 2'
    }]])
  }));
  expect(component.find('.selectable-list__itemcontent').at(0).text()).toEqual('test title 1');
  expect(component.find('.selectable-list__itemcontent').at(1).text()).toEqual('test title 2');
});