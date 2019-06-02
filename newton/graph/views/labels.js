const d3 = require('d3')
const View = require('./view')

const fixedRadius = 12

/**
 * Encapsulates what is needed to draw `<text>` to represent labels of nodes
 * of the network graph.
 *
 * @extends View
 */
class Labels extends View {
	/**
	 *
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by d3.js
	 */
	constructor (options = {}) {
		super(options)
	}

	/**
	 * Renders labels based on node data.
	 *
	 * @param {Object} data
	 */
	render (data) {
		let labels = d3.select(this.dom)
			.select(this.container)
			.selectAll('.label')
			.data(data.nodes, (d) => d.id)

		/**
		 * An `Array` of exiting labels, i.e. labels to be added per d3.js general update pattern.
		 *
		 * @event Labels#exit
		 * @type {Array}
		 */
		this.emit('exit', labels.exit())
		labels.exit()
			.remove()

		/**
		 * An `Array` of entering Labels, i.e. labels to be added per d3.js general update pattern.
		 *
		 * @event Labels#enter
		 * @type {Array}
		 */
		this.emit('enter', labels.enter())
		labels = labels
			.enter()
				.append('text')
			.merge(labels)
				.text((node) => node.label)
				.attr('id', (node) => 'label-' + node.id)
				.attr('class', (node) => 'label status-' + node.status)
				.attr('dx', (node) => node.cx)
				.attr('dy', (node) => node.cy)

		/**
		 * An `Array` of combined existing and new Labels, per d3.js general update pattern.
		 *
		 * @event Labels#update
		 * @type {Array}
		 */
		this.emit('update', labels)
		this.selection = labels
	}

	position () {
		this.selection
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)
	}
}

module.exports = Labels