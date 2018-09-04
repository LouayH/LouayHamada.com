const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()
const port = 3000

server.use(cors())
server.use(bodyParser.json())

server.get('/', (req, res) => {
  res.send(`Express started at http://localhost:${port}`)
})

server.listen(port, console.log(`Express started at http://localhost:${port}`))
