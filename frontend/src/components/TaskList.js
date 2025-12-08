import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ tasks, onComplete, loading }) => {
    if (loading) {
        return (
            <div className="task-list-container">
                <div className="loading">Loading tasks...</div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="task-list-container">
                <div className="no-tasks">
                    <p>No tasks yet!</p>
                    <p className="no-tasks-subtitle">Add your first task to get started.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="task-list-container">
            <div className="task-list">
                {tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onComplete={onComplete}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;