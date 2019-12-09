"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * General purpose BEM css class utilities.
 */
var BemUtilities =
/*#__PURE__*/
function () {
  function BemUtilities() {
    _classCallCheck(this, BemUtilities);
  }

  _createClass(BemUtilities, null, [{
    key: "addVariants",

    /**
     * Add variants to a BEM block or element.
     *
     * Low level method - you normally want to use
     * {@link BemUtilities#buildBemBlock} or {@link BemUtilities#buildBemElement}.
     *
     * @example
     * BemUtilities.addVariants('button', ['primary', 'spaced']
     * // Result is 'button button--primary button--spaced'
     *
     * @param {string} bemBlockOrElement A BEM block or element.
     * @param {[]} bemVariants Array of BEM variants.
     * @returns {string} CSS classes string.
     */
    value: function addVariants(bemBlockOrElement) {
      var bemVariants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var cssClass = bemBlockOrElement;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = bemVariants[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var variant = _step.value;
          cssClass = "".concat(cssClass, " ").concat(bemBlockOrElement, "--").concat(variant);
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

      return cssClass;
    }
    /**
     * Build a BEM element.
     *
     * @example
     * BemUtilities.buildBemElement('blocklist', 'title', ['lg', 'dark'])
     * // Result is 'blocklist__title blocklist__title--lg blocklist__title--dark'
     *
     * @param {string} bemBlock The BEM block the element belongs to.
     * @param {string} bemElement The BEM element.
     * @param {[]} bemVariants Array of BEM variants
     * @returns {string} CSS classes string.
     */

  }, {
    key: "buildBemElement",
    value: function buildBemElement(bemBlock, bemElement) {
      var bemVariants = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return BemUtilities.addVariants("".concat(bemBlock, "__").concat(bemElement), bemVariants);
    }
    /**
     * Build a BEM block.
     *
     * @example
     * BemUtilities.buildBemBlock('button', ['primary', 'huge'])
     * // Result is 'button button--primary button--huge'
     *
     * @param {string} bemBlock The BEM block.
     * @param {[]} bemVariants Array of BEM variants
     * @returns {string} CSS classes string.
     */

  }, {
    key: "buildBemBlock",
    value: function buildBemBlock(bemBlock) {
      var bemVariants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return BemUtilities.addVariants(bemBlock, bemVariants);
    }
  }]);

  return BemUtilities;
}();

exports.default = BemUtilities;