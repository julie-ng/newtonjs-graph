const backgroundColor = '#102027'
const backgroundOffsetColor = '#263238'
const darkNodeBg = '#162b35'
const green = '#168600'
const blue = '#00838f'
const red = '#b72022'
const yellow = '#fdd835'
const orange = '#d2620b'

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
		}
	}
}