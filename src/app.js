require('./db/mongoose')
const cors = require('cors')
const express = require('express')

const app = express()

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
  })
)
app.use(express.json())

module.exports = app
