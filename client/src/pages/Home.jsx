import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Daily Planner
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px' }}>
                Master your day with focus modes, mood tracking, and gamified productivity.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/dashboard">
                    <Button>Get Started</Button>
                </Link>
                <Button variant="secondary">Learn More</Button>
            </div>

            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
                <Card>
                    <h3>🚀 Focus Mode</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Boost productivity with built-in Pomodoro timers.</p>
                </Card>
                <Card>
                    <h3>📊 Mood Tracker</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Understand your energy levels and productivity patterns.</p>
                </Card>
                <Card>
                    <h3>🎮 Gamification</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Earn rewards and streaks for completing tasks.</p>
                </Card>
            </div>
        </div>
    );
};

export default Home;
