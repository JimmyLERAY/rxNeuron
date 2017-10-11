const Rx = require('rxjs')

function Neuron(inputs) {
    this.inputs = inputs
    this.synapses = this.inputs.map(val => Math.random())
    this.output = Rx.Observable
        .merge(...this.inputs.map((synapse, idx) => synapse.map(val => val * this.synapses[idx])))
        .bufferTime(500, 500)
        .map(buffer => buffer.reduce((sum, val) => sum + val, 0))
        .filter(val => val > 0.5 * this.synapses.length)
        .map(val => 1)
}

const neuronTest = new Neuron([
    Rx.Observable.interval(~~(Math.random()*100)).map(x => 1),
    Rx.Observable.interval(~~(Math.random()*100)).map(x => 1),
    Rx.Observable.interval(~~(Math.random()*100)).map(x => 1)
])

neuronTest.output.subscribe(val => { console.log(val) })