const d3 = require('d3')
const NodeUI = require('./node-ui')
const Transitions = require('./transitions')

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 */
class Nodes {
	/**
	 * @param {Object} data
	 * @param {Array} data.nodes - Array of node data
	 * @param {Object} opts
	 * @param {d3Element} opts.container - d3 element from `select()`
	 * @param {d3adapter} opts.adapter - reference to layout adapter (webcola). required to enable dragging of nodes
	 */
	constructor (data, opts) {
		console.log('new Nodes()')
		this.setData(data)
		this.container = opts.container
		this.adapter = opts.adapter
	}

	/**
	 * A small wrapper until the data interface stabilizes, i.e. for the moment, `.nodes` property is expected to contain node data.
	 *
	 * Theoretically necessary to have other data, for advanced visualizations etc.
	 *
	 * @private
	 * @param {Array} data.nodes - list of nodes
	 */
	setData (data) {
		this.data = data.nodes
	}

	/**
	 * Updates node data
	 *
	 * @param {Object} data
	 */
	updateData (data) {
		this.setData(data)
	}

	/**
	 * Renders the nodes, updating existing and drawing new nodes.
	 * TODO: return self
	 */
	render () {
		console.log('Nodes.render()')

		let nodes = this.container.selectAll('circle')
			.data(this.data, (d) => d.id)

		let t = d3.transition()
			.duration(300)
			.ease(d3.easeLinear)

		nodes.exit()
			.transition(t)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.circle, 5)
			.remove()

		nodes = nodes.enter()
			.append('circle')
				.attr('data-title', (d) => d.label)
			.merge(nodes)
				.call(NodeUI.styleNode)
				.call(this.adapter.drag)

		this.nodes = nodes
	}

	/**
	 * Calculates node positions using current data.
	 * Actual positioning is done in the `Graph` class.
	 */
	position () {
		// console.log('Nodes.position()')
		this.nodes.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	}

	/**
	 * (Re)starts any animations using current data.
	 */
	animate () {
		this.nodes.filter('.status-down')
			.call(NodeUI.flash)

		this.nodes.filter('.status-deploying')
			.call(NodeUI.pulse, 3)
	}
}

module.exports = Nodes