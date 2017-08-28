"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MagicTrackpadDetector = (function () {
    function MagicTrackpadDetector() {
        this.history = new RingBuffer(20);
        this.tolerance = 7; // ms
        this.interval = 1000 / 60; // events per second
        this.minN = 5;
    }
    MagicTrackpadDetector.prototype.inertial = function (e) {
        var h = this.history;
        var t0 = performance.now();
        var d0 = e.deltaY;
        h.push([t0, d0]);
        if (h.length < this.minN)
            return false;
        for (var i = this.minN; i > 1; --i) {
            var o = h.at(-i);
            var n = h.at(-i + 1);
            var dt = n[0] - o[0];
            if (dt < this.interval - this.tolerance || this.interval + this.tolerance < dt)
                return false;
            if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                return false;
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
