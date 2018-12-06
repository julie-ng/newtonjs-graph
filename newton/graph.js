const d3 = require('d3')
const Cola = require('webcola')

const defaults = {
	margin: 40,
	height: 550,
	width: 800 // can't use `window` in tests
}

class Graph {
	constructor (nodes, links, opts = {}) {
		this.nodes = nodes
		this.links = links

		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = opts.width || defaults.width
	}

	init () {
		this.cola = Cola.d3adaptor(d3).size([this.width, this.height])
		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)
		this.cola.nodes(this.nodes)
			.links(this.links)
			.jaccardLinkLengths(100,0.8)
			.start(30)
	}
}

module.exports = Graph
