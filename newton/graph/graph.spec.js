const d3 = require('d3')
const EventEmitter = require('events').EventEmitter
const Graph = require('./graph')
const Network = require('./../network/network')
const Labels = require('./views/labels')
const Links = require('./views/links')
const Nodes = require('./views/nodes')

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
		g = new Graph({ network: network })
		g.init()
		// g.bind(network)

		// prevent memory leak in tests
		g.setMaxListeners(2)
	})

	it ('extends EventEmitter', () => {
		expect (Graph.prototype instanceof EventEmitter).toBe(true)
	})

	it('is has an init() method', () => {
		expect(typeof g.init).toEqual('function')
	})

	it ('init() can be chained', () => {
		expect(g.init()).toEqual(g)
	})

	it ('sets svg', () => {
		let spy = jest.spyOn(d3, 'select')
		let graph = new Graph({ network: network })
		graph.init()
		expect(spy).toHaveBeenCalled()
		expect(graph.hasOwnProperty('svg')).toBe(true)
	})

	describe ('Constructor', function () {
		it ('has defaults', () => {
			let graph = new Graph({ network: network })
			graph.init()
			expect(graph.margin).toEqual(40)
			expect(graph.height).toEqual(550)
			expect(graph.width).toEqual(760)
		})

		it ('accepts options', () => {
			let opts = {
				margin: 1,
				height: 2,
				width: 3,
				network: network,
				scaleExtent: [1, 5]
			}
			let graph = new Graph(opts)

			expect(graph.margin).toEqual(1)
			expect(graph.height).toEqual(2)
			expect(graph.width).toEqual(opts.width - opts.margin)
		})
	})

	// xit ('uses cola layout', () => {
	// 	let nodesSpy = jest.spyOn(g.cola, 'nodes')
	// 	let linksSpy = jest.spyOn(g.cola, 'links')
	// 	let jaccardSpy = jest.spyOn(g.cola, 'jaccardLinkLengths')
	// 	let startSpy = jest.spyOn(g.cola, 'start')

	// 	// broke after moving network bind to constructor
	// 	g.bind(network)

	// 	expect(nodesSpy).toHaveBeenCalled()
	// 	expect(linksSpy).toHaveBeenCalled()
	// 	expect(jaccardSpy).toHaveBeenCalled()
	// 	expect(startSpy).toHaveBeenCalled()
	// })

	describe ('Views', () => {
		xit ("forwards layout's tick event", () => {})
		it ('sets nodes', () => {
			expect(g.nodes instanceof Nodes).toBe(true)
		})

		it ('sets links', () => {
			expect(g.links instanceof Links).toBe(true)
		})

		it ('sets labels', () => {
			expect(g.labels instanceof Labels).toBe(true)
		})

		describe ('Bindings', () => {
			let nodesSpy, linksSpy, labelsSpy

			beforeEach(() => {
				g = new Graph({ network: network })
				labelsSpy = jest.spyOn(g.labels, 'bindGraph')
				linksSpy = jest.spyOn(g.links, 'bindGraph')
				nodesSpy = jest.spyOn(g.nodes, 'bindGraph')

				g.init()
			})

			afterEach(() => {
				labelsSpy.mockRestore()
				linksSpy.mockRestore()
				nodesSpy.mockRestore()
			})

			it ('binds nodes', () => {
				expect(nodesSpy).toHaveBeenCalledTimes(1)
			})

			it ('binds links', () => {
				expect(linksSpy).toHaveBeenCalledTimes(1)
			})

			it ('binds labels', () => {
				expect(labelsSpy).toHaveBeenCalledTimes(1)
			})
		})
	})
})