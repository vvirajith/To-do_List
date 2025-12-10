const TaskController = require('../../src/controllers/taskController');
const TaskModel = require('../../src/models/taskModel');

jest.mock('../../src/models/taskModel');

describe('TaskController Unit Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create task successfully', async () => {
            mockReq.body = { title: 'Test Task', description: 'Test Description' };
            TaskModel.create.mockResolvedValue(1);

            await TaskController.createTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Task created successfully',
                data: {
                    id: 1,
                    title: 'Test Task',
                    description: 'Test Description'
                }
            });
        });

        it('should return 400 when title is missing', async () => {
            mockReq.body = { description: 'Test Description' };

            await TaskController.createTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Title is required'
            });
        });

        it('should return 400 when title is empty', async () => {
            mockReq.body = { title: '   ', description: 'Test Description' };

            await TaskController.createTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Title is required'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { title: 'Test Task', description: 'Test Description' };
            TaskModel.create.mockRejectedValue(new Error('Database error'));

            await TaskController.createTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Failed to create task'
                })
            );
        });
    });

    describe('getTasks', () => {
        it('should return all tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', description: 'Desc 1' },
                { id: 2, title: 'Task 2', description: 'Desc 2' }
            ];
            TaskModel.getRecentTasks.mockResolvedValue(mockTasks);

            await TaskController.getTasks(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockTasks
            });
        });

        it('should return empty array when no tasks', async () => {
            TaskModel.getRecentTasks.mockResolvedValue([]);

            await TaskController.getTasks(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: []
            });
        });

        it('should handle errors', async () => {
            TaskModel.getRecentTasks.mockRejectedValue(new Error('Database error'));

            await TaskController.getTasks(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('completeTask', () => {
        it('should complete task successfully', async () => {
            mockReq.params = { id: '1' };
            TaskModel.getById.mockResolvedValue({ id: 1, completed: false });
            TaskModel.markAsCompleted.mockResolvedValue(true);

            await TaskController.completeTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Task marked as completed'
            });
        });

        it('should return 404 when task not found', async () => {
            mockReq.params = { id: '999' };
            TaskModel.getById.mockResolvedValue(null);

            await TaskController.completeTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Task not found'
            });
        });

        it('should return 400 when task already completed', async () => {
            mockReq.params = { id: '1' };
            TaskModel.getById.mockResolvedValue({ id: 1, completed: true });

            await TaskController.completeTask(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Task is already completed'
            });
        });
    });
});