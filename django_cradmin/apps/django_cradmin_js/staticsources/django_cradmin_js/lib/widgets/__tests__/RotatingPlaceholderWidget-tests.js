"use strict";

var _RotatingPlaceholderWidget = _interopRequireDefault(require("../RotatingPlaceholderWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('RotatingPlaceholderWidget', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });
  it('no placeholder', function () {
    document.body.innerHTML = "<input id=\"id_test\">";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList.length).toBe(0);
    expect(element.getAttribute('placeholder')).toBe(null);
  });
  it('has single placeholder item', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test\">";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList.length).toBe(1);
    expect(widget._placeholderList).toEqual(['test']);
    expect(element.getAttribute('placeholder')).toEqual('test');
  });
  it('has multiple placeholder items', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2, test3\">";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList.length).toBe(3);
    expect(widget._placeholderList).toEqual(['test1', 'test2', 'test3']);
    expect(element.getAttribute('placeholder')).toEqual('test1');
  });
  it('placeholder from config', function () {
    document.body.innerHTML = "<input id=\"id_test\"\n        data-ievv-jsbase-widget-config='{\"placeholder\": \"test1, test2\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList.length).toBe(2);
    expect(widget._placeholderList).toEqual(['test1', 'test2']);
  });
  it('placeholder from config overrides placeholder attribute', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"ignored\" \n        data-ievv-jsbase-widget-config='{\"placeholder\": \"test\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList.length).toBe(1);
    expect(widget._placeholderList).toEqual(['test']);
  });
  it('rotates placeholder items', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2, test3\">";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('test1');
    jest.runTimersToTime(2000);
    expect(element.getAttribute('placeholder')).toEqual('test2');
    jest.runTimersToTime(2000);
    expect(element.getAttribute('placeholder')).toEqual('test3');
    jest.runTimersToTime(2000);
    expect(element.getAttribute('placeholder')).toBe('test1');
  });
  it('custom rotation interval', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2, test3\"\n       data-ievv-jsbase-widget-config='{\"intervalMilliseconds\": 100}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('test1');
    jest.runTimersToTime(100);
    expect(element.getAttribute('placeholder')).toEqual('test2');
    jest.runTimersToTime(100);
    expect(element.getAttribute('placeholder')).toEqual('test3');
    jest.runTimersToTime(100);
    expect(element.getAttribute('placeholder')).toBe('test1');
  });
  it('prefix sanity', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test\"\n       data-ievv-jsbase-widget-config='{\"prefix\": \"The prefix\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('The prefix test');
  });
  it('prefix works with rotation', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2\"\n       data-ievv-jsbase-widget-config='{\"prefix\": \"The prefix\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('The prefix test1');
    jest.runTimersToTime(2000);
    expect(element.getAttribute('placeholder')).toEqual('The prefix test2');
  });
  it('suffix sanity', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test\"\n       data-ievv-jsbase-widget-config='{\"suffix\": \"the suffix\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('test the suffix');
  });
  it('suffix works with rotation', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2\"\n       data-ievv-jsbase-widget-config='{\"suffix\": \"the suffix\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(element.getAttribute('placeholder')).toEqual('test1 the suffix');
    jest.runTimersToTime(2000);
    expect(element.getAttribute('placeholder')).toEqual('test2 the suffix');
  });
  it('custom separator', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1; test2; test3\"\n       data-ievv-jsbase-widget-config='{\"separator\": \";\"}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList).toEqual(['test1', 'test2', 'test3']);
  });
  it('default ignore', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2, ...\">";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList).toEqual(['test1', 'test2']);
  });
  it('custom ignore', function () {
    document.body.innerHTML = "<input id=\"id_test\" placeholder=\"test1, test2, test3\"\n       data-ievv-jsbase-widget-config='{\"ignore\": [\"test2\", \"test3\"]}'>";
    var element = document.getElementById('id_test');
    var widget = new _RotatingPlaceholderWidget.default(element);
    expect(widget._placeholderList).toEqual(['test1']);
  });
});