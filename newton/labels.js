const d3 = require('d3')
const fixedRadius = 12
const defaultFontSize = 16

const calculateFontSize = (node) => {
	return (node.status === 'up')
		? defaultFontSize + 'px'
		: defaultFontSize + 4 + 'px'
}

class Labels {
	constructor (data, opts = {}) {
		this.setData(data)
		this.container = opts.container
	}

	setData (data) {
		this.data = data.nodes
	}
	updateData (data) {
		this.setData(data)
	}

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

	position () {
		this.labels
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)
	}
}

module.exports = Labels