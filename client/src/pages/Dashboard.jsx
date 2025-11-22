import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import TaskList from '../components/TaskList';
import MoodTracker from '../components/MoodTracker';
import WeatherWidget from '../components/WeatherWidget';
import Schedule from '../components/Schedule';
import SmartSuggestions from '../components/SmartSuggestions';
import AuthContext from '../context/AuthContext';
import Button from '../components/Button';
import { LogOut, Calendar, Timer } from 'lucide-react';
import NotificationManager from '../components/NotificationManager';
import ReminderSystem from '../components/ReminderSystem';
import TaskContext from '../context/TaskContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { tasks } = useContext(TaskContext);

    // Fallback if user data isn't fully populated yet
    const xp = user?.xp || 0;
    const streak = user?.streak || 0;
    const level = Math.floor(xp / 100) + 1;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <ReminderSystem tasks={tasks} />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Dashboard</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Level {level} • {xp} XP
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <NotificationManager />
                    <Link to="/review">
                        <Button variant="secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Weekly Review">
                            <Calendar size={20} />
                        </Button>
                    </Link>
                    <Link to="/focus">
                        <Button variant="secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Focus Mode">
                            <Timer size={20} />
                        </Button>
                    </Link>
                    <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🔥</span>
                        <span style={{ fontWeight: 'bold' }}>{streak} Day Streak</span>
                    </div>
                    <MoodTracker />
                    <Button variant="secondary" onClick={logout} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <LogOut size={20} />
                    </Button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <SmartSuggestions tasks={tasks} user={user} />

                    <Card>
                        <h3>Today's Focus</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No active tasks. Add one to get started!</p>
                    </Card>

                    <Card>
                        <TaskList />
                    </Card>

                    <Card>
                        <h3>Daily Schedule</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <Schedule />
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card>
                        <h3>Weather</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <WeatherWidget />
                        </div>
                    </Card>

                    <Card>
                        <h3>Stats</h3>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>85%</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Productivity Score</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
