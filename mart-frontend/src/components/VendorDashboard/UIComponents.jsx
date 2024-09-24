import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const Card = ({ children }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">
    {children}
  </div>
);

export const Button = ({ onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
  >
    {children}
  </button>
);

export const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    />
  </div>
);

export const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={3}
      value={value}
      onChange={onChange}
      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    />
  </div>
);

// Alert Component

export const Alert = ({ type = 'info', children, onDismiss }) => {
  const alertStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${alertStyles[type]} rounded-md flex justify-between items-center`} role="alert">
      <p className="text-sm">{children}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
      )}
    </div>
  );
};