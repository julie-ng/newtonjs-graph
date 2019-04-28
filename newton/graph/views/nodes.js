const d3 = require('d3')
const View = require('./view')

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 *
 * @extends View
 */
class Nodes extends View {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
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

		let nodes = d3.select(this.dom)
			.select(this.container)
			.selectAll('.node')
			.data(data.nodes, (d) => d.id)

		this.emit('exit', nodes.exit())
		nodes.exit()
			.remove()

		this.emit('enter', nodes.enter())
		nodes = nodes.enter()
			.append('circle')
				.attr('id', (n) => 'node-' + n.id)
			.merge(nodes)
				.attr('data-title', (n) => n.label)
				.attr('class', (n) => 'node status-' + n.status)
				.attr('r', (n) => n.status === 'up' ? 6 : 10)
				.on('mouseover', (n) => this.onMouseover(n))
				.on('mouseout', (n) => this.onMouseout(n))

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

	highlightDependencies (node) {
		this.nodes
			.attr('data-rel', (i) => this.graph.getRelationship(i, node))
	}

	resetStyles () {
		this.nodes
			.attr('data-rel', '')
	}
}

module.exports = Nodes