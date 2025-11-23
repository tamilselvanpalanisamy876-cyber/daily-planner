import React, { useMemo } from 'react';
import Card from './Card';
import { Lightbulb, Zap, Target, Clock } from 'lucide-react';
import { generateSmartSuggestions, learnUserPatterns, calculateSmartPriority } from '../utils/smartLogic';

const SmartSuggestions = ({ tasks, user }) => {
    const suggestions = useMemo(() => {
        // Learn from user patterns
        const patterns = learnUserPatterns();

        // Get AI-like smart suggestions
        const smartSuggs = generateSmartSuggestions(tasks, patterns);

        // Add priority-based suggestions
        const sortedByPriority = tasks
            .filter(t => t.status !== 'completed')
            .map(t => ({ ...t, smartScore: calculateSmartPriority(t) }))
            .sort((a, b) => b.smartScore - a.smartScore);

        if (sortedByPriority.length > 0) {
            const topTask = sortedByPriority[0];
            smartSuggs.unshift({
                type: 'top-priority',
                icon: '🎯',
                message: `Top priority: ${topTask.title}`,
                task: topTask
            });
        }

        // Add pattern-based insight
        if (patterns.mostProductiveHour) {
            const hour = patterns.mostProductiveHour;
            const currentHour = new Date().getHours();
            if (Math.abs(currentHour - hour) <= 1) {
                smartSuggs.push({
                    type: 'peak-time',
                    icon: '⚡',
                    message: `Peak productivity time! You usually excel now.`
                });
            }
        }

        // Add completion rate insight
        if (patterns.completionRate < 50) {
            smartSuggs.push({
                type: 'motivation',
                icon: '💪',
                message: `Let's boost that completion rate! Start with one small task.`
            });
        } else if (patterns.completionRate > 80) {
            smartSuggs.push({
                type: 'celebration',
                icon: '🎉',
                message: `Amazing! ${Math.round(patterns.completionRate)}% completion rate!`
            });
        }

        return smartSuggs.slice(0, 4); // Show top 4
    }, [tasks, user]);

    if (suggestions.length === 0) {
        return (
            <Card style={{
                background: 'linear-gradient(135deg, var(--ios-blue)20, var(--ios-purple)20)',
                border: '1px solid var(--ios-blue)40',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <Lightbulb size={20} color="var(--ios-yellow)" />
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Smart Suggestions</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Add some tasks to get personalized suggestions! 📝
                </p>
            </Card>
        );
    }

    return (
        <Card style={{
            background: 'linear-gradient(135deg, var(--ios-blue)20, var(--ios-purple)20)',
            border: '1px solid var(--ios-blue)40',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <Lightbulb size={20} color="var(--ios-yellow)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Smart Suggestions</h3>
                <span style={{
                    marginLeft: 'auto',
                    background: 'var(--ios-blue)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                }}>
                    AI-Like
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {suggestions.map((sugg, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--space-sm)',
                            padding: 'var(--space-sm)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--text-tertiary)',
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{sugg.icon}</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {sugg.message}
                            </p>
                            {sugg.type && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    {sugg.type.replace('-', ' ')}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SmartSuggestions;
