const d3 = require('d3')
const Links = require('./links')

const linksArray = [
	{ source: '0', target: '1' },
	{ source: '0', target: '2' },
]

const JSDOM = require('jsdom').JSDOM
const markup = `<html><body><svg></svg></body></html>`
const sharedDom = new JSDOM(markup)

describe ('Links', () => {
	let links

	beforeEach(() => {
		links = new Links({
			// adapter: '',
			dom: sharedDom.window.document, // different DOMs for parallel tests
			container: 'svg'
		})

		// prevent memory link in tests
		links.setMaxListeners(1)
	})


	describe ('render()', () => {
		describe ('uses general update pattern', () => {
			const updatedLinksArray = [
				{ source: '0', target: '1' }
			]

			const removedLink = { source: '0', target: '2' }

			beforeEach(() => {
				links = new Links({
					dom: new JSDOM(markup).window.document, // different DOMs for parallel tests
					container: 'svg'
				})
			})

			it ('has entering links', (done) => {
				let results
				let cb = jest.fn(function (data) {
					results = data['_groups'][0] // currently only 1 group
					done()
				})

				links.on('enter', cb)
				links.render({ links: linksArray })
				expect(helpers.extractData(results)).toEqual(linksArray)
			})

			describe ('after updating data', () => {
				let results

				// initial seed
				beforeEach (() => {
					links.render({ links: linksArray })
				})

				it ('has exiting links', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					links.on('exit', cb)
					links.render({ links: updatedLinksArray })
					expect(helpers.extractData(results)).toEqual([removedLink])
				})

				it ('has merged links (= existing - removed + added)', (done) => {
					let cb = jest.fn(function (data) {
						results = data['_groups'][0] // currently only 1 group
						done()
					})

					links.on('update', cb)
					links.render({ links: updatedLinksArray })
					expect(helpers.extractData(results)).toEqual(updatedLinksArray)
				})
			})
		})
	})

	describe ('position()', () => {
		let spy

		beforeEach (() => {
			links.links = d3.select('svg').selectAll('circle')
			spy = jest.spyOn(links.links, 'attr')
		})

		afterEach (() => {
			spy.mockRestore()
		})

		it ('calls `attr()` on d3 links', () => {
			links.position()
			const calls = spy.mock.calls
			const firstParam = calls[0][0]
			const secondParam = calls[1][0]
			const thirdParam = calls[2][0]
			const fourthParam = calls[3][0]

			expect(spy).toHaveBeenCalledTimes(4)
			expect(firstParam).toEqual('x1')
			expect(secondParam).toEqual('x2')
			expect(thirdParam).toEqual('y1')
			expect(fourthParam).toEqual('y2')
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