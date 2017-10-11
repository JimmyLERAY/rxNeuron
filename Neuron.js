const Rx = require('rxjs')

module.exports = class Neuron {
    constructor(inputs) {
        this.output = Rx.ConnectableObservable.create(observer => { this.observer = observer })
    
        this.weights = new Array(inputs.length).fill().map(val => Math.random())
        this.inputs = inputs.map((input, i) => input.map(val => val * this.weights[i]))
        this.core = Rx.Observable.merge(...this.inputs).bufferTime(5)
            .map(buffer => buffer.reduce((sum, val) => sum + val, 0))
            .filter(val => val > 0.5 * inputs.length)
            .subscribe(val => { this.observer.next(1) })
    }

    subscribe(callback) { this.output.subscribe(callback) }
}