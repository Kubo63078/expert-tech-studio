import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  label = '로딩 중...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;