import React from 'react';

const Alert = React.forwardRef(({ className, children, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-gray-100 border-gray-300 text-gray-900',
    destructive: 'bg-red-100 border-red-300 text-red-900',
    success: 'bg-green-100 border-green-300 text-green-900',
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`p-4 rounded-md border ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`font-medium mb-1 ${className}`}
    {...props}
  />
));

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm ${className}`}
    {...props}
  />
));

Alert.displayName = 'Alert';
AlertTitle.displayName = 'AlertTitle';
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };