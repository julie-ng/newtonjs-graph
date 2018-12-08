const elements = [
	{
		id: "H",
		size: 10,
		status: "up",
		label: "Hydrogen"
	},
	{
		id: "E",
		size: 6,
		status: "up",
		label: "Elium"
	},
	{
		id: "L",
		size: 7,
		status: "deploying",
		label: "Deploying"
	},
	{
		id: "C",
		size: 12,
		status: "up",
		label: "Carbon"
	},
	{
		id: "N",
		size: 7,
		status: "up",
		label: "Nitrogen"
	},
	{
		id: "O",
		size: 13,
		status: "up",
		label: "Oxygen"
	},
	{
		id: "F",
		size: 7,
		status: "down",
		label: "Failing"
	},
	{
		id: "P",
		size: 5,
		status: "deploying",
		label: "Pon"
	},
	{
		id: "K",
		size: 8,
		status: "up",
		label: "Sodium"
	},
	{
		id: "M",
		size: 7,
		status: "up",
		label: "Magnesium"
	}
]

// links by reference
const linksMap = [
	{ source: 'H', target: 'L' },
	{ source: 'H', target: 'E' },
	{ source: 'C', target: 'N' },
	{ source: 'C', target: 'O' },
	{ source: 'C', target: 'F' },
	{ source: 'L', target: 'K' },
	{ source: 'E', target: 'C' },
	{ source: 'E', target: 'P' },
	{ source: 'H', target: 'M' },
	{ source: 'H', target: 'C' },
]

module.exports = {
	nodes: elements,
	linksMap: linksMap
}