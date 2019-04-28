const d3 = require('d3')
const View = require('./view')

/**
 * Encapsulates what is needed to create the links between
 * nodes of a network graph, namely rendering and positioning
 *
 * @extends View
 */
class Links extends View {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
	}

	render (data) {
		let links = d3.select(this.dom)
			.select(this.container)
			.selectAll('.link')
			.data(data.links, (d) => d.source.id + '-' + d.target.id) // key function

		this.emit('exit', links.exit())
		links.exit()
			.remove()

		this.emit('enter', links.enter())
		links = links.enter()
			.append('line')
			.merge(links)
				.attr('id', (l) => 'link-' + l.source.id + '-' + l.target.id)
				.attr('class', 'link')
				.attr('marker-end', 'url(#end)')

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
		this.links
			.attr('data-rel', (i) => this._getRelationship(i, n))
			.attr('marker-end', (i) => `url(#${this._getRelationship(i, n)})`)
	}

	showRelevantNetwork(n) {
		this.links
			.attr('data-hidden', (i) => this._getRelationship(i, n) === 'has-no-relationship'
				? '1'
				: ''
			)
	}

	resetStyles () {
		this.links
			.attr('data-rel', '')
			.attr('marker-end', '')
			.attr('data-hidden', '')
	}

	_getRelationship (link, n) {
		let rel = ''
		if (link.source === n) {
			rel = 'is-source'
		} else if (link.target === n) {
			rel = 'is-target'
		} else if (this.graph.isDeepSourceLink(link, n)) {
			rel = 'is-deep-source'
		} else {
			rel = 'has-no-relationship'
		}
		return rel
	}
}



module.exports = Links