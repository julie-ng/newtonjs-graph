const backgroundColor = '#102027'
const backgroundOffsetColor = '#263238'
const darkNodeBg = '#162b35'
const green = '#168600'
const blue = '#00838f'
const red = '#b72022'
const yellow = '#fdd835'
const orange = '#d2620b'

// Based on: https://css-tricks.com/snippets/javascript/lighten-darken-color/
const lightenDarkenColor = function (hexColor, amt) {
	let usePound = false
	if (hexColor[0] == "#") {
		hexColor = hexColor.slice(1)
		usePound = true
	}
	if (hexColor.length === 4) {
		hexColor = hexColor + hexColor.slice(1,4)
	}

	let num = parseInt(hexColor,16)

	let g = (num & 0x0000FF) + amt
	if (g > 255) { g = 255 }
	else if (g < 0) { g = 0 }

	let b = ((num >> 8) & 0x00FF) + amt
	if (b > 255) { b = 255 }
	else if (b < 0) { b = 0 }

	let r = (num >> 16) + amt
	if (r > 255) { r = 255 }
	else if (r < 0) { r = 0 }

	return (usePound ? '#': '') + (g | (b << 8) | (r << 16)).toString(16)
}

module.exports = {
	backgroundColor: backgroundColor,
	backgroundOffsetColor: backgroundOffsetColor,
	darkNodeBg: darkNodeBg,
	green: green,
	blue: blue,
	red: red,
	yellow: yellow,
	orange: orange,
	statusColors: {
		up: {
			fill: green,
			stroke: green
		},
		deploying: {
			fill: blue,
			stroke: '#009aa9'
		},
		down: {
			fill: red,
			stroke: '#c42d2f'
		},
	},
	lightenDarkenColor: lightenDarkenColor
}