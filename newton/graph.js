const d3 = require('d3')
const Cola = require('webcola')

const Labels = require('./labels')
const Links = require('./links')
const Nodes = require('./nodes')

const defaults = {
	margin: 40,
	height: 550,
	width: 800 // can't use `window` in tests
}

class Graph {
	constructor (data, opts = {}) {
		this.data = data

		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = opts.width || defaults.width

		this.init()
	}

	init () {
		this.cola = Cola.d3adaptor(d3).size([this.width, this.height])
		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)

		this.links = new Links(this.data, {
			container: this.svg
		})

		this.nodes = new Nodes(this.data, {
			container: this.svg,
			adapter: this.cola
		})

		this.labels = new Labels(this.data, {
			container: this.svg
		})

		this.cola.nodes(this.data.nodes)
			.links(this.data.links)
			.jaccardLinkLengths(100,0.8)
			.start(30)
	}

	render () {
		this.links.render()
		this.nodes.render()
		this.labels.render()

		this.cola.on('tick', () => {
			this.labels.position()
			this.links.position()
			this.nodes.position()
		})

		this.nodes.animate()

		return this
	}

	updateData (data) {
		this.labels.updateData(data)
		this.links.updateData(data)
		this.nodes.updateData(data)

		return this
	}
}

module.exports = Graph
