"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupDefaultListRegistryFilterListComponents = setupDefaultListRegistryFilterListComponents;
exports.setupDefaultListRegistryLayoutComponents = setupDefaultListRegistryLayoutComponents;
exports.setupDefaultListRegistryListComponents = setupDefaultListRegistryListComponents;
exports.setupDefaultListRegistryFilterComponents = setupDefaultListRegistryFilterComponents;
exports.setupDefaultListRegistryItemComponents = setupDefaultListRegistryItemComponents;
exports.setupDefaultListRegistryPaginatorComponents = setupDefaultListRegistryPaginatorComponents;
exports.setupDefaultListRegistryComponentGroupComponents = setupDefaultListRegistryComponentGroupComponents;
exports.setupDefaultListRegistrySelectedItemsComponents = setupDefaultListRegistrySelectedItemsComponents;
exports.default = setupDefaultListRegistry;

var _FilterListRegistrySingleton = _interopRequireDefault(require("./FilterListRegistrySingleton"));

var _BlockList = _interopRequireDefault(require("./components/lists/BlockList"));

var _IdOnlyListItem = _interopRequireDefault(require("./components/items/IdOnlyListItem"));

var _CheckboxBooleanFilter = _interopRequireDefault(require("./components/filters/CheckboxBooleanFilter"));

var _TitleDescriptionListItem = _interopRequireDefault(require("./components/items/TitleDescriptionListItem"));

var _LoadMorePaginator = _interopRequireDefault(require("./components/paginators/LoadMorePaginator"));

var _SearchFilter = _interopRequireDefault(require("./components/filters/SearchFilter"));

var _DropDownSearchFilter = _interopRequireDefault(require("./components/filters/DropDownSearchFilter"));

var _SelectableTitleDescriptionListItem = _interopRequireDefault(require("./components/items/SelectableTitleDescriptionListItem"));

var _SelectableList = _interopRequireDefault(require("./components/lists/SelectableList"));

var _ThreeColumnLayout = _interopRequireDefault(require("./components/layout/ThreeColumnLayout"));

var _PageNumberPaginationFilterList = _interopRequireDefault(require("./components/filterlists/PageNumberPaginationFilterList"));

var _ThreeColumnDropDownLayout = _interopRequireDefault(require("./components/layout/ThreeColumnDropDownLayout"));

var _HiddenFieldRenderSelectedItems = _interopRequireDefault(require("./components/selecteditems/HiddenFieldRenderSelectedItems"));

var _SelectableListRenderSelectedItems = _interopRequireDefault(require("./components/selecteditems/SelectableListRenderSelectedItems"));

var _BlockListRenderSelectedItems = _interopRequireDefault(require("./components/selecteditems/BlockListRenderSelectedItems"));

var _ParagraphLoadMorePaginator = _interopRequireDefault(require("./components/paginators/ParagraphLoadMorePaginator"));

var _SubmitSelectedItems = _interopRequireDefault(require("./components/selecteditems/SubmitSelectedItems"));

var _LinkWithTitleDescriptionListItem = _interopRequireDefault(require("./components/items/LinkWithTitleDescriptionListItem"));

var _SelectComponentGroup = _interopRequireDefault(require("./components/componentgroup/SelectComponentGroup"));

var _DropDownSelectFilter = _interopRequireDefault(require("./components/filters/DropDownSelectFilter"));

var _TightLabeledEmptyBooleanFilter = _interopRequireDefault(require("./components/filters/TightLabeledEmptyBooleanFilter"));

var _EmptyBooleanFilter = _interopRequireDefault(require("./components/filters/EmptyBooleanFilter"));

var _BlockListRenderSortableSelectedItems = _interopRequireDefault(require("./components/selecteditems/BlockListRenderSortableSelectedItems"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupDefaultListRegistryFilterListComponents(registry) {
  registry.registerFilterListComponent('PageNumberPaginationFilterList', _PageNumberPaginationFilterList.default);
}

function setupDefaultListRegistryLayoutComponents(registry) {
  registry.registerLayoutComponent('ThreeColumnLayout', _ThreeColumnLayout.default);
  registry.registerLayoutComponent('ThreeColumnDropDownLayout', _ThreeColumnDropDownLayout.default);
}

function setupDefaultListRegistryListComponents(registry) {
  registry.registerListComponent('BlockList', _BlockList.default);
  registry.registerListComponent('SelectableList', _SelectableList.default);
}

function setupDefaultListRegistryFilterComponents(registry) {
  registry.registerFilterComponent('CheckboxBooleanFilter', _CheckboxBooleanFilter.default);
  registry.registerFilterComponent('DropDownSelectFilter', _DropDownSelectFilter.default);
  registry.registerFilterComponent('SearchFilter', _SearchFilter.default);
  registry.registerFilterComponent('DropDownSearchFilter', _DropDownSearchFilter.default);
  registry.registerFilterComponent('EmptyBooleanFilter', _EmptyBooleanFilter.default);
  registry.registerFilterComponent('TightLabeledEmptyBooleanFilter', _TightLabeledEmptyBooleanFilter.default);
}

function setupDefaultListRegistryItemComponents(registry) {
  registry.registerItemComponent('IdOnlyItem', _IdOnlyListItem.default);
  registry.registerItemComponent('TitleDescriptionItem', _TitleDescriptionListItem.default);
  registry.registerItemComponent('SelectableTitleDescriptionItem', _SelectableTitleDescriptionListItem.default);
  registry.registerItemComponent('LinkWithTitleDescriptionListItem', _LinkWithTitleDescriptionListItem.default);
}

function setupDefaultListRegistryPaginatorComponents(registry) {
  registry.registerPaginatorComponent('LoadMorePaginator', _LoadMorePaginator.default);
  registry.registerPaginatorComponent('ParagraphLoadMorePaginator', _ParagraphLoadMorePaginator.default);
}

function setupDefaultListRegistryComponentGroupComponents(registry) {
  registry.registerComponentGroupComponent('SelectComponentGroup', _SelectComponentGroup.default);
}

function setupDefaultListRegistrySelectedItemsComponents(registry) {
  registry.registerSelectedItemsComponent('HiddenFieldRenderSelectedItems', _HiddenFieldRenderSelectedItems.default);
  registry.registerSelectedItemsComponent('SelectableListRenderSelectedItems', _SelectableListRenderSelectedItems.default);
  registry.registerSelectedItemsComponent('BlockListRenderSelectedItems', _BlockListRenderSelectedItems.default);
  registry.registerSelectedItemsComponent('BlockListRenderSortableSelectedItems', _BlockListRenderSortableSelectedItems.default);
  registry.registerSelectedItemsComponent('SubmitSelectedItems', _SubmitSelectedItems.default);
}

function setupDefaultListRegistry() {
  var registry = new _FilterListRegistrySingleton.default();
  setupDefaultListRegistryFilterListComponents(registry);
  setupDefaultListRegistryLayoutComponents(registry);
  setupDefaultListRegistryListComponents(registry);
  setupDefaultListRegistryFilterComponents(registry);
  setupDefaultListRegistryItemComponents(registry);
  setupDefaultListRegistryPaginatorComponents(registry);
  setupDefaultListRegistrySelectedItemsComponents(registry);
  setupDefaultListRegistryComponentGroupComponents(registry);
}