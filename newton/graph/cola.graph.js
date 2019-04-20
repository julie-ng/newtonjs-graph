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
		super.bind(network)

		this.cola
			.nodes(network.get('nodes'))
			.links(network.get('links'))
			.avoidOverlaps(true)
			.handleDisconnected(false)
			.jaccardLinkLengths(115,0.8)

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

		// Nodes entry point for user interaction
		// pass these to links and labels
		this.bindUI()
	}

	bindUI () {
		this.nodes.on('style:highlightNeighbors', (node) => {
			this.labels.highlightNeighbors(node)
			this.links.highlightNeighbors(node)
		})

		this.nodes.on('style:reset', () => {
			this.labels.resetStyles()
			this.links.resetStyles()
		})
	}
}

module.exports = ColaGraph
