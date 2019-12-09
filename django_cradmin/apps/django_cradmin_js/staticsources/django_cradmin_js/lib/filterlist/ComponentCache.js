"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentCache = exports.ComponentGroupComponentSpec = exports.SelectedItemsComponentSpec = exports.PaginatorComponentSpec = exports.FilterComponentSpec = exports.ListComponentSpec = exports.AbstractLayoutChildComponentSpec = exports.ListItemComponentSpec = exports.LayoutComponentSpec = exports.AbstractComponentSpec = exports.ComponentLayout = exports.KeyboardNavigationGroupItem = void 0;

var _AbstractFilter = _interopRequireDefault(require("./components/filters/AbstractFilter"));

var _AbstractPaginator = _interopRequireDefault(require("./components/paginators/AbstractPaginator"));

var _AbstractList = _interopRequireDefault(require("./components/lists/AbstractList"));

var _FilterListRegistrySingleton = _interopRequireDefault(require("./FilterListRegistrySingleton"));

var _PrettyFormat = _interopRequireDefault(require("ievv_jsbase/lib/utils/PrettyFormat"));

var _AbstractListItem = _interopRequireDefault(require("./components/items/AbstractListItem"));

var _AbstractLayout = _interopRequireDefault(require("./components/layout/AbstractLayout"));

var _filterListConstants = require("./filterListConstants");

var _AbstractSelectedItems = _interopRequireDefault(require("./components/selecteditems/AbstractSelectedItems"));

