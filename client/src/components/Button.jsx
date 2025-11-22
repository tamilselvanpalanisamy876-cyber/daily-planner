import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', ...props }) => {
    const baseStyle = 'btn-primary';
    const variantStyle = variant === 'secondary' ? 'btn-secondary' : baseStyle;

    return (
        <button
            type={type}
            className={`${baseStyle} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
