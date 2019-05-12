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

	setRelationships (n) {
		this.links.attr('data-rel', (i) => this._getRelationship(i, n))
	}

	hideUnrelated (n) {
		this.links.attr('data-hidden', (i) => this._setHidden(i, n))
	}

	showArrows (n, opts = {}) {
		this.links.attr('marker-end', (i) => this._getMarkerEnd(i, n, opts))
	}

	showAll () {
		this.links.attr('data-hidden', null)
	}

	resetStyles () {
		this.links
			.attr('data-rel', '')
			.attr('marker-end', '')
			.attr('data-hidden', '')
	}

	_setHidden (i, n) {
		return (this._getRelationship(i, n) === 'has-no-relationship')
			? '1'
			: ''
	}

	_getMarkerEnd (link, n, opts = {}) {
		let defaults = {
			color: true,
			showAll: true,
		}
		opts = Object.assign({}, defaults, opts)

		let relationship 	  = this._getRelationship(link, n)
		let hasRelationship	= (relationship !== 'has-no-relationship')
		let defaultStyle 		= 'url(#is-default)'
		let unrelatedStyle 	= (opts.showAll) ? defaultStyle : ''
		let colorStyle 			= `url(#${relationship})`

		if (hasRelationship) {
			return (opts.color)
				? colorStyle
				: defaultStyle
		}

		return unrelatedStyle
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