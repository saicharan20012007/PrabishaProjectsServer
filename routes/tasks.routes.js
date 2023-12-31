const router = require("express").Router()
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")
const Task = require("../models/task")
const authenticateToken = require("../middlewares/authentication")

router.route("/").get(async (req, res) => {
  res.send("Hello from tasks")
})

router.route("/create").post(authenticateToken, async (req, res) => {
  const { company, contact,city, project, tasks, quantity, startDate, plannedEndDate,actualEndDate, assignedTo, createdBy, status,  priority,category, latestUpdate } =
    req.body

  console.log(req.body)

  try {
    const newTask = new Task({
      company,
      contact,
      city,
      project,
      tasks, 
      quantity,
      startDate,
      plannedEndDate,
      actualEndDate,      
      assignedUser: assignedTo,
      createdBy,
      status,
      priority,
      category,
      latestUpdate
    })

    newTask.save()

    res
      .status(201)
      .json({ message: "Task Created Successfully", task: newTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/get/:id").get(authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const user = await User.findById(id)
    const tasks = await Task.find({ createdBy: user.username })
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/update/:id").put(authenticateToken, async (req, res) => {
  const { id,company, contact,city, project, tasks, quantity, startDate, plannedEndDate,actualEndDate, assignedTo, createdBy, status,  priority, category, latestUpdate   } =
    req.body

  try {
    /* const isTaskpresent = await Task.findById(id)
    if (isTaskpresent) {
      isTaskpresent.title = title
      isTaskpresent.description = description
      isTaskpresent.dueDate = dueDate
      isTaskpresent.assignedUser = assignedTo
      isTaskpresent.createdBy = createdBy

      isTaskpresent.save()

      res
        .status(201)
        .json({ message: "Task Updated Successfully", task: isTaskpresent })
    } else {
      res.status(404).json({ message: "Task Not Found" })
    } */

    const updatedTask = await Task.findByIdAndUpdate(id, {
    company,
    contact,
    city,
    project,
    tasks,
    quantity,
    startDate,
    plannedEndDate,
    actualEndDate,
    createdBy,
    status,
    priority,
    category,
    latestUpdate ,
    assignedUser: assignedTo,
    })

    res
      .status(201)
      .json({ message: "Task Updated Successfully", task: updatedTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/delete/:id").delete(authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    const deletedTask = await Task.findByIdAndDelete(id)

    res
      .status(201)
      .json({ message: "Task Deleted Successfully", task: deletedTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/all").get(authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find()
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/assigned/:id").get(authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    const tasks = await Task.find({ assignedUser: user.username })
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/weekly").get(authenticateToken, async (req, res) => {
  try {
    const currentDate = new Date()

    const currentWeekStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    )

    const currentWeekEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 6
    )

    const previousWeekStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() - 7
    )

    const previousWeekEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() - 1
    )

    const weekBeforePreviousStartDate = new Date(
      previousWeekStartDate.getFullYear(),
      previousWeekStartDate.getMonth(),
      previousWeekStartDate.getDate() - 7
    )

    const weekBeforePreviousEndDate = new Date(
      previousWeekEndDate.getFullYear(),
      previousWeekEndDate.getMonth(),
      previousWeekEndDate.getDate() - 7
    )

    const thisWeekTasks = await Task.find({
      createdAt: {
        $gte: currentWeekStartDate,
        $lte: currentWeekEndDate,
      },
    }).exec()

    const previousWeekTasks = await Task.find({
      createdAt: {
        $gte: previousWeekStartDate,
        $lte: previousWeekEndDate,
      },
    }).exec()

    const weekBeforePreviousTasks = await Task.find({
      createdAt: {
        $gte: weekBeforePreviousStartDate,
        $lte: weekBeforePreviousEndDate,
      },
    }).exec()

    res.status(200).json({
      message: "Tasks Fetched Successfully",
      weekData: [
        {
          week: 1,
          tasks: weekBeforePreviousTasks,
        },
        {
          week: 2,
          tasks: previousWeekTasks,
        },
        {
          week: 3,
          tasks: thisWeekTasks,
        },
      ],
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

module.exports = router
