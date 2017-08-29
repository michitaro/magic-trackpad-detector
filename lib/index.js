"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MagicTrackpadDetector = (function () {
    function MagicTrackpadDetector() {
        this.tolerance = 7; // ms
        this.interval = 1000 / 60; // events per second
        this.minN1 = 7;
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
                var dt = n[0] - o[0];
                if (dt < this.interval - this.tolerance || this.interval + this.tolerance < dt)
                    return false;
                if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                    return false;
            }
        }
        else {
            if (h.length < this.minN2)
                return false;
            var _a = h.at(-this.minN2), to = _a[0], vo = _a[1];
            if (Math.abs(vo) <= 1 || t0 - to > 2 * this.interval * this.minN2) {
                return false;
            }
            for (var i = this.minN2 - 1; i > 1; --i) {
                var o = h.at(-i);
                var n = h.at(-i + 1);
                var dt = n[0] - o[0];
                if (!(this.interval - this.tolerance <= dt && dt <= this.interval + this.tolerance ||
                    2 * this.interval - this.tolerance <= dt && dt <= 2 * this.interval + this.tolerance))
                    return false;
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
