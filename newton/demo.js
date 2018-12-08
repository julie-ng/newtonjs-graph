const Graph = require('./graph')
const data = require('./scratch/data')
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