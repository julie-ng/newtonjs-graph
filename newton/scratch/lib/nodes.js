import colors from './colors'

const radiusFactor = 4
const defaultFontSize = 16

const calculateFill = (node) => colors.statusColors[node.status].fill
const calculateStroke = (node) => colors.statusColors[node.status].stroke
const calculateRadius = (node) => 12 // node.size * radiusFactor
const calculateFontSize = (node) => {
	return (node.status === 'up')
		? defaultFontSize + 'px'
		: defaultFontSize + 4 + 'px'
}

export default {
	radiusFactor: radiusFactor,
	defaultFontSize: defaultFontSize,
	calculateFill: calculateFill,
	calculateStroke: calculateStroke,
	calculateRadius: calculateRadius,
	calculateFontSize: calculateFontSize
}
