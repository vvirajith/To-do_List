const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Create a new task
router.post('/', TaskController.createTask);

// Get recent tasks
router.get('/', TaskController.getTasks);

// Mark task as completed
router.put('/:id/complete', TaskController.completeTask);

module.exports = router;