// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel/src/builtins/bundle-url.js"}],"styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectedView = projectedView;
exports.normalizedView = normalizedView;
exports.pregenerate = pregenerate;
exports.genData = genData;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function projectedView(data, maxX, maxY, sStartY, sEndY) {
  var lines = cachedOr([data.lines, maxX, maxY], function () {
    return data.lines.map(function (line) {
      return _objectSpread({}, line, {
        data: line.data.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              x = _ref2[0],
              y = _ref2[1];

          return [x * maxX, maxY - y * maxY];
        })
      });
    });
  });
  var searchDiff = sEndY - sStartY;
  var smallLines = cachedOr([data.fullLines, maxX, sStartY, searchDiff], function () {
    return data.fullLines.map(function (line) {
      return _objectSpread({}, line, {
        data: line.data.map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              x = _ref4[0],
              y = _ref4[1];

          return [x * maxX, sStartY + (searchDiff - y * searchDiff)];
        })
      });
    });
  });
  var labels = cachedOr([data.labels, maxX], function () {
    return data.labels.map(function (label) {
      return {
        pos: label.pos * maxX,
        text: label.text
      };
    });
  });
  var markers = cachedOr([data.markers, maxY, maxX], function () {
    return data.markers.map(function (marker) {
      return {
        pos: maxY - marker.pos * maxY,
        text: marker.text
      };
    });
  });
  var shownLabels = cachedOr([data.shownLabels, maxX], function () {
    return data.shownLabels.map(function (label) {
      return {
        text: label.text,
        pos: label.pos * maxX
      };
    });
  });
  return {
    lines: lines,
    smallLines: smallLines,
    labels: labels,
    markers: markers,
    shownLabels: shownLabels,
    view: [data.view[0] * maxX, data.view[1] * maxX],
    selection: null
  };
}

function binarySearchClosestIdx(data, thing, lower) {
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (data.length <= 2) {
    if (lower) {
      if (data[0] < thing) {
        if (data[1] && data[1] < thing) {
          return offset + 1;
        }

        return offset;
      } else {
        if (offset === 0) return 0;
        return offset - 1 || 0;
      }
    } else {
      if (data[0] < thing) {
        if (data[1] && data[1] < thing) {
          return offset + 2;
        }

        return offset + 1;
      } else {
        return offset;
      }
    }
  }

  if (data.length === 1) return offset + data[0] < thing ? lower ? 0 : 1 : lower ? -1 : 0;
  var idx = Math.round(data.length / 2);

  if (thing < data[idx]) {
    return binarySearchClosestIdx(data.slice(0, idx), thing, lower, offset);
  } else {
    return binarySearchClosestIdx(data.slice(idx), thing, lower, offset + idx);
  }
}

var _cache = undefined;

function interp(n, time) {
  if (!_cache) {
    _cache = n;
    return n;
  }

  return n;
}

var steps = [10, 5, 1];
var minLines = 3;

