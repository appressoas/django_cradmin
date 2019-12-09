"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ModalContentsBase2 = _interopRequireDefault(require("../../../components/ModalPortal/ModalContentsBase"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _LoadingIndicator = _interopRequireDefault(require("../../../components/LoadingIndicator"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var AbstractFilterListBulkActionModalContents =
/*#__PURE__*/
function (_ModalContentsBase) {
  _createClass(AbstractFilterListBulkActionModalContents, null, [{
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractFilterListBulkActionModalContents), "propTypes", this), {
        childExposedApi: _propTypes.default.any.isRequired,
        pageSize: _propTypes.default.number
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractFilterListBulkActionModalContents), "defaultProps", this), {
        pageSize: 1000
      });
    }
  }]);

  function AbstractFilterListBulkActionModalContents(props) {
    var _this;

    _classCallCheck(this, AbstractFilterListBulkActionModalContents);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractFilterListBulkActionModalContents).call(this, props));
    _this.state = _this.getInitialState();

    _this.setupBoundFunctions();

    return _this;
  }

  _createClass(AbstractFilterListBulkActionModalContents, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadIdsFromApi();
    }
    /* initialization functions */

  }, {
    key: "getInitialState",
    value: function getInitialState() {
      return {
        idList: [],
        isLoadingIds: false
      };
    }
  }, {
    key: "setupBoundFunctions",
    value: function setupBoundFunctions() {
      this.handleIdListResponse = this.handleIdListResponse.bind(this);
    }
  }, {
    key: "handleIdListResponse",

    /* view logic functions */
    value: function handleIdListResponse(idList) {
      this.setState({
        idList: idList.map(function (idObject) {
          return idObject.id;
        }),
        isLoadingIds: false
      });
    }
  }, {
    key: "loadIdsFromApi",
    value: function loadIdsFromApi() {
      this.setState({
        isLoadingIds: true
      });
      var request = this.props.childExposedApi.makeListItemsHttpRequest(null, true, false);
      request.urlParser.queryString.set('page_size', this.props.pageSize);
      request.getAllPaginationPages().then(this.handleIdListResponse).catch(function (error) {
        console.error('Something went wrong while loading idList: ', error);
        throw error;
      });
    }
    /* Render functions */

  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      return _react.default.createElement("div", {
        className: 'text-center',
        key: 'loading-indicator'
      }, _react.default.createElement(_LoadingIndicator.default, {
        message: this.loadingMessage,
        visibleMessage: !!this.loadingMessage
      }));
    }
  }, {
    key: "renderBodyContents",
    value: function renderBodyContents() {
      throw new Error('override renderBodyContents function');
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      return _react.default.createElement(_react.default.Fragment, null, this.message ? this.message : null, this.state.isLoadingIds ? this.renderLoadingIndicator() : this.renderBodyContents());
    }
  }, {
    key: "loadingMessage",
    get: function get() {
      return null;
    }
  }, {
    key: "message",
    get: function get() {
      return null;
    }
  }]);

  _inherits(AbstractFilterListBulkActionModalContents, _ModalContentsBase);

  return AbstractFilterListBulkActionModalContents;
}(_ModalContentsBase2.default);

exports.default = AbstractFilterListBulkActionModalContents;