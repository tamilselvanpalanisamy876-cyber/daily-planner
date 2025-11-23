import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const TaskContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setTasks([]);
            setLoading(false);
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/api/tasks`, config);
            console.log('✅ Fetched tasks:', data);
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching tasks:', err);
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData) => {
        try {
            console.log('📝 Adding task with data:', taskData);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Ensure all required fields are present
            const payload = {
                title: taskData.title || 'Untitled Task',
                importance: taskData.importance || 5,
                difficulty: taskData.difficulty || 3,
                deadline: taskData.deadline || null,
                estimatedDuration: taskData.estimatedDuration || 30
            };

            console.log('📤 Sending payload:', payload);
            const { data } = await axios.post(`${API_URL}/api/tasks`, payload, config);
            console.log('✅ Task created:', data);

            setTasks([data, ...tasks]);
            setError(null);
            return data;
        } catch (err) {
            console.error('❌ Error adding task:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to add task');
            alert(`Error: ${err.response?.data?.message || err.message}`);
            throw err;
        }
    };

    const updateTask = async (id, updatedData) => {
        try {
            console.log('🔄 Updating task:', id, updatedData);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.put(`${API_URL}/api/tasks/${id}`, updatedData, config);
            console.log('✅ Task updated:', data);
            setTasks(tasks.map(task => task._id === id ? data : task));
            setError(null);
            return data;
        } catch (err) {
            console.error('❌ Error updating task:', err);
            setError(err.response?.data?.message || 'Failed to update task');
            throw err;
        }
    };

    const deleteTask = async (id) => {
        try {
            console.log('🗑️ Deleting task:', id);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${API_URL}/api/tasks/${id}`, config);
            console.log('✅ Task deleted');
            setTasks(tasks.filter(task => task._id !== id));
            setError(null);
        } catch (err) {
            console.error('❌ Error deleting task:', err);
            setError(err.response?.data?.message || 'Failed to delete task');
            throw err;
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;
