"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractLayoutComponentChild = _interopRequireDefault(require("../AbstractLayoutComponentChild"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Base class for filter components.
 *
 * See {@link AbstractFilter.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractFilter =
/*#__PURE__*/
function (_AbstractLayoutCompon) {
  _createClass(AbstractFilter, null, [{
    key: "filterHttpRequest",

    /**
     * Filter the provided HTTP request.
     *
     * Defaults to setting `<name>=<value>` is the querystring.
     * Non-trivial filters will need to override this.
     *
     * @param httpRequest The HTTP request.
     *    An object of the class returned by {@link AbstractFilter#getHttpRequestClass}
     * @param name The name of the filter. Will be the same as
     *    `props.name`.
     * @param value The current value of the filter.
     */
    value: function filterHttpRequest(httpRequest, name, value) {
      httpRequest.urlParser.queryString.setSmart(name, value);
    }
  }, {
    key: "setInQueryString",
    value: function setInQueryString(queryString, name, value) {
      if (value === null) {
        return;
      }

      queryString.setSmart(name, value);
    }
  }, {
    key: "getValueFromQueryString",
    value: function getValueFromQueryString(queryString, name) {
      return queryString.getSmart(name, null);
    }
    /**
     * Should the filter receive selected items?
     *
     * If this returns ``true``, the component will receive
     * ``selectedListItemsMap`` as a prop. This also means
     * that the filter will re-render when selected items
     * change.
     *
     * ``selectedListItemsMap`` is a Map of selected items
     * that maps ID to item data.
     *
     * @param {FilterComponentSpec} componentSpec The component spec.
     * @returns {boolean}
     */

  }, {
    key: "shouldReceiveSelectedItems",
    value: function shouldReceiveSelectedItems(componentSpec) {
      return false;
    }
  }, {
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractFilter), "propTypes", this), {
        name: _propTypes.default.string.isRequired,
        isStatic: _propTypes.default.bool,
        value: _propTypes.default.any,
        selectedListItemsMap: _propTypes.default.instanceOf(Map).isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractLayoutComponentChild.defaultProps}.
     *
     * @return {Object}
     * @property {string} name The name of the filter.
     *    This is required, and defaults to `null`.
     *    **Must be be provided in spec**.
     * @property {bool} isStatic If this is `true`, the filter is not rendered,
     *    but API requests is always filtered by the value specified for the
     *    filter in the `initialValue` attribute of the spec for the filter.
     *    Defaults to `false`.
     *    **Can be used in spec**.
     * @property {*} value The current value of the filter.
     *    _Provided automatically by the parent component_.
     * @property {Map} selectedListItemsMap Map of selected items
     *    (maps ID to item data).
     *    _Provided automatically by the parent component_.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractFilter), "defaultProps", this), {
        name: null,
        isStatic: false,
        value: null,
        selectedListItemsMap: null
      });
    }
  }]);

  function AbstractFilter(props) {
    var _this;

    _classCallCheck(this, AbstractFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractFilter).call(this, props));
    _this.state = _this.getInitialState();
    return _this;
  }
  /**
   * Get the initial state for the filter.
   *
   * Ment to be overridden in subclasses to provide a uniform
   * way of setting initial state for filters that require state.
   *
   * @returns {{}}
   */


  _createClass(AbstractFilter, [{
    key: "getInitialState",
    value: function getInitialState() {
      return {};
    }
    /**
     * Setup bound methods.
     *
     * Calls {@link AbstractFilterListChild#setupBoundMethods}, and
     * binds {@link AbstractFilter#setFilterValue}
     * to ``this` by default, but you can override this
     * method to bind more methods. In that case, ensure
     * you call `super.setupBoundMethods()`!
     */

  }, {
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractFilter.prototype), "setupBoundMethods", this).call(this);

      this.setFilterValue = this.setFilterValue.bind(this);
    }
    /**
     * Set the value of the filter.
     *
     * If you set complex objects as value (array, object, map, set, ...),
     * you will need to override {@link AbstractFilter#filterHttpRequest}.
     *
     * @param value The value to set.
     */

  }, {
    key: "setFilterValue",
    value: function setFilterValue(value) {
      this.props.childExposedApi.setFilterValue(this.props.name, value);
    }
  }, {
    key: "ariaProps",
    get: function get() {
      var controlsDomIds = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.childExposedApi.listComponentSpecs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var componentSpec = _step.value;
          controlsDomIds.push(componentSpec.props.domIdPrefix);
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

      return {
        'aria-controls': controlsDomIds.join(' ')
      };
    }
  }]);

  _inherits(AbstractFilter, _AbstractLayoutCompon);

  return AbstractFilter;
}(_AbstractLayoutComponentChild.default);

exports.default = AbstractFilter;