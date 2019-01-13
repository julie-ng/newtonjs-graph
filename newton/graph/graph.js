const EventEmitter = require('events').EventEmitter
const d3 = require('d3')
const Cola = require('webcola')

const _render = Symbol('render')
const Labels = require('./views/labels')
const Links = require('./views/links')
const Nodes = require('./views/nodes')

const defaults = {
	margin: 40,
	height: 550,
	width: 800 // can't use `window` in tests
}

/**
 * Network Graph
 *
 * @fires Graph#tick
 * @fires Graph#update
 *
 * @property {Integer} margin - Layout Margin
 * @property {Integer} width - Graph Width
 * @property {Integer} height - Graph Height
 * @property {cola} cola - Layout Constraint Adapter
 * @property {d3} svg - d3.js container selection that holds our svg elements, incl. labels, links and nodes.
 * @property {Labels} labels - Labels for network nodes to be drawn
 * @property {Links} links - Network links to be drawn
 * @property {Nodes} nodes - Network nodes to be drawn
 */
class Graph extends EventEmitter {

	/**
	 * Also initializes graph
	 *
	 * @param {Object} [opts] - options
	 * @param {Object} [opts.margin] - graph margins
	 * @param {Object} [opts.height] - height of network graph
	 * @param {Object} [opts.width] - width of network graph
	 */
	constructor (opts = {}) {
		super()

		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = (opts.width || defaults.width) - this.margin
		this.options = opts

		// Initialize Layout
		this.cola = Cola.d3adaptor(d3).size([this.width, this.height])
		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)

		// Initialize d3 components
		this.labels = new Labels()
		this.links = new Links()
		this.nodes = new Nodes({ adapter: this.cola })
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
			.jaccardLinkLengths(100,0.8)

		if (this.options.flow === 'horizontal') {
			this.cola. flowLayout('x', 150)
		}
		this.cola.start(30)

		this.links.bindGraph(this)
		this.nodes.bindGraph(this)
		this.labels.bindGraph(this)

		/**
		 * Tick event used to constrain layout using webcola.
		 * Graph elements listen to this event to reposition themselves.
		 *
		 * @event Graph#tick
		 */
		this.cola.on('tick', () => this.emit('tick'))

		/**
		 * Update event which passes on network data so graph elements,
		 * nodes and links can update themselves based on latest
		 * real-time data.
		 *
		 * @event Graph#update
		 * @type {Object}
		 * @property {Array} nodes
		 * @property {Array} links
		 */
		network.on('update', (data) => {
			this.emit('update', data)
			this.cola.start()
		})

		// First render
		this[_render]({
			nodes: network.get('nodes'),
			links: network.get('links')
		})
	}

	/**
	 * Force render the graph. Can be used debugging.
	 * @private
	 */
	[_render] (data) {
		// Order here determines how elements are stacked in svg
		this.links.render(data)
		this.nodes.render(data)
		this.labels.render(data)
	}
}

module.exports = Graph
