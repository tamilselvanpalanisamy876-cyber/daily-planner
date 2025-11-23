import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';
import SearchBar from '../components/SearchBar';
import CategoryManager from '../components/CategoryManager';
import HabitsTracker from '../components/HabitsTracker';
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

            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <SearchBar tasks={tasks} onTaskSelect={(task) => console.log('Selected:', task)} />
            </div>

            {/* Main Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 'var(--space-lg)',
            }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {/* Habits Tracker */}
                    <HabitsTracker />

                    {/* Smart Suggestions */}
                    <SmartSuggestions tasks={tasks} user={user} />

                    {/* Task List */}
                    <Card className="fade-in">
                        <TaskList />
                    </Card>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {/* Calendar */}
                    <Card className="fade-in">
                        <Calendar
                            tasks={tasks}
                            onDateClick={(date) => console.log('Date clicked:', date)}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
