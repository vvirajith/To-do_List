import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList Component', () => {
    const mockOnComplete = jest.fn();

    const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
        { id: 2, title: 'Task 2', description: 'Description 2', completed: false },
        { id: 3, title: 'Task 3', description: 'Description 3', completed: false }
    ];

    it('shows loading state', () => {
        render(<TaskList tasks={[]} onComplete={mockOnComplete} loading={true} />);
        
        expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    });

    it('shows no tasks message when empty', () => {
        render(<TaskList tasks={[]} onComplete={mockOnComplete} loading={false} />);
        
        expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
        expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
    });

    it('renders all tasks', () => {
        render(<TaskList tasks={mockTasks} onComplete={mockOnComplete} loading={false} />);
        
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('renders correct number of task cards', () => {
        render(<TaskList tasks={mockTasks} onComplete={mockOnComplete} loading={false} />);
        
        const doneButtons = screen.getAllByRole('button', { name: /done/i });
        expect(doneButtons).toHaveLength(3);
    });
});