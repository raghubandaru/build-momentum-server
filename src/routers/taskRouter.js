const express = require('express')

const auth = require('../middlewares/auth')

const { Task } = require('../models')

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, mission: req.query.mission })
    const savedTask = await task.save()

    res.status(201).send({ task: savedTask })
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.get('/tasks', auth, async (req, res) => {
  const page = parseInt(req.query.page)
  const mission = req.query.mission

  try {
    const [tasks, numberOfTasks] = await Promise.all([
      Task.find({ mission })
        .sort('-createdAt')
        .skip((page - 1) * 3)
        .limit(3),
      Task.find({ mission }).countDocuments()
    ])

    res.status(200).send({
      tasks,
      numberOfTasks,
      hasPrevious: page > 1,
      hasNext: page * 3 < numberOfTasks
    })
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).cache({ key: req.user._id })
    res.status(200).send({ task })
  } catch (error) {
    res.status(400).send({ error })
  }
})

module.exports = router
