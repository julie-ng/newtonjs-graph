const EventEmitter = require('events').EventEmitter
const Network = require('./network')

describe ('Network', function () {
	let network
	let nodesMockData
	let linksMockData
	let linksMockDataforD3
	let dataObjMock

	function resetMockData () {
		nodesMockData = [
			{ id: 'foo', name: 'bar' },
			{ id: 'hello', name: 'world' }
		]

		linksMockData = [
			{ source: 'foo', target: 'hello' }
		]

		linksMockDataforD3 = [
			{ source: nodesMockData[0], target: nodesMockData[1] }
		]

		dataObjMock = {
			nodes: nodesMockData,
			links: linksMockDataforD3
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

		it ('calculates links for d3 using array indexes', () => {
			expect(network._links).toEqual(linksMockDataforD3)
		})
	})

	describe ('Getters', () => {
		it ('can return links', () => {
			expect(network.get('links')).toEqual(linksMockDataforD3)
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
	})

	describe ('Links', () => {
		it ('has a `findLinks` method', () => {
			expect(network.findLinks(nodesMockData[0])).toEqual(linksMockDataforD3)
			expect(network.findLinks(nodesMockData[1])).toEqual(linksMockDataforD3)
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
