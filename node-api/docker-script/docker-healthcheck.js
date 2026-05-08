const http = require('node:http')

const port = process.env.PORT || '3005'

http
	.get(`http://127.0.0.1:${port}/health`, (res) => {
		res.resume()
		res.on('end', () => {
			process.exit(res.statusCode === 200 ? 0 : 1)
		})
	})
	.on('error', () => {
		process.exit(1)
	})
