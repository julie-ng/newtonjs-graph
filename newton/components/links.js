const d3 = require('d3')
const Renderer = require('./renderer')
const Transitions = require('./transitions')

const SELECTOR = '.link'
/**
 * Encapsulates what is needed to create the links between
 * nodes of a network graph, namely rendering and positioning
 *
 * @extends Renderer
 */
class Links extends Renderer {
	/**
	 * @param {Object} options
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super()
		this.container = options.container || 'svg'
	}

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

	position () {
		this.links
			.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y)
	}
}

module.exports = Links