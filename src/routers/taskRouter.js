const express = require('express')

const auth = require('../middlewares/auth')

const { Goal, Task } = require('../models')

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.query.mission, isActive: true })

    if (goal) {
      const task = new Task({ ...req.body, mission: req.query.mission })
      const savedTask = await task.save()

      res.status(201).send({ task: savedTask })
    } else {
      res.status(400).send({ error: 'You can only add tasks for active goal' })
    }
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
    const task = await Task.findById(req.params.id)

    res.status(200).send({ task })
  } catch (error) {
    res.status(400).send({ error })
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const { isActive } = await Goal.findById(req.query.mission)

    if (isActive) {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      )

      return res.status(200).send({ task: updatedTask })
    } else {
      res.status(400).send({ error: 'Not Found' })
    }
  } catch (error) {
    res.status(400).send({ error })
  }
})

module.exports = router
