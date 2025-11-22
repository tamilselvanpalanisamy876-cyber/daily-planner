import React, { useState, useEffect, useContext } from 'react';
import Button from './Button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PomodoroTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus, short, long
    const { user } = useContext(AuthContext);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false);
                        // Log focus session if in focus mode
                        if (mode === 'focus' && user) {
                            axios.post(`${API_URL}/api/focus/log`, { minutes: 25 }, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            }).catch(err => console.error('Failed to log session', err));

                            new Notification('Daily Planner', { body: 'Focus session complete! Take a break.' });
                        } else {
                            new Notification('Daily Planner', { body: 'Break over! Time to focus.' });
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, minutes, mode, user]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setMinutes(25);
        else if (mode === 'short') setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setMinutes(25);
        else if (newMode === 'short') setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => changeMode('focus')}
                    style={{
                        background: mode === 'focus' ? 'var(--surface-light)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    Focus
                </button>
                <button
                    onClick={() => changeMode('short')}
                    style={{
                        background: mode === 'short' ? 'var(--surface-light)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    Short Break
                </button>
                <button
                    onClick={() => changeMode('long')}
                    style={{
                        background: mode === 'long' ? 'var(--surface-light)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    Long Break
                </button>
            </div>

            <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Button onClick={toggleTimer} style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                </Button>
                <Button variant="secondary" onClick={resetTimer} style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <RotateCcw size={24} />
                </Button>
            </div>
        </div>
    );
};

export default PomodoroTimer;
