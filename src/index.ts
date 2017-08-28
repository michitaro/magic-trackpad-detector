export class MagicTrackpadDetector {
    private history = new RingBuffer<[number, number]>(20)
    tolerance = 7 // ms
    interval = 1000 / 60 // events per second
    minN = 5

    inertial(e: WheelEvent) {
        const h = this.history
        const t0 = performance.now()
        const d0 = e.deltaY
        h.push([t0, d0])
        if (h.length < this.minN)
            return false
        for (let i = this.minN; i > 1; --i) {
            const o = h.at(-i)
            const n = h.at(-i + 1)
            const dt = n[0] - o[0]
            if (dt < this.interval - this.tolerance || this.interval + this.tolerance < dt)
                return false
            if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                return false
        }
        return true
    }
}

class RingBuffer<T> {
    private o: number
    private xs: T[]

    constructor(readonly n: number) {
        this.clear()
    }

    at(i: number): T {
        const j = (this.o + i + this.length) % this.xs.length
        return this.xs[j]
    }

    push(x: T) {
        if (this.xs.length < this.n)
            this.xs.push(x)
        else
            this.xs[this.o] = x
        this.o = (this.o + 1) % this.n
    }

    clear() {
        this.o = 0
        this.xs = []
    }

    get length() {
        return this.xs.length
    }
}