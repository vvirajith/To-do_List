import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await onTaskAdded(title, description);
            setTitle('');
            setDescription('');
            setSuccess('Task Added Successfully');
            
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="task-form-container">
            <h2>Add a Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        rows="4"
                        disabled={isSubmitting}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button 
                    type="submit" 
                    className="add-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;