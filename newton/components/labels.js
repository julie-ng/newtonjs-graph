const d3 = require('d3')
const Renderer = require('./renderer')
const Transitions = require('./transitions')

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
 *
 * @extends Renderer
 */
class Labels extends Renderer {
	/**
	 *
	 * @param {Object} options
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super()
		this.container = options.container || 'svg'
	}

	render (data) {
		let t1 = d3.transition()
			.duration(250)
			.ease(d3.easeLinear)

		let labels = d3.select(this.container)
			.selectAll('text')
			.data(data.nodes, (d) => 'label-' + d.id)

		labels.exit()
			.transition(t1)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.text, fixedRadius*2.5 + 5)
			.remove()

		let t2 = d3.transition()
				.duration(250)
				.ease(d3.easeLinear)
		labels.transition(t2)
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

	position () {
		this.labels
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)
	}
}

module.exports = Labels