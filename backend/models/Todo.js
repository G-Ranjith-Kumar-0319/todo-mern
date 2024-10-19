// models/Todo.js
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todoName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Export the model
module.exports = mongoose.model("Todo", todoSchema);
