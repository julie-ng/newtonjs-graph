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
	network.setMaxListeners(0)

	beforeEach(() => {
		g = new Graph(nodesMockData, linksMockData)
		g.init().bind(network)

		// prevent memory leak in tests
		g.setMaxListeners(0)
	})

	it ('extends EventEmitter', () => {
		expect (Graph.prototype instanceof EventEmitter).toBe(true)
	})

	it ('can emit events', () => {
		expect(typeof g.emit).toEqual('function')
	})

	describe ('Constructor', function () {
		it ('has defaults', () => {
			let graph = new Graph()
			graph.init()
			expect(graph.margin).toEqual(40)
			expect(graph.height).toEqual(550)
			expect(graph.width).toEqual(760)
		})

		it ('accepts options', () => {
			let opts = {
				margin: 1,
				height: 2,
				width: 3
			}
			let graph = new Graph(opts)

			expect(graph.margin).toEqual(1)
			expect(graph.height).toEqual(2)
			expect(graph.width).toEqual(opts.width - opts.margin)
		})

		it ('sets svg', () => {
			let spy = jest.spyOn(d3, 'select')
			let graph = new Graph()
			graph.init()
			expect(spy).toHaveBeenCalled()
			expect(graph.hasOwnProperty('svg')).toBe(true)
		})

		describe ('Views', function () {
			it ('sets nodes', () => {
				expect(g.nodes instanceof Nodes).toBe(true)
			})

			it ('sets links', () => {
				expect(g.links instanceof Links).toBe(true)
			})

			it ('sets labels', () => {
				expect(g.labels instanceof Labels).toBe(true)
			})
		})
	})

	it('is has an init() method', () => {
		expect(typeof g.init).toEqual('function')
	})

	describe ('Chaining', () => {
		it ('init() can be chained', () => {
			expect(g.init()).toEqual(g)
		})

		it ('bind() can be chained', () => {
			expect(g.bind(network)).toEqual(g)
		})
	})

	describe ('Bindings', () => {
		xit ("forwards layout's tick event", () => {})

		describe ('Views', () => {
			let nodesSpy, linksSpy, labelsSpy

			beforeEach(() => {
				g = new Graph(nodesMockData, linksMockData)
				g.init()
				labelsSpy = jest.spyOn(g.labels, 'bindGraph')
				linksSpy = jest.spyOn(g.links, 'bindGraph')
				nodesSpy = jest.spyOn(g.nodes, 'bindGraph')

				g.bind(network)
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