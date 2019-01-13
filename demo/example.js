const Graph = require('./../newton').Graph
const Network = require('./../newton').Network
const data = require('./data')

const graph = new Graph({ width: window.innerWidth })
const network = new Network(data.nodes, data.linksMap, { uid: 'id' })
graph.bind(network)

document.querySelector('#js-delete')
	.addEventListener('click', () => {
		let toDelete = document.querySelector('#js-delete-id').value
		network.removeNodeById(toDelete.toString())
	})