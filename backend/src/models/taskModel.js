const { pool } = require('../config/database');

class TaskModel {
    // Create a new task
    static async create(title, description) {
        try {
            const [result] = await pool.query(
                'INSERT INTO task (title, description) VALUES (?, ?)',
                [title, description]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating task: ${error.message}`);
        }
    }

    // Get recent uncompleted tasks (limit 5)
    static async getRecentTasks(limit = 5) {
        try {
            const [rows] = await pool.query(
                'SELECT id, title, description, completed, created_at FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT ?',
                [limit]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error fetching tasks: ${error.message}`);
        }
    }

    // Get task by ID
    static async getById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT id, title, description, completed, created_at FROM task WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching task: ${error.message}`);
        }
    }

    // Mark task as completed
    static async markAsCompleted(id) {
        try {
            const [result] = await pool.query(
                'UPDATE task SET completed = TRUE WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating task: ${error.message}`);
        }
    }

    // Delete all tasks (useful for testing)
    static async deleteAll() {
        try {
            await pool.query('DELETE FROM task');
        } catch (error) {
            throw new Error(`Error deleting tasks: ${error.message}`);
        }
    }
}

module.exports = TaskModel;