import React from 'react';

const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={`px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };