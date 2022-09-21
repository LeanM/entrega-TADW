const express = require('express')
const bodyParser = require('body-parser')
const { init } = require('./db')
const routes = require('./routes')

const app = express()
app.use(bodyParser.json())
app.use(routes)
app.use(express.static("public"));

init().then(() => {
  console.log('starting server on port 3000')
  app.listen(3000)
})
