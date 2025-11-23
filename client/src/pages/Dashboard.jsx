import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TaskContext from '../context/TaskContext';
import Button from '../components/Button';
import SmartInput from '../components/SmartInput';
import TaskCard from '../components/TaskCard';
import ThemeToggle from '../components/ThemeToggle';
import { LogOut, Zap, Calendar as CalendarIcon, Bell } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { tasks, addTask, updateTask, deleteTask, fetchTasks } = useContext(TaskContext);
    const [notifications, setNotifications] = useState([]);
    const [isScheduling, setIsScheduling] = useState(false);

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/tasks/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleAutoSchedule = async () => {
        setIsScheduling(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/tasks/auto-schedule`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Auto-schedule result:', response.data);
            await fetchTasks(); // Refresh tasks
            alert(`✅ Scheduled ${response.data.scheduledTasks.length} tasks!`);
        } catch (error) {
            console.error('Error auto-scheduling:', error);
            alert('❌ Error scheduling tasks');
        } finally {
            setIsScheduling(false);
        }
    };

    const handleTaskCreate = async (parsedData) => {
        try {
            await addTask(parsedData);
            await fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    // Separate tasks by status
    const backlogTasks = tasks.filter(t => t.status === 'Backlog').sort((a, b) => b.priorityScore - a.priorityScore);
    const scheduledTasks = tasks.filter(t => t.status === 'Scheduled').sort((a, b) => {
        if (!a.scheduledTime || !b.scheduledTime) return 0;
        return a.scheduledTime.localeCompare(b.scheduledTime);
    });
    const doneTasks = tasks.filter(t => t.status === 'Done');

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)',
                padding: 'var(--space-md)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        LogicFlow
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                        Mathematical AI Planner • Welcome, {user?.username}!
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Button variant="secondary" onClick={logout} style={{
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <LogOut size={20} />
                    </Button>
                </div>
            </header>

            {/* Context Notification Bar */}
            {notifications.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, var(--ios-orange), var(--ios-red))',
                    color: 'white',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-lg)',
                    boxShadow: 'var(--shadow-md)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <Bell size={20} />
                        <strong>Context Notifications</strong>
                    </div>
                    {notifications.map((notif, idx) => (
                        <div key={idx} style={{
                            padding: 'var(--space-sm)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: idx < notifications.length - 1 ? 'var(--space-xs)' : 0,
                        }}>
                            {notif.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Smart Input */}
            <SmartInput onTaskCreate={handleTaskCreate} />

            {/* Auto-Schedule Button */}
            <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
                <button
                    onClick={handleAutoSchedule}
                    disabled={isScheduling || backlogTasks.length === 0}
                    style={{
                        padding: 'var(--space-md) var(--space-xl)',
                        borderRadius: 'var(--radius-lg)',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--ios-green), var(--ios-teal))',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: backlogTasks.length > 0 ? 'pointer' : 'not-allowed',
                        opacity: backlogTasks.length > 0 ? 1 : 0.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    <Zap size={20} />
                    {isScheduling ? 'Scheduling...' : `Auto-Schedule ${backlogTasks.length} Tasks`}
                </button>
            </div>

            {/* Main Grid: Backlog | Scheduled */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 'var(--space-lg)',
            }}>
                {/* Left Column: BACKLOG */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-md)',
                        padding: 'var(--space-sm)',
                        background: 'var(--ios-orange)20',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <CalendarIcon size={20} color="var(--ios-orange)" />
                        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Backlog</h2>
                        <span style={{
                            marginLeft: 'auto',
                            background: 'var(--ios-orange)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                        }}>
                            {backlogTasks.length}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {backlogTasks.length > 0 ? (
                            backlogTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div style={{
                                padding: 'var(--space-xl)',
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                No tasks in backlog. Add one above! 📝
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: SCHEDULED (THE PLAN) */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginBottom: 'var(--space-md)',
                        padding: 'var(--space-sm)',
                        background: 'var(--ios-blue)20',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <Zap size={20} color="var(--ios-blue)" />
                        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>The Plan</h2>
                        <span style={{
                            marginLeft: 'auto',
                            background: 'var(--ios-blue)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                        }}>
                            {scheduledTasks.length}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {scheduledTasks.length > 0 ? (
                            scheduledTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div style={{
                                padding: 'var(--space-xl)',
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                No scheduled tasks. Click "Auto-Schedule" above! ⚡
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completed Tasks (Collapsible) */}
            {doneTasks.length > 0 && (
                <details style={{ marginTop: 'var(--space-lg)' }}>
                    <summary style={{
                        padding: 'var(--space-md)',
                        background: 'var(--ios-green)20',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: 'var(--ios-green)',
                    }}>
                        ✅ Completed Tasks ({doneTasks.length})
                    </summary>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--space-md)',
                        marginTop: 'var(--space-md)',
                    }}>
                        {doneTasks.map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
};

export default Dashboard;
