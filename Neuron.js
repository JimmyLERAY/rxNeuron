const Rx = require('rxjs')

module.exports = class Neuron {

    constructor() {
        this.synapses = []
        this.output = Rx.Observable.create(observer => { this.observer = observer }).publish()
        this.output.connect()
    }

    resetCore() {
        if (this.core) this.core.unsubscribe()
        this.core = Rx.Observable
            .merge(...this.synapses.map(synapse => synapse.observable.map(impulse => impulse * synapse.weigth)))
            .bufferTime(5)
            .map(buffer => buffer.reduce((sum, val) => sum + val, 0))
            .filter(val => val > 0.5 * this.synapses.length)
            .subscribe(() => { this.observer.next(1) })
    }

    addSynapses(inputs) {
        this.synapses.push(...inputs.map(input => { return { observable: input, weigth: Math.random() } }))
        console.log(`${ inputs.length } new synapse(s) have been connected to the core`)
        this.resetCore()
    }

    remSynapses(idxs) {
        idxs.sort((a,b) => b-a).forEach(idx => { this.synapses.splice(idx, 1) })
        console.log(`${ idxs.length } synapse(s) have been disconnected to the core`)
        this.resetCore()
    }

    subscribe(callback) { return this.output.subscribe(callback) }
}