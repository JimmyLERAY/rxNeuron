const Rx = require('rxjs')
const Neuron = require('./Neuron')

let neuron = new Neuron([
    Rx.ConnectableObservable.interval(11).map(val => 1),
    Rx.ConnectableObservable.interval(19).map(val => 1),
    Rx.ConnectableObservable.interval(31).map(val => 1)
])

neuron.subscribe(val => console.log(1))