import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const Card = ({ children }) => (
  <div className="bg-white shadow-md overflow-hidden sm:rounded-lg">
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

export const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">
    {children}
  </h3>
);

export const Button = ({ onClick, children, className = '', disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const Input = ({ label, name, value, onChange, type = 'text', error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`mt-1 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
      rows={5}
      value={value}
      onChange={onChange}
      className="mt-1 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    />
  </div>
);

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

export const Select = ({ label, name, value, onChange, children, error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
        error ? 'border-red-500' : ''
      }`}
    >
      {children}
    </select>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {children}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};