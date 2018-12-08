// const d3 = require('d3')

const SELECTOR = '.link'

class Links {
	constructor (data, opts) {
		console.log('new Links()')
		this.setData(data)
		this.container = opts.container
	}

	// private
	setData (data) {
		this.data = data.links
	}

	updateData (data) {
		this.setData(data)
	}

	render () {
		let links = this.container.selectAll(SELECTOR)
		.data(this.data)

		links = links.enter()
			.append('line')
			.merge(links)
				.attr('class', 'link')
				.style('stroke-width', 1)

		this.links = links
	}

	position () {
		this.links
			.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y)
	}
}

module.exports = Links