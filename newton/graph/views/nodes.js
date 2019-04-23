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
	 * @param {String} [options.dom=window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
		this.adapter = options.adapter
	}

	/**
	 * Renders network graphs and passes hooks to d3.js's general update pattern via events.
	 *
	 * For more information on the general update pattern, see:
	 * https://bost.ocks.org/mike/join/
	 *
	 * @param {Object} data - Network data with `nodes` attribute
	 */
	render (data) {
		// console.log(' nodes render()')

		if (data.nodes === undefined) { throw 'Error: missing `nodes` attribute on parameter.' }

		let t = d3.transition()
			.duration(300)
			.ease(d3.easeLinear)

		// -- Pattern: JOIN --
		let nodes = d3.select(this.dom)
			.select(this.container)
			.selectAll('.node')
			.data(data.nodes, (d) => d.id)

		// -- Pattern: REMOVE --
		/**
		 * @event Nodes#exit
		 * @property {Nodes} nodes - Exiting nodes per d3.js [general update pattern, III](https://bl.ocks.org/mbostock/3808234).
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

		// -- Pattern: ENTER + UPDATE (merge()) --
		/**
		 * @event Nodes#enter
		 * @property {Nodes} nodes - Entering nodes per d3.js [general update pattern, III](https://bl.ocks.org/mbostock/3808234).
		 */
		this.emit('enter', nodes.enter())
		nodes = nodes.enter()
			.append('circle')
				.attr('id', (n) => 'node-' + n.id)
			.merge(nodes)
				.attr('data-title', (n) => n.label)
				.attr('class', (n) => 'node status-' + n.status)
				.call(NodeUI.styleNode)
				.on('mouseover', (n) => this.onMouseover(n))
				.on('mouseout', (n) => this.onMouseout(n))

		/**
		 * @event Nodes#update
		 * @property {Nodes} nodes - Updating nodes (post merge with enter) per d3.js [general update pattern, III](https://bl.ocks.org/mbostock/3808234).
		 * @example
		 * nodes.on('update', (n) => n.call(webcola.drag))
		 */
		this.emit('update', nodes)

		this.nodes = nodes
	}

	position () {
		if (this.nodes === undefined) { throw 'Error: `nodes` attribute not set. Please render with data first.' }

		this.nodes
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	}

	onMouseover (n) {
		this.emit('node:mouseover', n)
	}

	onMouseout (n) {
		this.emit('node:mouseout', n)
	}

	highlightNeighbors (node) {
		// console.log(`[node] highlightNeighbors(${node.label})`)
		this.nodes
			.style('stroke', (i) => NodeUI.relationshipColor('stroke', i, this.network.getRelationship(i, node)))
			.style('fill', (i) => NodeUI.relationshipColor('fill', i, this.network.getRelationship(i, node)))
	}

	// Todo: reset by node, not by all
	resetStyles () {
		let t = d3.transition()
			.duration(300)
			.ease(d3.easeLinear)

		this.nodes
			.style('fill', '')
			.style('stroke', '')
			.call(NodeUI.styleNode)
	}
}

module.exports = Nodes