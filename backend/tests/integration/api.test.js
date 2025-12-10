const request = require('supertest');
const app = require('../../src/app');
const TaskModel = require('../../src/models/taskModel');

jest.mock('../../src/config/database', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const mockInsertId = 1;
            require('../../src/config/database').pool.query.mockResolvedValue([{ insertId: mockInsertId }]);

            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'New Task', description: 'Task Description' })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(mockInsertId);
            expect(response.body.data.title).toBe('New Task');
        });

        it('should return 400 when title is missing', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ description: 'Description only' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Title is required');
        });
    });

    describe('GET /api/tasks', () => {
        it('should return list of tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
                { id: 2, title: 'Task 2', description: 'Desc 2', completed: false }
            ];
            require('../../src/config/database').pool.query.mockResolvedValue([mockTasks]);

            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
        });

        it('should return empty array when no tasks', async () => {
            require('../../src/config/database').pool.query.mockResolvedValue([[]]);

            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('PUT /api/tasks/:id/complete', () => {
        it('should mark task as completed', async () => {
            const pool = require('../../src/config/database').pool;
            
            pool.query.mockResolvedValueOnce([[{ id: 1, completed: false }]]);
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app)
                .put('/api/tasks/1/complete')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Task marked as completed');
        });

        it('should return 404 for non-existent task', async () => {
            const pool = require('../../src/config/database').pool;
            pool.query.mockResolvedValue([[]]);

            const response = await request(app)
                .put('/api/tasks/999/complete')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Task not found');
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Server is running');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app)
                .get('/api/unknown')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Route not found');
        });
    });
});