"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COMPONENT_GROUP_ADVANCED = exports.COMPONENT_GROUP_EXPANDABLE = exports.MULTISELECT = exports.SINGLESELECT = exports.RENDER_LOCATION_BOTTOM = exports.RENDER_LOCATION_CENTER = exports.RENDER_LOCATION_TOP = exports.RENDER_LOCATION_RIGHT = exports.RENDER_LOCATION_LEFT = exports.RENDER_LOCATION_DEFAULT = void 0;

/**
 * Constant for the "default" render location.
 *
 * All layout components (see {@link AbstractLayout}) must
 * support this render location.
 *
 * @type {string}
 */
var RENDER_LOCATION_DEFAULT = 'default';
/**
 * Constant for the "left" render location.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_DEFAULT = RENDER_LOCATION_DEFAULT;
var RENDER_LOCATION_LEFT = 'left';
/**
 * Constant for the "right" render location.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_LEFT = RENDER_LOCATION_LEFT;
var RENDER_LOCATION_RIGHT = 'right';
/**
 * Constant for the "top" render location.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_RIGHT = RENDER_LOCATION_RIGHT;
var RENDER_LOCATION_TOP = 'top';
/**
 * Constant for the "center" render location.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_TOP = RENDER_LOCATION_TOP;
var RENDER_LOCATION_CENTER = 'center';
/**
 * Constant for the "bottom" render location.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_CENTER = RENDER_LOCATION_CENTER;
var RENDER_LOCATION_BOTTOM = 'bottom';
/**
 * Constant for single select selectMode for {@link AbstractFilterList}.
 *
 * @type {string}
 */

exports.RENDER_LOCATION_BOTTOM = RENDER_LOCATION_BOTTOM;
var SINGLESELECT = 'single';
/**
 * Constant for multi-select selectMode for {@link AbstractFilterList}.
 *
 * @type {string}
 */

exports.SINGLESELECT = SINGLESELECT;
var MULTISELECT = 'multi';
/**
 * Constant the "expandable" component group.
 *
 * Intended for the use case where you have expand
 * something, such as a search filter, that expands
 * the entire body in a floating panel to show results.
 *
 * @type {string}
 */

exports.MULTISELECT = MULTISELECT;
var COMPONENT_GROUP_EXPANDABLE = 'expandable';
/**
 * Constant the "advanced" component group.
 *
 * Intended for _Show advanced filters_ / _Show all filters_ and
 * similar use cases.
 *
 * @type {string}
 */

exports.COMPONENT_GROUP_EXPANDABLE = COMPONENT_GROUP_EXPANDABLE;
var COMPONENT_GROUP_ADVANCED = 'advanced'; // export const KEYBOARD_NAVIGATION_GROUP_KEY_UP_DOWN = 'key_up_down'

exports.COMPONENT_GROUP_ADVANCED = COMPONENT_GROUP_ADVANCED;