const d3 = require('d3')
const fixedRadius = 12
const defaultFontSize = 16

const calculateFontSize = (node) => {
	return (node.status === 'up')
		? defaultFontSize + 'px'
		: defaultFontSize + 4 + 'px'
}

/**
 * Encapsulates what is needed to create the labels of nodes
 * of the network graph
 */
class Labels {
	/**
	 *
	 * @param {Object} data
	 * @param {Array} data.nodes - list of nodes
	 * @param {Object} opts
	 * @param {d3Element} opts.container - d3 element from `select()`
	 */
	constructor (data, opts = {}) {
		this.setData(data)
		this.container = opts.container
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
	 * Updates Label data
	 *
	 * @param {Object} data
	 */
	updateData (data) {
		this.setData(data)
	}

	/**
	 * Renders the labels, updating existing and drawing new labels.
	 * TODO: remove old labels, return self
	 */
	render () {
		let t = d3.transition()
		.duration(250)
		.ease(d3.easeLinear)

		let labels = this.container.selectAll('text')
			.data(this.data)

		labels.transition(t)
			.attr('font-size', calculateFontSize)

		labels = labels.enter().append('text')
			.text((node) => node.label)
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'central')
				.attr('font-size', calculateFontSize)
			.merge(labels)
				.attr('dx', (node) => node.cx)
				.attr('dy', (node) => node.cy)
				.attr('class', (node) => 'label status-' + node.status)

		this.labels = labels
	}

	/**
	 * Calculates label positions using current data.
	 * Actual positioning is done in the `Graph` class.
	 */
	position () {
		this.labels
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)
	}
}

module.exports = Labels