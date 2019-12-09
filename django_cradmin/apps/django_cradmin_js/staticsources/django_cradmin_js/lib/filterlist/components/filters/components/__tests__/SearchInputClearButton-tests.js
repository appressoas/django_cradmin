"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _SearchInputClearButton = _interopRequireDefault(require("../SearchInputClearButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render(props) {
  var fullProps = Object.assign({
    onClick: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn()
  }, props);
  return _react.default.createElement(_SearchInputClearButton.default, fullProps);
}

function getIconComponent(component) {
  return component.find('span');
}

test('className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('searchinput__button');
});
test('icon className', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(getIconComponent(component).prop('className')).toBe('searchinput__buttonicon cricon cricon--close');
});
test('title', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('title')).toBe('Clear search field');
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