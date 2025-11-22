import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WeeklyReview = () => {
    // Mock data for charts
    const data = [
        { name: 'Mon', tasks: 4, mood: 3 },
        { name: 'Tue', tasks: 6, mood: 4 },
        { name: 'Wed', tasks: 8, mood: 5 },
        { name: 'Thu', tasks: 5, mood: 3 },
        { name: 'Fri', tasks: 7, mood: 4 },
        { name: 'Sat', tasks: 3, mood: 5 },
        { name: 'Sun', tasks: 2, mood: 4 },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', background: 'linear-gradient(to right, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Weekly Review
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <CheckCircle size={24} color="#10b981" />
                        <h3>Tasks Completed</h3>
                    </div>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>35</p>
                    <p style={{ color: 'var(--text-secondary)' }}>+12% from last week</p>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <TrendingUp size={24} color="#f59e0b" />
                        <h3>Most Productive Day</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Wednesday</p>
                    <p style={{ color: 'var(--text-secondary)' }}>8 tasks completed</p>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <XCircle size={24} color="#ef4444" />
                        <h3>Missed Tasks</h3>
                    </div>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                        <li>Update documentation</li>
                        <li>Call mom</li>
                    </ul>
                </Card>
            </div>

            <Card style={{ height: '400px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>Productivity & Mood Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface-dark)', border: 'var(--glass-border)', borderRadius: 'var(--radius-md)' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Bar dataKey="tasks" fill="#818cf8" radius={[4, 4, 0, 0]} name="Tasks" />
                        <Bar dataKey="mood" fill="#f472b6" radius={[4, 4, 0, 0]} name="Mood Level" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default WeeklyReview;
