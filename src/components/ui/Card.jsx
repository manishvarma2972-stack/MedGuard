import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : ''
      } ${paddings[padding] || paddings.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
