const d3 = require('d3')
const EventEmitter = require('events').EventEmitter
// const Cola = require('webcola')
const Graph = require('./graph')
const Network = require('./network')
const Labels = require('./components/labels')
const Links = require('./components/links')
const Nodes = require('./components/nodes')

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
	// prevent memory link in tests
	network.setMaxListeners(1)

	beforeEach(() => {
		g = new Graph(nodesMockData, linksMockData)
		g.bind(network)

		// prevent memory link in tests
		g.setMaxListeners(2)
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

		it ('sets cola with a d3 context', () => {
			expect(g.cola.hasOwnProperty('d3Context')).toBe(true)
		})

		it ('sets svg', () => {
			let spy = jest.spyOn(d3, 'select')
			let graph = new Graph()
			expect(spy).toHaveBeenCalled()
			expect(graph.hasOwnProperty('svg')).toBe(true)
		})

		describe ('Components', function () {
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

	it ('uses cola layout', () => {
		let nodesSpy = jest.spyOn(g.cola, 'nodes')
		let linksSpy = jest.spyOn(g.cola, 'links')
		let jaccardSpy = jest.spyOn(g.cola, 'jaccardLinkLengths')
		let startSpy = jest.spyOn(g.cola, 'start')

		g.bind(network)

		expect(nodesSpy).toHaveBeenCalled()
		expect(linksSpy).toHaveBeenCalled()
		expect(jaccardSpy).toHaveBeenCalled()
		expect(startSpy).toHaveBeenCalled()
	})

	describe ('Bindings', () => {
		xit ("forwards cola's tick event", () => {})

		describe ('Components', () => {
			let nodesSpy, linksSpy, labelsSpy

			beforeEach(() => {
				g = new Graph(nodesMockData, linksMockData)
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