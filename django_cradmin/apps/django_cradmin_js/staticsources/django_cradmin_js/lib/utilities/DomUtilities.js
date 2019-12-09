"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * General purpose DOM utilities.
 */
var DomUtilities =
/*#__PURE__*/
function () {
  function DomUtilities() {
    _classCallCheck(this, DomUtilities);
  }

  _createClass(DomUtilities, null, [{
    key: "forceFocus",

    /**
     * Force focus on a DOM element.
     *
     * Works around timing issues with visibility and signals by
     * trying multiple times with a short interval between each attempt.
     *
     * @param {Element} domElement A DOM Element.
     * @param {Number} maxAttempts Number of attempts to make. The first attempt
     *    is made at once, and the other attempts is performed each
     *    ``pollIntervalMilliseconds`` until we get focus, or
     *    we have used up the attempts.
     * @param {Number} pollIntervalMilliseconds Numer of milliseconds
     *    between each attempt.
     */
    value: function forceFocus(domElement) {
      var maxAttempts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var pollIntervalMilliseconds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 80;

      var _forceFocus = function _forceFocus(attemptNumber) {
        if (attemptNumber > maxAttempts) {
          // Give up - the element will probably not become visible
          // within a useful amount of time.
          return;
        }

        domElement.focus();

        if (window.document.activeElement != domElement) {
          setTimeout(function () {
            _forceFocus(attemptNumber + 1);
          }, pollIntervalMilliseconds);
        }
      };

      _forceFocus(0);
    }
  }, {
    key: "show",
    value: function show(element) {
      var displayStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "block";
      element.setAttribute('style', "display: ".concat(displayStyle));
    }
  }, {
    key: "hide",
    value: function hide(element) {
      element.setAttribute('style', "display: none");
    }
  }]);

  return DomUtilities;
}();

exports.default = DomUtilities;