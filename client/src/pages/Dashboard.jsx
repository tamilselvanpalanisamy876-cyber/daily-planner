import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import TaskContext from '../context/TaskContext';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { tasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
    const [newTask, setNewTask] = useState('');

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            try {
                await addTask({ title: newTask });
                setNewTask('');
            } catch (error) {
                alert('Failed to add task');
            }
        }
    };

    const handleToggle = async (task) => {
        try {
            await updateTask(task._id, { completed: !task.completed });
        } catch (error) {
            alert('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                await deleteTask(id);
            } catch (error) {
                alert('Failed to delete task');
            }
        }
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h1 style={{ margin: 0 }}>To-Do List</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Hi, {user?.username}!</span>
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={16} style={{ verticalAlign: 'middle' }} /> Logout
                    </button>
                </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Add
                    </button>
                </div>
            </form>

            {/* Task List */}
            <div>
                {tasks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        No tasks yet. Add one above!
                    </p>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                marginBottom: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggle(task)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span
                                style={{
                                    flex: 1,
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? '#999' : '#000'
                                }}
                            >
                                {task.title}
                            </span>
                            <button
                                onClick={() => handleDelete(task._id)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Stats */}
            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#e9ecef',
                borderRadius: '4px',
                textAlign: 'center'
            }}>
                <strong>Total:</strong> {tasks.length} tasks |
                <strong> Completed:</strong> {tasks.filter(t => t.completed).length} |
                <strong> Pending:</strong> {tasks.filter(t => !t.completed).length}
            </div>
        </div>
    );
};

export default Dashboard;
