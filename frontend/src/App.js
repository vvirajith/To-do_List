import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, getTasks, completeTask } from './services/api';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getTasks();
            setTasks(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskAdded = async (title, description) => {
        try {
            await createTask(title, description);
            // Refresh task list
            await fetchTasks();
        } catch (err) {
            throw new Error(err.message || 'Failed to create task');
        }
    };

    const handleTaskComplete = async (id) => {
        try {
            await completeTask(id);
            // Remove task from list immediately
            setTasks(tasks.filter(task => task.id !== id));
            // Refresh to get next task if available
            await fetchTasks();
        } catch (err) {
            console.error('Error completing task:', err);
            throw err;
        }
    };

    return (
        <div className="app">
            <div className="container">
                <div className="left-section">
                    <TaskForm onTaskAdded={handleTaskAdded} />
                </div>
                
                <div className="divider"></div>
                
                <div className="right-section">
                    {error && <div className="error-banner">{error}</div>}
                    <TaskList 
                        tasks={tasks} 
                        onComplete={handleTaskComplete}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;