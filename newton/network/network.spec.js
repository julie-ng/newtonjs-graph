const EventEmitter = require('events').EventEmitter
const Network = require('./network')
// const Neighbors = require('./neighbors')

describe ('Network', function () {
	let network
	let nodesMockData
	let linksMockData
	let linksByIndex
	let linksByReference
	let dataObjMock



	function resetMockData () {
		nodesMockData = [
			{ id: 'foo', name: 'bar' },
			{ id: 'hello', name: 'world' }
		]

		linksMockData = [
			{ source: 'foo', target: 'hello' }
		]

		linksByIndex = [
			{ source: 0, target: 1 }
		]

		linksByReference = [
			{ source: nodesMockData[0], target: nodesMockData[1] }
		]

		dataObjMock = {
			nodes: nodesMockData,
			links: linksByReference
		}
	}

	beforeEach(() => {
		resetMockData()
		network = new Network(nodesMockData, linksMockData, { uid: 'id' })

		// prevent memory link in tests
		network.setMaxListeners(0)
	})

	describe ('Constructor', function () {
		it ('saves nodes', () => {
			expect(network._nodes).toEqual(nodesMockData)
		})

		describe ('links', () => {
			it ('accepts as indexes', () => {
				let n = new Network(nodesMockData, linksByIndex)
				expect(n._links).toEqual(linksByReference)
			})

			it ('accepts as reference keys', () => {
				expect(network._links).toEqual(linksByReference)
			})
		})
	})

	describe ('Getters', () => {
		it ('can return links', () => {
			expect(network.get('links')).toEqual(linksByReference)
		})

		it ('can return nodes', () => {
			expect(network.get('nodes')).toEqual(nodesMockData)
		})

		it ('can return data object with nodes and links', () => {
			expect(network.get('data')).toEqual(dataObjMock)
		})

		it ('defaults to null', () => {
			expect(network.get()).toBeNull()
		})
	})

	describe ('Unique Identifier `uid` for nodes', () => {
		// for faster tests
		const emptyList = []

		it ('defaults to `id`', () => {
			let n = new Network(emptyList, emptyList)
			expect(n._uid).toEqual('id')
		})

		it ('accepts custom `uid` via option', () => {
			let n = new Network(emptyList, emptyList, { uid: 'foo_id' })
			expect(n._uid).toEqual('foo_id')
		})
	})

	describe ('Nodes', () => {
		it ('has a `findNodeById` method', () => {
			expect(network.findNodeById(nodesMockData[0].id)).toEqual(nodesMockData[0])
		})

		describe ('findeNodeIndex()', () => {
			it ('accepts a node as parameter', () => {
				expect(network.findNodeIndex(nodesMockData[1])).toEqual(1)
			})

			it ('accepts an id as parameter', () => {
				expect(network.findNodeIndex(nodesMockData[1].id)).toEqual(1)
			})
		})

		it ('has a `removeNodeById` method', () => {
			let clone = nodesMockData.slice(0)
			expect(clone.length).toEqual(2)

			network.removeNodeById(clone[0].id)
			clone.splice(0,1)

			expect(network.get('nodes')).toEqual(clone)
		})

		describe ('removeNode()', () => {
			let clone

			beforeEach(() => {
				clone = nodesMockData.slice(0)
				network.removeNode(nodesMockData[0])
			})

			it ('removes the specified node', () => {
				clone.splice(0, 1)
				expect(network.get('nodes')).toEqual(clone)
			})

			it ('also removes the associated links', () => {
				expect(network.get('links')).toEqual([])
			})
		})

		describe ('Sources', () => {
			const a = { id: 'a' }
			const b = { id: 'b' }
			const c = { id: 'c' }
			const d = { id: 'd' }
			const e = { id: 'e' }
			const f = { id: 'f' }
			const nodes = [a, b, c, d, e, f]
			const directNeighbors = [e, d]
			const deepNeighbors = [a, b]

			//        c
			//       /
			// a - b - d - f
			//	    \- e -/

			let links, network

			beforeEach (() => {
				// must use reference keys
				links = [
					{ source: 'a', target: 'b' },
					{ source: 'b', target: 'c' },
					{ source: 'b', target: 'd' },
					{ source: 'b', target: 'e' },
					{ source: 'd', target: 'f' },
					{ source: 'e', target: 'f' }
				]
				network = new Network(nodes, links)
			})

			it ('find source nodes', () => {
				expect(network.findSources(b)).toEqual([a])
				expect(network.findSources(f)).toEqual([d, e])
			})

			it ('finds ancestor source nodes', () => {
				let ancestors = network.findDeepSources(f)
				expect(ancestors.includes(directNeighbors[0])).toBe(false)
				expect(ancestors.includes(directNeighbors[1])).toBe(false)
				expect(ancestors.includes(deepNeighbors[0])).toBe(true)
				expect(ancestors.includes(deepNeighbors[1])).toBe(true)
			})

			it ('can compare for deep ancestors', () => {
				expect(network.isDeepSourceNeighbor(d, f)).toBe(false)
				expect(network.isDeepSourceNeighbor(e, f)).toBe(false)
				expect(network.isDeepSourceNeighbor(a, f)).toBe(true)
				expect(network.isDeepSourceNeighbor(b, f)).toBe(true)
				expect(network.isDeepSourceNeighbor(c, f)).toBe(false)
			})
		})
	})

	describe ('Links', () => {
		it ('has a `findLinks` method', () => {
			expect(network.findLinks(nodesMockData[0])).toEqual(linksByReference)
			expect(network.findLinks(nodesMockData[1])).toEqual(linksByReference)
		})

		describe ('removeLinks()', () => {
			it ('has a `removeLinks` method', () => {
				network.removeLinks(nodesMockData[0])
				expect(network.get('links')).toEqual([])
			})

			it ('does not remove, i.e. affect nodes', () => {
				network.removeLinks(nodesMockData[1])
				expect(network.get('links')).toEqual([])
				expect(network.get('nodes')).toEqual(nodesMockData)
			})
		})

		it ('removes broken links', () => {
			let a = { id: 'a' }
			let b = { id: 'b' }
			let nodes = [a, b]
			let links = [
				{ source: 0, target: 1 }, // valid
				{ source: 1, target: 2 }  // invalid
			]
			let n = new Network(nodes, links)
			expect(n._links).toEqual([{ source: a, target: b }])
		})
	})

	describe ('Events', () => {
		it ('extends EventEmitter', () => {
			expect (Network.prototype instanceof EventEmitter).toBe(true)
		})

		it ('can emit events', () => {
			expect(typeof network.emit).toEqual('function')
		})

		it ('publishes when removing a node', () => {
			let mock = {
				listener: function (network) { return }
			}
			let spy = jest.spyOn(mock, 'listener')
			network.on('update', mock.listener)
			network.removeNodeById('foo')
			expect(spy).toHaveBeenCalledTimes(1)
			expect(spy).toHaveBeenCalledWith({
				nodes: network.get('nodes'),
				links: network.get('links')
			})
		})
	})
})
