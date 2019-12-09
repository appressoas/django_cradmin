"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _SearchInputExpandCollapseButton = _interopRequireDefault(require("../SearchInputExpandCollapseButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render(props) {
  var fullProps = Object.assign({
    onClick: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    isExpanded: false
  }, props);
  return _react.default.createElement(_SearchInputExpandCollapseButton.default, fullProps);
}

function getIconComponent(component) {
  return component.find('span');
}

test('className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('searchinput__button');
});
test('icon className - not expanded', function () {
  var component = (0, _enzyme.shallow)(render({
    isExpanded: false
  }));
  expect(getIconComponent(component).prop('className')).toBe('searchinput__buttonicon cricon cricon--chevron-down');
});
test('icon className - expanded', function () {
  var component = (0, _enzyme.shallow)(render({
    isExpanded: true
  }));
  expect(getIconComponent(component).prop('className')).toBe('searchinput__buttonicon cricon cricon--chevron-up');
});
test('title - not expanded', function () {
  var component = (0, _enzyme.shallow)(render({
    isExpanded: false
  }));
  expect(component.prop('title')).toBe('Expand');
});
test('title - not expanded', function () {
  var component = (0, _enzyme.shallow)(render({
    isExpanded: true
  }));
  expect(component.prop('title')).toBe('Collapse');
});
test('onClick', function () {
  var onClick = jest.fn();
  var component = (0, _enzyme.shallow)(render({
    onClick: onClick
  }));
  component.simulate('click');
  expect(onClick).toBeCalled();
});
test('onFocus', function () {
  var onFocus = jest.fn();
  var component = (0, _enzyme.shallow)(render({
    onFocus: onFocus
  }));
  component.simulate('focus');
  expect(onFocus).toBeCalled();
});
test('onBlur', function () {
  var onBlur = jest.fn();
  var component = (0, _enzyme.shallow)(render({
    onBlur: onBlur
  }));
  component.simulate('blur');
  expect(onBlur).toBeCalled();
});