"use strict";

var _react = _interopRequireDefault(require("react"));

var _filterListConstants = require("../../filterlist/filterListConstants");

var _Html5FromToDateSelectors = _interopRequireDefault(require("../Html5FromToDateSelectors"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function renderSelector(selectorComponentClass) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fullProps = Object.assign({
    location: _filterListConstants.RENDER_LOCATION_DEFAULT,
    uniqueComponentKey: 'test',
    name: 'test',
    fromDateValue: '',
    toDateValue: '',
    onChange: jest.fn(),
    label: null,
    expandedLabel: null,
    commonDateOptions: {},
    isExpandedInitially: false,
    displayExpandToggle: true,
    expandToggleLabel: 'Display to-date?',
    toDateExpandedLabel: 'To date',
    fromDateExpandedLabel: 'From date'
  }, props);
  return _react.default.createElement(selectorComponentClass, fullProps);
}

function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return renderSelector(_Html5FromToDateSelectors.default, props);
}

test('sanity', function () {
  var component = (0, _enzyme.shallow)(render());
  expect(component.prop('className')).toBe('fieldwrapper');
});
test('Default item width', function () {
  var wrapper = (0, _enzyme.shallow)(render({
    label: 'Test'
  })).instance();
  var component = wrapper.getLineItemWidth();
  expect(component).toBe('fieldwrapper-line__item--width-small');
});
test('Extra small item width', function () {
  var wrapper = (0, _enzyme.shallow)(render({
    label: 'Test',
    commonDateOptions: {
      'lineItemWidth': 'xsmall'
    }
  })).instance();
  var component = wrapper.getLineItemWidth(wrapper.props.commonDateOptions.lineItemWidth);
  expect(component).toBe('fieldwrapper-line__item--width-xsmall');
});
test('Medium item width', function () {
  var wrapper = (0, _enzyme.shallow)(render({
    label: 'Test',
    commonDateOptions: {
      'lineItemWidth': 'medium'
    }
  })).instance();
  var component = wrapper.getLineItemWidth(wrapper.props.commonDateOptions.lineItemWidth);
  expect(component).toBe('fieldwrapper-line__item--width-medium');
});