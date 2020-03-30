const express = require('express')
const endOfISOWeek = require('date-fns/endOfISOWeek')

const auth = require('../middlewares/auth')
const { Goal } = require('../models')

const router = express.Router()

router.post('/goals', auth, async (req, res) => {
  try {
    const activeGoal = await Goal.findOne({
      isActive: true,
      author: req.user._id
    })

    if (activeGoal) {
      return res.status(400).send({ error: 'Active goal already exists' })
    }

    const goal = new Goal({
      ...req.body,
      author: req.user._id,
      endDate: endOfISOWeek(new Date())
    })
    const savedGoal = await goal.save()

    res.status(201).send({ goal: savedGoal })
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.get('/goals', auth, async (req, res) => {
  const page = parseInt(req.query.page)
  const isActive = req.query.active

  const query = { author: req.user._id }

  if (isActive === 'true') {
    query.isActive = true
  } else if (isActive === 'false') {
    query.isActive = false
  }

  try {
    const [goals, numberOfGoals] = await Promise.all([
      Goal.find(query)
        .sort('-createdAt')
        .skip((page - 1) * 3)
        .limit(3),
      Goal.find(query).countDocuments()
    ])

    res.status(200).send({
      goals,
      hasPrevious: page > 1,
      hasNext: page * 3 < numberOfGoals
    })
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.patch('/goals/:id', auth, async (req, res) => {
  try {
    const activeGoal = await Goal.findOne({
      _id: req.params.id,
      isActive: true,
      author: req.user._id
    })

    if (activeGoal) {
      const updatedGoal = await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      return res.status(200).send({ goal: updatedGoal })
    } else {
      return res.status(400).send({ error: 'Can only edit active goal' })
    }
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.get('/goals/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      author: req.user._id
    })

    res.status(200).send({ goal })
  } catch (error) {
    res.status(400).send({ error })
  }
})

module.exports = router
