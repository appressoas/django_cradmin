"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Defines a range between two moment objects.
 */
var MomentRange =
/*#__PURE__*/
function () {
  _createClass(MomentRange, null, [{
    key: "defaultForDatetimeSelect",

    /**
     * Get the default range for our datetime range components.
     *
     * Can be used for a sane default datetime picker range by other
     * widgets/components.
     *
     * @returns {MomentRange}
     */
    value: function defaultForDatetimeSelect() {
      return new MomentRange((0, _moment.default)({
        year: 1900,
        month: 0,
        day: 0
      }), (0, _moment.default)({
        year: 2100,
        month: 0,
        day: 0
      }).subtract(1, 'second'));
    }
    /**
     * @param start Moment object for the start of the range. Defaults to NOW if not provided.
     * @param end Moment object for the end of the range. Defaults to NOW if not provided.
     */

  }]);

  function MomentRange() {
    var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, MomentRange);

    this.start = start || (0, _moment.default)();
    this.end = end || (0, _moment.default)();

    if (!this.end.isAfter(this.start)) {
      throw new Error('The end of a MomentRange must be after the start.');
    }
  }
  /**
   * Prettyformat the range.
   *
   * @param args Forwarded to moment.format() for formatting of both the endpoints in the range.
   * @returns {string}
   */


  _createClass(MomentRange, [{
    key: "format",
    value: function format() {
      var _this$start, _this$end;

      return "".concat((_this$start = this.start).format.apply(_this$start, arguments), " - ").concat((_this$end = this.end).format.apply(_this$end, arguments));
    }
    /**
     * Is the provided moment object within the range?
     *
     * @param momentObject
     * @returns {boolean}
     */

  }, {
    key: "contains",
    value: function contains(momentObject) {
      return this.start.isSameOrBefore(momentObject) && this.end.isSameOrAfter(momentObject);
    }
    /**
     * Get the closes valid moment object within the range.
     *
     * @param momentObject
     * @returns {*} If the moment object is within the range, we return a clone of the provided
     *   moment object. Otherwise we return the start or end of the range (the one closest to ``momentObject``).
     */

  }, {
    key: "getClosestValid",
    value: function getClosestValid(momentObject) {
      if (this.contains(momentObject)) {
        return momentObject.clone();
      }

      var millisecondsToStart = Math.abs(this.start.diff(momentObject));
      var millisecondsToEnd = Math.abs(this.end.diff(momentObject));

      if (millisecondsToStart < millisecondsToEnd) {
        return this.start.clone();
      }

      return this.end.clone();
    }
  }]);

  return MomentRange;
}();

exports.default = MomentRange;