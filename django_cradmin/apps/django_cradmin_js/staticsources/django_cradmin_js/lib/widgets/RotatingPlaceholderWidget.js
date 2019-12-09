"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/**
 * Rotating input field placeholders.
 *
 * You only have to send a comma separated list into the placeholder
 * attribute, and the widget will take care of splitting up the list
 * and rotate the placeholder between the items in the list.
 *
 * @example
 * <input type="text"
 *        placeholder="People, Animals, Monsters, Elves, ..."
 *        data-ievv-jsbase-widget="cradmin-rotating-placeholder">
 *
 * @example <caption>Using the available config options</caption>
 * <input type="text"
 *        placeholder="People; Animals; Monsters; Elves; ..."
 *        data-ievv-jsbase-widget="cradmin-rotating-placeholder"
 *        data-ievv-jsbase-widget-config='{
 *          "separator": ";",
 *          "intervalMilliseconds": 4000,
 *          "ignore": ["...", "..", "I", "we"],
 *          "prefix": "Search for",
 *          "suffix": "awesomeness"
 *        }'>
 *
 */
var RotatingPlaceholderWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(RotatingPlaceholderWidget, [{
    key: "getDefaultConfig",

    /**
     * @returns {Object} The default config.
     * @property {string} separator The separator to split the value of the placeholder
     *    attribute by. Defaults to ``","``.
     * @property {number} intervalMilliseconds Number of milliseconds to show each
     *    placeholder. Defaults to ``2000``.
     * @property {Array} ignore Array of items in the placeholder list to ignore
     *    Defaults to ``["..."]``.
     * @property {string} prefix A prefix to add to each placeholder.
     *    Lets say you have a search field. You may want to use
     *    ``Search for`` as prefix so that the placeholder is always
     *    ``Search for <placeholder>``.
     * @property {string} suffix Same as ``prefix``, but added at the end instead
     *    of at the beginning.
     * @property {string} placeholder Send a placeholder through config
     *    instead of using the placeholder attribute of the element. If this
     *    is specified, we read the placeholder from this config instead
     *    of from the placeholder attribute.
     *
     *    The primary reason for using this method is to avoid the placeholder
     *    flashing on load before the javascript takes over.
     */
    value: function getDefaultConfig() {
      return {
        'separator': ',',
        'intervalMilliseconds': 2000,
        'prefix': '',
        'suffix': '',
        'ignore': ["..."],
        'placeholder': null
      };
    }
  }]);

  function RotatingPlaceholderWidget(element) {
    var _this;

    _classCallCheck(this, RotatingPlaceholderWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RotatingPlaceholderWidget).call(this, element));
    _this._rotatePlaceholder = _this._rotatePlaceholder.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._intervalId = null;
    _this._originalPlaceholder = _this.element.getAttribute('placeholder');
    _this._placeholderList = _this.makePlaceholderList();

    if (_this._placeholderList.length == 0) {
      return _possibleConstructorReturn(_this);
    }

    _this._currentPlaceholderIndex = 0;

    _this._setPlaceholder();

    if (_this._placeholderList.length > 1) {
      _this._intervalId = window.setInterval(_this._rotatePlaceholder, _this.config.intervalMilliseconds);
    }

    return _this;
  }

  _createClass(RotatingPlaceholderWidget, [{
    key: "destroy",
    value: function destroy() {
      if (this._intervalId != null) {
        clearInterval(this._intervalId);
      }

      if (this._originalPlaceholder != null) {
        this.element.setAttribute(this._originalPlaceholder);
      }
    }
    /**
     * Get the prefix.
     *
     * Defaults to the ``prefix`` config with a single
     * whitespace appended if the prefix config is not empty.
     *
     * @returns {string} The prefix string. Should be empty string if
     *    you do not want a prefix (null or undefined does not work).
     */

  }, {
    key: "getPrefix",
    value: function getPrefix() {
      var prefix = '';

      if (this.config.prefix != '') {
        prefix = "".concat(this.config.prefix, " ");
      }

      return prefix;
    }
    /**
     * Get the suffix. Defaults to the ``suffix`` config.
     *
     * Defaults to the ``suffix`` config with a single
     * whitespace appended if the suffix config is not empty.
     *
     * @returns {string} The prefix string. Should be empty string if
     *    you do not want a prefix (null or undefined does not work).
     */

  }, {
    key: "getSuffix",
    value: function getSuffix() {
      var suffix = '';

      if (this.config.suffix != '') {
        suffix = " ".concat(this.config.suffix);
      }

      return suffix;
    }
    /**
     * Make the array of placeholders to rotate over.
     *
     * May be useful if you want to create a subclass that gets
     * placeholders from some other place (such as an API), or
     * if you just want to extract items from the placeholder attribute
     * in a smarter way.
     *
     * @returns {Array} Array of placeholder items to rotate.
     */

  }, {
    key: "makePlaceholderList",
    value: function makePlaceholderList() {
      var placeholder = this.config.placeholder;

      if (placeholder == null) {
        placeholder = this.element.getAttribute('placeholder');
      }

      if (placeholder == null) {
        return [];
      }

      placeholder = placeholder.trim();

      if (placeholder.trim() == '') {
        return [];
      }

      var placeholderList = [];
      var ignoreSet = new Set(this.config.ignore);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = placeholder.split(this.config.separator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var placeholderItem = _step.value;
          placeholderItem = placeholderItem.trim();

          if (!ignoreSet.has(placeholderItem)) {
            placeholderList.push(placeholderItem);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return placeholderList;
    }
  }, {
    key: "_setPlaceholder",
    value: function _setPlaceholder() {
      var placeholder = this._placeholderList[this._currentPlaceholderIndex];
      var placeholderText = "".concat(this.getPrefix()).concat(placeholder).concat(this.getSuffix());
      this.element.setAttribute('placeholder', placeholderText);
    }
  }, {
    key: "_rotatePlaceholder",
    value: function _rotatePlaceholder() {
      this._currentPlaceholderIndex++;

      if (this._currentPlaceholderIndex >= this._placeholderList.length) {
        this._currentPlaceholderIndex = 0;
      }

      this._setPlaceholder();
    }
  }]);

  _inherits(RotatingPlaceholderWidget, _AbstractWidget);

  return RotatingPlaceholderWidget;
}(_AbstractWidget2.default);

exports.default = RotatingPlaceholderWidget;