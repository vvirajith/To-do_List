import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from './TaskCard';

describe('TaskCard Component', () => {
    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false
    };
    const mockOnComplete = jest.fn();

    beforeEach(() => {
        mockOnComplete.mockClear();
    });

    it('renders task information correctly', () => {
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    });

    it('calls onComplete when Done button is clicked', async () => {
        const user = userEvent.setup();
        mockOnComplete.mockResolvedValue();
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        const doneButton = screen.getByRole('button', { name: /done/i });
        await user.click(doneButton);

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledWith(1);
        });
    });

    it('shows completing state during completion', async () => {
        const user = userEvent.setup();
        mockOnComplete.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        const doneButton = screen.getByRole('button', { name: /done/i });
        user.click(doneButton); 

        await waitFor(() => {
            expect(screen.getByText(/completing/i)).toBeInTheDocument();
            expect(doneButton).toBeDisabled();
        });
    });

    it('renders task without description', () => {
        const taskWithoutDesc = { ...mockTask, description: '' };
        render(<TaskCard task={taskWithoutDesc} onComplete={mockOnComplete} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });
});