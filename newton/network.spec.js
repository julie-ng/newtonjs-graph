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
	{ source: nodesMockData[0], target: nodesMockData[1] }
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

	describe ('Constructor', function () {
		it ('saves nodes', () => {
			expect(network._nodes).toEqual(nodesMockData)
		})

		it ('calculates links for d3 using array indexes', () => {
			expect(network._links).toEqual(linksMockDataforD3)
		})

		describe ('Getters', () => {
			it ('gets links', () => {
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
})

// not much faster…
// function createNetwork (network) {
// 	network = new Network(nodesMockData, linksMockData, { uid: 'id' })

// 	// prevent memory link in tests
// 	network.setMaxListeners(1)

// 	return network
// }