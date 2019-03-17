const EventEmitter = require('events').EventEmitter
const d3 = require('d3')

const Labels = require('./views/labels')
const Links = require('./views/links')
const Nodes = require('./views/nodes')
const _bind = Symbol('bind')
const _render = Symbol('render')

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
 * @property {*} layout - layout adapter, e.g. cola.js or simulation engine, e.g. d3-force
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
	}

	/**
	 * Initializes layouts, new views for links, noes, etc.
	 *
	 * @return {this}
	 */
	init () {
		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)

		this.labels = new Labels()
		this.links = new Links()
		this.nodes = new Nodes()

		return this
	}

	/**
	 * Default Layout: d3-force
	 *
	 * @param {Object|GraphData} network - Network instance
	 */
	initDefaultLayout (network) {
		this.layout = d3.forceSimulation(network.get('nodes'))
			.force('link', d3.forceLink(
				network.get('links'))
					.id(d => d.id)
					.distance(100)
					.strength(0.1)
			)
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(this.width / 2, this.height / 2))
	}

	/**
	 * Binds graph to network `update` and passes along cola's
	 * `tick` event.
	 *
	 * @param {Object|GraphData} network - network graph data
	 */
	bind (network) {
		if (typeof this.layout === 'undefined') {
			this.initDefaultLayout(network)
		}

		this[_bind](network)
		return this
	}

	/**
	 * Binds graph to network `update` and passes along cola's
	 * `tick` event.
	 *
	 * @private
	 * @param {Object|GraphData} network - network graph data
	 */
	[_bind] (network) {
		this.links.bindGraph(this)
		this.nodes.bindGraph(this)
		this.labels.bindGraph(this)

		/**
		 * Tick event used to constrain layout using webcola.
		 * Graph elements listen to this event to reposition themselves.
		 *
		 * @event Graph#tick
		 */
		this.layout.on('tick', () => this.emit('tick'))

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
		network.on('update', (data) => this.emit('update', data))

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
