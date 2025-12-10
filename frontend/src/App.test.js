import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './services/api';

jest.mock('./services/api', () => ({
    getTasks: jest.fn(),
    createTask: jest.fn(),
    completeTask: jest.fn()
}));

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the app with form and task list', async () => {
        api.getTasks.mockResolvedValue({ data: [] });
        
        render(<App />);

        expect(screen.getByText('Add a Task')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
        });
    });

    it('loads and displays tasks on mount', async () => {
        const mockTasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
            { id: 2, title: 'Task 2', description: 'Description 2', completed: false }
        ];
        api.getTasks.mockResolvedValue({ data: mockTasks });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });
    });

    it('creates a new task', async () => {
        api.getTasks.mockResolvedValue({ data: [] });
        api.createTask.mockResolvedValue({ success: true });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
        });

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await userEvent.type(titleInput, 'New Task');
        
        const newTask = { id: 1, title: 'New Task', description: '', completed: false };
        api.getTasks.mockResolvedValue({ data: [newTask] });
        
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(api.createTask).toHaveBeenCalledWith('New Task', '');
        });
    });

    it('shows error when API fails to load tasks', async () => {
        api.getTasks.mockRejectedValue(new Error('Network error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
        });
    });

    it('completes a task successfully', async () => {
        const mockTasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', completed: false }
        ];
        api.getTasks.mockResolvedValue({ data: mockTasks });
        api.completeTask.mockResolvedValue({ success: true });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        const doneButton = screen.getByRole('button', { name: /done/i });
        
        api.getTasks.mockResolvedValue({ data: [] });
        
        await userEvent.click(doneButton);

        await waitFor(() => {
            expect(api.completeTask).toHaveBeenCalledWith(1);
            expect(screen.getByText(/task completed/i)).toBeInTheDocument();
        });
    });
});