function normalizedView(data, start, end, time) {
  var xData = data.xData,
      fullLines = data.fullLines,
      fullLabels = data.fullLabels;
  var startVal = xData.data[0];
  var endVal = xData.data[xData.data.length - 1];
  var diff = endVal - startVal;
  var startBound = startVal + diff * start;
  var endBound = startVal + diff * end;
  var startIdx = cachedOr([xData.data, startBound], function () {
    return binarySearchClosestIdx(xData.data, startBound, true);
  });
  var endIdx = cachedOr([xData.data, endBound], function () {
    return binarySearchClosestIdx(xData.data, endBound, false);
  });
  var labels = cachedOr([fullLabels, startIdx, endIdx], function () {
    return fullLabels.slice(startIdx, endIdx).map(function (_ref5) {
      var text = _ref5.text,
          pos = _ref5.pos;
      return {
        text: text,
        pos: (pos - start) / (end - start)
      };
    });
  });

  var _cachedOr = cachedOr([fullLines, startIdx, endIdx], function () {
    var max = Number.MIN_SAFE_INTEGER;
    var lines = fullLines.map(function (line) {
      return _objectSpread({}, line, {
        data: line.raw.slice(startIdx, endIdx).map(function (n) {
          return n > max ? max = n : n;
        })
      });
    });
    max *= 1.05;
    max = interp(max, time);
    max = cachedOr([startIdx, endIdx], function () {
      return max;
    });
    lines.map(function (line) {
      line.data = line.data.map(function (d, i) {
        return [labels[i].pos, d / max];
      });
    });
    return {
      lines: lines,
      max: max
    };
  }),
      lines = _cachedOr.lines,
      max = _cachedOr.max;

  var stepN = max / minLines;
  var digits = Math.round(Math.log10(stepN));
  var base = Math.pow(10, digits - 1);
  var step = steps.map(function (s) {
    return base * s;
  }).filter(function (s) {
    return s < stepN;
  })[0];
  var nSteps = Math.floor(max / step) + 1;
  var markers = cachedOr([nSteps, step], function () {
    return Array.from({
      length: nSteps
    }, function (_, i) {
      return {
        text: "" + i * step,
        pos: i * step / max
      };
    });
  });
  var shownLabels = cachedOr([labels, end, start, diff], function () {
    var viewDiff = end - start;
    var labelPadAmt = 0.05;
    var labelMinN = 5;
    var posOnly = labels.map(function (l) {
      return l.pos;
    });
    var invDiff = 1 / viewDiff;
    var boundDiff = (endBound - startBound) * (1 - labelPadAmt * 2);
    var power = Math.round(Math.log2(boundDiff / labelMinN));
    var step = Math.pow(2, power);
    var labelN = Math.floor(boundDiff / step);
    var relStep = step / boundDiff;
    var offset = 1 - (startBound + labelPadAmt * diff) / step % 1;

    var r = function r(n) {
      return Math.round(n * 100) / 100;
    };

    console.log('n', r(relStep), r(labelN), r((startBound + labelPadAmt * diff) / step));
    return Array.from({
      length: labelN
    }, function (_, i) {
      var pos = (offset + i) * relStep;
      var idx = binarySearchClosestIdx(posOnly, pos, false);
      return labels[idx] && {
        text: labels[idx].text,
        pos: labels[idx].pos
      };
    }).filter(Boolean);
  });
  return Object.assign({
    lines: lines,
    labels: labels,
    markers: markers,
    shownLabels: shownLabels,
    view: [start, end],
    selection: null
  }, data);
}

function pregenerate(xData, yData) {
  var startVal = xData.data[0];
  var endVal = xData.data[xData.data.length - 1];
  var fullLabels = cachedOr([xData.data, startVal, endVal], function () {
    return xData.data.map(function (d) {
      return {
        text: new Date(d).toDateString().split(" ").slice(1, 3).join(" "),
        pos: (d - startVal) / (endVal - startVal),
        raw: d
      };
    });
  });

  var _cachedOr2 = cachedOr([yData], function () {
    var totalMax = Number.MIN_SAFE_INTEGER;
    var fullYView = yData.map(function (line) {
      return _objectSpread({}, line, {
        data: line.data.map(function (n) {
          return n > totalMax ? totalMax = n : n;
        })
      });
    });
    return {
      totalMax: totalMax,
      fullYView: fullYView
    };
  }),
      fullYView = _cachedOr2.fullYView,
      totalMax = _cachedOr2.totalMax;

  var totalMaxPerc = totalMax * 0.05;
  var fullLines = cachedOr([fullYView, totalMaxPerc, fullLabels], function () {
    return fullYView.map(function (line) {
      return _objectSpread({}, line, {
        data: line.data.map(function (d, i) {
          return [fullLabels[i].pos, (totalMaxPerc + d) / (totalMax + totalMaxPerc * 2)];
        }),
        raw: line.data
      });
    });
  });
  return {
    xData: xData,
    yData: yData,
    fullLines: fullLines,
    fullLabels: fullLabels
  };
} // { [id]: [] }


var cache = {};
var currentId, currentIdx;

function cachedOr(inputs, creator) {
  var caller = new Error().stack.split('\n')[2].trim();
  var currentCache = cache[currentId] || (cache[currentId] = {});
  var currentValue = currentCache[caller] || (currentCache[caller] = {}); //  const currentValue = currentCache[currentIdx] || (currentCache.push({}), currentCache[currentIdx]);
  //  currentIdx += 1;

  var cached = currentValue.inputs && currentValue.value && currentValue.inputs.length === inputs.length && inputs.reduce(function (acc, val, i) {
    return acc && val === currentValue.inputs[i];
  }, true);

  if (!cached) {
    currentValue.inputs = inputs;
    currentValue.value = creator();
  }

  return currentValue.value;
}

