const Graph = require('./../../newton').Graph
const ColaGraph = require('./../../newton').ColaGraph
const Network = require('./../../newton').Network
const data = require('./architecture.data')

const graph = new ColaGraph({
	width: window.innerWidth,
	height: window.innerHeight - 250,
	flow: 'horizontal'
})
const network = new Network(data.nodes, data.linksMap, { uid: 'id' })

graph.init().bind(network)

document.querySelector('#js-delete')
	.addEventListener('click', () => {
		let toDelete = document.querySelector('#js-delete-id').value
		network.removeNodeById(toDelete.toString())
	})