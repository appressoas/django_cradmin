"use strict";

var _enzyme = require("enzyme");

var _SelectComponentGroup = _interopRequireDefault(require("../SelectComponentGroup"));

var _testHelpers = require("../testHelpers");

var _testHelpers2 = require("../../filterlists/testHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
function render() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _testHelpers.renderComponentGroup)(_SelectComponentGroup.default, Object.assign({
    name: 'test'
  }, props));
}

describe('SelectComponentGroup', function () {
  beforeEach(function () {
    jest.restoreAllMocks();
  });
  test('no selectable componentgroups - do not render anything', function () {
    console.warn = jest.fn(); // prevent warning from logging in test - see next test..

    var component = (0, _enzyme.shallow)(render());
    expect(component.type()).toBeNull();
  });
  test('no selectable componentgroups - warning logged to console', function () {
    console.warn = jest.fn();
    (0, _enzyme.shallow)(render());
    expect(console.warn).toBeCalled();
  });
  test('single selectable componentgroup - render something', function () {
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }]
    };
    var component = (0, _enzyme.shallow)(render(props));
    expect(component.type()).not.toBeNull();
  });
  test('two selectable componentgroups - render two radiobuttons', function () {
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }]
    };
    var component = (0, _enzyme.shallow)(render(props));
    expect(component.find('label.radio.radio--block > span.radio__control-indicator').length).toBe(2);
    expect(component.find('label.radio.radio--block > input[type="radio"]').length).toBe(2);
  });
  test('two selectable componentgroups - rendered radiobuttons have given', function () {
    var props = {
      name: 'testname',
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }]
    };
    var component = (0, _enzyme.shallow)(render(props));
    expect(component.find('input[name="testname"]').length).toBe(2);
  });
  test('two selectable componentgroups - rendered radiobuttons have componentgroup values', function () {
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }]
    };
    var component = (0, _enzyme.shallow)(render(props));
    expect(component.find('label.radio.radio--block > input[value="testgroup1"]').length).toBe(1);
    expect(component.find('label.radio.radio--block > input[value="testgroup2"]').length).toBe(1);
  });
  test('mount calls selectComponentGroup with initialEnabled', function () {
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }],
      initialEnabled: 'testgroup1'
    };
    var selectComponentGroup = jest.spyOn(_SelectComponentGroup.default, 'selectComponentGroup');
    (0, _enzyme.shallow)(render(props));
    expect(selectComponentGroup).toHaveBeenCalledTimes(1);
    expect(selectComponentGroup).toHaveBeenCalledWith('testgroup1', expect.anything());
  });
  test('clicking radiobutton runs selectComponentGroup', function () {
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }],
      initialEnabled: 'testgroup1'
    };
    var selectComponentGroup = jest.spyOn(_SelectComponentGroup.default, 'selectComponentGroup');
    var component = (0, _enzyme.shallow)(render(props));
    expect(selectComponentGroup).toHaveBeenCalledWith('testgroup1', expect.anything());
    component.find('input[value="testgroup2"]').first().simulate('change', {
      target: {
        value: 'testgroup2'
      }
    });
    expect(selectComponentGroup).toHaveBeenLastCalledWith('testgroup2', expect.anything());
  });
  test('selectComponentGroup enables given componentGroup if not already enabled', function () {
    var childExposedApi = new _testHelpers2.ChildExposedApiMock();
    childExposedApi.componentGroupIsEnabled = jest.fn(function (componentGroupName) {
      return componentGroupName === 'isEnabled';
    });
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'testgroup2',
        label: 'test group 2'
      }],
      initialEnabled: 'testgroup1',
      childExposedApi: childExposedApi
    };
    var component = (0, _enzyme.shallow)(render(props));
    component.find('input[value="testgroup2"]').first().simulate('change', {
      target: {
        value: 'testgroup2'
      }
    });
    expect(childExposedApi.enableComponentGroup).toBeCalledWith('testgroup2');
  });
  test('selectComponentGroup disable already enabled componentGroup if not the one given', function () {
    var childExposedApi = new _testHelpers2.ChildExposedApiMock();
    childExposedApi.componentGroupIsEnabled = jest.fn(function (componentGroupName) {
      return componentGroupName === 'isEnabled';
    });
    var props = {
      selectableComponentGroups: [{
        name: 'testgroup1',
        label: 'test group 1'
      }, {
        name: 'isEnabled',
        label: 'test group 2'
      }],
      initialEnabled: 'testgroup1',
      childExposedApi: childExposedApi
    };
    var component = (0, _enzyme.shallow)(render(props));
    component.find('input[value="testgroup1"]').first().simulate('change', {
      target: {
        value: 'testgroup1'
      }
    });
    expect(childExposedApi.disableComponentGroup).toBeCalledWith('isEnabled');
  });
});