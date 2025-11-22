import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mock data for now since we don't have an API key
        // In a real app, we would fetch from OpenWeatherMap
        const fetchWeather = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setWeather({
                    temp: 24,
                    condition: 'Cloudy',
                    city: 'New York',
                    humidity: 65,
                    wind: 12
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load weather');
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <div>Loading weather...</div>;
    if (error) return <div>Weather unavailable</div>;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '50%' }}>
                <Cloud size={32} color="var(--primary-color)" />
            </div>
            <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{weather.temp}°C</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{weather.condition} in {weather.city}</p>
            </div>
        </div>
    );
};

export default WeatherWidget;
