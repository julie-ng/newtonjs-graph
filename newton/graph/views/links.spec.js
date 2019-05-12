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

		links.links = d3.select('svg').selectAll('line')

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
			links.links = d3.select('svg').selectAll('line')
			spy = jest.spyOn(links.links, 'attr')
		})

		afterEach (() => {
			spy.mockRestore()
		})

		it ('calls `attr()` on d3 links', () => {
			links.position()
			const calls = spy.mock.calls
			const x1 = calls[0]
			const x2 = calls[1]
			const y1 = calls[2]
			const y2 = calls[3]

			expect(spy).toHaveBeenCalledTimes(4)

			expect(x1[0]).toEqual('x1')
			expect(x2[0]).toEqual('x2')
			expect(y1[0]).toEqual('y1')
			expect(y2[0]).toEqual('y2')

			expect(x1[1].toString().includes('d.source.x')).toBe(true)
			expect(x2[1].toString().includes('d.target.x')).toBe(true)
			expect(y1[1].toString().includes('d.source.y')).toBe(true)
			expect(y2[1].toString().includes('d.target.y')).toBe(true)
		})
	})

	describe ('are styled via attributes on <line> element', () => {
		let attrSpy

		beforeEach (() => {
			attrSpy = jest.spyOn(links.links, 'attr')
		})

		afterEach (() => {
			attrSpy.mockRestore()
		})

		describe ('setRelationships()', () => {
			it ('sets `data-rel` attribute on link', () => {
				links.setRelationships()
				const attr = attrSpy.mock.calls[0][0]
				expect(attrSpy).toHaveBeenCalledTimes(1)
				expect(attr).toEqual('data-rel')
			})

			it ('uses _getRelationship() helper', () => {
				links.setRelationships()
				let cb = attrSpy.mock.calls[0][1]
				expect(cb.toString().includes('_getRelationship(i, n)')).toBe(true)
			})
		})

		describe ('hideUnrelated()', () => {
			let l = linksArray[0]

			it ('uses _setHidden() helper', () => {
				links.hideUnrelated()
				let cb = attrSpy.mock.calls[0][1]
				expect(cb.toString().includes('_setHidden(i, n)')).toBe(true)
			})

			it ('sets `data-hidden` attribute on element', () => {
				links.hideUnrelated()
				expect(attrSpy).toHaveBeenCalled()
			})

			describe ('_setHidden() sets `data-hidden` attr', () => {
				let relSpy

				beforeEach (() => {
					relSpy = jest.spyOn(links, `_getRelationship`)
				})

				afterEach (() => {
					relSpy.mockRestore()
				})

				it (`sets to '1' if no relationship`, () => {
					relSpy.mockReturnValue('has-no-relationship')
					expect(links._setHidden(l, 'orphan')).toEqual('1')
				})

				it (`sets to '' if has relationship`, () => {
					relSpy.mockReturnValue('is-target')
					expect(links._setHidden(l, l.target)).toEqual('')
				})
			})
		})

		describe ('showAll()', () => {
			it ('resets `data-hidden` attribute', () => {
				links.showAll()
				let fn = attrSpy.mock.calls[0]
				expect(fn[0]).toEqual('data-hidden')
				expect(fn[1]).toBe(null)
			})
		})

		describe ('svg arrowheads', () => {
			const nodeStub = linksArray[0]
			let attrSpy

			beforeEach (() => {
				attrSpy = jest.spyOn(links.links, 'attr')
			})

			afterEach (() => {
				attrSpy.mockRestore()
			})

			describe ('setRelationships()', () => {
				xit ('hides nodes without relations', () => {
					let spy = jest.spyOn(links, 'hideUnrelated')
					links.setRelationships()
					expect(spy).toHaveBeenCalledTimes(1)
				})

				xdescribe ('option: markers', () => {
					let spy

					beforeEach(() => {
						spy = jest.spyOn(links, 'showArrows')
					})

					afterEach (() => {
						spy.mockRestore()
					})

					it ('defaults to true', () => {
						let emptyOpts = {}
						links.setRelationships(nodeStub, emptyOpts)
						expect(spy.mock.calls[0][1].markers).toBe(true)
					})

					it ('delegates to showArrows() when true', () => {
						links.setRelationships(nodeStub, { markers: true })
						expect(spy).toHaveBeenCalledTimes(1)
					})

					it ('ignores showArrows() when false', () => {
						links.setRelationships(nodeStub, { markers: false })
						expect(spy).not.toHaveBeenCalled()
					})
				})
			})

			describe ('_getMarkerEnd(i, node, opts)', () => {
				const colorStyles = [
					'url(#is-source)',
					'url(#is-deep-source)',
					'url(#is-target)',
					'url(#has-no-relationship)'
				]

				const deepSourceMock = jest.fn()
				const graphStub = {
					isDeepSourceLink: deepSourceMock,
					on: () => {}
				}

				beforeEach(() => {
					links.bindGraph(graphStub)
				})

				afterEach(() => {
					deepSourceMock.mockRestore()
				})

				it ('gets relationship to node', () => {
					let spy = jest.spyOn(links, '_getRelationship')
					let l = linksArray[0]
					links._getMarkerEnd(l, l.target)
					expect(spy).toHaveBeenCalledTimes(1)
				})

				describe ('option: `color`', () => {
					describe ('= true', () => {
						it ('colors based on relationships', () => {
							let l = linksArray[0]
							let style = links._getMarkerEnd(l, l.target, { color: true })
							expect(colorStyles.includes(style)).toBe(true)
						})
					})

					describe ('= false', () => {
						it ('uses `is-default`', () => {
							let l = linksArray[0]
							let style = links._getMarkerEnd(l, l.target, { color: false, showAll: true })
							expect(style).toEqual('url(#is-default)')
						})
					})
				})

				describe ('when: links have NO relationship', () => {
					let l = linksArray[0]

					describe ('option: `showAll`', () => {
						it ('defaults to true', () => {
							let style = links._getMarkerEnd(l, 'orphan-node', {})
							expect(style).toEqual('url(#is-default)')
						})

						describe ('= true', () => {
							it ('returns a default marker', () => {
								let style = links._getMarkerEnd(l, 'orphan-node', { showAll: true })
								expect(style).toEqual('url(#is-default)')
							})
						})

						describe ('= false', () => {
							it ('returns an empty string', () => {
								let style = links._getMarkerEnd(l, 'orphan-node', { showAll: false })
								expect(style).toEqual('')
							})
						})
					})
				})
			})

			describe ('resetStyles()', () => {
				it ('adds removes arrows', () => {
					links.resetStyles()
					const calls = attrSpy.mock.calls
					expect(attrSpy).toHaveBeenCalledTimes(3)
					expect(calls[0][0]).toEqual('data-rel')
					expect(calls[1][0]).toEqual('marker-end')
					expect(calls[2][0]).toEqual('data-hidden')
				})
			})
		})
	})


	describe ('helpers', () => {

		describe ('_getRelationship()', () => {
			const deepSourceMock = jest.fn()
			const graphStub = {
				isDeepSourceLink: deepSourceMock,
				on: () => {}
			}

			beforeEach(() => {
				links.bindGraph(graphStub)
			})

			afterEach(() => {
				deepSourceMock.mockRestore()
			})

			const link = { source: 'a', target: 'b' }

			it ('can identify sources', () => {
				expect(links._getRelationship(link, 'a')).toEqual('is-source')
			})

			it ('can identify targets', () => {
				expect(links._getRelationship(link, 'b')).toEqual('is-target')
			})

			// avoid mock setup in other places
			describe ('is used by:', () => {
				let spy
				let l = linksArray[0]

				beforeEach (() => {
					spy = jest.spyOn(links, '_getRelationship')
				})

				afterEach(() => {
					spy.mockRestore()
				})

				it ('_setHidden()', () => {
					links._setHidden(l, 'n')
					expect(spy).toHaveBeenCalled()
				})

				it ('_getMarkerEnd()', () => {
					links._getMarkerEnd(l, 'n')
					expect(spy).toHaveBeenCalled()
				})
			})

			describe ('not direct source or target', () => {
				it ('delegates no matches to graph.isDeepSourceLink()', () => {
					deepSourceMock.mockReturnValue(true)
					expect(links._getRelationship(link, 'not-a-node')).toEqual('is-deep-source')
				})

				it ('can `has-no-relationship`', () => {
					deepSourceMock.mockReturnValue(false)
					expect(links._getRelationship(link, 'not-a-node')).toEqual('has-no-relationship')
				})
			})
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