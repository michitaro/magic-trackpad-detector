export class MagicTrackpadDetector {
    private history = new RingBuffer<[number, number]>(20)

    private T = 160
    private maxN = Math.ceil(this.T / (1000 / 60))
    private N = Math.floor(0.8 * this.T / (1000 / 60))
    // private halfLife = 200

    inertial(e: WheelEvent) {
        const t0 = performance.now()
        const d0 = e.deltaY
        this.history.push([t0, d0])

        const samples: [number, number][] = []
        for (let i = 1; i <= this.history.length; ++i) {
            const [t, d] = this.history.at(-i)!
            if (t0 - t > this.T || d * d0 < 0)
                break
            samples.push([t, d])
        }

        if (samples.length < this.N || samples.length > this.maxN) {
            // console.log({ N: samples.length })
            return false
        }

        // const s1 = samples[samples.length - 1]
        // const s0 = samples[0]
        // const dt = s0[0] - s1[0]

        let ng = 0
        for (let i = 0; i < samples.length - 1; ++i) {
            const dNew = samples[i][1]
            const dOld = samples[i + 1][1]
            if (dNew * dOld < 0 || dNew / dOld > 1) {
                ng++
                continue
            }
        }

        if (ng > 0) {
            // console.log({ ng })
            return false
        }

        // if (s0[1] / s1[1] <= 1.1 * Math.pow(0.5, dt / this.halfLife))
        //     return true

        return true
    }
}


class RingBuffer<T> {
    private o: number
    private xs: T[]

    constructor(readonly n: number) {
        this.clear()
    }

    at(i: number): T | undefined {
        const j = (this.o + i + this.length) % this.xs.length
        return j < this.xs.length ? this.xs[j] : undefined
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