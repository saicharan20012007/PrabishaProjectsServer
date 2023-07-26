const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema(
  {
    company: {
      type: String,
      require: true,
    },
    contact: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    project: {
      type: String,
      require: true,
    },
    tasks: {
      type: String,
      require: true,
    },
    quantity: {
      type: String,
      require: true,
    },
    actualEndDate: {
      type: Date,
      require: true,
    },
    plannedEndDate: {
      type: Date,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      require: true,
      enum: ["High", "Low"],
      default: "High",
    },
    latestUpdate: {
      type: String,
      require: true,
    },
    assignedUser: {
      type: String,
      require: true,
    },
    createdBy: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
