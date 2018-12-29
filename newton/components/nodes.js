const d3 = require('d3')

const Renderer = require('./renderer')
const Transitions = require('./transitions')
const NodeUI = require('./styles/node.ui')

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 *
 * @extends Renderer
 */
class Nodes extends Renderer {
	/**
	 * @param {Object} options
	 * @param {d3adapter} options.adapter - reference to layout adapter (webcola). required to enable dragging of nodes
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super()
		this.adapter = options.adapter
		this.container = options.container || 'svg'
	}

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