function genData(_ref6) {
  var id = _ref6.id,
      xData = _ref6.xData,
      yData = _ref6.yData,
      view = _ref6.view,
      viewPort = _ref6.viewPort,
      time = _ref6.time,
      rerender = _ref6.rerender;
  currentId = id;
  currentIdx = 0;
  var pregen = pregenerate(xData, yData);
  var currView = normalizedView(pregen, view[0], view[1], time);
  return projectedView(currView, viewPort.chart.x[1], viewPort.chart.y[1], viewPort.finder.y[0], viewPort.finder.y[1]);
}
},{}],"renderer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.diff = diff;

/**
 * @typedef
 * @name VNode
 * @property {string} tagName
 * @property {Object} attributes
 * @property {(VNode | string)[]} children
 */

/**
 *
 * @param {string} tagName
 * @param {Object?} attributes
 * @param {(VNode | string)[]} children
 *
 * @return {VNode}
 */
function h(tagName) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return {
    tagName: tagName,
    attributes: attributes,
    children: children
  };
}
/**
 *
 * @param {ChildNode} element
 * @param {Object} attributes
 */


function diffAttrs(element, attributes) {
  var newAttrs = Object.keys(attributes);
  var attrs = element.attributes;

  for (var i = attrs.length - 1; i >= 0; i--) {
    var name = attrs[i].name;
    var value = attrs[i].value; // if we already have the attribute, let's reuse it

    if (attributes[name] !== undefined) {
      newAttrs.splice(newAttrs.indexOf(name), 1);

      if ("" + attributes[name] !== value) {
        attrs[i].value = attributes[name];
      }
    } else {
      // delete any not given
      element.removeAttribute(name);
    }
  }

  newAttrs.map(function (a) {
    // event handlers
    if (a[0] === "o" && a[1] === "n") {
      var _name = a.toLowerCase().substr(2);

      if (!element._listen || !element._listen[_name]) element.addEventListener(_name, eventProxy, false);
      (element._listen || (element._listen = {}))[_name] = attributes[a]; // } else if (element[a] !== 'undefined') {
      //   element[a] = attributes[a];
    } else {
      element.setAttribute(a, attributes[a]);
    }
  });
}

function eventProxy(e) {
  return this._listen[e.type](e);
}

var EMPTY_ARR = [];
/**
 *
 * @param {ChildNode} parent
 * @param {(VNode | string)[]} nodes
 * @param {boolean?} isSvg
 * @return {SVGAElement}
 */

function diff(parent, nodes) {
  var isSvg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var children = parent.childNodes;
  var n,
      i = 0,
      len = nodes.length,
      childI = 0,
      isNew = false,
      el;

  for (; i < len; i++) {
    n = nodes[i]; // skip null nodes

    if (!n) continue; // convert to string if it's not a normal node

    n = n.tagName ? n : typeof n === "string" ? n : "" + n; // svgs need namespace elements

    isSvg = n.tagName === "svg" || isSvg; // try to find the right element, delete any that are not in the node tree

    el = children[childI++];

    while (el != null && (el.tagName || "#text").toLowerCase() !== n.tagName) {
      parent.removeChild(el);
      el = children[childI++];
    } // create and append an element if we didn't find one


    isNew = !el;
    el = el || (typeof n === "string" ? document.createTextNode(n) : isSvg ? document.createElementNS("http://www.w3.org/2000/svg", n.tagName) : document.createElement(n.tagName));

    if (typeof n === "string") {
      // text node
      el.data !== n && (el.data = n);
    } else {
      // normal element
      diffAttrs(el, n.attributes);
      diff(el, n.children, isSvg);
    }

    if (isNew) parent.appendChild(el);
  }

  for (; childI < children.length; childI++) {
    parent.removeChild(children[childI]);
  }
}
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _data = require("./data");

var _renderer = require("./renderer");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var maxChartY = 400;
var searchStartY = 450;
var searchEndY = 500;
var EMPTY_ARR = [];

function coerceTouches(e) {
  return e.changedTouches ? EMPTY_ARR.slice.call(e.changedTouches) : [{
    identifier: 0,
    clientX: e.clientX,
    target: e.target
  }];
}

