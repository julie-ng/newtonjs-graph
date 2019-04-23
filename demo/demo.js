const io = require('socket.io-client')
const Graph = require('./../newton').Graph
const Network = require('./../newton').Network
const data = require('./demo.data')

// ----------- SETUP AND BIND ----------- //

const network = new Network(data.nodes, data.links)
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight - 60, // top in css
	flow: 'horizontal',
	// engine: 'd3',
	draggable: true,
	network: network
})
graph.init()


// function highlight () {
// 	let n = network.findNodeById('8')
// 	graph.highlightNeighbors(n)
// }

// function reset () {
// 	graph.resetStyles()
// }

// setTimeout(highlight, 1000)
// setTimeout(reset, 3000)

// ----------- REAL TIME UPDATES ----------- //

const socket = io('http://localhost:3000')

socket.on('connect', (data) => {
	socket.emit('join', 'Newton.js Graph connected')
})

socket.on('network:data', function (d) {
	console.log('[demo] data received')
	console.log(d)

	if (isValidData(d)) {
		network.updateData(d.nodes, d.links)
	}
})

function isValidData (data) {
	if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
		return true
	} else {
		throw 'ERROR [Socket] - invalid data received. `nodes` and `links` properties are required.'
	}
}