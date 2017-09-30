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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = __webpack_require__(2);
window.addEventListener('load', function (e) {
    var trackpad = document.querySelector('.trackpad');
    var canvas = document.querySelector('canvas');
    var history = [];
    var mtd = new src_1.MagicTrackpadDetector();
    var historyCanvas = new HistoryCanvas(history, canvas);
    trackpad.addEventListener('wheel', function (e) {
        e.preventDefault();
        history.unshift([e.deltaY, mtd.inertial(e)]);
        if (history.length > canvas.width)
            history.splice(canvas.width);
        historyCanvas.refresh();
    });
    historyCanvas.refresh();
});
var HistoryCanvas = (function () {
    function HistoryCanvas(history, canvas) {
        this.history = history;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
    }
    HistoryCanvas.prototype.refresh = function () {
        this.clear();
        this.drawInertialAreas();
        this.drawAxis();
        this.drawHistory();
    };
    HistoryCanvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.w, this.h);
    };
    HistoryCanvas.prototype.drawInertialAreas = function () {
        var ctx = this.ctx;
        var state = false;
        var start;
        this.history.push([0, false]);
        for (var x = 0; x < this.history.length; ++x) {
            var _a = this.history[x], i = _a[1];
            if (state != i) {
                if (state = i)
                    start = x;
                else {
                    ctx.fillStyle = '#ccf';
                    ctx.fillRect(start, 0, x - start, this.h);
                }
            }
        }
        this.history.pop();
    };
    HistoryCanvas.prototype.drawHistory = function () {
        var ctx = this.ctx;
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        for (var x = 0; x < this.history.length; ++x) {
            var y = this.history[x][0];
            ctx.lineTo(x, y + this.h / 2);
        }
        ctx.stroke();
    };
    HistoryCanvas.prototype.drawAxis = function () {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = '#777';
        ctx.lineTo(0, this.h / 2);
        ctx.lineTo(this.w, this.h / 2);
        ctx.stroke();
    };
    return HistoryCanvas;
}());


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MagicTrackpadDetector = (function () {
    function MagicTrackpadDetector() {
        this.minN1 = 10;
        this.minN2 = 15;
        this.history = new RingBuffer(Math.max(this.minN1, this.minN2));
    }
    MagicTrackpadDetector.prototype.inertial = function (e) {
        var h = this.history;
        var t0 = performance.now();
        var d0 = e.deltaY;
        h.push([t0, d0]);
        if (h.length < this.minN1)
            return false;
        if (Math.abs(e.deltaY) > 1) {
            for (var i = this.minN1 - 1; i > 1; --i) {
                var o = h.at(-i);
                var n = h.at(-i + 1);
                if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                    return false;
            }
            if (h.at(-1)[1] == h.at(-(this.minN1 - 1))[1]) {
                return false;
            }
        }
        else {
            if (h.length < this.minN2)
                return false;
            var _a = h.at(-this.minN2), to = _a[0], vo = _a[1];
            if (Math.abs(vo) <= 1) {
                return false;
            }
            for (var i = this.minN2 - 1; i > 1; --i) {
                var o = h.at(-i);
                var n = h.at(-i + 1);
                if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                    return false;
            }
        }
        return true;
    };
    return MagicTrackpadDetector;
}());
exports.MagicTrackpadDetector = MagicTrackpadDetector;
var RingBuffer = (function () {
    function RingBuffer(n) {
        this.n = n;
        this.clear();
    }
    RingBuffer.prototype.at = function (i) {
        var j = (this.o + i + this.length) % this.xs.length;
        return this.xs[j];
    };
    RingBuffer.prototype.push = function (x) {
        if (this.xs.length < this.n)
            this.xs.push(x);
        else
            this.xs[this.o] = x;
        this.o = (this.o + 1) % this.n;
    };
    RingBuffer.prototype.clear = function () {
        this.o = 0;
        this.xs = [];
    };
    Object.defineProperty(RingBuffer.prototype, "length", {
        get: function () {
            return this.xs.length;
        },
        enumerable: true,
        configurable: true
    });
    return RingBuffer;
}());


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ })
/******/ ]);