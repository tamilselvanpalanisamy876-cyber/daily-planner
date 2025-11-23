import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', style = {}, ...props }) => {
    const baseStyles = {
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer',
        border: 'none',
        transition: 'all var(--transition-fast)',
        fontFamily: 'inherit',
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
            color: 'white',
            boxShadow: 'var(--shadow-sm)',
        },
        secondary: {
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--text-tertiary)',
        },
        danger: {
            background: 'var(--danger-color)',
            color: 'white',
        },
        success: {
            background: 'var(--success-color)',
            color: 'white',
        },
    };

    const combinedStyles = {
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
    };

    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            style={combinedStyles}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
