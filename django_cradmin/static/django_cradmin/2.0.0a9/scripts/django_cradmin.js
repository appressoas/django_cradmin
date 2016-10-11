(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var CradminMenuToggle = (function () {
    function CradminMenuToggle(clickableAttribute, toggleStyleAttribute, groupIdAttribute) {
        var _this = this;
        if (clickableAttribute === void 0) { clickableAttribute = "cradmin_menutoggle_clickable"; }
        if (toggleStyleAttribute === void 0) { toggleStyleAttribute = "cradmin_menutoggle_activestyle"; }
        if (groupIdAttribute === void 0) { groupIdAttribute = "cradmin_menutoggle_groupid"; }
        this.clickableAttribute = clickableAttribute;
        this.toggleStyleAttribute = toggleStyleAttribute;
        this.groupIdAttribute = groupIdAttribute;
        this.activeMap = {};
        this.styleToggleElementGroups = {};
        this.toggleAction = function (event, clickable) {
            var groupId = _this.getGroupIdForClickable(clickable);
            _this.activeMap[groupId] = !_this.activeMap[groupId];
            for (var _i = 0, _a = _this.styleToggleElementGroups[groupId]; _i < _a.length; _i++) {
                var element = _a[_i];
                if (_this.activeMap[groupId]) {
                    element.node.classList.add(element.value);
                }
                else {
                    element.node.classList.remove(element.value);
                }
            }
        };
        this.addClickListeners();
        this.getToggleElements();
    }
    CradminMenuToggle.prototype.getToggleElements = function () {
        var elements = Array.from(document.querySelectorAll("[" + this.toggleStyleAttribute + "]"));
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var nodeDescriptor = {
                node: element,
                value: element.attributes.getNamedItem(this.toggleStyleAttribute).nodeValue
            };
            var groupName = element.attributes.getNamedItem(this.groupIdAttribute).nodeValue;
            if (!this.styleToggleElementGroups[groupName]) {
                this.styleToggleElementGroups[groupName] = [];
            }
            this.styleToggleElementGroups[groupName].push(nodeDescriptor);
        }
    };
    CradminMenuToggle.prototype.getGroupIdForClickable = function (clickable) {
        return clickable.attributes.getNamedItem(this.groupIdAttribute).nodeValue;
    };
    CradminMenuToggle.prototype.addClickListeners = function () {
        var _this = this;
        var clickables = Array.from(document.querySelectorAll("[" + this.clickableAttribute + "]"));
        var _loop_1 = function(clickable) {
            this_1.activeMap[this_1.getGroupIdForClickable(clickable)] = false;
            clickable.addEventListener('click', function (event) {
                _this.toggleAction(event, clickable);
            });
        };
        var this_1 = this;
        for (var _i = 0, clickables_1 = clickables; _i < clickables_1.length; _i++) {
            var clickable = clickables_1[_i];
            _loop_1(clickable);
        }
    };
    return CradminMenuToggle;
}());
exports.CradminMenuToggle = CradminMenuToggle;

},{}],2:[function(require,module,exports){
"use strict";
var CradminMenuToggle_1 = require('./CradminMenuToggle');
var CradminModuleLoader = (function () {
    function CradminModuleLoader() {
    }
    CradminModuleLoader.setup = function () {
        if (this.isInitialized) {
            console.error("attempting to initialize multiple times? No such luck - fix your bootstrapping!");
            return;
        }
        this.isInitialized = true;
        new CradminMenuToggle_1.CradminMenuToggle();
    };
    CradminModuleLoader.isInitialized = false;
    return CradminModuleLoader;
}());
exports.CradminModuleLoader = CradminModuleLoader;
CradminModuleLoader.setup();

},{"./CradminMenuToggle":1}]},{},[2]);
