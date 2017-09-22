export class MagicTrackpadDetector {
    minN1 = 7
    minN2 = 15
    private history = new RingBuffer<[number, number]>(Math.max(this.minN1, this.minN2))

    inertial(e: WheelEvent) {
        const h = this.history
        const t0 = performance.now()
        const d0 = e.deltaY
        h.push([t0, d0])

        if (h.length < this.minN1)
            return false

        if (Math.abs(e.deltaY) > 1) {
            for (let i = this.minN1 - 1; i > 1; --i) {
                const o = h.at(-i)
                const n = h.at(-i + 1)
                if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                    return false
            }
            if (h.at(-1)[1] == h.at(-(this.minN1 - 1))[1]) {
                return false
            }
        }
        else { // |deltaY| == 1
            if (h.length < this.minN2)
                return false
            const [to, vo] = h.at(- this.minN2)
            if (Math.abs(vo) <= 1) { // || t0 - to > 2 * this.interval * this.minN2) {
                return false
            }
            for (let i = this.minN2 - 1; i > 1; --i) {
                const o = h.at(-i)
                const n = h.at(-i + 1)
                if (n[1] * o[1] < 0 || n[1] / o[1] > 1)
                    return false
            }
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