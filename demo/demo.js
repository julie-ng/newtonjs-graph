const io = require('socket.io-client')
const Graph = require('./../newton').Graph
const Network = require('./../newton').Network
const data = require('./demo.data')

// ----------- SETUP AND BIND ----------- //

const network = new Network(data.nodes, data.links)
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight, //- 60, // top in css
	flow: 'horizontal',
	engine: 'd3',
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

let dataServer = new URLSearchParams(window.location.search).get('data-server')
if (dataServer === null ) {
	console.warn('Please provide a `data-server` via query parameter to use real-time demo.')
} else {
	initRealtimeDemo()
}

function initRealtimeDemo () {
	const socket = io(dataServer)

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
}

function isValidData (data) {
	if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
		return true
	} else {
		throw 'ERROR [Socket] - invalid data received. `nodes` and `links` properties are required.'
	}
}