const d3 = require('d3')
const View = require('./view')
const Transitions = require('./transitions')
const LinksUI = require('./styles/links.ui')

const SELECTOR = '.link'
/**
 * Encapsulates what is needed to create the links between
 * nodes of a network graph, namely rendering and positioning
 *
 * @extends View
 */
class Links extends View {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom=window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
	}

	render (data) {
		let t = d3.transition()
			.duration(100)
			.ease(d3.easeLinear)

		let links = d3.select(this.dom)
			.select(this.container)
			.selectAll(SELECTOR)
			.data(data.links, (d) => 'link-' + d.source.id + '-' + d.target.id)

		this.emit('exit', links.exit())
		links.exit()
			.transition(t)
				.call(Transitions.fadeOut)
				.call(Transitions.FadeDown.link)
			.remove()

		this.emit('enter', links.enter())
		links = links.enter()
			.append('line')
			.merge(links)
				.attr('class', 'link')

		this.emit('update', links)
		this.links = links
	}

	position () {
		this.links
			.attr('x1', (d) => d.source.x)
			.attr('x2', (d) => d.target.x)
			.attr('y1', (d) => d.source.y)
			.attr('y2', (d) => d.target.y)
	}

	highlightNeighbors (n) {
		// console.log(`links.highlightNeighbors(${n.label})`)

		this.links
			.style('stroke-width', 1)
			.style('stroke', (i) => {
				let rel
				if (i.source === n) {
					rel = 'is-source'
				} else if (i.target === n) {
					rel = 'is-target'
				} else {
					rel = 'has-no-relationship'
				}
				return LinksUI.relationshipColor(i, rel)
			})
	}

	resetStyles () {
		this.links.attr('style', '')
	}
}

module.exports = Links