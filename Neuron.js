const Rx = require('rxjs')

// Module export the Neuron Class
module.exports = class Neuron {

    constructor() {
        this.rate = 1.01
        this.delay = 1
        this.synapses = [] // Init the synapses array
        this.initOutput() // Init the output hot observable
        this.resetCore() // Init the core of the neuron
    }

    initOutput() {
        // Create a connectableObservable then connect it
        // Other neurons can already connect to this hot source
        this.output = Rx.Observable.create(observer => { this.observer = observer }).publish()
        this.output.connect(); console.log('Output published')
    }

    resetCore() {
        // unsubscribe from the previous core if defined
        if (this.core) { this.core.unsubscribe(); console.log('Core disconnected') }

        // subscribe to the new core which merge, buffer and filter
        // all hot synapses sources into one observable
        this.core = Rx.Observable
            .merge(...this.synapses.map((synapse, idx) => {
                return synapse.observable.map(impulse => {
                    this.synapses[idx].activated = true
                    setTimeout(() => { this.synapses[idx].activated = false }, this.delay)
                    return impulse * synapse.weigth
                })
            }))
            .bufferTime(this.delay)
            .map(buffer => buffer.reduce((sum, val) => sum + val, 0))
            .filter(val => val > 0.5 * this.synapses.length)
            .subscribe(() => {
                this.updSyn()
                this.observer.next(1)
            })
        console.log('Core connected')
    }

    updSyn() {
        // Synapses weights update if activated in same time than the axone (Hebb rule)
        this.synapses.forEach(synapse => {
            synapse.weigth = synapse.activated ? Math.pow(synapse.weigth, 1/this.rate) : Math.pow(synapse.weigth, this.rate)
        })
        console.log(this.synapses.map(synapse => synapse.weigth))
    }

    addSyn(inputs) {
        // Add new references to inputs observables then reset the core source
        this.synapses.push(...inputs.map(input => { return { observable: input, weigth: Math.random(), activated: false } }))
        console.log(`${ inputs.length } new synapse(s) connected`)
        this.resetCore()
    }

    remSyn(idxs) {
        // Remove some references to inputs observables then reset the core source
        idxs.sort((a,b) => b-a).forEach(idx => { this.synapses.splice(idx, 1) })
        console.log(`${ idxs.length } synapse(s) disconnected`)
        this.resetCore()
    }

    subscribe(callback) {
        console.log('Output new subscription')
        // Return the subscribe object of output
        return this.output.subscribe(callback)
    }
}