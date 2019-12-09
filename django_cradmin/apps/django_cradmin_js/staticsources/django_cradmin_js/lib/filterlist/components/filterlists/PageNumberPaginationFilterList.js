"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractFilterList2 = _interopRequireDefault(require("./AbstractFilterList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var PageNumberPaginationFilterList =
/*#__PURE__*/
function (_AbstractFilterList) {
  function PageNumberPaginationFilterList() {
    _classCallCheck(this, PageNumberPaginationFilterList);

    return _possibleConstructorReturn(this, _getPrototypeOf(PageNumberPaginationFilterList).apply(this, arguments));
  }

  _createClass(PageNumberPaginationFilterList, [{
    key: "makePaginationStateFromHttpResponse",
    value: function makePaginationStateFromHttpResponse(httpResponse, paginationOptions) {
      var page = 1;

      if (paginationOptions && paginationOptions.page) {
        page = paginationOptions.page;
      }

      return {
        page: page,
        next: httpResponse.bodydata.next,
        previous: httpResponse.bodydata.previous,
        count: httpResponse.bodydata.count
      };
    }
  }, {
    key: "getFirstPagePaginationOptions",
    value: function getFirstPagePaginationOptions(paginationState) {
      return null;
    }
  }, {
    key: "getCurrentPaginationPage",
    value: function getCurrentPaginationPage(paginationState) {
      if (paginationState && paginationState.page) {
        return paginationState.page;
      }

      return 1;
    }
  }, {
    key: "getNextPagePaginationOptions",
    value: function getNextPagePaginationOptions(paginationState) {
      if (paginationState) {
        if (!paginationState.next) {
          return null;
        }

        return {
          page: this.getCurrentPaginationPage(paginationState) + 1
        };
      }

      return null;
    }
  }, {
    key: "getPreviousPagePaginationOptions",
    value: function getPreviousPagePaginationOptions(paginationState) {
      if (paginationState) {
        if (paginationState.previous === null) {
          return null;
        }

        return {
          page: this.getCurrentPaginationPage(paginationState) - 1
        };
      }

      return null;
    }
  }, {
    key: "getSpecificPagePaginationOptions",
    value: function getSpecificPagePaginationOptions(pageNumber, paginationState) {
      return {
        page: pageNumber
      };
    }
  }, {
    key: "getPaginationPageCount",
    value: function getPaginationPageCount(paginationState) {
      return null;
    }
  }, {
    key: "getTotalListItemCount",
    value: function getTotalListItemCount(paginationState) {
      return paginationState.count;
    }
  }]);

  _inherits(PageNumberPaginationFilterList, _AbstractFilterList);

  return PageNumberPaginationFilterList;
}(_AbstractFilterList2.default);

exports.default = PageNumberPaginationFilterList;