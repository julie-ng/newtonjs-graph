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

/**
 * Network Graph
 */
class Graph {

	/**
	 * Also initializes graph
	 *
	 * @param {Object|GraphData} data - network graph data
	 * @param {Object} [opts] - options
	 * @param {Object} [opts.margin] - graph margins
	 * @param {Object} [opts.height] - height of network graph
	 * @param {Object} [opts.width] - width of network graph
	 */
	constructor (data, opts = {}) {
		this.data = data

		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = opts.width || defaults.width

		this.init()
	}

	/**
	 * Initializes graph by setting up `<svg>` layout and binding data.
	 *
	 */
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

	/**
	 * Renders the graph, specifically all links, nodes and labels.
	 * No links have to be drawn first so circles are on top.
	 */
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

	/**
	 * Updates Data
	 *
	 * Change interface such data we're not really updating data, but just re-rendering.
	 *
	 * @param {Up} data
	 */
	updateData (data) {
		this.labels.updateData(data)
		this.links.updateData(data)
		this.nodes.updateData(data)

		return this
	}
}

module.exports = Graph
