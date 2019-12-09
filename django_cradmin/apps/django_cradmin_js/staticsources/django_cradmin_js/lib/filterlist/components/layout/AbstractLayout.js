"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _AbstractFilterListChild = _interopRequireDefault(require("../AbstractFilterListChild"));

var _LoadingIndicator = _interopRequireDefault(require("../../../components/LoadingIndicator"));

var _AbstractFilter = _interopRequireDefault(require("../filters/AbstractFilter"));

var _AbstractList = _interopRequireDefault(require("../lists/AbstractList"));

var _AbstractPaginator = _interopRequireDefault(require("../paginators/AbstractPaginator"));

var _AbstractSelectedItems = _interopRequireDefault(require("../selecteditems/AbstractSelectedItems"));

var _AbstractComponentGroup = _interopRequireDefault(require("../componentgroup/AbstractComponentGroup"));

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

var AbstractLayout =
/*#__PURE__*/
function (_AbstractFilterListCh) {
  function AbstractLayout() {
    _classCallCheck(this, AbstractLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractLayout).apply(this, arguments));
  }

  _createClass(AbstractLayout, [{
    key: "renderLoadingIndicator",
    //
    //
    // Rendering
    //
    //
    value: function renderLoadingIndicator() {
      return _react.default.createElement(_LoadingIndicator.default, {
        key: "loadingIndicator"
      });
    }
    /**
     * Used by {@link AbstractLayout#shouldRenderComponent} when
     * the provided componentSpec.componentClass is a subclass
     * of {@link AbstractFilter}.
     *
     * By default this returns `true`.
     *
     * @param componentSpec
     * @returns {boolean}
     */

  }, {
    key: "shouldRenderFilterComponent",
    value: function shouldRenderFilterComponent(componentSpec) {
      return true;
    }
    /**
     * Used by {@link AbstractLayout#shouldRenderComponent} when
     * the provided componentSpec.componentClass is a subclass
     * of {@link AbstractList}.
     *
     * By default this returns `true`.
     *
     * @param componentSpec The component we want to determine if should be rendered.
     * @returns {boolean} `true` to render the component, and `false` to not render
     *    the component.
     */

  }, {
    key: "shouldRenderListComponent",
    value: function shouldRenderListComponent(componentSpec) {
      return true;
    }
    /**
     * Used by {@link AbstractLayout#shouldRenderComponent} when
     * the provided componentSpec.componentClass is a subclass
     * of {@link AbstractPaginator}.
     *
     * By default this returns `true` unless we are loading a new list
     * of items from the API (which typically happens when a filter is changed).
     *
     * @param componentSpec The component we want to determine if should be rendered.
     * @returns {boolean} `true` to render the component, and `false` to not render
     *    the component.
     */

  }, {
    key: "shouldRenderPaginatorComponent",
    value: function shouldRenderPaginatorComponent(componentSpec) {
      return !this.props.isLoadingNewItemsFromApi && !this.props.isLoadingMoreItemsFromApi;
    }
    /**
     * Used by {@link AbstractLayout#shouldRenderComponent} when
     * the provided componentSpec.componentClass is a subclass
     * of {@link AbstractSelectedItems}.
     *
     * By default this returns `true`.
     *
     * @param componentSpec The component we want to determine if should be rendered.
     * @returns {boolean} `true` to render the component, and `false` to not render
     *    the component.
     */

  }, {
    key: "shouldRenderSelectedItemsComponent",
    value: function shouldRenderSelectedItemsComponent(componentSpec) {
      return true;
    }
    /**
     * Used by {@link AbstractLayout#shouldRenderComponent} when
     * the provided componentSpec.componentClass is a subclass
     * of {@link AbstractComponentGroup}.
     *
     * By default this returns `true`.
     *
     * @param componentSpec The component we want to determine if should be rendered.
     * @returns {boolean} `true` to render the component, and `false` to not render
     *    the component.
     */

  }, {
    key: "shouldRenderComponentGroupComponent",
    value: function shouldRenderComponentGroupComponent(componentSpec) {
      return true;
    }
    /**
     * Determine if a component should be rendered.
     *
     * Perfect place to hook in things like "show advanced" filters etc.
     * in subclasses, but you will normally want to override one of
     * {@link AbstractLayout#shouldRenderFilterComponent},
     * {@link AbstractLayout#shouldRenderListComponent} or
     * {@link AbstractLayout#shouldRenderPaginatorComponent} instead
     * of this method.
     *
     * @param componentSpec The component we want to determine if should be rendered.
     * @param componentProps The props for the component we want to determine if should be rendered.
     * @returns {boolean} `true` to render the component, and `false` to not render
     *    the component.
     */

  }, {
    key: "shouldRenderComponent",
    value: function shouldRenderComponent(componentSpec, componentProps) {
      if (!this.props.childExposedApi.componentGroupsIsEnabled(componentProps.componentGroups)) {
        return false;
      }

      if (componentSpec.componentClass.prototype instanceof _AbstractFilter.default) {
        return this.shouldRenderFilterComponent(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractList.default) {
        return this.shouldRenderListComponent(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractPaginator.default) {
        return this.shouldRenderPaginatorComponent(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractSelectedItems.default) {
        return this.shouldRenderSelectedItemsComponent(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractComponentGroup.default) {
        return this.shouldRenderComponentGroupComponent(componentSpec);
      } else {
        throw new Error("Could not determine if we should render component. " + "Unsupported component type: ".concat(componentSpec.componentClassName));
      }
    }
  }, {
    key: "getFilterComponentProps",
    value: function getFilterComponentProps(componentSpec) {
      var props = {
        value: this.props.childExposedApi.getFilterValue(componentSpec.props.name),
        enabledComponentGroups: this.props.enabledComponentGroups,
        selectedListItemsMap: this.props.selectedListItemsMap
      };

      if (componentSpec.componentClass.shouldReceiveSelectedItems(componentSpec)) {
        props.selectedListItemsMap = this.props.selectedListItemsMap;
      }

      return props;
    }
  }, {
    key: "getListComponentProps",
    value: function getListComponentProps(componentSpec) {
      return {
        listItemsDataArray: this.props.listItemsDataArray,
        selectedListItemsMap: this.props.selectedListItemsMap
      };
    }
  }, {
    key: "getPaginatorComponentProps",
    value: function getPaginatorComponentProps(componentSpec) {
      return {
        listItemsDataArray: this.props.listItemsDataArray
      };
    }
  }, {
    key: "getSelectedItemsComponentProps",
    value: function getSelectedItemsComponentProps(componentSpec) {
      return {
        selectedListItemsMap: this.props.selectedListItemsMap
      };
    }
  }, {
    key: "getComponentGroupComponentProps",
    value: function getComponentGroupComponentProps(componentSpec) {
      return {
        enabledComponentGroups: this.props.enabledComponentGroups
      };
    }
  }, {
    key: "getComponentTypeSpecificExtraProps",
    value: function getComponentTypeSpecificExtraProps(componentSpec) {
      if (componentSpec.componentClass.prototype instanceof _AbstractFilter.default) {
        return this.getFilterComponentProps(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractList.default) {
        return this.getListComponentProps(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractPaginator.default) {
        return this.getPaginatorComponentProps(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractSelectedItems.default) {
        return this.getSelectedItemsComponentProps(componentSpec);
      } else if (componentSpec.componentClass.prototype instanceof _AbstractComponentGroup.default) {
        return this.getComponentGroupComponentProps(componentSpec);
      } else {
        throw new Error("Could not determine type-specific extra props. " + "Unsupported component type: ".concat(componentSpec.componentClassName));
      }
    }
  }, {
    key: "getFocusableComponentProps",
    value: function getFocusableComponentProps(componentSpec) {
      if (componentSpec.componentClass.shouldReceiveFocusEvents(componentSpec)) {
        return {
          willReceiveFocusEvents: true
        };
      }

      return {
        willReceiveFocusEvents: false
      };
    }
  }, {
    key: "getComponentProps",
    value: function getComponentProps(componentSpec) {
      var props = Object.assign({}, componentSpec.props, {
        key: componentSpec.props.uniqueComponentKey
      }, this.getComponentTypeSpecificExtraProps(componentSpec), this.getFocusableComponentProps(componentSpec));
      return this.makeChildComponentProps(componentSpec, props);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(componentSpec, componentProps) {
      return _react.default.createElement(componentSpec.componentClass, componentProps);
    }
  }, {
    key: "renderComponentsAtLocation",
    value: function renderComponentsAtLocation(location) {
      var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var renderedComponents = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.layout.getComponentsAtLocation(location)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var componentSpec = _step.value;
          var componentProps = this.getComponentProps(componentSpec);

          if (this.shouldRenderComponent(componentSpec, componentProps)) {
            renderedComponents.push(this.renderComponent(componentSpec, componentProps));
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

      if (renderedComponents.length === 0) {
        return fallback;
      }

      return renderedComponents;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractLayout), "propTypes", this), {
        layout: _propTypes.default.object.isRequired,
        listItemsDataArray: _propTypes.default.array.isRequired,
        listItemsDataMap: _propTypes.default.instanceOf(Map).isRequired,
        selectedListItemsMap: _propTypes.default.instanceOf(Map).isRequired,
        enabledComponentGroups: _propTypes.default.instanceOf(Set).isRequired,
        isLoadingNewItemsFromApi: _propTypes.default.bool.isRequired,
        isLoadingMoreItemsFromApi: _propTypes.default.bool.isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractLayout), "defaultProps", this), {
        layout: null,
        listItemsDataArray: null,
        listItemsDataMap: null,
        selectedListItemsMap: null,
        enabledComponentGroups: null,
        isLoadingNewItemsFromApi: false,
        isLoadingMoreItemsFromApi: false
      });
    }
  }]);

  _inherits(AbstractLayout, _AbstractFilterListCh);

  return AbstractLayout;
}(_AbstractFilterListChild.default);

exports.default = AbstractLayout;