const d3 = require('d3')
const EventEmitter = require('events').EventEmitter
const Cola = require('webcola')
const Graph = require('./graph')
const Network = require('./network')
const Labels = require('./labels')
const Links = require('./links')
const Nodes = require('./nodes')

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

	beforeEach(() => {
		g = new Graph(nodesMockData, linksMockData)
		g.bind(network)
	})

	it ('extends EventEmitter', () => {
		expect (Graph.prototype instanceof EventEmitter).toBe(true)
	})

	it ('can emit events', () => {
		expect(typeof g.emit).toEqual('function')
	})

	describe ('Constructor', function () {
		describe ('Layout', function () {
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

			// it ('sets')
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
})