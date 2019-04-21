const d3 = require('d3')
const Cola = require('webcola')
const Graph = require('./graph')

/**
 * Cola.js Network Graph
 *
 */
class ColaGraph extends Graph {

	/**
	 * Also initializes graph
	 *
	 * @param {Object} [opts] - options
	 * @param {Object} [opts.margin] - graph margins
	 * @param {Object} [opts.height] - height of network graph
	 * @param {Object} [opts.width] - width of network graph
	 */
	constructor (opts = {}) {
		super(opts)
	}

	init () {
		this.cola = Cola.d3adaptor(d3).size([this.width, this.height])
		this.layout = this.cola
		super.init()
		return this
	}

	/**
	 * Binds graph to network `update` and passes along cola's
	 * `tick` event.
	 *
	 * @param {Object|GraphData} data - network graph data
	 */
	bind (network) {
		this.cola
			.nodes(network.get('nodes'))
			.links(network.get('links'))
			.avoidOverlaps(true)
			.handleDisconnected(false)
			.jaccardLinkLengths(85,0.8)

		if (this.options.flow === 'horizontal') {
			this.cola. flowLayout('x', 120)
		}
		this.cola.start(30)

		// restart cola, so layout always pretty
		this.on('update', (data) => this.cola.start())

		// make nodes draggable
		if (this.options.draggable) {
			this.nodes.on('update', (nodes) => nodes.call(this.cola.drag))
		}

		// bind network at end so dragging still works
		super.bind(network)

		// Nodes entry point for user interaction
		// pass these to links and labels
		this.bindUI()
	}

	bindUI () {
		// debugging
		this.nodes.on('update', (d) => {
			console.log('Event [nodes:update]', d)
		})

		this.network.on('update', (data) => {
			console.log('Event [network:update]', data)
			this.render(data)
		})
	}

	render (data) {
		this.nodes.render(data)
		this.labels.render(data)
		this.links.render(data)
	}

	highlightNeighbors (node) {
		this.nodes.highlightNeighbors(node)
		this.labels.highlightNeighbors(node)
		this.links.highlightNeighbors(node)
	}

	resetStyles () {
		this.nodes.resetStyles()
		this.labels.resetStyles()
		this.links.resetStyles()
	}
}

module.exports = ColaGraph
