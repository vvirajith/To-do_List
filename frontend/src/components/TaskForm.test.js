import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
    const mockOnTaskAdded = jest.fn();

    beforeEach(() => {
        mockOnTaskAdded.mockClear();
    });

    it('renders the form with all elements', () => {
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

        expect(screen.getByText('Add a Task')).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('allows user to type in title field', async () => {
        const user = userEvent.setup();
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);
        const titleInput = screen.getByLabelText(/title/i);

        await user.type(titleInput, 'New Task');

        expect(titleInput.value).toBe('New Task');
    });

    it('allows user to type in description field', async () => {
        const user = userEvent.setup();
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);
        const descInput = screen.getByLabelText(/description/i);

        await user.type(descInput, 'Task description');

        expect(descInput.value).toBe('Task description');
    });

    it('shows error when submitting without title', async () => {
        const user = userEvent.setup();
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await user.click(submitButton);

        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        expect(mockOnTaskAdded).not.toHaveBeenCalled();
    });

    it('calls onTaskAdded when form is submitted with valid data', async () => {
        const user = userEvent.setup();
        mockOnTaskAdded.mockResolvedValue();
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

        const titleInput = screen.getByLabelText(/title/i);
        const descInput = screen.getByLabelText(/description/i);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await user.type(titleInput, 'New Task');
        await user.type(descInput, 'Task description');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnTaskAdded).toHaveBeenCalledWith('New Task', 'Task description');
        });
    });

    it('clears form after successful submission', async () => {
        const user = userEvent.setup();
        mockOnTaskAdded.mockResolvedValue();
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

        const titleInput = screen.getByLabelText(/title/i);
        const descInput = screen.getByLabelText(/description/i);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await user.type(titleInput, 'New Task');
        await user.type(descInput, 'Task description');
        await user.click(submitButton);

        await waitFor(() => {
            expect(titleInput.value).toBe('');
            expect(descInput.value).toBe('');
        });
    });

    it('shows error message when submission fails', async () => {
        const user = userEvent.setup();
        mockOnTaskAdded.mockRejectedValue(new Error('Failed to create task'));
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await user.type(titleInput, 'New Task');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
        });
    });

    it('disables form during submission', async () => {
        const user = userEvent.setup();
        mockOnTaskAdded.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole('button', { name: /add/i });

        await user.type(titleInput, 'New Task');
        user.click(submitButton); 

        await waitFor(() => {
            expect(submitButton).toHaveTextContent(/adding/i);
            expect(submitButton).toBeDisabled();
        });
    });
});