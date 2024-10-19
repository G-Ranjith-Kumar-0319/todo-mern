// routes/todos.js
const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to limit 10

  try {
    // Calculate total number of todos
    const totalTodos = await Todo.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalTodos / limit);

    // Calculate the offset
    const skip = (page - 1) * limit;

    // Fetch the todos for the current page
    const todos = await Todo.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: sort by creation date

    res.json({
      todos,
      totalPages,
      currentPage: page,
      totalTodos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new todo
router.post("/", async (req, res) => {
  const { todoName, date } = req.body;
  const todo = new Todo({ todoName, date });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo by id
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark or unmark as complete
router.put("/:id", async (req, res) => {
  const { completed } = req.body; // Expecting { completed: true or false }

  try {
    // Find and update the todo by id
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, // Use req.params.id instead of req.params._id
      {
        completed: completed,
        date: completed ? new Date().toISOString() : undefined,
      }, // Update completed and date if needed
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    // Check if todo was found
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo); // Return the updated todo
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
