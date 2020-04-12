const mongoose = require('mongoose')
const redis = require('redis')

const { Goal } = require('../models')

// Initialize redis client from env
const client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
})

const connectionURL = process.env.MONGODB_URL
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

// Initialize mongoose connection from env
mongoose
  .connect(connectionURL, options)
  .then(() => {
    resetGoalActive()
      .then(() => console.log('Scheduled task done!'))
      .catch(e => console.log(e))
  })
  .catch(() => console.log('Error connecting to Database'))

// define the async task
async function resetGoalActive() {
  const cursor = Goal.find({ isActive: true }).cursor()

  cursor.on('data', function (goal) {
    console.log(goal)
    goal.isActive = false
    goal.save().then(() => {
      // ideally mail people about their goal update
      // or delete the cache stored for that user
    })
  })

  cursor.on('close', function () {
    // for now deleting the whole cache
    client.flushall()
  })
}
