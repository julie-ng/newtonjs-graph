const Graph = require('./../newton/graph')
const Network = require('./../newton/network')
const data = require('./data')

const graph = new Graph({ width: window.innerWidth })
const network = new Network(data.nodes, data.linksMap, { uid: 'id' })

graph.bind(network)
network.triggerUpdate()

// Fake Data Update
document.querySelector('#js-update')
	.addEventListener('click', () => {
		network.demoUpdate()
	})

document.querySelector('#js-delete')
	.addEventListener('click', () => {
		network.demoDelete()
	})