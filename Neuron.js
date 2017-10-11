const Rx = require('rxjs')

module.exports = class Neuron {
    constructor(synapses, callback) {
        this.output = Rx.ConnectableObservable.create(observer => { this.observer = observer })
        this.output.subscribe(callback)
    
        this.weights = new Array(synapses.length).fill().map(val => Math.random())
        this.synapses = synapses.map((synapse, i) => synapse.map(val => val * this.weights[i]))
        this.core = Rx.Observable.merge(...this.synapses).bufferTime(2)
            .map(buffer => buffer.reduce((sum, val) => sum + val, 0))
            .filter(val => val > 0.5 * synapses.length)
            .subscribe(val => { this.observer.next(1) })
    }
}