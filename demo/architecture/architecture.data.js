const elements = [
	{
		id: "1",
		status: "up",
		label: "Frontend"
	},
	{
		id: "2",
		status: "up",
		label: "Middleware"
	},
	{
		id: "3",
		status: "up",
		label: "Search Service"
	},
	{
		id: "4",
		status: "up",
		label: "Product Service"
	},
	{
		id: "5",
		status: "up",
		label: "Database"
	}
]

// links by reference
const linksMap = [
	{ source: '1', target: '2' },
	{ source: '2', target: '3' },
	{ source: '2', target: '4' },
	{ source: '3', target: '5' },
	{ source: '4', target: '5' }
]

module.exports = {
	nodes: elements,
	linksMap: linksMap
}