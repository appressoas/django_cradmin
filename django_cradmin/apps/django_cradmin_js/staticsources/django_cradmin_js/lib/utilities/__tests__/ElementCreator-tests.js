"use strict";

var _ElementCreator = _interopRequireDefault(require("../ElementCreator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ElementCreator', function () {
  it('ElementCreator.renderElement() plain element', function () {
    var elementCreator = new _ElementCreator.default('div');
    var element = elementCreator.renderElement();
    expect(element.tagName).toBe('DIV');
  });
  it('ElementCreator.addCssClass() single css-class', function () {
    var elementCreator = new _ElementCreator.default('div');
    elementCreator.addCssClass('this-is-a-test-class');
    var element = elementCreator.renderElement();
    expect(element.classList.contains('this-is-a-test-class')).toBe(true);
  });
  it('ElementCreator.addCssClass() multiple css-classes', function () {
    var elementCreator = new _ElementCreator.default('div');
    var cssClasses = ['this-is-a-test-class', 'this-is-another-test-class', 'woopeeedoooooooo'];

    for (var _i = 0; _i < cssClasses.length; _i++) {
      var cssClass = cssClasses[_i];
      elementCreator.addCssClass(cssClass);
    }

    var element = elementCreator.renderElement();

    for (var _i2 = 0; _i2 < cssClasses.length; _i2++) {
      var _cssClass = cssClasses[_i2];
      expect(element.classList.contains(_cssClass)).toBe(true);
    }
  });
  it('ElementCreator.addAttribute() single attribute without value', function () {
    var elementCreator = new _ElementCreator.default('div');
    elementCreator.addAttribute('this-is-a-test-attribute');
    var element = elementCreator.renderElement();
    expect(element.hasAttribute('this-is-a-test-attribute')).toBe(true);
  });
  it('ElementCreator.addAttribute() single attribute with value', function () {
    var elementCreator = new _ElementCreator.default('div');
    elementCreator.addAttribute('this-is-a-test-attribute', 'woopeedooo');
    var element = elementCreator.renderElement();
    expect(element.hasAttribute('this-is-a-test-attribute')).toBe(true);
    expect(element.getAttribute('this-is-a-test-attribute')).toBe('woopeedooo');
  });
  it('ElementCreator.addAttribute() multiple attributes with and without values', function () {
    var elementCreator = new _ElementCreator.default('div');
    elementCreator.addAttribute('this');
    elementCreator.addAttribute('this-is', 'woopeedooo');
    elementCreator.addAttribute('this-is-a');
    elementCreator.addAttribute('this-is-a-test');
    elementCreator.addAttribute('this-is-a-test-attribute', 'maybe');
    var element = elementCreator.renderElement();
    expect(element.hasAttribute('this')).toBe(true);
    expect(element.getAttribute('this')).toBe('');
    expect(element.hasAttribute('this-is')).toBe(true);
    expect(element.getAttribute('this-is')).toBe('woopeedooo');
    expect(element.hasAttribute('this-is-a')).toBe(true);
    expect(element.getAttribute('this-is-a')).toBe('');
    expect(element.hasAttribute('this-is-a-test')).toBe(true);
    expect(element.getAttribute('this-is-a-test')).toBe('');
    expect(element.hasAttribute('this-is-a-test-attribute')).toBe(true);
    expect(element.getAttribute('this-is-a-test-attribute')).toBe('maybe');
  });
  it('ElementCreator.renderElement() all functionality', function () {
    var elementCreator = new _ElementCreator.default('div');
    var cssClasses = ['this-is-a-test-class', 'this-is-another-test-class', 'woopeeedoooooooo'];

    for (var _i3 = 0; _i3 < cssClasses.length; _i3++) {
      var cssClass = cssClasses[_i3];
      elementCreator.addCssClass(cssClass);
    }

    elementCreator.addAttribute('this');
    elementCreator.addAttribute('this-is', 'woopeedooo');
    var element = elementCreator.renderElement();
    expect(element.tagName).toBe('DIV');

    for (var _i4 = 0; _i4 < cssClasses.length; _i4++) {
      var _cssClass2 = cssClasses[_i4];
      expect(element.classList.contains(_cssClass2)).toBe(true);
    }

    expect(element.hasAttribute('this')).toBe(true);
    expect(element.getAttribute('this')).toBe('');
    expect(element.hasAttribute('this-is')).toBe(true);
    expect(element.getAttribute('this-is')).toBe('woopeedooo');
  });
});