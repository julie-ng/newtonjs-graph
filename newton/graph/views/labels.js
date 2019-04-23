const d3 = require('d3')
const View = require('./view')
const Transitions = require('./transitions')
const LabelsUI = require('./styles/label.ui')
// const colors = require('./styles/colors')

const fixedRadius = 12
const defaultFontSize = 14

const calculateFontSize = (node) => {
	// return (node.status === 'up')
	// 	? defaultFontSize + 'px'
	// 	: defaultFontSize + 2 + 'px'
	return defaultFontSize
}

/**
 * Encapsulates what is needed to create the labels of nodes
 * of the network graph
 *
 * @extends View
 */
class Labels extends View {
	/**
	 *
	 * @param {Object} options
	 * @param {String} [options.dom=window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
	}

	render (data) {
		let t1 = d3.transition()
			.duration(250)
			.ease(d3.easeLinear)

		let labels = d3.select(this.dom)
			.select(this.container)
			.selectAll('.label')
			.data(data.nodes, (d) => d.id)

		this.emit('exit', labels.exit())
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

		this.emit('enter', labels.enter())
		labels = labels.enter().append('text')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'central')
				.attr('font-size', calculateFontSize)
			.merge(labels)
				.text((node) => node.label)
				.attr('id', (node) => 'label-' + node.id)
				.attr('class', (node) => 'label status-' + node.status)
				.attr('dx', (node) => node.cx)
				.attr('dy', (node) => node.cy)

		this.emit('update', labels)
		this.labels = labels
	}

	position () {
		this.labels
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)
	}

	highlightNeighbors (n) {
		this.labels.style('fill', (i) => {
			let rel = this.network.getRelationship(i, n)
			return LabelsUI.relationshipColor(i, rel)
		})
	}

	resetStyles () {
		this.labels
			.style('fill', '')
	}
}

module.exports = Labels