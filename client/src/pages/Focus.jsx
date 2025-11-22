import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PomodoroTimer from '../components/PomodoroTimer';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const Focus = () => {
    const location = useLocation();
    const task = location.state?.task;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Focus Mode</h2>

                {task && (
                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Working on:</p>
                        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {task.title}
                        </h1>
                    </div>
                )}

                <Card style={{ padding: '3rem' }}>
                    <PomodoroTimer />
                </Card>

                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    "The only way to do great work is to love what you do."
                </p>
            </div>
        </div>
    );
};

export default Focus;
