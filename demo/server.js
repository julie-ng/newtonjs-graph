// eslint-disable-next-line no-unused-vars
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')

let app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 3000

// --- Middleware and Views ---

app.use(helmet())
app.use(logger('dev'))
app.use('/', express.static(path.join(__dirname, '/dist')))

// --- Routes ---

app.use((req, res, next) => {
	res.status(404).send('Oops - page not found')
})

http.listen(port, function () {
	console.log(`App listening on ${port}!`)
})