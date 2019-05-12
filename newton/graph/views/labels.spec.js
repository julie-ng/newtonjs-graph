const d3 = require('d3')
const Labels = require('./labels')

const nodesArray = [
	{ id: '1', name: 'foo' },
	{ id: '2', name: 'bar' }
]

const JSDOM = require('jsdom').JSDOM
const markup = `<html><body><svg></svg></body></html>`
const sharedDom = new JSDOM(markup)

describe ('Labels', () => {
	let labels

	beforeEach(() => {
		labels = new Labels({
			// adapter: '',
			dom: sharedDom.window.document, // different DOMs for parallel tests
			container: 'svg'
		})

		// prevent memory link in tests
		labels.setMaxListeners(1)
	})


	describe ('render()', () => {
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
				labels = new Labels({
					dom: new JSDOM(markup).window.document, // different DOMs for parallel tests
					container: 'svg'
				})
			})

			it ('has entering labels', (done) => {
				let results
				let cb = jest.fn(function (data) {
					results = data['_groups'][0] // currently only 1 group
					done()
				})

				labels.on('enter', cb)
				labels.render({ nodes: nodesArray })
				expect(helpers.extractData(results)).toEqual(nodesArray)
			})

			describe ('after updating data', () => {
				let results

				// initial seed
				beforeEach (() => {
					labels.render({ nodes: nodesArray })
				})

				it ('has exiting labels', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					labels.on('exit', cb)
					labels.render({ nodes: updatedNodesArray })
					expect(helpers.extractData(results)).toEqual([removedNode])
				})

				it ('has merged labels (= existing - removed + added)', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					labels.on('update', cb)
					labels.render({ nodes: updatedNodesArray })
					expect(helpers.extractData(results)).toEqual(updatedNodesArray)
				})
			})
		})
	})

	describe ('position()', () => {
		let spy

		beforeEach (() => {
			labels.selection = d3.select('svg').selectAll('circle')
			spy = jest.spyOn(labels.selection, 'attr')
		})

		afterEach (() => {
			spy.mockRestore()
		})

		it ('calls `attr()` on d3 nodes', () => {
			labels.position()
			const firstParam = spy.mock.calls[0][0]
			const secondParam = spy.mock.calls[1][0]

			expect(spy).toHaveBeenCalledTimes(2)
			expect(firstParam).toEqual('x')
			expect(secondParam).toEqual('y')
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