var _AbstractComponentGroup = _interopRequireDefault(require("./components/componentgroup/AbstractComponentGroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyboardNavigationGroupItem = function KeyboardNavigationGroupItem(componentSpec, index) {
  _classCallCheck(this, KeyboardNavigationGroupItem);

  this.componentSpec = componentSpec;
  this.index = index;
};
/**
 * Defines the component layout within a {@link LayoutComponentSpec}.
 */


exports.KeyboardNavigationGroupItem = KeyboardNavigationGroupItem;

var ComponentLayout =
/*#__PURE__*/
function () {
  function ComponentLayout() {
    _classCallCheck(this, ComponentLayout);

    /**
     * Maps locations to arrays of components.
     *
     * The {@link AbstractLayout} component uses this
     * to determine how to render the items.
     *
     * The locations are not sorted, but the array of components
     * within each location key is sorted, and should be rendered
     * in the listed order.
     *
     * @type {Map}
     */
    this.layoutMap = new Map();
  }
  /**
   * Add a component to the layout.
   *
   * Used when parsing the `body` and `header` props
   * for {@link AbstractFilterList}.
   *
   * @param {{}} componentSpec
   */


  _createClass(ComponentLayout, [{
    key: "add",
    value: function add(componentSpec) {
      if (!this.layoutMap.has(componentSpec.props.location)) {
        this.layoutMap.set(componentSpec.props.location, []);
      }

      this.layoutMap.get(componentSpec.props.location).push(componentSpec);
    }
    /**
     * Get the components at a given location.
     *
     * @param {string} location The location.
     * @returns {[]} Always returns a (possibly empty) array even if there are no
     *    items at the provided location.
     */

  }, {
    key: "getComponentsAtLocation",
    value: function getComponentsAtLocation(location) {
      return this.layoutMap.get(location) || [];
    }
  }]);

  return ComponentLayout;
}();

exports.ComponentLayout = ComponentLayout;

var AbstractComponentSpec =
/*#__PURE__*/
function () {
  function AbstractComponentSpec(componentClass, rawComponentSpec) {
    _classCallCheck(this, AbstractComponentSpec);

    /**
     * An instance of {@link FilterListRegistrySingleton} for convenience.
     *
     * @type {FilterListRegistrySingleton}
     */
    this.filterListRegistry = new _FilterListRegistrySingleton.default();
    this._componentClass = componentClass;
    this._componentSpec = Object.assign({}, rawComponentSpec);
    this._keyboardNavigationGroupPointerMap = new Map();
  }

  _createClass(AbstractComponentSpec, [{
    key: "_makeUniqueComponentKeyPrefix",
    value: function _makeUniqueComponentKeyPrefix() {
      return this.componentClassName;
    }
  }, {
    key: "_makeUniqueComponentKey",
    value: function _makeUniqueComponentKey(componentCache) {
      var suffix = componentCache.makeUniqueComponentKey(componentCache);
      return "".concat(this._makeUniqueComponentKeyPrefix(), "-").concat(suffix);
    }
  }, {
    key: "_makeDomIdPrefix",
    value: function _makeDomIdPrefix(componentCache, uniqueComponentKey) {
      return "".concat(componentCache.domIdPrefix).concat(uniqueComponentKey);
    }
  }, {
    key: "_raiseMissingRequiredAttributeError",
    value: function _raiseMissingRequiredAttributeError(attribute) {
      throw new Error("".concat(this.componentClassName, " Missing required attribute \"").concat(attribute, "\": ").concat(this.prettyFormatRawComponentSpec()));
    }
  }, {
    key: "clean",
    value: function clean(componentCache) {
      if (!this._componentSpec.props) {
        this._componentSpec.props = {};
      }

      if (!this._componentSpec.props.componentGroups) {
        this._componentSpec.props.componentGroups = null;
      }

      this._componentSpec.props.uniqueComponentKey = this._makeUniqueComponentKey(componentCache);
      this._componentSpec.props.domIdPrefix = this._makeDomIdPrefix(componentCache, this._componentSpec.props.uniqueComponentKey);

      if (!componentCache.typeMap.has(this.constructor.name)) {
        componentCache.typeMap.set(this.constructor.name, []);
      }

      componentCache.addComponentSpecToTypeMap(this); // const keyboardNavigationGroups = this._componentClass.getKeyboardNavigationGroups ? this._componentClass.getKeyboardNavigationGroups(this) : []
      // for (const keyboardNavigationGroup of keyboardNavigationGroups) {
      //   componentCache.addComponentSpecToKeyboardNavigationGroup(keyboardNavigationGroup, this)
      // }
    }
  }, {
    key: "prettyFormatRawComponentSpec",
    value: function prettyFormatRawComponentSpec() {
      return new _PrettyFormat.default().toString();
    }
  }, {
    key: "componentClass",
    get: function get() {
      return this._componentClass;
    }
  }, {
    key: "componentClassName",
    get: function get() {
      return this.componentClass.name;
    }
  }, {
    key: "props",
    get: function get() {
      return this._componentSpec.props;
    }
  }]);

  return AbstractComponentSpec;
}();

exports.AbstractComponentSpec = AbstractComponentSpec;

var LayoutComponentSpec =
/*#__PURE__*/
function (_AbstractComponentSpe) {
  function LayoutComponentSpec() {
    _classCallCheck(this, LayoutComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(LayoutComponentSpec).apply(this, arguments));
  }

  _createClass(LayoutComponentSpec, [{
    key: "clean",
    value: function clean(componentCache) {
      _get(_getPrototypeOf(LayoutComponentSpec.prototype), "clean", this).call(this, componentCache);

      if (!this._componentSpec.layout) {
        this._raiseMissingRequiredAttributeError('layout');
      }

      if (!this._componentSpec.defaultLocation) {
        this._componentSpec.defaultLocation = _filterListConstants.RENDER_LOCATION_DEFAULT;
      }

      this._componentSpec.props.layout = new ComponentLayout();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._componentSpec.layout[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rawChildComponentSpec = _step.value;
          var childComponentSpec = componentCache.makeComponentSpec(rawChildComponentSpec);

          if (!(childComponentSpec instanceof AbstractLayoutChildComponentSpec)) {
            throw new Error("Invalid child component of a layout: ".concat(childComponentSpec.componentClassName));
          }

          childComponentSpec.clean(componentCache, this._componentSpec.defaultLocation);

          this._componentSpec.props.layout.add(childComponentSpec);
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
  }]);

  _inherits(LayoutComponentSpec, _AbstractComponentSpe);

  return LayoutComponentSpec;
}(AbstractComponentSpec);

exports.LayoutComponentSpec = LayoutComponentSpec;

var ListItemComponentSpec =
/*#__PURE__*/
function (_AbstractComponentSpe2) {
  function ListItemComponentSpec() {
    _classCallCheck(this, ListItemComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(ListItemComponentSpec).apply(this, arguments));
  }

  _inherits(ListItemComponentSpec, _AbstractComponentSpe2);

  return ListItemComponentSpec;
}(AbstractComponentSpec);

exports.ListItemComponentSpec = ListItemComponentSpec;

var AbstractLayoutChildComponentSpec =
/*#__PURE__*/
function (_AbstractComponentSpe3) {
  function AbstractLayoutChildComponentSpec() {
    _classCallCheck(this, AbstractLayoutChildComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractLayoutChildComponentSpec).apply(this, arguments));
  }

  _createClass(AbstractLayoutChildComponentSpec, [{
    key: "clean",
    value: function clean(componentCache, defaultLocation) {
      _get(_getPrototypeOf(AbstractLayoutChildComponentSpec.prototype), "clean", this).call(this, componentCache);

      if (!this._componentSpec.props.location) {
        this._componentSpec.props.location = defaultLocation;
      }
    }
  }]);

  _inherits(AbstractLayoutChildComponentSpec, _AbstractComponentSpe3);

  return AbstractLayoutChildComponentSpec;
}(AbstractComponentSpec);

exports.AbstractLayoutChildComponentSpec = AbstractLayoutChildComponentSpec;

var ListComponentSpec =
/*#__PURE__*/
function (_AbstractLayoutChildC) {
  function ListComponentSpec() {
    _classCallCheck(this, ListComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(ListComponentSpec).apply(this, arguments));
  }

  _createClass(ListComponentSpec, [{
    key: "clean",
    value: function clean(componentCache, defaultLocation) {
      _get(_getPrototypeOf(ListComponentSpec.prototype), "clean", this).call(this, componentCache, defaultLocation);

      if (!this._componentSpec.itemSpec) {
        this._raiseMissingRequiredAttributeError('itemSpec');
      }

      var itemComponentSpec = componentCache.makeComponentSpec(this._componentSpec.itemSpec);
      itemComponentSpec.clean(componentCache);

      if (!(itemComponentSpec instanceof ListItemComponentSpec)) {
        throw new Error("Invalid child component of a list: ".concat(itemComponentSpec.componentClassName));
      }

      this._componentSpec.props.itemSpec = itemComponentSpec;
    }
  }]);

  _inherits(ListComponentSpec, _AbstractLayoutChildC);

  return ListComponentSpec;
}(AbstractLayoutChildComponentSpec);

exports.ListComponentSpec = ListComponentSpec;

var FilterComponentSpec =
/*#__PURE__*/
function (_AbstractLayoutChildC2) {
  function FilterComponentSpec() {
    _classCallCheck(this, FilterComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterComponentSpec).apply(this, arguments));
  }

  _createClass(FilterComponentSpec, [{
    key: "_makeUniqueComponentKeyPrefix",
    value: function _makeUniqueComponentKeyPrefix() {
      return "".concat(this.componentClassName, "-").concat(this.props.name);
    }
  }, {
    key: "clean",
    value: function clean(componentCache, defaultLocation) {
      _get(_getPrototypeOf(FilterComponentSpec.prototype), "clean", this).call(this, componentCache, defaultLocation);

      if (!this._componentSpec.props.name) {
        this._raiseMissingRequiredAttributeError('props.name');
      }

      if (componentCache.filterMap.has(this.filterName)) {
        throw new Error("Multiple filters with the same name: ".concat(this.filterName));
      }

      if (this._componentSpec.initialValue === undefined) {
        this._componentSpec.initialValue = null;
      }

      componentCache.filterMap.set(this.filterName, this);
    }
  }, {
    key: "filterName",
    get: function get() {
      return this.props.name;
    }
  }, {
    key: "initialValue",
    get: function get() {
      return this._componentSpec.initialValue;
    }
  }]);

  _inherits(FilterComponentSpec, _AbstractLayoutChildC2);

  return FilterComponentSpec;
}(AbstractLayoutChildComponentSpec);

exports.FilterComponentSpec = FilterComponentSpec;

var PaginatorComponentSpec =
/*#__PURE__*/
function (_AbstractLayoutChildC3) {
  function PaginatorComponentSpec() {
    _classCallCheck(this, PaginatorComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(PaginatorComponentSpec).apply(this, arguments));
  }

  _inherits(PaginatorComponentSpec, _AbstractLayoutChildC3);

  return PaginatorComponentSpec;
}(AbstractLayoutChildComponentSpec);

exports.PaginatorComponentSpec = PaginatorComponentSpec;

var SelectedItemsComponentSpec =
/*#__PURE__*/
function (_AbstractLayoutChildC4) {
  function SelectedItemsComponentSpec() {
    _classCallCheck(this, SelectedItemsComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(SelectedItemsComponentSpec).apply(this, arguments));
  }

  _inherits(SelectedItemsComponentSpec, _AbstractLayoutChildC4);

  return SelectedItemsComponentSpec;
}(AbstractLayoutChildComponentSpec);

exports.SelectedItemsComponentSpec = SelectedItemsComponentSpec;

var ComponentGroupComponentSpec =
/*#__PURE__*/
function (_AbstractLayoutChildC5) {
  function ComponentGroupComponentSpec() {
    _classCallCheck(this, ComponentGroupComponentSpec);

    return _possibleConstructorReturn(this, _getPrototypeOf(ComponentGroupComponentSpec).apply(this, arguments));
  }

  _inherits(ComponentGroupComponentSpec, _AbstractLayoutChildC5);

  return ComponentGroupComponentSpec;
}(AbstractLayoutChildComponentSpec);
/**
 * Parser for the `body` and `header` props for {@link AbstractFilterList}.
 *
 * Validates the provided objects, looks up `component` attributes
 * and sets their actual class in a new `componentClass` attribute,
 * and much more.
 *
 * You can extend this class, and override
 * {@link AbstractFilterList#makeEmptyComponentCache} to
 * use a subclass of this class to parse the AbstractFilterList
 * `components` prop.
 */


exports.ComponentGroupComponentSpec = ComponentGroupComponentSpec;

var ComponentCache =
/*#__PURE__*/
function () {
  function ComponentCache() {
    var rawLayoutComponentSpecs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var domIdPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, ComponentCache);

    this.domIdPrefix = domIdPrefix;
    /**
     * An instance of {@link FilterListRegistrySingleton} for convenience.
     *
     * @type {FilterListRegistrySingleton}
     */

    this.filterListRegistry = new _FilterListRegistrySingleton.default();
    /**
     * Map from filter name to parsed filter spec.
     *
     * @type {Map}
     */

    this.filterMap = new Map();
    /**
     * Internal counter of the number of layout components.
     *
     * Used by {@link ComponentCache#makeUniqueComponentKey}.
     *
     * @type {number}
     */

    this.componentCount = 0;
    /**
     * The layout component specs.
     *
     * @type {[LayoutComponentSpec]}
     */

    this.layoutComponentSpecs = [];
    /**
     * Map of spec type string to list of component specs within the type.
     *
     * @type {Map}
     */

    this.typeMap = new Map();
    this.keyboardNavigationGroupMap = new Map();
    this.addRawLayoutComponentSpecs(rawLayoutComponentSpecs);
  }
  /**
   * Get the javascript class for a `component` string.
   *
   * Looks up the component in {@link FilterListRegistrySingleton}.
   *
   * @param {string} componentString A string alias for a component class.
   * @returns {*}
   */


  _createClass(ComponentCache, [{
    key: "getClassForComponentString",
    value: function getClassForComponentString(componentString) {
      var componentClass = null;

      if (componentString.endsWith('Filter')) {
        componentClass = this.filterListRegistry.getFilterComponent(componentString);
      } else if (componentString.endsWith('List')) {
        componentClass = this.filterListRegistry.getListComponent(componentString);
      } else if (componentString.endsWith('Paginator')) {
        componentClass = this.filterListRegistry.getPaginatorComponent(componentString);
      } else if (componentString.endsWith('SelectedItems')) {
        componentClass = this.filterListRegistry.getSelectedItemsComponent(componentString);
      } else if (componentString.endsWith('Layout')) {
        componentClass = this.filterListRegistry.getLayoutComponent(componentString);
      } else if (componentString.endsWith('Item')) {
        componentClass = this.filterListRegistry.getItemComponent(componentString);
      } else if (componentString.endsWith('ComponentGroup')) {
        componentClass = this.filterListRegistry.getComponentGroupComponent(componentString);
      } else {
        throw new Error("Invalid component: \"".concat(componentString, "\". ") + "Must end with \"Filter\", \"List\", \"ComponentGroup\" or \"Paginator\".");
      }

      if (!componentClass) {
        throw new Error("No component class for \"".concat(componentString, "\" in the registry."));
      }

      return componentClass;
    }
  }, {
    key: "getComponentClass",
    value: function getComponentClass(componentSpec) {
      if (typeof componentSpec.component === 'string') {
        return this.getClassForComponentString(componentSpec.component);
      } else {
        return componentSpec.component;
      }
    }
    /**
     * Make a unique key for a component.
     *
     * @returns {string}
     */

  }, {
    key: "makeUniqueComponentKey",
    value: function makeUniqueComponentKey() {
      var key = this.componentCount;
      this.componentCount++;
      return "".concat(key);
    }
  }, {
    key: "getComponentSpecClass",
    value: function getComponentSpecClass(componentClass) {
      if (componentClass.prototype instanceof _AbstractFilter.default) {
        return FilterComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractList.default) {
        return ListComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractPaginator.default) {
        return PaginatorComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractSelectedItems.default) {
        return SelectedItemsComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractListItem.default) {
        return ListItemComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractLayout.default) {
        return LayoutComponentSpec;
      } else if (componentClass.prototype instanceof _AbstractComponentGroup.default) {
        return ComponentGroupComponentSpec;
      } else {
        throw new Error("Invalid component: \"".concat(componentClass.name, "\". ") + "Must be a subclass of AbstractFilter, AbstractList, AbstractComponentGroup " + "or AbstractPaginator.");
      }
    }
  }, {
    key: "makeComponentSpec",
    value: function makeComponentSpec(rawComponentSpec) {
      var componentClass = this.getComponentClass(rawComponentSpec);
      var ComponentSpecClass = this.getComponentSpecClass(componentClass);
      return new ComponentSpecClass(componentClass, rawComponentSpec);
    }
    /**
     * Make a {@link LayoutComponentSpec}.
     *
     * @param {{}} rawLayoutComponentSpec The raw area spec.
     * @returns {LayoutComponentSpec}
     */

  }, {
    key: "makeLayoutComponent",
    value: function makeLayoutComponent(rawLayoutComponentSpec) {
      var componentSpec = this.makeComponentSpec(rawLayoutComponentSpec);
      componentSpec.clean(this);
      return componentSpec;
    }
  }, {
    key: "addRawLayoutComponentSpec",
    value: function addRawLayoutComponentSpec(rawLayoutComponentSpec) {
      this.layoutComponentSpecs.push(this.makeLayoutComponent(rawLayoutComponentSpec));
    }
  }, {
    key: "addRawLayoutComponentSpecs",
    value: function addRawLayoutComponentSpecs(rawLayoutComponentSpecs) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = rawLayoutComponentSpecs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var rawLayoutComponentSpec = _step2.value;
          this.addRawLayoutComponentSpec(rawLayoutComponentSpec);
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
    }
  }, {
    key: "addComponentSpecToTypeMap",
    value: function addComponentSpecToTypeMap(componentSpec) {
      this.typeMap.get(componentSpec.constructor.name).push(componentSpec);
    } // addComponentSpecToKeyboardNavigationGroup (keyboardNavigationGroup, componentSpec) {
    //   if (!this.keyboardNavigationGroupMap.has(keyboardNavigationGroup)) {
    //     this.keyboardNavigationGroupMap.set(keyboardNavigationGroup, [])
    //   }
    //   const keyboardNavigationGroupItemsArray = this.keyboardNavigationGroupMap.get(keyboardNavigationGroup)
    //   const nextIndex = keyboardNavigationGroupItemsArray.length
    //   keyboardNavigationGroupItemsArray.push(new KeyboardNavigationGroupItem(componentSpec, nextIndex))
    // }

  }]);

  return ComponentCache;
}();

exports.ComponentCache = ComponentCache;