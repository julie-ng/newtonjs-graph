const Graph = require('./graph')

describe ('Graph >', function () {
	const nodes = [
		{ id: 1, name: 'foo' },
		{ id: 2, name: 'bar' }
	]
	const links = [
		{ source: 1, target: 0 }
	]

	describe ('Constructor', function () {
		describe ('Data >', function () {
			let g
			beforeAll(() => {
				g = new Graph(nodes, links)
			})

			it ('sets nodes', () => {
				expect(g.nodes).toEqual(nodes)
			})

			it ('sets links', () => {
				expect(g.links).toEqual(links)
			})
		})

		describe ('Layout >', function () {
			it ('has defaults', () => {
				let graph = new Graph(nodes, links)
				expect(graph.margin).toEqual(40)
				expect(graph.height).toEqual(550)
				expect(graph.width).toEqual(800)
			})

			it ('accepts options', () => {
				let graph = new Graph(nodes, links, {
					margin: 1,
					height: 2,
					width: 3
				})

				expect(graph.margin).toEqual(1)
				expect(graph.height).toEqual(2)
				expect(graph.width).toEqual(3)
			})
		})
	})

	describe ('init() >', function () {
		let g
		beforeAll(() => {
			g = new Graph(nodes, links)
			g.init()
		})

		it ('sets cola', () => {
			expect(g.hasOwnProperty('cola')).toBe(true)
			expect(typeof g.cola).toEqual('object') // TODO: type testing?
		})

		it ('sets svg', () => {
			expect(g.hasOwnProperty('svg')).toBe(true)
			expect(typeof g.svg).toEqual('object') // TODO: type testing?
		})
	})
})