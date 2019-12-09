"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _CradminCalendarAdd = _interopRequireDefault(require("../CradminCalendarAdd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('CradminCalendarAdd changes the class when hovered', function () {
  var component = (0, _enzyme.mount)(_react.default.createElement(_CradminCalendarAdd.default, {
    signalNameSpace: "test"
  })); // expect(component.text()).toEqual('TODO');
  // console.log(component.html());
});