function createChart(_ref) {
  var x = _ref.x,
      y = _ref.y,
      id = _ref.id,
      rerender = _ref.rerender,
      stacked = _ref.stacked,
      percentage = _ref.percentage;
  var currentView = [0.0, 1.0];
  var touches = {};
  var svg = null;

  function mouseDown(e) {
    e.preventDefault();
    coerceTouches(e).map(function (_ref2) {
      var identifier = _ref2.identifier,
          clientX = _ref2.clientX,
          target = _ref2.target;
      touches[identifier] = {
        start: clientX,
        target: target.classList[1] || ""
      };
    });
  }

  function mouseUp(e) {
    e.preventDefault();
    coerceTouches(e).map(function (_ref3) {
      var identifier = _ref3.identifier;
      delete touches[identifier];
    });
  }

  function mouseMove(e) {
    e.preventDefault();

    if (Object.keys(touches).length > 0 && e.buttons === 1) {
      // refresh svg if it got diffed to hell
      if (!svg || !svg.clientWidth) {
        svg = document.querySelector("svg");
      }

      var _svg$getBoundingClien = svg.getBoundingClientRect(),
          svgStart = _svg$getBoundingClien.x,
          svgWidth = _svg$getBoundingClien.width;

      coerceTouches(e).map(function (t) {
        // console.log(t);
        var identifier = t.identifier,
            current = t.clientX;
        var touch = touches[identifier];
        var start = touch.start,
            target = touch.target;
        var delta = (current - svgStart - (start - svgStart)) / svgWidth;
        var left = target === "window" || target === "left";
        var right = target === "window" || target === "right";

        if (left && currentView[0] + delta < 0) {
          delta = -currentView[0];
        }

        if (right && currentView[1] + delta > 1) {
          delta = 1 - currentView[1];
        }

        if (left && currentView[0] + delta > currentView[1] - 0.05) {
          delta = currentView[1] - 0.05 - currentView[0];
        }

        if (right && currentView[1] + delta < currentView[0] + 0.05) {
          delta = currentView[0] + 0.05 - currentView[1];
        }

        if (left) {
          currentView[0] += delta;
        }

        if (right) {
          currentView[1] += delta;
        }

        if (left || right) {
          touch.start = start + delta * svgWidth;
          rerender();
        }
      });
    }
  }

  document.body.addEventListener('mousemove', mouseMove);
  document.body.addEventListener('touchmove', mouseMove);
  document.body.addEventListener('mouseup', mouseUp);
  document.body.addEventListener('touchend', mouseUp);
  var gen = (0, _data.pregenerate)(x, y);
  return function (time, width) {
    var data = (0, _data.genData)({
      xData: x,
      yData: y,
      view: currentView,
      viewPort: {
        chart: {
          x: [0, width],
          y: [0, maxChartY]
        },
        finder: {
          x: [0, width],
          y: [searchStartY, searchEndY]
        }
      }
    }); //    const data = normalizeData(
    //      view(gen, currentView[0], currentView[1], time),
    //      width,
    //      maxChartY,
    //      searchStartY,
    //      searchEndY
    //    );

    var graph = (0, _renderer.h)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      version: "1.2",
      viewBox: [0, 0, width, searchEndY].join(" "),
      class: "graph"
    }, [(0, _renderer.h)("g", {}, [(0, _renderer.h)("g", {
      class: "lines y-lines"
    }, data.markers.map(function (m) {
      return (0, _renderer.h)("line", {
        x1: 0,
        x2: width,
        y1: m.pos,
        y2: m.pos
      });
    })), (0, _renderer.h)("g", {
      class: "labels y-labels"
    }, data.markers.map(function (m) {
      return (0, _renderer.h)("text", {
        x: 0,
        y: m.pos - 10
      }, [m.text]);
    })), (0, _renderer.h)("g", {
      class: "labels x-lines"
    }, [data.selection && (0, _renderer.h)("line", {
      x1: 200,
      x2: 200,
      y1: 0,
      y2: maxChartY
    })]), (0, _renderer.h)("g", {
      class: "labels x-labels"
    }, data.shownLabels.map(function (l) {
      return (0, _renderer.h)("text", {
        x: l.pos,
        y: maxChartY
      }, [l.text]);
    })), (0, _renderer.h)("g", {
      class: "line-charts"
    }, data.lines.map(function (line) {
      return (0, _renderer.h)("polyline", {
        stroke: line.color,
        class: "line-chart",
        points: line.data.join(" ")
      });
    }))]), (0, _renderer.h)("g", {
      class: "finder"
    }, [(0, _renderer.h)("rect", {
      x: data.view[0],
      y: "450",
      width: width - (width - data.view[1]) - data.view[0],
      height: "50",
      class: "window-border"
    }), (0, _renderer.h)("rect", {
      x: data.view[0] + 5,
      y: "452",
      width: width - (width - data.view[1]) - data.view[0] - 10,
      height: "46",
      class: "window"
    })].concat(_toConsumableArray(data.smallLines.map(function (line) {
      return (0, _renderer.h)("polyline", {
        stroke: line.color,
        class: "line-chart",
        points: line.data.join(" ")
      });
    })), [(0, _renderer.h)("rect", {
      x: "0",
      y: "450",
      width: data.view[0],
      height: "50",
      class: "overlay"
    }), (0, _renderer.h)("rect", {
      x: data.view[1],
      y: "450",
      width: width - data.view[1],
      height: "50",
      class: "overlay"
    }), (0, _renderer.h)("rect", {
      x: data.view[0] - 15,
      y: "450",
      width: 25,
      height: "50",
      class: "handle left",
      onMouseDown: mouseDown,
      onTouchStart: mouseDown
    }), (0, _renderer.h)("rect", {
      x: data.view[1] - 10,
      y: "450",
      width: 25,
      height: "50",
      class: "handle right",
      onMouseDown: mouseDown,
      onTouchStart: mouseDown
    }), (0, _renderer.h)("rect", {
      x: data.view[0] + 10,
      y: "450",
      width: width - (width - data.view[1]) - data.view[0] - 20,
      height: "50",
      class: "handle window",
      onMouseDown: mouseDown,
      onTouchStart: mouseDown
    })]))]);
    return (0, _renderer.h)("section", {
      class: "chart"
    }, [(0, _renderer.h)("header", {
      class: "header"
    }, [(0, _renderer.h)("h1", {}, ["Chart"])]), graph, (0, _renderer.h)("footer", {}, data.lines.map(function (line) {
      return (0, _renderer.h)("label", {
        for: line.name
      }, [(0, _renderer.h)("input", {
        type: "checkbox",
        class: "outline",
        id: line.name,
        checked: true
      }), line.name]);
    }))]);
  };
}

