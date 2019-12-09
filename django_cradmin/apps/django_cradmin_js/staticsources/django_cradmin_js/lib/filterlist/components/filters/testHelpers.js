"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFilter = renderFilter;

var _react = _interopRequireDefault(require("react"));

var _testHelpers = require("../filterlists/testHelpers");

var _filterListConstants = require("../../filterListConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderFilter(filterComponentClass) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fullProps = Object.assign({
    childExposedApi: new _testHelpers.ChildExposedApiMock(),
    location: _filterListConstants.RENDER_LOCATION_CENTER,
    uniqueComponentKey: 'test',
    name: 'test'
  }, props);
  return _react.default.createElement(filterComponentClass, fullProps);
}