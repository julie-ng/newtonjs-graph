// class Neighbors {
// 	constructor (linksByIndex) {
// 		this._neighbors = {}
// 		this._mapNeighbors(linksByIndex)
// 	}

// 	_mapNeighbors (links) {
// 		links.forEach((d) => {
// 			this._neighbors[`${d.source.index},${d.target.index}`] = true
// 		})
// 	}

// 	// a & b are nodes
// 	_areNeighbors(a, b) {
// 		return this._isConnectedAsTarget(a, b)
// 			|| this._isConnectedAsSource(a, b)
// 			|| this._isEqual(a, b)
// 	}

// 	_isSourceNeighbor(a, b) {
// 		return this._neighbors[`${a.index},${b.index}`]
// 	}

// 	_isTargetNeighbor(a, b) {
// 		return this._neighbors[`${b.index},${a.index}`]
// 	}

// 	_isEqual(a, b) {
// 		return a.index === b.index
// 	}
// }

// module.exports = Neighbors