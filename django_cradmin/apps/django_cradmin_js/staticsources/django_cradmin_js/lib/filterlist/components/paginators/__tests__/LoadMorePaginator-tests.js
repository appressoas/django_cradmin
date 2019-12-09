"use strict";

var _enzyme = require("enzyme");

var _LoadMorePaginator = _interopRequireDefault(require("../LoadMorePaginator"));

var _testHelpers = require("../../filterlists/testHelpers");

var _testHelpers2 = require("../testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function makeChildExposedApiMock(hasNextPaginationPage) {
  var childExposedApi = new _testHelpers.ChildExposedApiMock();
  childExposedApi.hasNextPaginationPage.mockReturnValue(hasNextPaginationPage);
  return childExposedApi;
}

function render(props) {
  return (0, _testHelpers2.renderPaginator)(_LoadMorePaginator.default, props);
}

test('hasNextPaginationPage() is false', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(false)
  }));
  expect(component.type()).toBeNull();
});
test('hasNextPaginationPage() is true', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true)
  }));
  expect(component.type()).not.toBeNull();
});
test('Default className', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true)
  }));
  expect(component.prop('className')).toBe('button');
});
test('Custom bemBlock', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true),
    bemBlock: 'myblock'
  }));
  expect(component.prop('className')).toBe('myblock');
});
test('Custom bemVariants', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true),
    bemVariants: ['large', 'dark']
  }));
  expect(component.prop('className')).toBe('button button--large button--dark');
});
test('Default label', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true)
  }));
  expect(component.text()).toEqual('Load more');
});
test('Custom label', function () {
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: makeChildExposedApiMock(true),
    label: 'My Label'
  }));
  expect(component.text()).toEqual('My Label');
});
test('Click button calls loadMoreItemsFromApi', function () {
  var childExposedApi = makeChildExposedApiMock(true);
  var component = (0, _enzyme.shallow)(render({
    childExposedApi: childExposedApi
  }));
  component.at(0).simulate('click', {
    preventDefault: jest.fn()
  });
  expect(childExposedApi.loadMoreItemsFromApi).toBeCalled();
});