require('./db/mongoose')
require('./schedulers/resetGoalActive')
require('./utils/cache')

const cors = require('cors')
const express = require('express')

const { goalRouter, taskRouter, userRouter } = require('./routers')

const app = express()

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
  })
)
app.use(express.json())
app.use(goalRouter)
app.use(taskRouter)
app.use(userRouter)

module.exports = app
