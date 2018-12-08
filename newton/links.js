const d3 = require('d3')
const SELECTOR = '.link'
const Transitions = require('./transitions')

/**
 * Encapsulates what is needed to create the links between
 * nodes of a network graph, namely rendering and positioning
 */
class Links {
	/**
	 * @param {Object} data
	 * @param {Array} data.nodes - Array of node data
	 * @param {Object} opts
	 * @param {d3Element} opts.container - d3 element from `select()`
	 */
	constructor (data, opts) {
		console.log('new Links()')
		this.setData(data)
		this.container = opts.container
	}

	/**
	 * A small wrapper until the data interface stabilizes, i.e. for the moment, `.links` property is expected to contain links data.
	 *
	 * Theoretically necessary to have other data, for advanced visualizations etc.
	 *
	 * @private
	 * @param {Array} data.links - list of links
	 */
	setData (data) {
		this.data = data.links
	}

	/**
	 * Updates node data
	 *
	 * @param {Object} data
	 */
	updateData (data) {
		this.setData(data)
	}

	/**
	 * Renders the links, updating existing and drawing new links.
	 * TODO: return self
	 */
	render () {
		let t = d3.transition()
		.duration(100)
		.ease(d3.easeLinear)

		let links = this.container.selectAll(SELECTOR)
		.data(this.data)

		links.exit()
			.transition(t)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.line)
			.remove()

		links = links.enter()
			.append('line')
			.merge(links)
				.attr('class', 'link')
				.style('stroke-width', 1)

		this.links = links
	}

	/**
	 * Calculates link positions using current data.
	 * Actual positioning is done in the `Graph` class.
	 */
	position () {
		this.links
			.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y)
	}
}

module.exports = Links