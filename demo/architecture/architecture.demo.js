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

setTimeout(() => {
	graph.highlightNeighbors(network.findNodeById('4'))
}, 1000)

setTimeout(() => {
	graph.resetStyles()
}, 3000)

// document.querySelector('#js-delete')
// 	.addEventListener('click', () => {
// 		let toDelete = document.querySelector('#js-delete-id').value
// 		network.removeNodeById(toDelete.toString())
// 	})