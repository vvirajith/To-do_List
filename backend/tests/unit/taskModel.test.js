const TaskModel = require('../../src/models/taskModel');
const { pool } = require('../../src/config/database');

jest.mock('../../src/config/database', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('TaskModel Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new task successfully', async () => {
            const mockResult = [{ insertId: 1 }];
            pool.query.mockResolvedValue(mockResult);

            const taskId = await TaskModel.create('Test Task', 'Test Description');

            expect(taskId).toBe(1);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO task (title, description) VALUES (?, ?)',
                ['Test Task', 'Test Description']
            );
        });

        it('should throw error when database fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(
                TaskModel.create('Test', 'Description')
            ).rejects.toThrow('Error creating task: Database error');
        });
    });

    describe('getRecentTasks', () => {
        it('should return recent uncompleted tasks', async () => {
            const mockTasks = [
                [
                    { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
                    { id: 2, title: 'Task 2', description: 'Desc 2', completed: false }
                ]
            ];
            pool.query.mockResolvedValue(mockTasks);

            const tasks = await TaskModel.getRecentTasks(5);

            expect(tasks).toHaveLength(2);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT id, title, description, completed, created_at FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT ?',
                [5]
            );
        });

        it('should return empty array when no tasks exist', async () => {
            pool.query.mockResolvedValue([[]]);

            const tasks = await TaskModel.getRecentTasks(5);

            expect(tasks).toEqual([]);
        });
    });

    describe('getById', () => {
        it('should return task by id', async () => {
            const mockTask = [
                [{ id: 1, title: 'Task 1', description: 'Desc 1', completed: false }]
            ];
            pool.query.mockResolvedValue(mockTask);

            const task = await TaskModel.getById(1);

            expect(task).toEqual({ id: 1, title: 'Task 1', description: 'Desc 1', completed: false });
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT id, title, description, completed, created_at FROM task WHERE id = ?',
                [1]
            );
        });

        it('should return null when task not found', async () => {
            pool.query.mockResolvedValue([[]]);

            const task = await TaskModel.getById(999);

            expect(task).toBeNull();
        });
    });

    describe('markAsCompleted', () => {
        it('should mark task as completed', async () => {
            const mockResult = [{ affectedRows: 1 }];
            pool.query.mockResolvedValue(mockResult);

            const result = await TaskModel.markAsCompleted(1);

            expect(result).toBe(true);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE task SET completed = TRUE WHERE id = ?',
                [1]
            );
        });

        it('should return false when task not found', async () => {
            const mockResult = [{ affectedRows: 0 }];
            pool.query.mockResolvedValue(mockResult);

            const result = await TaskModel.markAsCompleted(999);

            expect(result).toBe(false);
        });
    });
});