var parent = document.querySelector("main");
var queued = [];
var charts = [];
var width = document.body.clientWidth;
var cache = [];

function render(time) {
  cache = charts.map(function (c, i) {
    return queued.includes(i) || !cache[i] ? c(time, width - 30) : cache[i];
  });
  (0, _renderer.diff)(parent, cache);
  queued = [];
}

function queueRender(id) {
  if (queued.includes(id)) return;
  if (!queued.length) requestAnimationFrame(render);
  queued.push(id);
}

function queueAll() {
  charts.map(function (_, i) {
    return queueRender(i);
  });
}

window.addEventListener("load", function () {
  width = document.body.clientWidth;
  queueAll();
});
window.addEventListener("resize", function () {
  width = document.body.clientWidth;
  queueAll();
});

function fetchCharts() {
  Promise.all([1, 2, 3, 4, 5].map(function (nr) {
    return fetch("./contest/".concat(nr, "/overview.json"));
  })).then(function (res) {
    return Promise.all(res.map(function (res) {
      return res.json();
    }));
  }).then(function (data) {
    return data.map(function (chart) {
      var columns = chart.columns.map(function (_ref4) {
        var _ref5 = _toArray(_ref4),
            name = _ref5[0],
            data = _ref5.slice(1);

        return {
          color: chart.colors[name],
          data: data,
          name: chart.names[name],
          type: chart.types[name]
        };
      });
      var x = columns.find(function (c) {
        return c.type === "x";
      });
      var y = columns.filter(function (c) {
        return c !== x;
      });
      var id = charts.length;
      charts.push(createChart({
        x: x,
        y: y,
        stacked: !!chart.stacked,
        y_scaled: !!chart.y_scaled,
        percentage: !!chart.percentage,
        id: id,
        rerender: queueRender.bind(null, id)
      }));
      queueRender(id);
    });
  });
}

fetchCharts(); //fetch("./chart_data (3).json")
//  .then(res => res.json())
//  .then(data => {
//    charts = data.map(chart => {
//      const columns = chart.columns.map(([name, ...data]) => {
//        return {
//          color: chart.colors[name],
//          data: data,
//          name: chart.names[name],
//          type: chart.types[name]
//        };
//      });
//
//      const x = columns.find(c => c.type === "x");
//      const y = columns.filter(c => c !== x);
//
//      return createChart({ x, y });
//    });
//
//    queueRender();
//  });
},{"./styles.css":"styles.css","./data":"data.js","./renderer":"renderer.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46505" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map