"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abstractIdListItemMapStateToProps = abstractIdListItemMapStateToProps;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractSearchInputFilter = _interopRequireDefault(require("../AbstractSearchInputFilter"));

var reduxApiUtilities = _interopRequireWildcard(require("ievv_jsbase/lib/utils/reduxApiUtilities"));

var _LoadingIndicator = _interopRequireDefault(require("../../../../components/LoadingIndicator"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AbstractGeneridIdListSearchInputMultiSelect =
/*#__PURE__*/
function (_AbstractSearchInputF) {
  _inherits(AbstractGeneridIdListSearchInputMultiSelect, _AbstractSearchInputF);

  function AbstractGeneridIdListSearchInputMultiSelect() {
    _classCallCheck(this, AbstractGeneridIdListSearchInputMultiSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractGeneridIdListSearchInputMultiSelect).apply(this, arguments));
  }

  _createClass(AbstractGeneridIdListSearchInputMultiSelect, [{
    key: "getInitialState",
    value: function getInitialState() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractGeneridIdListSearchInputMultiSelect.prototype), "getInitialState", this).call(this), {
        hasAllReduxData: false
      });
    }
  }, {
    key: "getLabelForId",
    value: function getLabelForId(id) {
      console.warn('Should be overridden in subclass');
      return id;
    }
  }, {
    key: "deselectItemById",
    value: function deselectItemById(id) {
      this.props.childExposedApi.deselectItems([id]);
    }
  }, {
    key: "renderSelected",
    value: function renderSelected(id) {
      var _this = this;

      return _react.default.createElement("span", {
        key: "selected-".concat(id),
        className: 'searchinput__selected'
      }, _react.default.createElement("span", {
        className: 'searchinput__selected_preview searchinput__selected_preview--with-deselect'
      }, this.getLabelForId(parseInt(id))), _react.default.createElement("button", {
        type: 'button',
        className: 'searchinput__deselect',
        onClick: function onClick() {
          _this.deselectItemById(id);
        }
      }, _react.default.createElement("i", {
        className: 'searchinput__deselect_icon cricon cricon--close cricon--color-light'
      })));
    }
  }, {
    key: "renderSelectedValues",
    value: function renderSelectedValues() {
      var _this2 = this;

      if (!this.state.hasAllReduxData) {
        return _react.default.createElement(_LoadingIndicator.default, null);
      }

      return this.props.childExposedApi.selectedItemIdsAsArray().map(function (id) {
        return _this2.renderSelected(id);
      });
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      return _react.default.createElement(_react.default.Fragment, null, this.renderSelectedValues(), _get(_getPrototypeOf(AbstractGeneridIdListSearchInputMultiSelect.prototype), "renderBodyContent", this).call(this));
    }
  }, {
    key: "idListItemNotFoundFallback",
    get: function get() {
      return new Map();
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = null;
      var hasAllReduxData = true;

      function setValueInNextState(valueObject) {
        nextState = _objectSpread({}, nextState === null ? {} : nextState, {}, valueObject);
      }

      function ensureIdListItemInStore() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = nextProps.childExposedApi.selectedItemIdsAsArray()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var id = _step.value;
            var idListItem = reduxApiUtilities.getObjectFromReduxMapOrNullIfLoading(nextProps.idListItemMap, parseInt(id), nextProps.getIdListItemAction, nextProps.dispatch);

            if (idListItem === null) {
              hasAllReduxData = false;
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
      }

      ensureIdListItemInStore();

      if (hasAllReduxData !== prevState.hasAllReduxData) {
        setValueInNextState({
          hasAllReduxData: hasAllReduxData
        });
      }

      return nextState;
    }
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractGeneridIdListSearchInputMultiSelect), "propTypes", this), {
        idListItemMap: _propTypes.default.object,
        getIdListItemAction: _propTypes.default.func
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractGeneridIdListSearchInputMultiSelect), "defaultProps", this), {
        idListItemMap: new Map(),
        getIdListItemAction: function getIdListItemAction() {
          console.warn('getIdListItemAction not given in props!');
          return null;
        }
      });
    }
  }]);

  return AbstractGeneridIdListSearchInputMultiSelect;
}(_AbstractSearchInputFilter.default);
/**
 * example mapStateToProps in order to use {@link AbstractGenericIdListMultiSelectItem}.
 *
 * @param state redux-state
 * @return {{getIdListItemAction: null, idListItemMap: never, idListItemId: *}}
 */


exports.default = AbstractGeneridIdListSearchInputMultiSelect;

function abstractIdListItemMapStateToProps(state) {
  return {
    idListItemMap: new Map(),
    getIdListItemAction: null
  };
}