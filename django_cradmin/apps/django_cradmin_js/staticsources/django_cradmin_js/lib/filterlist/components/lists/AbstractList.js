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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var AbstractList =
/*#__PURE__*/
function (_AbstractLayoutCompon) {
  function AbstractList() {
    _classCallCheck(this, AbstractList);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractList).apply(this, arguments));
  }

  _createClass(AbstractList, [{
    key: "shouldRenderListItem",
    value: function shouldRenderListItem(listItemData) {
      return true;
    }
  }, {
    key: "getItemComponentClass",
    value: function getItemComponentClass(listItemData) {
      return this.props.itemSpec.componentClass;
    }
  }, {
    key: "getItemComponentProps",
    value: function getItemComponentProps(listItemData) {
      var listItemId = this.props.childExposedApi.getIdFromListItemData(listItemData);
      var props = Object.assign(listItemData, this.props.itemSpec.props, {
        key: listItemId,
        isSelected: this.props.childExposedApi.itemIsSelected(listItemId),
        listItemId: listItemId
      });
      return this.makeChildComponentProps(this.props.itemSpec, props);
    }
  }, {
    key: "renderListItem",
    value: function renderListItem(listItemData) {
      return _react.default.createElement(this.getItemComponentClass(listItemData), this.getItemComponentProps(listItemData));
    }
  }, {
    key: "renderListItems",
    value: function renderListItems() {
      var renderedListItems = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.listItemsDataArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listItemData = _step.value;

          if (this.shouldRenderListItem(listItemData)) {
            renderedListItems.push(this.renderListItem(listItemData));
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

      return renderedListItems;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractList), "propTypes", this), {
        itemSpec: _propTypes.default.object.isRequired,
        listItemsDataArray: _propTypes.default.array.isRequired,
        selectedListItemsMap: _propTypes.default.instanceOf(Map).isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractList), "defaultProps", this), {
        itemSpec: null,
        selectedListItemsMap: null,
        listItemsDataArray: null
      });
    }
  }]);

  _inherits(AbstractList, _AbstractLayoutCompon);

  return AbstractList;
}(_AbstractLayoutComponentChild.default);

exports.default = AbstractList;