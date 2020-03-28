const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskScheama = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    mission: {
      type: Schema.Types.ObjectId,
      ref: 'Goal'
    }
  },
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', taskScheama)

module.exports = Task
