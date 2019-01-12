const Graph = require('./../newton/graph')
const Network = require('./../newton/network')
const data = require('./data')

const graph = new Graph({ width: window.innerWidth })
const network = new Network(data.nodes, data.linksMap, { uid: 'id' })

graph.bind(network)
network.triggerUpdate()

document.querySelector('#js-delete')
	.addEventListener('click', () => {
		let toDelete = document.querySelector('#js-delete-id').value
		network.demoDelete(toDelete.toString())
	})