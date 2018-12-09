const d3 = require('d3')
const NodeUI = require('./node-ui')
const Transitions = require('./transitions')

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 */
class Nodes {
	/**
	 * @param {Object} options
	 * @param {d3adapter} options.adapter - reference to layout adapter (webcola). required to enable dragging of nodes
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		this.adapter = options.adapter
		this.container = options.container || 'svg'
	}

	bindGraph (graph) {
		graph.on('tick', () => this.position())
		graph.on('update', (data) => this.render(data))
	}

	/**
	 * Renders the nodes, updating existing and drawing new nodes.
	 */
	render (data) {
		let nodes = d3.select(this.container)
			.selectAll('circle')
			.data(data.nodes, (d) => d.id)

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
		this.animate()
	}

	/**
	 * Calculates node positions using current data.
	 * Actual positioning is done in the `Graph` class.
	 */
	position () {
		this.nodes
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	}

	/**
	 * (Re)starts any animations using current data.
	 */
	animate () {
		this.nodes
			.filter('.status-down')
				.call(NodeUI.flash)

		this.nodes
			.filter('.status-deploying')
				.call(NodeUI.pulse, 3)
	}
}

module.exports = Nodes