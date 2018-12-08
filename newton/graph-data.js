/**
 * Data Wrapper for Graphs, useful for dynamically calculating links between nodes.
 * As describe in the [WebCola Wiki](https://github.com/tgdwyer/WebCola/wiki/General-API-notes), the layout adapter
 * follows [d3.layout.force](https://github.com/mbostock/d3/wiki/Force-Layout) conventions and joins nodes via (JavaScript) reference or array indexes, which normally looks like this:
 *
 * ```
 * const links = [
 * 	{ source: 0, target: 1 },
 * 	{ source: 3, target: 5 }
 * ]
 * ```
 *
 * This wrapper lets you calculate links dynamically based on a reference key, e.g. `id`, so we can use this structure instead:
 *
 * ```
 * const links = [
 * 	{ source: 'A', target: 'B' },
 * 	{ source: '1', target: '2' }
 * ]
 * ```
 *
 */
class GraphData {

	/**
	 * Creates a GraphData
	 *
	 * @param {String} opts.key - name of the property of your unique identifier, e.g. 'id'
	 * @param {Array} opts.nodes - Array of nodes
	 * @param {Array} opts.map - Array of links using reference key
	 */
	constructor (opts = {}) {
		// requires nodes, map and key
		this.key = opts.key || 'id'
		this.nodes = opts.nodes
		this.map = opts.map

		this.createLinks()
	}

	/**
	 * Re-calculates links via array indicies for D3.
	 * This should be invoked if you update your data and
	 * nodes and/or relationships might have changed.
	 */
	createLinks () {
		this.cache = {}
		let links = []
		this.map.forEach((l) => {
			links.push({
				source: this.findNode(l.source),
				target: this.findNode(l.target),
			})
		})

		this.links = links
	}

	/**
	 * Finds and returns index of a Node. Returns `-1` if not found.
	 * TODO: make private
	 *
	 * @private
	 * @param {String} id - value to match against key, e.g. `app1` or `bob`
	 * @returns {integer} i - index of Node
	 */
	findNode (id) {
		if (this.cache.hasOwnProperty(id)) {
			return this.cache[id]
		} else {
			// TODO: throw/catch node not found
			let i = this.nodes.findIndex((n) => n[this.key] === id )
			this.cache[id] = i
			return i
		}
	}
}

module.exports = GraphData