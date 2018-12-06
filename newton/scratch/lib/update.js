import * as d3 from 'd3'
import colors from './colors'

const nodeSelector = '.node'
const linkSelector = '.link'

const updateCircles = function (data) {
	console.log('update function!');

	let t = d3.transition()
		.duration(750)

	// JOIN new data with old elements.
	let circles = d3.select('svg').selectAll(nodeSelector)
		.data(data, (d) => d)

	// // EXIT old elements not present in new data.
	// text.exit()
	// 	.attr("class", "exit")
	// .transition(t)
	// 	.attr("y", 60)
	// 	.style("fill-opacity", 1e-6)
	// 	.remove();

	// UPDATE old elements present in new data.
	circles.attr('class', 'update')
		// .attr("y", 0)
		.attr('fill', colors.orange)
	.transition(t)
		// .attr("x", function(d, i) { return i * 32; });

		circles.enter().append('text').text((d)=> d)

// ENTER new elements present in new data.
// text.enter().append("text")
// 	.attr("class", "enter")
// 	.attr("dy", ".35em")
// 	.attr("y", -60)
// 	.attr("x", function(d, i) { return i * 32; })
// 	.style("fill-opacity", 1e-6)
// 	.text(function(d) { return d; })
// .transition(t)
// 	.attr("y", 0)
// 	.style("fill-opacity", 1);

}

export default {
	circles: updateCircles
}