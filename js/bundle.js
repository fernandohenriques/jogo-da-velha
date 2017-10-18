/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_utils_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_utils_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_utils_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_styles_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_styles_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_styles_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_external_sweetalert_min_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_external_sweetalert_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_external_sweetalert_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__external_sweetalert_min_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__external_sweetalert_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__external_sweetalert_min_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_game_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_game_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__modules_game_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_cpuPlay_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_cpuPlay_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__modules_cpuPlay_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_humanPlay_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_humanPlay_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__modules_humanPlay_js__);






window.board = [ [],[],[] ];
window.symbol = {'human':'O','cpu':'X'}; //default






/* Events */
document.querySelectorAll(".column").forEach(function(column){
  column.onclick = function(){ __WEBPACK_IMPORTED_MODULE_6__modules_humanPlay_js___default()(this.id,__WEBPACK_IMPORTED_MODULE_4__modules_game_js___default.a,__WEBPACK_IMPORTED_MODULE_5__modules_cpuPlay_js___default.a); }
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./utils.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./utils.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex {\r\n  display: -webkit-flex;\r\n  display: flex\r\n}\r\n.flex-column {\r\n  display: -webkit-flex;\r\n  display: flex;\r\n  -webkit-flex-flow: column;\r\n  flex-flow: column\r\n}\r\n.text-center{ text-align: center }\r\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./styles.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body{ font-family: \"arial black\" }\r\n.container {\r\n  width: 70%;\r\n  height: 100%;\r\n  margin: 0 auto\r\n}\r\n.header h1{ font: 30px }\r\n.board {\r\n  height: 80%\r\n}\r\n.board .table {\r\n  width: 70%;\r\n  height: 100%;\r\n  margin: 0 auto\r\n}\r\n.board .table .line {\r\n  width: 100%;\r\n  height: 33.33333%\r\n}\r\n.board .table .line .column {\r\n  height: 100%;\r\n  width: 33.33333%;\r\n  padding: 4px 0;\r\n  font-size: 60px\r\n}\r\n.line.one, .line.two{\r\n  border-bottom: 3px solid #333\r\n}\r\n.column.middle {\r\n  border-left: 3px solid #333;\r\n  border-right: 3px solid #333\r\n}\r\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./sweetalert.min.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./sweetalert.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body.stop-scrolling{height:100%;overflow:hidden}.sweet-overlay{background-color:#000;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);background-color:rgba(0,0,0,0.4);position:fixed;left:0;right:0;top:0;bottom:0;display:none;z-index:10000}.sweet-alert{background-color:#fff;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;width:478px;padding:17px;border-radius:5px;text-align:center;position:fixed;left:50%;top:50%;margin-left:-256px;margin-top:-200px;overflow:hidden;display:none;z-index:99999}@media all and (max-width: 540px){.sweet-alert{width:auto;margin-left:0;margin-right:0;left:15px;right:15px}}.sweet-alert h2{color:#575757;font-size:30px;text-align:center;font-weight:600;text-transform:none;position:relative;margin:25px 0;padding:0;line-height:40px;display:block}.sweet-alert p{color:#797979;font-size:16px;text-align:center;font-weight:300;position:relative;text-align:inherit;float:none;margin:0;padding:0;line-height:normal}.sweet-alert fieldset{border:none;position:relative}.sweet-alert .sa-error-container{background-color:#f1f1f1;margin-left:-17px;margin-right:-17px;overflow:hidden;padding:0 10px;max-height:0;webkit-transition:padding 0.15s,max-height .15s;transition:padding 0.15s,max-height .15s}.sweet-alert .sa-error-container.show{padding:10px 0;max-height:100px;webkit-transition:padding 0.2s,max-height .2s;transition:padding 0.25s,max-height .25s}.sweet-alert .sa-error-container .icon{display:inline-block;width:24px;height:24px;border-radius:50%;background-color:#ea7d7d;color:#fff;line-height:24px;text-align:center;margin-right:3px}.sweet-alert .sa-error-container p{display:inline-block}.sweet-alert .sa-input-error{position:absolute;top:29px;right:26px;width:20px;height:20px;opacity:0;-webkit-transform:scale(0.5);transform:scale(0.5);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-transition:all .1s;transition:all .1s}.sweet-alert .sa-input-error::before,.sweet-alert .sa-input-error::after{content:\"\";width:20px;height:6px;background-color:#f06e57;border-radius:3px;position:absolute;top:50%;margin-top:-4px;left:50%;margin-left:-9px}.sweet-alert .sa-input-error::before{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.sweet-alert .sa-input-error::after{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.sweet-alert .sa-input-error.show{opacity:1;-webkit-transform:scale(1);transform:scale(1)}.sweet-alert input{width:100%;box-sizing:border-box;border-radius:3px;border:1px solid #d7d7d7;height:43px;margin-top:10px;margin-bottom:17px;font-size:18px;box-shadow:inset 0 1px 1px rgba(0,0,0,0.06);padding:0 12px;display:none;-webkit-transition:all .3s;transition:all .3s}.sweet-alert input:focus{outline:none;box-shadow:0 0 3px #c4e6f5;border:1px solid #b4dbed}.sweet-alert input:focus::-moz-placeholder{transition:opacity .3s .03s ease;opacity:.5}.sweet-alert input:focus:-ms-input-placeholder{transition:opacity .3s .03s ease;opacity:.5}.sweet-alert input:focus::-webkit-input-placeholder{transition:opacity .3s .03s ease;opacity:.5}.sweet-alert input::-moz-placeholder{color:#bdbdbd}.sweet-alert input::-ms-clear{display:none}.sweet-alert input:-ms-input-placeholder{color:#bdbdbd}.sweet-alert input::-webkit-input-placeholder{color:#bdbdbd}.sweet-alert.show-input input{display:block}.sweet-alert .sa-confirm-button-container{display:inline-block;position:relative}.sweet-alert .la-ball-fall{position:absolute;left:50%;top:50%;margin-left:-27px;margin-top:4px;opacity:0;visibility:hidden}.sweet-alert button{background-color:#8CD4F5;color:#fff;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;padding:10px 32px;margin:26px 5px 0;cursor:pointer}.sweet-alert button:focus{outline:none;box-shadow:0 0 2px rgba(128,179,235,0.5),inset 0 0 0 1px rgba(0,0,0,0.05)}.sweet-alert button:hover{background-color:#7ecff4}.sweet-alert button:active{background-color:#5dc2f1}.sweet-alert button.cancel{background-color:#C1C1C1}.sweet-alert button.cancel:hover{background-color:#b9b9b9}.sweet-alert button.cancel:active{background-color:#a8a8a8}.sweet-alert button.cancel:focus{box-shadow:rgba(197,205,211,0.8) 0 0 2px,rgba(0,0,0,0.0470588) 0 0 0 1px inset!important}.sweet-alert button[disabled]{opacity:.6;cursor:default}.sweet-alert button.confirm[disabled]{color:transparent}.sweet-alert button.confirm[disabled] ~ .la-ball-fall{opacity:1;visibility:visible;transition-delay:0}.sweet-alert button::-moz-focus-inner{border:0}.sweet-alert[data-has-cancel-button=false] button{box-shadow:none!important}.sweet-alert[data-has-confirm-button=false][data-has-cancel-button=false]{padding-bottom:40px}.sweet-alert .sa-icon{width:80px;height:80px;border:4px solid gray;-webkit-border-radius:40px;border-radius:40px;border-radius:50%;margin:20px auto;padding:0;position:relative;box-sizing:content-box}.sweet-alert .sa-icon.sa-error{border-color:#F27474}.sweet-alert .sa-icon.sa-error .sa-x-mark{position:relative;display:block}.sweet-alert .sa-icon.sa-error .sa-line{position:absolute;height:5px;width:47px;background-color:#F27474;display:block;top:37px;border-radius:2px}.sweet-alert .sa-icon.sa-error .sa-line.sa-left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.sweet-alert .sa-icon.sa-error .sa-line.sa-right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}.sweet-alert .sa-icon.sa-warning{border-color:#F8BB86}.sweet-alert .sa-icon.sa-warning .sa-body{position:absolute;width:5px;height:47px;left:50%;top:10px;-webkit-border-radius:2px;border-radius:2px;margin-left:-2px;background-color:#F8BB86}.sweet-alert .sa-icon.sa-warning .sa-dot{position:absolute;width:7px;height:7px;-webkit-border-radius:50%;border-radius:50%;margin-left:-3px;left:50%;bottom:10px;background-color:#F8BB86}.sweet-alert .sa-icon.sa-info{border-color:#C9DAE1}.sweet-alert .sa-icon.sa-info::before{content:\"\";position:absolute;width:5px;height:29px;left:50%;bottom:17px;border-radius:2px;margin-left:-2px;background-color:#C9DAE1}.sweet-alert .sa-icon.sa-info::after{content:\"\";position:absolute;width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px;background-color:#C9DAE1;left:50%}.sweet-alert .sa-icon.sa-success{border-color:#A5DC86}.sweet-alert .sa-icon.sa-success::before,.sweet-alert .sa-icon.sa-success::after{content:'';-webkit-border-radius:40px;border-radius:40px;border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.sweet-alert .sa-icon.sa-success::before{-webkit-border-radius:120px 0 0 120px;border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.sweet-alert .sa-icon.sa-success::after{-webkit-border-radius:0 120px 120px 0;border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px}.sweet-alert .sa-icon.sa-success .sa-placeholder{width:80px;height:80px;border:4px solid rgba(165,220,134,0.2);-webkit-border-radius:40px;border-radius:40px;border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.sweet-alert .sa-icon.sa-success .sa-fix{width:5px;height:90px;background-color:#fff;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.sweet-alert .sa-icon.sa-success .sa-line{height:5px;background-color:#A5DC86;display:block;border-radius:2px;position:absolute;z-index:2}.sweet-alert .sa-icon.sa-success .sa-line.sa-tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.sweet-alert .sa-icon.sa-success .sa-line.sa-long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.sweet-alert .sa-icon.sa-custom{background-size:contain;border-radius:0;border:none;background-position:center center;background-repeat:no-repeat}@-webkit-keyframes showSweetAlert{0%{transform:scale(0.7);-webkit-transform:scale(0.7)}45%{transform:scale(1.05);-webkit-transform:scale(1.05)}80%{transform:scale(0.95);-webkit-transform:scale(0.95)}100%{transform:scale(1);-webkit-transform:scale(1)}}@keyframes showSweetAlert{0%{transform:scale(0.7);-webkit-transform:scale(0.7)}45%{transform:scale(1.05);-webkit-transform:scale(1.05)}80%{transform:scale(0.95);-webkit-transform:scale(0.95)}100%{transform:scale(1);-webkit-transform:scale(1)}}@-webkit-keyframes hideSweetAlert{0%{transform:scale(1);-webkit-transform:scale(1)}100%{transform:scale(0.5);-webkit-transform:scale(0.5)}}@keyframes hideSweetAlert{0%{transform:scale(1);-webkit-transform:scale(1)}100%{transform:scale(0.5);-webkit-transform:scale(0.5)}}@-webkit-keyframes slideFromTop{0%{top:0}100%{top:50%}}@keyframes slideFromTop{0%{top:0}100%{top:50%}}@-webkit-keyframes slideToTop{0%{top:50%}100%{top:0}}@keyframes slideToTop{0%{top:50%}100%{top:0}}@-webkit-keyframes slideFromBottom{0%{top:70%}100%{top:50%}}@keyframes slideFromBottom{0%{top:70%}100%{top:50%}}@-webkit-keyframes slideToBottom{0%{top:50%}100%{top:70%}}@keyframes slideToBottom{0%{top:50%}100%{top:70%}}.showSweetAlert[data-animation=pop]{-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s}.showSweetAlert[data-animation=none]{-webkit-animation:none;animation:none}.showSweetAlert[data-animation=slide-from-top]{-webkit-animation:slideFromTop .3s;animation:slideFromTop .3s}.showSweetAlert[data-animation=slide-from-bottom]{-webkit-animation:slideFromBottom .3s;animation:slideFromBottom .3s}.hideSweetAlert[data-animation=pop]{-webkit-animation:hideSweetAlert .2s;animation:hideSweetAlert .2s}.hideSweetAlert[data-animation=none]{-webkit-animation:none;animation:none}.hideSweetAlert[data-animation=slide-from-top]{-webkit-animation:slideToTop .4s;animation:slideToTop .4s}.hideSweetAlert[data-animation=slide-from-bottom]{-webkit-animation:slideToBottom .3s;animation:slideToBottom .3s}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}100%{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}100%{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}100%{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}100%{width:47px;right:8px;top:38px}}@-webkit-keyframes rotatePlaceholder{0%{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}5%{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}12%{transform:rotate(-405deg);-webkit-transform:rotate(-405deg)}100%{transform:rotate(-405deg);-webkit-transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}5%{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}12%{transform:rotate(-405deg);-webkit-transform:rotate(-405deg)}100%{transform:rotate(-405deg);-webkit-transform:rotate(-405deg)}}.animateSuccessTip{-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.animateSuccessLong{-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}.sa-icon.sa-success.animate::after{-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}@-webkit-keyframes animateErrorIcon{0%{transform:rotateX(100deg);-webkit-transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);-webkit-transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{transform:rotateX(100deg);-webkit-transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);-webkit-transform:rotateX(0deg);opacity:1}}.animateErrorIcon{-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}@-webkit-keyframes animateXMark{0%{transform:scale(0.4);-webkit-transform:scale(0.4);margin-top:26px;opacity:0}50%{transform:scale(0.4);-webkit-transform:scale(0.4);margin-top:26px;opacity:0}80%{transform:scale(1.15);-webkit-transform:scale(1.15);margin-top:-6px}100%{transform:scale(1);-webkit-transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{transform:scale(0.4);-webkit-transform:scale(0.4);margin-top:26px;opacity:0}50%{transform:scale(0.4);-webkit-transform:scale(0.4);margin-top:26px;opacity:0}80%{transform:scale(1.15);-webkit-transform:scale(1.15);margin-top:-6px}100%{transform:scale(1);-webkit-transform:scale(1);margin-top:0;opacity:1}}.animateXMark{-webkit-animation:animateXMark .5s;animation:animateXMark .5s}@-webkit-keyframes pulseWarning{0%{border-color:#F8D486}100%{border-color:#F8BB86}}@keyframes pulseWarning{0%{border-color:#F8D486}100%{border-color:#F8BB86}}.pulseWarning{-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}@-webkit-keyframes pulseWarningIns{0%{background-color:#F8D486}100%{background-color:#F8BB86}}@keyframes pulseWarningIns{0%{background-color:#F8D486}100%{background-color:#F8BB86}}.pulseWarningIns{-webkit-animation:pulseWarningIns .75s infinite alternate;animation:pulseWarningIns .75s infinite alternate}@-webkit-keyframes rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.sweet-alert .sa-icon.sa-error .sa-line.sa-left{-ms-transform:rotate(45deg) \\9}.sweet-alert .sa-icon.sa-error .sa-line.sa-right{-ms-transform:rotate(-45deg) \\9}.sweet-alert .sa-icon.sa-success{border-color:transparent\\9}.sweet-alert .sa-icon.sa-success .sa-line.sa-tip{-ms-transform:rotate(45deg) \\9}.sweet-alert .sa-icon.sa-success .sa-line.sa-long{-ms-transform:rotate(-45deg) \\9}.la-ball-fall,.la-ball-fall > div{position:relative;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.la-ball-fall{display:block;font-size:0;color:#fff}.la-ball-fall.la-dark{color:#333}.la-ball-fall > div{display:inline-block;float:none;background-color:currentColor;border:0 solid currentColor}.la-ball-fall{width:54px;height:18px}.la-ball-fall > div{width:10px;height:10px;margin:4px;border-radius:100%;opacity:0;-webkit-animation:ball-fall 1s ease-in-out infinite;-moz-animation:ball-fall 1s ease-in-out infinite;-o-animation:ball-fall 1s ease-in-out infinite;animation:ball-fall 1s ease-in-out infinite}.la-ball-fall > div:nth-child(1){-webkit-animation-delay:-200ms;-moz-animation-delay:-200ms;-o-animation-delay:-200ms;animation-delay:-200ms}.la-ball-fall > div:nth-child(2){-webkit-animation-delay:-100ms;-moz-animation-delay:-100ms;-o-animation-delay:-100ms;animation-delay:-100ms}.la-ball-fall > div:nth-child(3){-webkit-animation-delay:0;-moz-animation-delay:0;-o-animation-delay:0;animation-delay:0}.la-ball-fall.la-sm{width:26px;height:8px}.la-ball-fall.la-sm > div{width:4px;height:4px;margin:2px}.la-ball-fall.la-2x{width:108px;height:36px}.la-ball-fall.la-2x > div{width:20px;height:20px;margin:8px}.la-ball-fall.la-3x{width:162px;height:54px}.la-ball-fall.la-3x > div{width:30px;height:30px;margin:12px}@-webkit-keyframes ball-fall{0%{opacity:0;-webkit-transform:translateY(-145%);transform:translateY(-145%)}10%{opacity:.5}20%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}80%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}90%{opacity:.5}100%{opacity:0;-webkit-transform:translateY(145%);transform:translateY(145%)}}@-moz-keyframes ball-fall{0%{opacity:0;-moz-transform:translateY(-145%);transform:translateY(-145%)}10%{opacity:.5}20%{opacity:1;-moz-transform:translateY(0);transform:translateY(0)}80%{opacity:1;-moz-transform:translateY(0);transform:translateY(0)}90%{opacity:.5}100%{opacity:0;-moz-transform:translateY(145%);transform:translateY(145%)}}@-o-keyframes ball-fall{0%{opacity:0;-o-transform:translateY(-145%);transform:translateY(-145%)}10%{opacity:.5}20%{opacity:1;-o-transform:translateY(0);transform:translateY(0)}80%{opacity:1;-o-transform:translateY(0);transform:translateY(0)}90%{opacity:.5}100%{opacity:0;-o-transform:translateY(145%);transform:translateY(145%)}}@keyframes ball-fall{0%{opacity:0;-webkit-transform:translateY(-145%);-moz-transform:translateY(-145%);-o-transform:translateY(-145%);transform:translateY(-145%)}10%{opacity:.5}20%{opacity:1;-webkit-transform:translateY(0);-moz-transform:translateY(0);-o-transform:translateY(0);transform:translateY(0)}80%{opacity:1;-webkit-transform:translateY(0);-moz-transform:translateY(0);-o-transform:translateY(0);transform:translateY(0)}90%{opacity:.5}100%{opacity:0;-webkit-transform:translateY(145%);-moz-transform:translateY(145%);-o-transform:translateY(145%);transform:translateY(145%)}}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;var __WEBPACK_AMD_DEFINE_RESULT__;!function(e,t,n){"use strict";!function o(e,t,n){function a(s,l){if(!t[s]){if(!e[s]){var i="function"==typeof require&&require;if(!l&&i)return require(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return a(n?n:t)},c,c.exports,o,e,t,n)}return t[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(o,a,r){function s(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var l,i,u,c,d=o("./modules/handle-dom"),f=o("./modules/utils"),p=o("./modules/handle-swal-dom"),m=o("./modules/handle-click"),v=o("./modules/handle-key"),y=s(v),b=o("./modules/default-params"),h=s(b),g=o("./modules/set-params"),w=s(g);r["default"]=u=c=function(){function o(e){var t=a;return t[e]===n?h["default"][e]:t[e]}var a=arguments[0];if((0,d.addClass)(t.body,"stop-scrolling"),(0,p.resetInput)(),a===n)return(0,f.logStr)("SweetAlert expects at least 1 attribute!"),!1;var r=(0,f.extend)({},h["default"]);switch(typeof a){case"string":r.title=a,r.text=arguments[1]||"",r.type=arguments[2]||"";break;case"object":if(a.title===n)return(0,f.logStr)('Missing "title" argument!'),!1;r.title=a.title;for(var s in h["default"])r[s]=o(s);r.confirmButtonText=r.showCancelButton?"Confirm":h["default"].confirmButtonText,r.confirmButtonText=o("confirmButtonText"),r.doneFunction=arguments[1]||null;break;default:return(0,f.logStr)('Unexpected type of argument! Expected "string" or "object", got '+typeof a),!1}(0,w["default"])(r),(0,p.fixVerticalPosition)(),(0,p.openModal)(arguments[1]);for(var u=(0,p.getModal)(),v=u.querySelectorAll("button"),b=["onclick","onmouseover","onmouseout","onmousedown","onmouseup","onfocus"],g=function(e){return(0,m.handleButton)(e,r,u)},C=0;C<v.length;C++)for(var S=0;S<b.length;S++){var x=b[S];v[C][x]=g}(0,p.getOverlay)().onclick=g,l=e.onkeydown;var k=function(e){return(0,y["default"])(e,r,u)};e.onkeydown=k,e.onfocus=function(){setTimeout(function(){i!==n&&(i.focus(),i=n)},0)},c.enableButtons()},u.setDefaults=c.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");(0,f.extend)(h["default"],e)},u.close=c.close=function(){var o=(0,p.getModal)();(0,d.fadeOut)((0,p.getOverlay)(),5),(0,d.fadeOut)(o,5),(0,d.removeClass)(o,"showSweetAlert"),(0,d.addClass)(o,"hideSweetAlert"),(0,d.removeClass)(o,"visible");var a=o.querySelector(".sa-icon.sa-success");(0,d.removeClass)(a,"animate"),(0,d.removeClass)(a.querySelector(".sa-tip"),"animateSuccessTip"),(0,d.removeClass)(a.querySelector(".sa-long"),"animateSuccessLong");var r=o.querySelector(".sa-icon.sa-error");(0,d.removeClass)(r,"animateErrorIcon"),(0,d.removeClass)(r.querySelector(".sa-x-mark"),"animateXMark");var s=o.querySelector(".sa-icon.sa-warning");return(0,d.removeClass)(s,"pulseWarning"),(0,d.removeClass)(s.querySelector(".sa-body"),"pulseWarningIns"),(0,d.removeClass)(s.querySelector(".sa-dot"),"pulseWarningIns"),setTimeout(function(){var e=o.getAttribute("data-custom-class");(0,d.removeClass)(o,e)},300),(0,d.removeClass)(t.body,"stop-scrolling"),e.onkeydown=l,e.previousActiveElement&&e.previousActiveElement.focus(),i=n,clearTimeout(o.timeout),!0},u.showInputError=c.showInputError=function(e){var t=(0,p.getModal)(),n=t.querySelector(".sa-input-error");(0,d.addClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,d.addClass)(o,"show"),o.querySelector("p").innerHTML=e,setTimeout(function(){u.enableButtons()},1),t.querySelector("input").focus()},u.resetInputError=c.resetInputError=function(e){if(e&&13===e.keyCode)return!1;var t=(0,p.getModal)(),n=t.querySelector(".sa-input-error");(0,d.removeClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,d.removeClass)(o,"show")},u.disableButtons=c.disableButtons=function(e){var t=(0,p.getModal)(),n=t.querySelector("button.confirm"),o=t.querySelector("button.cancel");n.disabled=!0,o.disabled=!0},u.enableButtons=c.enableButtons=function(e){var t=(0,p.getModal)(),n=t.querySelector("button.confirm"),o=t.querySelector("button.cancel");n.disabled=!1,o.disabled=!1},"undefined"!=typeof e?e.sweetAlert=e.swal=u:(0,f.logStr)("SweetAlert is a frontend module!"),a.exports=r["default"]},{"./modules/default-params":2,"./modules/handle-click":3,"./modules/handle-dom":4,"./modules/handle-key":5,"./modules/handle-swal-dom":6,"./modules/set-params":8,"./modules/utils":9}],2:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o={title:"",text:"",type:null,allowOutsideClick:!1,showConfirmButton:!0,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#8CD4F5",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0,inputType:"text",inputPlaceholder:"",inputValue:"",showLoaderOnConfirm:!1};n["default"]=o,t.exports=n["default"]},{}],3:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=t("./utils"),r=(t("./handle-swal-dom"),t("./handle-dom")),s=function(t,n,o){function s(e){m&&n.confirmButtonColor&&(p.style.backgroundColor=e)}var u,c,d,f=t||e.event,p=f.target||f.srcElement,m=-1!==p.className.indexOf("confirm"),v=-1!==p.className.indexOf("sweet-overlay"),y=(0,r.hasClass)(o,"visible"),b=n.doneFunction&&"true"===o.getAttribute("data-has-done-function");switch(m&&n.confirmButtonColor&&(u=n.confirmButtonColor,c=(0,a.colorLuminance)(u,-.04),d=(0,a.colorLuminance)(u,-.14)),f.type){case"mouseover":s(c);break;case"mouseout":s(u);break;case"mousedown":s(d);break;case"mouseup":s(c);break;case"focus":var h=o.querySelector("button.confirm"),g=o.querySelector("button.cancel");m?g.style.boxShadow="none":h.style.boxShadow="none";break;case"click":var w=o===p,C=(0,r.isDescendant)(o,p);if(!w&&!C&&y&&!n.allowOutsideClick)break;m&&b&&y?l(o,n):b&&y||v?i(o,n):(0,r.isDescendant)(o,p)&&"BUTTON"===p.tagName&&sweetAlert.close()}},l=function(e,t){var n=!0;(0,r.hasClass)(e,"show-input")&&(n=e.querySelector("input").value,n||(n="")),t.doneFunction(n),t.closeOnConfirm&&sweetAlert.close(),t.showLoaderOnConfirm&&sweetAlert.disableButtons()},i=function(e,t){var n=String(t.doneFunction).replace(/\s/g,""),o="function("===n.substring(0,9)&&")"!==n.substring(9,10);o&&t.doneFunction(!1),t.closeOnCancel&&sweetAlert.close()};o["default"]={handleButton:s,handleConfirm:l,handleCancel:i},n.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],4:[function(n,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},s=function(e,t){r(e,t)||(e.className+=" "+t)},l=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(r(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},i=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},u=function(e){e.style.opacity="",e.style.display="block"},c=function(e){if(e&&!e.length)return u(e);for(var t=0;t<e.length;++t)u(e[t])},d=function(e){e.style.opacity="",e.style.display="none"},f=function(e){if(e&&!e.length)return d(e);for(var t=0;t<e.length;++t)d(e[t])},p=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},m=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding-top"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt((n+t)/2)+"px"},v=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function a(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(a,t)};o()}e.style.display="block"},y=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function a(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(a,t):e.style.display="none"};o()},b=function(n){if("function"==typeof MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var a=t.createEvent("MouseEvents");a.initEvent("click",!1,!1),n.dispatchEvent(a)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},h=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};a.hasClass=r,a.addClass=s,a.removeClass=l,a.escapeHtml=i,a._show=u,a.show=c,a._hide=d,a.hide=f,a.isDescendant=p,a.getTopMargin=m,a.fadeIn=v,a.fadeOut=y,a.fireClick=b,a.stopEventPropagation=h},{}],5:[function(t,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=t("./handle-dom"),s=t("./handle-swal-dom"),l=function(t,o,a){var l=t||e.event,i=l.keyCode||l.which,u=a.querySelector("button.confirm"),c=a.querySelector("button.cancel"),d=a.querySelectorAll("button[tabindex]");if(-1!==[9,13,32,27].indexOf(i)){for(var f=l.target||l.srcElement,p=-1,m=0;m<d.length;m++)if(f===d[m]){p=m;break}9===i?(f=-1===p?u:p===d.length-1?d[0]:d[p+1],(0,r.stopEventPropagation)(l),f.focus(),o.confirmButtonColor&&(0,s.setFocusStyle)(f,o.confirmButtonColor)):13===i?("INPUT"===f.tagName&&(f=u,u.focus()),f=-1===p?u:n):27===i&&o.allowEscapeKey===!0?(f=c,(0,r.fireClick)(f,l)):f=n}};a["default"]=l,o.exports=a["default"]},{"./handle-dom":4,"./handle-swal-dom":6}],6:[function(n,o,a){function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(a,"__esModule",{value:!0});var s=n("./utils"),l=n("./handle-dom"),i=n("./default-params"),u=r(i),c=n("./injected-html"),d=r(c),f=".sweet-alert",p=".sweet-overlay",m=function(){var e=t.createElement("div");for(e.innerHTML=d["default"];e.firstChild;)t.body.appendChild(e.firstChild)},v=function x(){var e=t.querySelector(f);return e||(m(),e=x()),e},y=function(){var e=v();return e?e.querySelector("input"):void 0},b=function(){return t.querySelector(p)},h=function(e,t){var n=(0,s.hexToRgb)(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"},g=function(n){var o=v();(0,l.fadeIn)(b(),10),(0,l.show)(o),(0,l.addClass)(o,"showSweetAlert"),(0,l.removeClass)(o,"hideSweetAlert"),e.previousActiveElement=t.activeElement;var a=o.querySelector("button.confirm");a.focus(),setTimeout(function(){(0,l.addClass)(o,"visible")},500);var r=o.getAttribute("data-timer");if("null"!==r&&""!==r){var s=n;o.timeout=setTimeout(function(){var e=(s||null)&&"true"===o.getAttribute("data-has-done-function");e?s(null):sweetAlert.close()},r)}},w=function(){var e=v(),t=y();(0,l.removeClass)(e,"show-input"),t.value=u["default"].inputValue,t.setAttribute("type",u["default"].inputType),t.setAttribute("placeholder",u["default"].inputPlaceholder),C()},C=function(e){if(e&&13===e.keyCode)return!1;var t=v(),n=t.querySelector(".sa-input-error");(0,l.removeClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,l.removeClass)(o,"show")},S=function(){var e=v();e.style.marginTop=(0,l.getTopMargin)(v())};a.sweetAlertInitialize=m,a.getModal=v,a.getOverlay=b,a.getInput=y,a.setFocusStyle=h,a.openModal=g,a.resetInput=w,a.resetInputError=C,a.fixVerticalPosition=S},{"./default-params":2,"./handle-dom":4,"./injected-html":7,"./utils":9}],7:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"]=o,t.exports=n["default"]},{}],8:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0});var a=e("./utils"),r=e("./handle-swal-dom"),s=e("./handle-dom"),l=["error","warning","info","success","input","prompt"],i=function(e){var t=(0,r.getModal)(),o=t.querySelector("h2"),i=t.querySelector("p"),u=t.querySelector("button.cancel"),c=t.querySelector("button.confirm");if(o.innerHTML=e.html?e.title:(0,s.escapeHtml)(e.title).split("\n").join("<br>"),i.innerHTML=e.html?e.text:(0,s.escapeHtml)(e.text||"").split("\n").join("<br>"),e.text&&(0,s.show)(i),e.customClass)(0,s.addClass)(t,e.customClass),t.setAttribute("data-custom-class",e.customClass);else{var d=t.getAttribute("data-custom-class");(0,s.removeClass)(t,d),t.setAttribute("data-custom-class","")}if((0,s.hide)(t.querySelectorAll(".sa-icon")),e.type&&!(0,a.isIE8)()){var f=function(){for(var o=!1,a=0;a<l.length;a++)if(e.type===l[a]){o=!0;break}if(!o)return logStr("Unknown alert type: "+e.type),{v:!1};var i=["success","error","warning","info"],u=n;-1!==i.indexOf(e.type)&&(u=t.querySelector(".sa-icon.sa-"+e.type),(0,s.show)(u));var c=(0,r.getInput)();switch(e.type){case"success":(0,s.addClass)(u,"animate"),(0,s.addClass)(u.querySelector(".sa-tip"),"animateSuccessTip"),(0,s.addClass)(u.querySelector(".sa-long"),"animateSuccessLong");break;case"error":(0,s.addClass)(u,"animateErrorIcon"),(0,s.addClass)(u.querySelector(".sa-x-mark"),"animateXMark");break;case"warning":(0,s.addClass)(u,"pulseWarning"),(0,s.addClass)(u.querySelector(".sa-body"),"pulseWarningIns"),(0,s.addClass)(u.querySelector(".sa-dot"),"pulseWarningIns");break;case"input":case"prompt":c.setAttribute("type",e.inputType),c.value=e.inputValue,c.setAttribute("placeholder",e.inputPlaceholder),(0,s.addClass)(t,"show-input"),setTimeout(function(){c.focus(),c.addEventListener("keyup",swal.resetInputError)},400)}}();if("object"==typeof f)return f.v}if(e.imageUrl){var p=t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage="url("+e.imageUrl+")",(0,s.show)(p);var m=80,v=80;if(e.imageSize){var y=e.imageSize.toString().split("x"),b=y[0],h=y[1];b&&h?(m=b,v=h):logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+e.imageSize)}p.setAttribute("style",p.getAttribute("style")+"width:"+m+"px; height:"+v+"px")}t.setAttribute("data-has-cancel-button",e.showCancelButton),e.showCancelButton?u.style.display="inline-block":(0,s.hide)(u),t.setAttribute("data-has-confirm-button",e.showConfirmButton),e.showConfirmButton?c.style.display="inline-block":(0,s.hide)(c),e.cancelButtonText&&(u.innerHTML=(0,s.escapeHtml)(e.cancelButtonText)),e.confirmButtonText&&(c.innerHTML=(0,s.escapeHtml)(e.confirmButtonText)),e.confirmButtonColor&&(c.style.backgroundColor=e.confirmButtonColor,c.style.borderLeftColor=e.confirmLoadingButtonColor,c.style.borderRightColor=e.confirmLoadingButtonColor,(0,r.setFocusStyle)(c,e.confirmButtonColor)),t.setAttribute("data-allow-outside-click",e.allowOutsideClick);var g=!!e.doneFunction;t.setAttribute("data-has-done-function",g),e.animation?"string"==typeof e.animation?t.setAttribute("data-animation",e.animation):t.setAttribute("data-animation","pop"):t.setAttribute("data-animation","none"),t.setAttribute("data-timer",e.timer)};o["default"]=i,t.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],9:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},r=function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null},s=function(){return e.attachEvent&&!e.addEventListener},l=function(t){"undefined"!=typeof e&&e.console&&e.console.log("SweetAlert: "+t)},i=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,a="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),a+=("00"+n).substr(n.length);return a};o.extend=a,o.hexToRgb=r,o.isIE8=s,o.logStr=l,o.colorLuminance=i},{}]},{},[1]), true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return sweetAlert}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!=typeof module&&module.exports&&(module.exports=sweetAlert)}(window,document);

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
  updateBoard: function (){
    for (let x=0; x<3; x++)
      for (let y=0; y<3; y++)
        if (board[x][y] != undefined) document.getElementById("p"+(x+1)+(y+1)).innerHTML = board[x][y]=='O'?this.printCircle():'O';
  },
  isLastTurn: function(board,teste = 0){
      var winner = null;
      for (y=0; y<3; y++) //linhe preenchida
        if (board[y][0] != undefined && board[y][0] == board[y][1] && board[y][1] == board[y][2]) {
          winner = board[y][0];
          break;
        }
      if (!winner) //coluna preenchida
        for (x=0; x<3; x++)
          if (board[0][x] != undefined && board[0][x] == board[1][x] && board[1][x] == board[2][x]) {
            winner = board[0][x] == "X";
            break;
          }
      if (!winner) //diagonal preenchida
        if (board[1][1] != undefined && ((board[0][0] == board[1][1] && board[0][0] == board[2][2]) ||
           (board[0][2] == board[1][1] && board[0][2] == board[2][0]))) winner = board[1][1];

      if(winner) {
        if(winner == symbol.human) swal("Parabéns!","Você venceu o robô!","success");
      }
  },
  calcMiniMax: function (){ },
  printCircle: function(){
    var canvas = document.createElement('canvas');
    if (canvas.getContext){
      var context = canvas.getContext('2d');
      context.strokeStyle = "#333";
      context.beginPath();
      var x = 64;   // = 128/2 - centraliza o circulo}
      var y = 64;
      var radius = 64;  //raio do circulo = diametro/2
      var anticlockwise = true;
      var startAngle = 0;     //inicia o arco na posição 0 graus (direita)
      var endAngle = Math.PI*2; //termina o arco na posição 360 graus (volta completa)
      context.arc(64,64,64,0,(Math.PI*2),true);
      context.closePath();
      context.lineWidth = 5; 
      context.stroke(); //desenha a borda
      return '<img src="'+canvas.toDataURL()+'" />';
    } else return 'O';
  }
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function() {
  
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(columnId,game,cpuPlay) {
  var x = parseInt(columnId.substr(1,1))-1;
  var y = parseInt(columnId.substr(2,1))-1;

  if(board[x][y] != undefined) {
    swal("Posição inválida!","Escolha outra posição.","warning");
    return false;
  }

  board[x][y] = symbol.human;	//salva a jogada do humano
  game.updateBoard();
  game.isLastTurn(board); //verifica se jogo acabou, se sim, trava novas jogadas
    //se não, CPU joga

  console.log(board);
};


/***/ })
/******/ ]);