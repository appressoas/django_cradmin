"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderComponentGroup = renderComponentGroup;

var _react = _interopRequireDefault(require("react"));

var _testHelpers = require("../filterlists/testHelpers");

var _filterListConstants = require("../../filterListConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderComponentGroup(componentGroupComponentClass) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fullProps = Object.assign({
    childExposedApi: new _testHelpers.ChildExposedApiMock(),
    location: _filterListConstants.RENDER_LOCATION_DEFAULT,
    uniqueComponentKey: 'test',
    enabledComponentGroups: new Set()
  }, props);
  return _react.default.createElement(componentGroupComponentClass, fullProps);
}