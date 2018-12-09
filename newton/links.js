const d3 = require('d3')
const SELECTOR = '.link'
const Transitions = require('./transitions')

/**
 * Encapsulates what is needed to create the links between
 * nodes of a network graph, namely rendering and positioning
 */
class Links {
	/**
	 * @param {Object} options
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		this.container = options.container || 'svg'
	}

	bindGraph (graph) {
		graph.on('tick', () => this.position())
		graph.on('update', (data) => this.render(data))
	}

	/**
	 * Renders the links, updating existing and drawing new links.
	 */
	render (data) {
		let t = d3.transition()
			.duration(100)
			.ease(d3.easeLinear)

		let links = d3.select(this.container)
			.selectAll(SELECTOR)
			.data(data.links)

		links.exit()
			.transition(t)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.link)
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