const EventEmitter = require('events').EventEmitter

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
 * This wrapper lets you calculate links dynamically based on a reference key, e.g. `id`, so we can use this kind of structure instead:
 *
 * ```
 * const links = [
 * 	{ source: 'A', target: 'B' },
 * 	{ source: 'frontend', target: 'middleware' }
 * ]
 * ```
 *
 */
class Network extends EventEmitter {
	/**
	 * Creates a Network
	 *
	 * @param {Array} nodes - Array of Nodes
	 * @param {Array} linksMap - Array of Relationships between nodes using the reference key
	 * @param {Object} options
	 * @param {String} options.uid - name of the property of your unique identifier, e.g. 'id'
	 */
	constructor (nodes, linksMap, options = {}) {
		super()

		/**
		 * Array that maps relationships between nodes using
		 * references to array indexes (original d3.js interface).
		 * @private
		 */
		this._links = []

		/**
		 * Array of nodes. See d3.js documentation.
		 */
		this._nodes = nodes

		/**
		 * Unique identifier to reference nodes when calculating links
		 *
		 * @private
		 */
		this._uid = options.uid || 'id'
		this._createLinks(linksMap)
	}

	/**
	 * Fetches network attributes
	 * Currently used for first binding or rendering
	 *
	 * @param {String} attr - attribute to return. Valid attributes are `links` or `nodes`.
	 * @return {String|null}
	 */
	get (attr) {
		if (attr === 'data')
			return { links: this._links, nodes: this._nodes }
		else if (attr === 'links')
			return this._links
		else if (attr === 'nodes')
			return this._nodes
		else
			return null
	}

	demoDelete (id) {
		let node = this.findNodeById(id)
		this.removeNode(node)
		this._publish('update')
	}

	/**
	 * @param {String} id
	 * @return {Object} node data object
	 */
	findNodeById (id) {
		return this._nodes.find((n) => n[this._uid] === id)
	}

	/**
	 * Finds index of node either by it's unique identifier, e.g. `id` or the node data object itself.
	 * @param {String|Object} node - id or data object
	 * @return {Integer} index of matched node or `-1` if not found
	 */
	findNodeIndex (node) {
		let id = (typeof node === 'object')
			? node[this._uid]
			: node
		return this._nodes.findIndex((n) => n[this._uid] === id)
	}

	/**
	 * Removes node and its links from the graph
	 * @param {Object} node - node data object
	 */
	removeNode (node) {
		const i = this.findNodeIndex(node)
		this.removeNodeByIndex(i)
		this.removeLinks(node)
	}

	/**
	 * Removes a node by its index in the network's `nodes` array.
	 * @param {Integer} index
	 */
	removeNodeByIndex (index) {
		this._nodes.splice(index, 1)
	}

	/**
	 * Finds links a given node has. Example results are `[{source: node, target: node}]`
	 *
	 * @param {Object} node - node data object
	 * @return {Array} of link objets
	 */
	findLinks (node) {
		let links = []
		this._links.forEach((link, i) => {
			if (link.source === node || link.target === node) {
				links.push(link)
			}
		})
		return links
	}

	/**
	 * Removes links for a given node
	 *
	 * @param {Object} node - node data object
	 */
	removeLinks (node) {
		let links = this._links
		for (let i = links.length; i--; i >= 0) {
			if (links[i].source === node || links[i].target === node) {
				links.splice(i, 1)
			}
		}
	}

	/**
	 * Emits an event
	 *
	 * @private
	 * @param {String} eventName - Event Name, e.g. `update`
	 */
	_publish (eventName) {
		this.emit(eventName, {
			nodes: this._nodes,
			links: this._links
		})
	}

	/**
	 * Re-calculates links via array indicies for D3.
	 * This should be invoked if you update your data and
	 * nodes and/or relationships might have changed.
	 *
	 * @private
	 */
	_createLinks (linksMap) {
		linksMap.forEach((l) => {
			this._links.push({
				source: this.findNodeById(l.source),
				target: this.findNodeById(l.target),
			})
		})
	}
}

module.exports = Network