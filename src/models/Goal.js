const mongoose = require('mongoose')

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
      type: String,
      default: 'No review available'
    }
  },
  {
    timestamps: true
  }
)

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
