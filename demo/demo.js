const io = require('socket.io-client')
const Graph = require('./../newton').Graph
const Network = require('./../newton').Network
// const data = require('./data/relationships')
const data = require('./data')

// ----------- SETUP AND BIND ----------- //

console.log('hello world')

const network = new Network(data.nodes, data.links)
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight,
	flow: 'horizontal',
	// engine: 'd3',
	draggable: true,
	network: network
})
graph.init()

graph.on('node:click', (n) => graph.highlightDependencies(n, { arrows: true }))
// graph.on('node:mouseover', (n) => graph.showDependencies(n))
// graph.on('node:mouseout', graph.resetStyles)



// ----- FAKE TIMELINE ----- //

// let index, delay, highlight

// setInterval(() => {
// 	clearTimeout(highlight)
// 	index = getRandomInt(0, data.nodes.length - 1)
// 	delay = setTimeout(highlightRandomNode(index), getRandomInt(1, 3))
// }, 6000)


// function highlightRandomNode (i) {
// 	console.log(`highlight ${data.nodes[i].label}`)

// 	clearTimeout(delay)
// 	let node = data.nodes[i]
// 	node.status = 'down'
// 	graph.render(data)
// 	graph.highlightNeighbors(node)
// 	highlight = setTimeout(() => {
// 		node.status = 'up'
// 		graph.render(data)
// 		graph.resetStyles()
// 	}, 3000)
// }

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

// function getRandomInt (min, max) {
// 	min = Math.ceil(min)
// 	max = Math.floor(max)
// 	return Math.floor(Math.random() * (max - min + 1)) + min
// }