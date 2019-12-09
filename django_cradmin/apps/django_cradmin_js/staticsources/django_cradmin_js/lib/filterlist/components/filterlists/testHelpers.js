"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChildExposedApiMock = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ChildExposedApiMock =
/*#__PURE__*/
function () {
  function ChildExposedApiMock() {
    _classCallCheck(this, ChildExposedApiMock);

    this.loadMoreItemsFromApi = jest.fn();
    this.loadNextPageFromApi = jest.fn();
    this.loadPreviousPageFromApi = jest.fn();
    this.loadSpecificPageFromApi = jest.fn();
    this.selectItem = jest.fn();
    this.selectItems = jest.fn();
    this.deselectItem = jest.fn();
    this.deselectItems = jest.fn();
    this.deselectAllItems = jest.fn();
    this.itemIsSelected = jest.fn();
    this.getIdFromListItemData = jest.fn();
    this.setFilterValue = jest.fn();
    this.getFilterValue = jest.fn();
    this.setSelectMode = jest.fn();
    this.isSingleSelectMode = jest.fn();
    this.isMultiSelectMode = jest.fn();
    this.hasPreviousPaginationPage = jest.fn();
    this.hasNextPaginationPage = jest.fn();
    this.getPaginationPageCount = jest.fn();
    this.getTotalListItemCount = jest.fn();
    this.onChildFocus = jest.fn();
    this.onChildBlur = jest.fn();
    this.disableComponentGroup = jest.fn();
    this.enableComponentGroup = jest.fn();
    this.toggleComponentGroup = jest.fn();
    this.componentGroupIsEnabled = jest.fn();
    this.componentGroupsIsEnabled = jest.fn();
    this.registerFocusChangeListener = jest.fn();
    this.unregisterFocusChangeListener = jest.fn();
    this.makeListItemsHttpRequest = jest.fn();
    this.moveDown = jest.fn();
    this.moveUp = jest.fn();
    this.isLast = jest.fn();
    this.isFirst = jest.fn();
    this.getAfter = jest.fn();
    this.getBefore = jest.fn();
  }

  _createClass(ChildExposedApiMock, [{
    key: "listComponentSpecs",
    get: function get() {
      return [];
    }
  }]);

  return ChildExposedApiMock;
}();

exports.ChildExposedApiMock = ChildExposedApiMock;