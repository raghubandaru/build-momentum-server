const { Goal } = require('../models')
const { client } = require('../utils')

function resetGoalActive() {
  console.log('running fn')
  const cursor = Goal.find({ isActive: true }).cursor()

  cursor.on('data', function (goal) {
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

resetGoalActive()
