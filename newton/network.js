const EventEmitter = require('events').EventEmitter
const _uid = Symbol('uid')
const _cache = Symbol('cache')
const _nodes = Symbol('nodes')
const _links = Symbol('links')
const _relationships = Symbol('relationships')
const _findIndex = Symbol('findIndex')
const _createLinks = Symbol('createLinks')
const _publish = Symbol('publish')

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
class Network extends EventEmitter {
	/**
	 * Creates a Network
	 *
	 * @param {Array} nodes - Array of Nodes
	 * @param {Array} relationships - Array of Relationships between nodes using the reference key
	 * @param {Object} options
	 * @param {String} options.uid - name of the property of your unique identifier, e.g. 'id'
	 */
	constructor (nodes, relationships, options = {}) {
		super()
		this[_cache] = {}
		this[_links] = []

		this[_nodes] = nodes
		this[_relationships] = relationships
		this[_uid] = options.uid || 'id'

		this[_createLinks]()
	}

	/**
	 * Fetches network attributes
	 * Currently used for first binding or rendering
	 *
	 * @param {String} attr - attribute to return. Valid attributes are `links` or `nodes`.
	 * @return {String|null}
	 */
	get (attr) {
		if (attr === 'links')
			return this[_links]
		else if (attr === 'nodes')
			return this[_nodes]
		else
			return null
	}

	/**
	 * Resets cache used to calculate links from relationships for d3.js
	 */
	resetCache () {
		this[_cache] = {}
	}

	// --------------- MOCK --------------- //

	triggerUpdate () {
		this.emit('update', {
			nodes: this[_nodes],
			links: this[_links]
		})
	}

	demoUpdate () {
		let nodes = this[_nodes]
		nodes[nodes.length-2].status = 'down'

		this[_publish]('update')
	}

	demoDelete () {
		this[_nodes].pop()
		this[_links].pop()

		this[_publish]('update')
	}

	// --------------- PRIVATE --------------- //

	/**
	 * Emits an event
	 *
	 * @private
	 * @param {String} eventName - Event Name, e.g. `update`
	 */
	[_publish] (eventName) {
		this.emit(eventName, {
			nodes: this[_nodes],
			links: this[_links]
		})
	}

	/**
	 * Finds and returns index of a Node. Returns `-1` if not found.
	 * TODO: throw/catch node not found
	 *
	 * @private
	 * @param {String} id - value to match against key, e.g. `app1` or `bob`
	 * @returns {Integer} i - index of Node
	 */
	[_findIndex] (id) {
		if (this[_cache].hasOwnProperty(id)) {
			return this[_cache][id]
		} else {
			let i = this[_nodes].findIndex((n) => n[this[_uid]] === id )
			this[_cache][id] = i
			return i
		}
	}

	/**
	 * Re-calculates links via array indicies for D3.
	 * This should be invoked if you update your data and
	 * nodes and/or relationships might have changed.
	 *
	 * @private
	 */
	[_createLinks] () {
		this.resetCache()

		let links = []
		this[_relationships].forEach((l) => {
			links.push({
				source: this[_findIndex](l.source),
				target: this[_findIndex](l.target),
			})
		})

		this[_links] = links
	}
}

module.exports = Network