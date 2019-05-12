const d3 = require('d3')
const Nodes = require('./nodes')

const nodesArray = [
	{ id: '1', name: 'foo' },
	{ id: '2', name: 'bar' }
]

const nodesData = {
	nodes: nodesArray
}

const JSDOM = require('jsdom').JSDOM
const markup = `<html><body><svg></svg></body></html>`
const sharedDom = new JSDOM(markup)

describe ('Nodes', () => {
	let nodes

	beforeEach(() => {
		nodes = new Nodes({
			adapter: '',
			dom: sharedDom.window.document, // different DOMs for parallel tests
			container: 'svg'
		})

		// prevent memory link in tests
		nodes.setMaxListeners(1)
	})

	it ('has a constructor', () => {
		expect(new Nodes()).not.toEqual(undefined)
	})

	describe ('render()', () => {
		it ('checks parameter', () => {
			expect(() => {
				nodes.render(nodesArray)
			}).toThrow()

			expect(() => {
				nodes.render(nodesData)
			}).not.toThrow()
		})

		// it.skip ('calls animate()')

		describe ('uses general update pattern', () => {
			// GENERAL UPDATE PATTERN:
			// We have to test via our events because `nodes` variable
			// is set on every render() call so we cannot spy on it

			const updatedNodesArray = [
				{ id: '1', name: 'foo' },
				{ id: '3', name: 'hello world' }
			]

			const removedNode = { id: '2', name: 'bar' }

			// Note: `beforeEach()` is not asynchronous??
			beforeEach(() => {
				nodes = new Nodes({
					adapter: '',
					dom: new JSDOM(markup).window.document, // different DOMs for parallel tests
					container: 'svg'
				})
			})

			it ('has entering nodes', (done) => {
				let results
				let cb = jest.fn(function (data) {
					results = data['_groups'][0] // currently only 1 group
					done()
				})

				nodes.on('enter', cb)
				nodes.render({ nodes: nodesArray })
				expect(helpers.extractData(results)).toEqual(nodesArray)
			})

			describe ('after updating data', () => {
				let results

				// initial seed
				beforeEach (() => {
					nodes.render({ nodes: nodesArray })
				})

				it ('has exiting nodes', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					nodes.on('exit', cb)
					nodes.render({ nodes: updatedNodesArray })
					expect(helpers.extractData(results)).toEqual([removedNode])
				})

				it ('has merged nodes (= existing - removed + added)', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					nodes.on('update', cb)
					nodes.render({ nodes: updatedNodesArray })
					expect(helpers.extractData(results)).toEqual(updatedNodesArray)
				})
			})
		})
	})

	describe ('position()', () => {
		let attrSpy

		beforeEach (() => {
			nodes.selection = d3.select('svg').selectAll('circle')
			attrSpy = jest.spyOn(nodes.selection, 'attr')
		})

		afterEach (() => {
			attrSpy.mockRestore()
		})

		it ('calls `attr()` on d3 nodes', () => {
			nodes.position()
			const firstParam = attrSpy.mock.calls[0][0]
			const secondParam = attrSpy.mock.calls[1][0]

			expect(attrSpy).toHaveBeenCalledTimes(2)
			expect(firstParam).toEqual('cx')
			expect(secondParam).toEqual('cy')
		})
	})

	describe ('event callbacks', () => {
		let spy
		let n = ''

		beforeEach(() => {
			spy = jest.spyOn(nodes, 'emit')
		})

		afterEach (() => {
			spy.mockRestore()
		})

		it ('emits `mouseover`', () => {
			nodes.onMouseover(n)
			const call = spy.mock.calls[0]
			expect(call[0]).toEqual('node:mouseover')
			expect(call[1]).toBe(n)
		})

		it ('emits `mouseout`', () => {
			nodes.onMouseout(n)
			const call = spy.mock.calls[0]
			expect(call[0]).toEqual('node:mouseout')
			expect(call[1]).toBe(n)
		})

		it ('emits `click`', () => {
			nodes.onClick(n)
			const call = spy.mock.calls[0]
			expect(call[0]).toEqual('node:click')
			expect(call[1]).toBe(n)
		})
	})
})

// -- Helpers --

const helpers = {
	extractData: function (selection) {
		let data = []
		selection.forEach(el => {
			data.push(el['__data__'])
		})
		return data
	}
}