const io = require('socket.io-client')
// const Graph = require('./../../newton').Graph
const Graph = require('./../../newton').ColaGraph
const Network = require('./../../newton').Network
const data = require('./architecture.data')

const network = new Network(data.nodes, data.linksMap, { uid: 'id' })
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight - 60, // top in css
	flow: 'horizontal',
	draggable: true
	// network: network
})

graph.init().bind(network)

// rename
data.links = data.linksMap

setTimeout(() => {
	data.nodes.forEach((n) => {
		n.status = 'deploying'
	})

	network.resetData(data)  				// render option #1
	// network._publish('update') 	// render option #2

	let n = network.findNodeById('2')
	graph.highlightNeighbors(n)
}, 1000)

setTimeout(() => {
	data.nodes.forEach((n) => {
		n.status = 'up'
	})

	data.nodes[1].status = 'down'
	network.resetData(data)
	graph.resetStyles()
}, 3000)

// --- real time data ---

const socket = io('http://localhost:3000')

socket.on('connect', (data) => {
	socket.emit('join', 'Newton.js Graph connected')
})