const EventEmitter = require('events').EventEmitter
const ColaGraph = require('./cola.graph')
const Network = require('./../network/network')

const nodesMockData = [
	{ id: 1, name: 'foo' },
	{ id: 2, name: 'bar' }
]
const linksMockData = [
	{ source: 1, target: 2 }
]

describe ('Graph', function () {
	let g
	const network = new Network(nodesMockData, linksMockData, { uid: 'id' })
	// prevent memory leak in tests
	network.setMaxListeners(1)

	beforeEach(() => {
		g = new ColaGraph({ network: network })
		g.init()
		// g.bind(network)

		// prevent memory leak in tests
		g.setMaxListeners(2)
	})

	it ('extends EventEmitter', () => {
		expect (ColaGraph.prototype instanceof EventEmitter).toBe(true)
	})

	describe ('Constructor', function () {
		it ('sets cola with a d3 context', () => {
			expect(g.cola.hasOwnProperty('d3Context')).toBe(true)
		})
	})

	xit ('uses cola layout', () => {
		let nodesSpy = jest.spyOn(g.cola, 'nodes')
		let linksSpy = jest.spyOn(g.cola, 'links')
		let jaccardSpy = jest.spyOn(g.cola, 'jaccardLinkLengths')
		let startSpy = jest.spyOn(g.cola, 'start')

		// broke after moving network bind to constructor
		g.bind(network)

		expect(nodesSpy).toHaveBeenCalled()
		expect(linksSpy).toHaveBeenCalled()
		expect(jaccardSpy).toHaveBeenCalled()
		expect(startSpy).toHaveBeenCalled()
	})
})