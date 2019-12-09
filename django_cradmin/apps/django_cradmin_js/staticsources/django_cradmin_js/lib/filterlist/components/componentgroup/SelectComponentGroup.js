"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _AbstractComponentGroup = _interopRequireDefault(require("./AbstractComponentGroup"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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

var SelectComponentGroup =
/*#__PURE__*/
function (_AbstractComponentGro) {
  function SelectComponentGroup() {
    _classCallCheck(this, SelectComponentGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(SelectComponentGroup).apply(this, arguments));
  }

  _createClass(SelectComponentGroup, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(SelectComponentGroup.prototype), "setupBoundMethods", this).call(this);

      this.selectComponentGroupClickListener = this.selectComponentGroupClickListener.bind(this);
    }
  }, {
    key: "selectComponentGroupClickListener",
    value: function selectComponentGroupClickListener(event) {
      SelectComponentGroup.selectComponentGroup(event.target.value, this.props);
    }
  }, {
    key: "renderSelectableComponentGroups",
    value: function renderSelectableComponentGroups() {
      var selectableComponentGroups = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.selectableComponentGroups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var componentGroup = _step.value;
          selectableComponentGroups.push(_react.default.createElement("label", {
            className: this.className,
            key: componentGroup.name
          }, _react.default.createElement("input", {
            type: 'radio',
            name: this.props.name,
            value: componentGroup.name,
            checked: this.props.enabledComponentGroups.has(componentGroup.name),
            onChange: this.selectComponentGroupClickListener
          }), _react.default.createElement("span", {
            className: 'radio__control-indicator'
          }), componentGroup.label));
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

      return selectableComponentGroups;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.selectableComponentGroups.length === 0) {
        console.warn('attempting to use SelectComponentGroup without passing any selectableComponentGroups - not rendering anything.');
        return null;
      }

      return _react.default.createElement("p", {
        className: this.props.wrapperClassName
      }, this.props.label, this.renderSelectableComponentGroups());
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var selected = '';
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = nextProps.selectableComponentGroups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var componentGroup = _step2.value;

          if (nextProps.childExposedApi.componentGroupIsEnabled(componentGroup.name)) {
            if (selected) {
              SelectComponentGroup.selectComponentGroup(selected, nextProps);
              break;
            }

            selected = componentGroup.name;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!selected) {
        SelectComponentGroup.selectComponentGroup(nextProps.initialEnabled, nextProps);
      }

      return null;
    }
  }, {
    key: "selectComponentGroup",
    value: function selectComponentGroup(enabledComponentGroup, props) {
      if (!props.childExposedApi.componentGroupIsEnabled(enabledComponentGroup)) {
        props.childExposedApi.enableComponentGroup(enabledComponentGroup);
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = props.selectableComponentGroups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var componentGroup = _step3.value;

          if (componentGroup.name !== enabledComponentGroup && props.childExposedApi.componentGroupIsEnabled(componentGroup.name)) {
            props.childExposedApi.disableComponentGroup(componentGroup.name);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(SelectComponentGroup), "propTypes", this), {
        selectableComponentGroups: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
        initialEnabled: _propTypes.default.string.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        wrapperClassName: _propTypes.default.string.isRequired,
        label: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        name: _propTypes.default.string.isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(SelectComponentGroup), "defaultProps", this), {
        selectableComponentGroups: [],
        initialEnabled: '',
        bemBlock: 'radio',
        name: null,
        bemVariants: ['block'],
        label: '',
        wrapperClassName: 'label'
      });
    }
  }]);

  _inherits(SelectComponentGroup, _AbstractComponentGro);

  return SelectComponentGroup;
}(_AbstractComponentGroup.default);

exports.default = SelectComponentGroup;