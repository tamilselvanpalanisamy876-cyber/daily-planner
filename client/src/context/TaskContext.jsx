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
            setTasks(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/tasks`, taskData, config);
            setTasks([data, ...tasks]);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add task');
            throw err;
        }
    };

    const updateTask = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${API_URL}/api/tasks/${id}`, updatedData, config);
            setTasks(tasks.map(task => task._id === id ? data : task));
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
            throw err;
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${API_URL}/api/tasks/${id}`, config);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (err) {
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
