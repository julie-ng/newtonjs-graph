const d3 = require('d3')

const View = require('./view')
const Transitions = require('./transitions')
const NodeUI = require('./styles/node.ui')

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 *
 * @extends View
 */
class Nodes extends View {
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

	/**
	 * Renders network graphs and passes hooks to d3.js's general update pattern via events.
	 *
	 * For more information on the general update pattern, see:
	 * https://bost.ocks.org/mike/join/
	 *
	 * @param {*} data - Network data with `nodes` and `links`
	 */
	render (data) {
		let nodes = d3.select(this.container)
			.selectAll('circle')
			.data(data.nodes, (d) => 'node-' + d.id)

		let t = d3.transition()
			.duration(300)
			.ease(d3.easeLinear)

		/**
		 * @event Nodes#exit
		 * @property {Nodes} nodes - Exiting nodes per d3.js [general update pattern](https://bl.ocks.org/mbostock/3808218).
		 * @example
		 * nodes.on('exit', function (n) {
		 *   n.call(Transitions.fadeOut)
		 *    .call(Transitions.fadeDown)
		 * })
		 */
		this.emit('exit', nodes.exit())
		nodes.exit()
			.transition(t)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.circle, 5)
			.remove()

		/**
		 * @event Nodes#enter
		 * @property {Nodes} nodes - Entering nodes per d3.js [general update pattern](https://bl.ocks.org/mbostock/3808218).
		 */
		this.emit('enter', nodes.enter())
		nodes = nodes.enter()
			.append('circle')
				.attr('data-title', (d) => d.label)
			.merge(nodes)
				.call(NodeUI.styleNode)

		/**
		 * @event Nodes#update
		 * @property {Nodes} nodes - Updating nodes (post merge with enter) per d3.js [general update pattern](https://bl.ocks.org/mbostock/3808218).
		 * @example
		 * nodes.on('update', (n) => n.call(webcola.drag))
		 */
		this.emit('update', nodes)

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