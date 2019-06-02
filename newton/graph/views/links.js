const d3 = require('d3')
const View = require('./view')

/**
 * @typedef {Object} Link
 *
 * A link is an `Object` with references to source and target {@link Node}s. Consider the following
 *
 * ```javascript
 * const nodes = [
 * 	{ id: 'a', label: 'Frontend' },
 * 	{ id: 'b', label: 'Backend' },
 * 	{ id: 'c', label: 'Database' },
 * ]
 *
 * const links = [
 * 	{ source: 'a', target: 'b' },	// Frontend requires Backend
 * 	{ source: 'b', target: 'c' }	// Backend requires Database
 * ]
 * ```
 * Note that identifiers must be `String`s.
 *
 * @property {String} source - Reference identifier to source node
 * @property {String} target - Reference identifier to target node
 */

/**
 * Encapsulates what is needed to draw `<line>`s to represent the links between
 * nodes of a network graph, namely rendering and positioning.
 *
 * Styling, including colors and arrowheads are accomplished using CSS on the selectors, including
 * - `[data-rel="is-source"]`
 * - `[data-rel="is-target"]`
 * - `[data-rel="is-deep-source"]`
 * - `[data-rel="has-no-relationship"]`
 *
 * @extends View
 */
class Links extends View {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by d3.js
	 */
	constructor (options = {}) {
		super(options)
	}

	/**
	 * Renders links, adding `<line>`s to our `<svg>` canvas.
	 *
	 * @param {Object} data
	 */
	render (data) {
		let links = d3.select(this.dom)
			.select(this.container)
			.selectAll('.link')
			.data(data.links, (d) => d.source.id + '-' + d.target.id) // key function

		/**
		 * An `Array` of exiting links, i.e. links to be removed per d3.js general update pattern.
		 *
		 * @event Links#exit
		 * @type {Array}
		 */
		this.emit('exit', links.exit())
		links.exit()
			.remove()

		/**
		 * An `Array` of entering links, i.e. links to be added per d3.js general update pattern.
		 *
		 * @event Links#enter
		 * @type {Array}
		 */
		this.emit('enter', links.enter())
		links = links.enter()
			.append('line')
			.merge(links)
				.attr('id', (l) => 'link-' + l.source.id + '-' + l.target.id)
				.attr('class', 'link')
				.attr('marker-end', 'url(#end)')

		/**
		 * An `Array` of combined existing and new links, per d3.js general update pattern.
		 *
		 * @event Links#update
		 * @type {Array}
		 */
		this.emit('update', links)
		this.selection = links
	}

	position () {
		this.selection
			.attr('x1', (d) => d.source.x)
			.attr('x2', (d) => d.target.x)
			.attr('y1', (d) => d.source.y)
			.attr('y2', (d) => d.target.y)
	}

	/**
	 * Classifies all links, based on relationship to node parameter.
	 * CSS styling is based on `data-rel` attribute set on the `<line>` element.
	 *
	 * @param {Node} node
	 */
	setRelationships (node) {
		this.selection.attr('data-rel', (i) => this._getRelationship(i, node))
	}

	/**
	 * Hides all links unrelated to node parameter.
	 * CSS styling is based on `data-hidden` attribute set on the `<line>` element.
	 *
	 * @param {Node} node
	 */
	hideUnrelated (node) {
		this.selection.attr('data-hidden', (i) => this._setHidden(i, node))
	}

	/**
	 * Adds directional arrows to indicate source-target relationship between nodes.
	 *
	 * @param {Node} node
	 * @param {Object} [options={}]
	 * @param {Boolean} [options.color=true]
	 * @param {Boolean} [options.showAll=true] - If set to `true`, this view will draw all arrows, even if link has no relationship to `node`.
	 */
	showArrows (node, options = {}) {
		this.selection.attr('marker-end', (i) => this._getMarkerEnd(i, node, options))
	}

	/**
	 * Shows all Links, resetting the `data-hidden` attribute used for CSS styling.
	 */
	showAll () {
		this.selection.attr('data-hidden', null)
	}

	/**
	 * Reset all styles, e.g. colors and removes arrowheads.
	 */
	resetStyles () {
		super.resetStyles()
		this.selection.attr('marker-end', '')
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
		} else if (this.graph.network.isDeepSourceLink(link, n)) {
			rel = 'is-deep-source'
		} else {
			rel = 'has-no-relationship'
		}
		return rel
	}
}

module.exports = Links