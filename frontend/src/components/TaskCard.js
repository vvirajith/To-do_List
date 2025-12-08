import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onComplete }) => {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            await onComplete(task.id);
        } catch (error) {
            console.error('Failed to complete task:', error);
            setIsCompleting(false);
        }
    };

    return (
        <div className="task-card">
            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
            </div>
            <button 
                className="done-button"
                onClick={handleComplete}
                disabled={isCompleting}
            >
                {isCompleting ? 'Completing...' : 'Done'}
            </button>
        </div>
    );
};

export default TaskCard;