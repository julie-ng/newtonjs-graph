// const d3 = require('./../d3')
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
class Graph extends EventEmitter {

	/**
	 * Also initializes graph
	 *
	 * @param {Object} [opts] - options
	 * @param {Number} [opts.margin] - graph margins
	 * @param {Number} [opts.height] - height of network graph
	 * @param {Number} [opts.width] - width of network graph
	 * @param {String} [opts.engine = 'cola'] - force layout engine. Can be `d3` or `cola`.
	 */
	constructor (opts = {}) {
		super()
		// super(opts)
		// console.log('[graph] constructor options?', opts)
		this.margin = opts.margin || defaults.margin
		this.height = opts.height || defaults.height
		this.width = (opts.width || defaults.width) - this.margin
		this.engine = opts.engine || 'cola'
		this.options = opts

		this._setNetwork(opts)

		this.labels = new Labels()
		this.links = new Links()
		this.nodes = new Nodes()

		this.renders = 0
	}

	/**
	 * Initializes graph and performs first render
	 *
	 * @returns this
	 */
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
		this.network.on('update', (data) => {
			this.force
				.nodes(data.nodes)
				.links(data.links)
			this.render()
		})
	}

	isDeepSourceLink (s, t) {
		return this.network.isDeepSourceLink(s, t)
	}

	getRelationship (s, t) {
		return this.network.getRelationship(s, t)
	}

	// ------- FORCE ENGINES ------- //

	_initLayout () {
		this.svg = d3.select('svg')
			.attr('width', this.width)
			.attr('height', this.height)

		this._addArrows([
			'is-default',
			'is-source',
			'is-deep-source',
			'is-target'
		])

		this.force = (this.engine === 'cola')
			? this._colaForce()
			: this._d3Force()
	}

	_bindLayout () {
		// let views re-position themselves on cola `tick`
		this.force.on('tick', () => this.emit('tick'))

		// recalcuate forces if nodes count changes
		if (this.engine === 'cola') {
			this.nodes.on('enter', (s) => this._adjustForce(s))
			this.nodes.on('exit', (s) => this._adjustForce(s))
			this.links.on('enter', (s) => this._adjustForce(s))
			this.links.on('exit', (s) => this._adjustForce(s))
		}

		// make nodes draggable
		if (this.options.draggable && this.engine === 'cola') {
			this.nodes.on('update', (nodes) => nodes.call(this.force.drag))
		}

		this.nodes.on('node:mouseover', (n) => this.emit('node:mouseover', n))
		this.nodes.on('node:mouseout', (n) => this.emit('node:mouseout', n))
		this.nodes.on('node:click', (n) => this.emit('node:click', n))
	}

	_adjustForce (selection) {
		if (selection.size() > 0) {
			this.force.start(20)
		}
	}

	_colaForce () {
		let force = Cola.d3adaptor(d3).size([this.width, this.height])
		force
			.nodes(this.network.get('nodes'))
			.links(this.network.get('links'))
			.avoidOverlaps(true)
			.handleDisconnected(true)
			// .symmetricDiffLinkLengths(25,0.5)
			.jaccardLinkLengths(65,0.8)

		if (this.options.flow === 'horizontal') {
			force.flowLayout('x', 100)
		}

		force.start(50)
		return force
	}

	_d3Force () {
		let force = d3.forceSimulation(this.network.get('nodes'))
		.force('link', d3.forceLink(
			this.network.get('links'))
				.id(d => d.id)
				.distance(100)
				.strength(0.5)
		)
		.force('charge', d3.forceManyBody(-30))
		.force('center', d3.forceCenter(this.width / 2, this.height / 2))
		.force('collide', d3.forceCollide(50))
		.force('position', d3.forceRadial(20))
		return force
	}

	/**
	 * Used by View position()
	 * @private
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

		let hasFailures = false
		data.nodes.forEach((n) => {
			if (n.status === 'down') {
				this.highlightDependencies(n)
				hasFailures = true
			}
		})
		if (!hasFailures) {
			this.resetStyles()
		}
	}

	highlightDependencies (node, opts = {}) {
		// console.log(`[graph] highlightDependencies(${node.label})`)
		this.nodes.setRelationships(node)
		this.labels.setRelationships(node)
		this.links.setRelationships(node)
		if (opts.arrows) {
			this.links.showArrows(node, { color: true, showAll: false })
		}
	}

	resetStyles () {
		// console.log('[graph] resetStyles()')
		this.nodes.resetStyles()
		this.labels.resetStyles()
		this.links.resetStyles()
	}

	_addArrows (stylesArray) {

		// 20 for radius 6
		// 24 for radius 10
		this.svg.append("svg:defs")
			.selectAll('marker')
			.data(stylesArray)
		.enter().append('svg:marker')
			.attr('id', String)
			.attr('viewBox', '0 -4 8 8')
			.attr('refX', 20)
			.attr('refY', 0)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
		.append('svg:path')
			.attr('d', 'M0,-5L10,0L0,5')
	}
}

module.exports = Graph
