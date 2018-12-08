function fadeOut (transition, fadeTo = 0) {
	transition
		.style('fill-opacity', fadeTo)
		.style('stroke-opacity', fadeTo)
}

module.exports = fadeOut