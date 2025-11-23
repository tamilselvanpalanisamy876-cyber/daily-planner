import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

const categories = [
    { id: 'work', name: 'Work', color: '#007AFF', icon: '💼' },
    { id: 'personal', name: 'Personal', color: '#5856D6', icon: '🏠' },
    { id: 'health', name: 'Health', color: '#34C759', icon: '💪' },
    { id: 'learning', name: 'Learning', color: '#FF9500', icon: '📚' },
    { id: 'finance', name: 'Finance', color: '#FF2D55', icon: '💰' },
    { id: 'social', name: 'Social', color: '#5AC8FA', icon: '👥' },
];

const CategoryManager = ({ selectedCategories = [], onCategoryChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCategory = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId));
        } else {
            onCategoryChange([...selectedCategories, categoryId]);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Selected Categories */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
                marginBottom: 'var(--space-sm)',
            }}>
                {selectedCategories.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    if (!category) return null;
                    return (
                        <div
                            key={catId}
                            style={{
                                background: category.color,
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-xs)',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                            }}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                            <button
                                onClick={() => toggleCategory(catId)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                })}

                {/* Add Category Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px dashed var(--text-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <Plus size={14} />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Category Picker */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: 'var(--space-md)',
                    zIndex: 1000,
                    minWidth: '250px',
                }}>
                    <div style={{
                        display: 'grid',
                        gap: 'var(--space-sm)',
                    }}>
                        {categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => toggleCategory(category.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    padding: 'var(--space-sm)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    background: selectedCategories.includes(category.id) ?
                                        `${category.color}20` : 'transparent',
                                    border: `2px solid ${selectedCategories.includes(category.id) ?
                                        category.color : 'transparent'}`,
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                                <span style={{ flex: 1, fontWeight: '500' }}>{category.name}</span>
                                {selectedCategories.includes(category.id) && (
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: category.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                />
            )}
        </div>
    );
};

export default CategoryManager;
export { categories };
