const d3 = require('d3')
const View = require('./view')

describe ('View', () => {
	let view

	beforeEach(() => {
		view = new View()
		view.selection = d3.select('svg').selectAll('line') // doesn't matter what element
		view.setMaxListeners(0)
	})

	it ('has a constructor', () => {
		expect(new View()).not.toEqual(undefined)
	})

	it ('has a bindGraph method', () => {
		expect(typeof view.bindGraph).toEqual('function')
	})

	describe ('placeholders for inherited classes', () => {
		it ('has a render() method', () => {
			expect(() => {
				view.render()
			}).toThrow()
		})

		it ('has a position() method', () => {
			expect(() => {
				view.position()
			}).toThrow()
		})

		it ('has a highlightDependencies() method', () => {
			expect(() => {
				view.highlightDependencies()
			}).toThrow()
		})
	})

	describe ('shared methods', () => {
		let spy

		beforeEach(() => {
			spy = jest.spyOn(view.selection, 'attr')
		})

		afterEach(() => {
			spy.mockRestore()
		})

		describe('setRelationships()', () => {
			it ('sets the `data-rel` attribute', () => {
				view.setRelationships('node')
				const call = spy.mock.calls[0]
				expect(call[0]).toEqual('data-rel')
				expect(call[1].toString().includes('this.graph.network.getRelationship(i, node)')).toBe(true)
			})
		})

		describe('hideUnrelated()', () => {
			it ('sets `data-hidden` attribute', () => {
				view.hideUnrelated('node')
				const call = spy.mock.calls[0]
				const checkUnrelated = `this.graph.network.getRelationship(i, node) === 'has-no-relationship'`
				expect(call[0]).toEqual('data-hidden')
				expect(call[1].toString().includes(checkUnrelated)).toBe(true)
			})
		})

		describe('resetStyles()', () => {
			it ('resets `data-` attributes', () => {
				view.resetStyles()
				const calls = spy.mock.calls
				expect(calls[0][0]).toEqual('data-rel')
				expect(calls[1][0]).toEqual('data-hidden')
				expect(calls[0][1]).toEqual('')
				expect(calls[1][1]).toEqual('')
			})
		})
	})

})