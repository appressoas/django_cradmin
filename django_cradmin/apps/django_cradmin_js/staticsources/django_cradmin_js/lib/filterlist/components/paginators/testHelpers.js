"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPaginator = renderPaginator;

var _react = _interopRequireDefault(require("react"));

var _testHelpers = require("../filterlists/testHelpers");

var _filterListConstants = require("../../filterListConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderPaginator(paginatorComponentClass) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fullProps = Object.assign({
    childExposedApi: new _testHelpers.ChildExposedApiMock(),
    location: _filterListConstants.RENDER_LOCATION_CENTER,
    listItemsDataArray: [],
    uniqueComponentKey: 'test'
  }, props);
  return _react.default.createElement(paginatorComponentClass, fullProps);
}