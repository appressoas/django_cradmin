"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NumberFormat =
/*#__PURE__*/
function () {
  function NumberFormat() {
    _classCallCheck(this, NumberFormat);
  }

  _createClass(NumberFormat, null, [{
    key: "zeroPaddedString",
    value: function zeroPaddedString(number, min, max) {
      if (max != undefined && number > max) {
        number = max;
      }

      if (min != undefined && number < min) {
        number = min;
      }

      if (number < 10) {
        return "0".concat(number);
      } else {
        return "".concat(number);
      }
    }
  }]);

  return NumberFormat;
}();

exports.default = NumberFormat;