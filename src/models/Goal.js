const mongoose = require('mongoose')

const Task = require('./Task')

const Schema = mongoose.Schema

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    endDate: {
      type: Date
    },
    review: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

goalSchema.pre('remove', async function(next) {
  const goal = this
  console.log(goal)

  await Task.deleteMany({ mission: goal._id })

  next()
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
