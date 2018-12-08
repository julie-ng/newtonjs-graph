class GraphData {
	constructor (opts = {}) {
		// requires nodes, map and key
		this.key = opts.key || 'id'
		this.nodes = opts.nodes
		this.map = opts.map

		this.createLinks()
	}

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