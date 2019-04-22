const io = require('socket.io-client')
const Graph = require('./../../newton').ColaGraph
const Network = require('./../../newton').Network

// ----------- MOCK DATA ----------- //

// const data = require('./architecture.data')
// const updatedData = require('./updated-data')

const data = {
	nodes: [
		{ id: "a", status: "up", label: "Alpha" },
		{ id: "b", status: "up", label: "Beta" },
		{ id: "c", status: "up", label: "Gamma" },
		{ id: "d", status: "up", label: "Delta" },
		{ id: "e", status: "up", label: "Epsilon" }
	],
	links: [
		{ source: 'a', target: 'b' },
		{ source: 'b', target: 'c' },
		{ source: 'c', target: 'd' },
		{ source: 'c', target: 'e' }
	]
}

const updatedDta = {
	nodes: [
		{ id: "a", status: "up", label: "Alpha" },
		{ id: "b", status: "up", label: "Beta" },
		{ id: "c", status: "up", label: "Gamma" },
		{ id: "d", status: "down", label: "Delta" },
		{ id: "e", status: "up", label: "Epsilon" }
	],
	links: [
		{ source: 'a', target: 'b' },
		{ source: 'b', target: 'c' },
		{ source: 'c', target: 'd' },
		{ source: 'c', target: 'e' }
	]
}

// ----------- SETUP AND BIND ----------- //

const network = new Network(data.nodes, data.links, { uid: 'id' })
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight - 60, // top in css
	flow: 'horizontal',
	draggable: true
	// network: network
})
graph.init().bind(network)


// ----------- CHANGES ----------- //

function update () {
	console.log('update()')
}

function reset () {
	console.log('reset()')
}

setTimeout(update, 1000)
setTimeout(reset, 3000)

// ----------- REAL TIME UPDATES ----------- //

const socket = io('http://localhost:3000')

socket.on('connect', (data) => {
	socket.emit('join', 'Newton.js Graph connected')
})

// socket.on('network:data', function (d) {
// 	console.log('--- network data received ---')
// 	// console.log('before', network.get('data'))
// 	// delete data.links
// 	// console.log(data)
// 	console.log(d)
// 	// console.log(data == d)
// 	// network._links.pop()
// 	// network._links.pop()
// 	network._nodes = d.nodes
// 	network._publish('update')

// 	// network.resetData(d)
// 	// network._nodes = d.nodes
// 	// network._createLinks(d.links)

// 	// console.log('after', network.get('data'))
// })
