"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MagicTrackpadDetector = (function () {
    function MagicTrackpadDetector() {
        this.history = new RingBuffer(20);
        this.T = 160;
        this.maxN = Math.ceil(this.T / (1000 / 60));
        this.N = Math.floor(0.8 * this.T / (1000 / 60));
        this.halfLife = 200;
    }
    MagicTrackpadDetector.prototype.inertial = function (e) {
        var t0 = performance.now();
        var d0 = e.deltaY;
        this.history.push([t0, d0]);
        var samples = [];
        for (var i = 1; i <= this.history.length; ++i) {
            var _a = this.history.at(-i), t = _a[0], d = _a[1];
            if (t0 - t > this.T || d * d0 < 0)
                break;
            samples.push([t, d]);
        }
        if (samples.length < this.N || samples.length > this.maxN) {
            // console.log({ N: samples.length })
            return false;
        }
        var s1 = samples[samples.length - 1];
        var s0 = samples[0];
        // const dt = s0[0] - s1[0]
        var ng = 0;
        for (var i = 0; i < samples.length - 1; ++i) {
            var dNew = samples[i][1];
            var dOld = samples[i + 1][1];
            if (dNew * dOld < 0 || dNew / dOld > 1) {
                ng++;
                continue;
            }
        }
        if (ng > 0) {
            // console.log({ ng })
            return false;
        }
        // if (s0[1] / s1[1] <= 1.1 * Math.pow(0.5, dt / this.halfLife))
        //     return true
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
        return j < this.xs.length ? this.xs[j] : undefined;
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
