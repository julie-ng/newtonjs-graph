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
		 * Unique identifier to reference nodes when calculating links
		 *
		 * @property {String} _uid
		 * @private
		 */
		this._uid = options.uid || 'id'

		/**
		 * Array that maps relationships between nodes using
		 * references to array indexes (original d3.js interface).
		 * @property {Array} _links
		 * @private
		 */
		this._links = []

		/**
		 * Array of nodes. See d3.js documentation.
		 * @property {Array} _nodes
		 * @private
		 */
		this._nodes = nodes

		this.resetData({
			nodes: nodes,
			links: linksMap,
			publish: false
		})
	}

	/**
	 * Resets entire network data set
	 *
	 * @param {Object} params
	 * @param {Array} params.nodes - nodes
	 * @param {Array} params.links - links
	 * @param {Boolean} [params.linksById = true] - links array maps to nodes via `id` key
	 * @param {Boolean} [params.publish = true] - publish event after resetting data?
	 */
	resetData (params = {}) {
		const defaults = {
			linksById: true,
			publish: true
		}
		params = Object.assign({}, defaults, params)
		console.log(`network.resetData()`, params)

		this._nodes = params.nodes

		if (params.linksById) {
			this._createLinks(params.links)
		}
		if (params.hasOwnProperty('linksByIndex') && params.linksByIndex === true) {
			this._links = params.links
		}

		this._mapNeighbors()

		if (params.publish) {
			this._publish('update')
		}
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

	updateNode (n, attrs) {
		let node = (typeof n === 'string')
			? this.findNodeById(n)
			: n
		Object.assign(node, attrs)
		this._publish('update')
		return this
	}

	/**
	 * Removes node and its links from the graph
	 * @param {Object} node - node data object
	 */
	removeNode (node) {
		const i = this.findNodeIndex(node)
		this._nodes.splice(i, 1)
		this.removeLinks(node)
	}

	/**
	 * Removes node by id
	 * @param {String} id
	 */
	removeNodeById (id) {
		let node = this.findNodeById(id)
		this.removeNode(node)
		this._publish('update')
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
		// console.log(`network.publish(${eventName})`)
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
		this._links = []
		linksMap.forEach((l) => {
			this._links.push({
				source: this.findNodeById(l.source),
				target: this.findNodeById(l.target),
			})
		})
	}

	// ----- Neighbors -----

	_mapNeighbors () {
		this._neighbors = {}
		this._links.forEach((d) => {
			let key = this.findNodeIndex(d.source)
				+ ','
				+ this.findNodeIndex(d.target)
			// console.log('key: ', key)
			this._neighbors[key] = true
		})
	}

	// s & t are nodes
	areNeighbors (s, t) {
		return this.isTargetNeighbor(s, t)
			|| this.isSourceNeighbor(s, t)
			|| this.isEqualNode(s, t)
	}

	isSourceNeighbor (s, t) {
		return this._neighbors[`${s.index},${t.index}`] !== undefined
	}

	isDeepSourceNeighbor (s, t) {
		// console.log(`isDeepSourceNeighbor(${s.label}, ${t.label})?`);

		let sources = this.findDeepSources(t)
		// console.log(`Deep sources of ${t.label}:`)
		// console.table(sources)
		return sources.length > 0
			? sources.includes(s)
			: false
	}

	isTargetNeighbor (s, t) {
		return this._neighbors[`${t.index},${s.index}`]
	}

	isEqualNode (s, t) {
		return s.index === t.index
	}

	findSources (n) {
		let sources = []
		this._links.forEach((i) => {
			if (i.target === n) {
				sources.push(i.source)
			}
		})
		return sources
	}

	findDeepSources (n, sources = [], level = 0) {
		// console.log(`-- findDeepSources(${n.label}) --`)
		this._links.forEach((l) => {
			if (l.target === n) {
				if (level !== 0) {
					sources.push(l.source)
				}

				let parents = this.findSources(n)
				if (parents.length === 0) { return }
				parents.forEach((a) => this.findDeepSources(a, sources, level + 1))
			}
		})

		const uniques = [...new Set(sources)]
		return uniques
	}

	isDeepSourceLink (link, n) {
		let sourceIsASource = this.isDeepSourceNeighbor(link.source, n)
		let targetIsASource = this.isDeepSourceNeighbor(link.target, n) || this.isSourceNeighbor(link.target, n)
		let isDeepLink = sourceIsASource && targetIsASource
		// console.log(`Does [${link.source.label}] -> [${link.target.label}] deep link to [${n.label}]? `, isDeepLink)
		return isDeepLink
	}

	getRelationship (node, neighbor) {
		let rel = ''
		if (this.isTargetNeighbor(node, neighbor) && this.isSourceNeighbor(node, neighbor)) {
			rel = 'is-source-and-target'
		} else if (this.isSourceNeighbor(node, neighbor)) {
			rel = 'is-source'
		} else if (this.isDeepSourceNeighbor(node, neighbor)) {
			rel = 'is-deep-source'
		} else if (this.isTargetNeighbor(node, neighbor)) {
			rel = 'is-target'
		} else if (this.isEqualNode(node, neighbor)) {
			rel = 'is-same-node'
		} else {
			rel = 'has-no-relationship'
		}
		return rel
	}
}

module.exports = Network