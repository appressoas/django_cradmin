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
var CradminTabController_1 = require('./CradminTabController');
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
        new CradminTabController_1.CradminTabController();
    };
    CradminModuleLoader.isInitialized = false;
    return CradminModuleLoader;
}());
exports.CradminModuleLoader = CradminModuleLoader;
CradminModuleLoader.setup();

},{"./CradminMenuToggle":1,"./CradminTabController":3}],3:[function(require,module,exports){
"use strict";
var CradminTabController = (function () {
    function CradminTabController(tabsAttribute, panelActiveCssClass, panelAttribute, tabActiveCssClass, tabAttribute) {
        var _this = this;
        if (tabsAttribute === void 0) { tabsAttribute = "cradmin_tabs"; }
        if (panelActiveCssClass === void 0) { panelActiveCssClass = "tabs__panel--active"; }
        if (panelAttribute === void 0) { panelAttribute = "cradmin_tabs_panel"; }
        if (tabActiveCssClass === void 0) { tabActiveCssClass = "tabs__tab--active"; }
        if (tabAttribute === void 0) { tabAttribute = "cradmin_tabs_tab"; }
        this.tabsAttribute = tabsAttribute;
        this.panelActiveCssClass = panelActiveCssClass;
        this.panelAttribute = panelAttribute;
        this.tabActiveCssClass = tabActiveCssClass;
        this.tabAttribute = tabAttribute;
        this.activeMap = {};
        this.tabMap = {};
        this.activateTab = function (event, tabElement) {
            event.preventDefault();
            var panelDomId = tabElement.attributes.getNamedItem('href').nodeValue.substring(1);
            var panelElement = document.getElementById(panelDomId);
            var tabgroup = _this.tabMap[panelDomId];
            tabgroup.activeTabElement.classList.remove(_this.tabActiveCssClass);
            tabgroup.activeTabElement.setAttribute('aria-selected', 'false');
            tabgroup.activePanelElement.classList.remove(_this.panelActiveCssClass);
            tabgroup.activePanelElement.setAttribute('aria-hidden', 'true');
            tabElement.classList.add(_this.tabActiveCssClass);
            tabElement.setAttribute('aria-selected', 'true');
            panelElement.classList.add(_this.panelActiveCssClass);
            panelElement.setAttribute('aria-hidden', 'false');
            tabgroup.activeTabElement = tabElement;
            tabgroup.activePanelElement = panelElement;
        };
        this.buildTabMap();
    }
    CradminTabController.prototype.buildTab = function (tabElement) {
        var _this = this;
        var panelElements = Array.from(tabElement.querySelectorAll("[" + this.panelAttribute + "]"));
        var tabElements = Array.from(tabElement.querySelectorAll("[" + this.tabAttribute + "]"));
        var tabgroup = {
            panelElements: panelElements,
            tabElements: tabElements,
        };
        for (var _i = 0, panelElements_1 = panelElements; _i < panelElements_1.length; _i++) {
            var panelElement = panelElements_1[_i];
            var isActive = panelElement.classList.contains(this.panelActiveCssClass);
            if (panelElement.attributes.hasOwnProperty('id')) {
                var domId = panelElement.attributes.getNamedItem('id').nodeValue;
                // console.log('domId:', domId);
                // console.log('isActive:', isActive);
                this.tabMap[domId] = tabgroup;
                if (isActive) {
                    tabgroup.activePanelElement = panelElement;
                }
            }
            else {
                console.warn(("Found " + this.panelAttribute + " on an element without an ") +
                    "ID. Aborting setup for then entire cradmin_tabs. Element:", panelElement);
            }
        }
        var _loop_1 = function(tabElement_1) {
            var isActive = tabElement_1.classList.contains(this_1.tabActiveCssClass);
            if (isActive) {
                tabgroup.activeTabElement = tabElement_1;
            }
            tabElement_1.addEventListener('click', function (event) {
                _this.activateTab(event, tabElement_1);
            });
        };
        var this_1 = this;
        for (var _a = 0, tabElements_1 = tabElements; _a < tabElements_1.length; _a++) {
            var tabElement_1 = tabElements_1[_a];
            _loop_1(tabElement_1);
        }
    };
    CradminTabController.prototype.buildTabMap = function () {
        var tabElements = Array.from(document.querySelectorAll("[" + this.tabsAttribute + "]"));
        for (var _i = 0, tabElements_2 = tabElements; _i < tabElements_2.length; _i++) {
            var tabElement = tabElements_2[_i];
            this.buildTab(tabElement);
        }
    };
    return CradminTabController;
}());
exports.CradminTabController = CradminTabController;

},{}]},{},[2]);
