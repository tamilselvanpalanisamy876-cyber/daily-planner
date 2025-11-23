import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import TaskList from '../components/TaskList';
import Schedule from '../components/Schedule';
import SmartSuggestions from '../components/SmartSuggestions';
import AuthContext from '../context/AuthContext';
import Button from '../components/Button';
import { LogOut, Timer, Plus } from 'lucide-react';
import NotificationManager from '../components/NotificationManager';
import ReminderSystem from '../components/ReminderSystem';
import TaskContext from '../context/TaskContext';
import MotivatingPartner from '../components/MotivatingPartner';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { tasks } = useContext(TaskContext);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCreated, setTaskCreated] = useState(false);

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <ReminderSystem tasks={tasks} />
            <MotivatingPartner
                onTaskComplete={taskCompleted}
                onTaskCreate={taskCreated}
            />

            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: 'var(--space-md)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div>
                    <h1 className="text-gradient">Daily Planner</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Welcome back, {user?.username || 'User'}! 👋
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    <NotificationManager />
                    <ThemeToggle />
                    <Link to="/focus">
                        <Button variant="secondary" style={{
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                            color: 'white',
                            border: 'none',
                        }} title="Focus Mode">
                            <Timer size={20} />
                        </Button>
                    </Link>
                    <Button variant="secondary" onClick={logout} style={{
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                    }}>
                        <LogOut size={20} />
                    </Button>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-lg)',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <SmartSuggestions tasks={tasks} user={user} />

                    <Card className="fade-in">
                        <TaskList />
                    </Card>

                    <Card className="fade-in">
                        <h3>Daily Schedule</h3>
                        <div style={{ marginTop: 'var(--space-md)' }}>
                            <Schedule />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
