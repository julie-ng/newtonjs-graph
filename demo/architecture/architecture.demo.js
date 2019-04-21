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
let n

setTimeout(() => {
	n = network.findNodeById('4')
	network.updateNode(n, { status: 'down' })
	// graph.highlightNeighbors(n)
}, 1000)

setTimeout(() => {
	network.updateNode(n, { status: 'up' })
}, 3000)
