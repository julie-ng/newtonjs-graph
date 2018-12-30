const EventEmitter = require('events').EventEmitter
const Network = require('./network')

const nodesMockData = [
	{ id: 'foo', name: 'bar' },
	{ id: 'hello', name: 'world' }
]
const linksMockData = [
	{ source: 'foo', target: 'hello' }
]

const linksMockDataforD3 = [
	{ source: 0, target: 1 } // array indexes
]

describe ('Network', function () {
	let network

	beforeEach(() => {
		network = new Network(nodesMockData, linksMockData, { uid: 'id' })

		// prevent memory link in tests
		network.setMaxListeners(1)
	})

	it ('extends EventEmitter', () => {
		expect (Network.prototype instanceof EventEmitter).toBe(true)
	})

	it ('can emit events', () => {
		expect(typeof network.emit).toEqual('function')
	})

	it ('has a cache', () => {
		expect(typeof network['_cache']).toEqual('object')
	})

	describe ('Constructor', function () {
		it ('saves nodes', () => {
			expect(network._nodes).toEqual(nodesMockData)
		})

		describe('Links', () => {
			it ('saves `uid` referenced links as `_linksMap`', () => {
				expect(network._linksMap).toEqual(linksMockData)
			})

			it ('calculates links for d3 using array indexes', () => {
				expect(network._links).toEqual(linksMockDataforD3)
			})
		})

		describe ('Getters', () => {
			it ('gets links (d3 formatted)', () => {
				expect(network.get('links')).toEqual(linksMockDataforD3)
			})

			it ('gets nodes', () => {
				expect(network.get('nodes')).toEqual(nodesMockData)
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
	})

	describe ('Links', () => {
		describe ('Helpers', () => {
			describe ('_createLinks()', () => {
				it ('resets cache', () => {
					let spy = jest.spyOn(network, '_resetCache')
					network._createLinks()
					expect(spy).toHaveBeenCalledTimes(1)
					spy.mockRestore()
				})
			})

			describe ('_findIndex()', () => {
				describe ('with cache', () => {
					it ('does not search array', () => {
						expect(Object.keys(network._cache).length).not.toEqual(0)
						let spy = jest.spyOn(network._nodes, 'findIndex')
						network._findIndex('hello')
						expect(spy).not.toHaveBeenCalled()
						spy.mockRestore()
					})
				})

				describe ('without cache', () => {
					it ("searches linksMap with Array prototype's `findIndex()`", () => {
						let spy = jest.spyOn(network._nodes, 'findIndex')

						network._resetCache()
						let result = network._findIndex('hello')
						expect(result).toEqual(1)
						expect(spy).toHaveBeenCalledTimes(1)

						spy.mockRestore()
					})
				})
			})
		})
	})
})

// not much faster…
// function createNetwork (network) {
// 	network = new Network(nodesMockData, linksMockData, { uid: 'id' })

// 	// prevent memory link in tests
// 	network.setMaxListeners(1)

// 	return network
// }