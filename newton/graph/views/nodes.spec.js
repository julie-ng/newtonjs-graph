const d3 = require('d3')
const Nodes = require('./nodes')

const nodesArray = [
	{ id: 'foo', name: 'bar' },
	{ id: 'hello', name: 'world' }
]

const nodesData = {
	nodes: nodesArray
}

describe ('Nodes', () => {
	let nodes

	beforeEach(() => {
		nodes = new Nodes({
			adapter: '',
			container: 'svg'
		})
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

		it.skip ('uses general update pattern', () => {
			// go through and check for:
			// - join via data()
			// - exit and remove
			// - enter & merge
		})

		// it.skip ('calls animate()')
	})

	describe ('position()', () => {
		describe ('without `nodes` property', () => {
			it ('throws', () => {
				expect(typeof nodes.nodes).toEqual('undefined')
				expect(() => {
					nodes.position()
				}).toThrow('Error: `nodes` attribute not set. Please render with data first.')
			})
		})

		describe ('with `nodes` property', () => {
			let attrSpy

			beforeEach (() => {
				nodes.nodes = d3.select('svg').selectAll('circle')
				attrSpy = jest.spyOn(nodes.nodes, 'attr')
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
	})
})
