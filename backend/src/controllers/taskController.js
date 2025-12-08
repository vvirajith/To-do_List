const TaskModel = require('../models/taskModel');

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description } = req.body;

            if (!title || title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required'
                });
            }

            const taskId = await TaskModel.create(title, description || '');

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: {
                    id: taskId,
                    title,
                    description: description || ''
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create task',
                error: error.message
            });
        }
    }

    static async getTasks(req, res) {
        try {
            const tasks = await TaskModel.getRecentTasks(5);

            res.status(200).json({
                success: true,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch tasks',
                error: error.message
            });
        }
    }

    static async completeTask(req, res) {
        try {
            const { id } = req.params;

            const task = await TaskModel.getById(id);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            if (task.completed) {
                return res.status(400).json({
                    success: false,
                    message: 'Task is already completed'
                });
            }

            const updated = await TaskModel.markAsCompleted(id);

            if (updated) {
                res.status(200).json({
                    success: true,
                    message: 'Task marked as completed'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update task'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to complete task',
                error: error.message
            });
        }
    }
}

module.exports = TaskController;