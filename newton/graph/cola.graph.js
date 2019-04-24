const d3 = require('d3')
const Cola = require('webcola')
const EventEmitter = require('events').EventEmitter

const Labels = require('./views/labels')
const Links = require('./views/links')
const Nodes = require('./views/nodes')

const defaults = {
	margin: 40,
	height: 550,
	width: 800 // can't use `window` in tests
}

/**
 * Cola.js Network Graph
 *
 */
class ColaGraph extends EventEmitter {

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
		// super(opts)
		// console.log('[graph] constructor options?', opts)
		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = (opts.width || defaults.width) - this.margin
		this.options = opts

		this._setNetwork(opts)

		this.labels = new Labels()
		this.links = new Links()
		this.nodes = new Nodes()

		this.renders = 0
		this.nodesRenders = 0
	}

	init () {
		this._initLayout()
		this._bindGraphToViews()

		// must bind layout before network for dragging to work
		this._bindLayout()
		this._bindNetwork()

		// first render
		this.render()
		return this
	}

	// ------- NETWORK ------- //

	_setNetwork (opts) {
		if (opts.network) {
			// console.log('[graph] constructor - network set')
			this.network = opts.network
		} else {
			throw `ERROR: graph requires network for data`
		}
	}

	_bindNetwork () {
		this.nodes.setNetwork(this.network)
		this.links.setNetwork(this.network)
		this.labels.setNetwork(this.network)
		this.network.on('update', (data) => {
			this.cola
				.nodes(data.nodes)
				.links(data.links)
				.start(20)
			this.render()
		})
	}

	// ------- WEBCOLA ------- //

	_initLayout () {
		this.cola = Cola.d3adaptor(d3).size([this.width, this.height])
		this.layout = this.cola

		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)

		this.cola
			.nodes(this.network.get('nodes'))
			.links(this.network.get('links'))
			.avoidOverlaps(true)
			.handleDisconnected(true)
			// .symmetricDiffLinkLengths(50,0.5)
			.jaccardLinkLengths(85,0.8)

		if (this.options.flow === 'horizontal') {
			this.cola.flowLayout('x', 100)
		}
		this.cola.start(30)
	}

	_bindLayout () {
		// let views re-position themselves on cola `tick`
		this.layout.on('tick', () => this.emit('tick'))

		// make nodes draggable
		if (this.options.draggable) {
			this.nodes.on('update', (nodes) => nodes.call(this.cola.drag))
		}

		// Demo: Highlight Neighbors
		this.nodes.on('node:mouseover', (n) => this.highlightNeighbors(n))
		this.nodes.on('node:mouseout', (n) => this.resetStyles())
	}

	/**
	 * Used by View position()
	 */
	_bindGraphToViews () {
		this.links.bindGraph(this)
		this.nodes.bindGraph(this)
		this.labels.bindGraph(this)
	}

	// ------- RENDERS --------

	render (data) {
		this.renders++
		// console.log(`[graph] renders count: ${this.renders}`)
		data = (data !== undefined) ? data : this.network.get('data')

		this.links.render(data) // technically does not need nodes
		this.nodes.render(data) // technically does not need links
		this.labels.render(data) // technically does not need links
	}

	highlightNeighbors (node) {
		// console.log(`[graph] highlightNeighbors(${node.label})`)
		this.nodes.highlightNeighbors(node)
		this.labels.highlightNeighbors(node)
		this.links.highlightNeighbors(node)
	}

	resetStyles () {
		// console.log('[graph] resetStyles()')
		this.nodes.resetStyles()
		this.labels.resetStyles()
		this.links.resetStyles()
	}
}

module.exports = ColaGraph
