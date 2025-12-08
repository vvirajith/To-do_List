const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.put('/:id/complete', TaskController.completeTask);

module.exports = router;