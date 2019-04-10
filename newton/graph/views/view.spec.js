const View = require('./view')

describe ('View', () => {
	let view

	beforeEach(() => {
		view = new View()
		view.setMaxListeners(0)
	})

	it ('has a constructor', () => {
		expect(new View()).not.toEqual(undefined)
	})

	it ('has a bindGraph method', () => {
		expect(typeof view.bindGraph).toEqual('function')
	})

	describe ('placeholders for inherited classes', () => {
		it ('has a render method', () => {
			expect(() => {
				view.render()
			}).toThrow()
		})

		it ('has a position method', () => {
			expect(() => {
				view.position()
			}).toThrow()
		})
	})
})