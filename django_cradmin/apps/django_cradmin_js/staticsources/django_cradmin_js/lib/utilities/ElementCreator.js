"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ElementCreator =
/*#__PURE__*/
function () {
  function ElementCreator() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ElementCreator);

    this.reset(tagName);
  }

  _createClass(ElementCreator, [{
    key: "reset",
    value: function reset() {
      var newTagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._tagName;

      this._destroy();

      this._tagName = newTagName;
      this._cssClasses = [];
      this._attributes = new Map();
      this._value = null;
      this._hasChanges = false;
    }
  }, {
    key: "_hasValidElement",
    value: function _hasValidElement() {
      return this._element != null && !this._hasChanges;
    }
  }, {
    key: "addCssClass",
    value: function addCssClass(className) {
      this._hasChanges = true;

      this._cssClasses.push(className);
    }
  }, {
    key: "changeTagName",
    value: function changeTagName(tagName) {
      this._hasChanges = true;
      this._tagName = tagName;
    }
  }, {
    key: "addAttribute",
    value: function addAttribute(attribute) {
      var attributeValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      this._hasChanges = true;

      this._attributes.set(attribute, attributeValue);
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this._hasChanges = true;
      this._value = value;
    }
  }, {
    key: "useElement",
    value: function useElement(element) {
      this._destroy();

      this._element = element;
    }
  }, {
    key: "renderElement",
    value: function renderElement() {
      if (this._hasValidElement()) {
        return this._element;
      }

      this._destroy();

      this._hasChanges = false;

      if (this._tagName == null) {
        throw new Error("Cannot create element without valid tagName! got: ".concat(this._tagName));
      }

      var element = document.createElement(this._tagName);

      if (this._value != null) {
        element.value = this._value;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._cssClasses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var className = _step.value;
          element.classList.add(className);
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._attributes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              attribute = _step2$value[0],
              value = _step2$value[1];

          element.setAttribute(attribute, value);
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

      this._element = element;
      return this._element;
    }
  }, {
    key: "_destroy",
    value: function _destroy() {
      if (this._element != null && this._element != undefined) {
        this._element.remove();
      }

      this._element = null;
    }
  }]);

  return ElementCreator;
}();

exports.default = ElementCreator;