const Graph = require('./../newton/graph')
const data = require('./data')
const margin = 40

const graph = new Graph(data, {
	margin: margin,
	height: 550,
	width: window.innerWidth - margin
})

graph.render()

// Fake Data Updata
document.querySelector('#js-update')
	.addEventListener('click', () => {
		data.nodes[data.nodes.length-1].status = "down"

		graph.updateData(data)
		graph.render()
	})