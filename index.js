const Rx = require('rxjs')
const Neuron = require('./Neuron')

// Instance of Neuron
const neuron = new Neuron()
neuron.subscribe()

// Emulate external hot sources
const input1 = Rx.Observable.interval(11).map(val => 1).publish()
const input2 = Rx.Observable.interval(19).map(val => 1).publish()
const input3 = Rx.Observable.interval(31).map(val => 1).publish()
input1.connect(); input2.connect(); input3.connect()

// Connect these sources then discconnect some
neuron.addSyn([input1, input2, input3])
neuron.remSyn([0,2])