import React, { useMemo } from 'react';
import Card from './Card';
import { Lightbulb, ArrowRight } from 'lucide-react';

const SmartSuggestions = ({ tasks, user }) => {
    const suggestions = useMemo(() => {
        const suggs = [];

        // 1. Priority Check
        const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
        if (highPriority.length > 0) {
            suggs.push({
                type: 'priority',
                text: `Tackle "${highPriority[0].title}" first - it's high priority!`,
                icon: '🔥'
            });
        }

        // 2. Streak/Habit Check
        if (user?.streak > 0 && user?.streak < 3) {
            suggs.push({
                type: 'habit',
                text: "Keep your streak alive! Complete a task today.",
                icon: '⚡'
            });
        } else if (user?.streak === 0) {
            suggs.push({
                type: 'habit',
                text: "Start a new streak today! You got this.",
                icon: '🌱'
            });
        }

        // 3. Quick Wins (Low priority but easy)
        const lowPriority = tasks.filter(t => t.priority === 'low' && t.status !== 'completed');
        if (lowPriority.length > 0 && highPriority.length === 0) {
            suggs.push({
                type: 'quick',
                text: `Need a quick win? Try "${lowPriority[0].title}".`,
                icon: '✨'
            });
        }

        // 4. Empty State
        if (tasks.length === 0) {
            suggs.push({
                type: 'empty',
                text: "Plan your day! Add 3 main tasks to get started.",
                icon: '📝'
            });
        }

        return suggs.slice(0, 3); // Show top 3 suggestions
    }, [tasks, user]);

    if (suggestions.length === 0) return null;

    return (
        <Card className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Lightbulb size={20} color="#fbbf24" />
                <h3 style={{ fontSize: '1.1rem' }}>Smart Suggestions</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {suggestions.map((sugg, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <span>{sugg.icon}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{sugg.text}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SmartSuggestions;
