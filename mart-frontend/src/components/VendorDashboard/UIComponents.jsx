import React, { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-3 shadow-md overflow-hidden sm:rounded-lg ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-4 py-5 border-b border-gray-200 sm:px-6 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-4 py-5 sm:p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const Button = ({ onClick, children, className = '', disabled = false, variant = 'primary', size = 'md' }) => {
  const baseStyles = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, name, value, onChange, type = 'text', error, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export const Checkbox = ({ label, name, checked, onChange, error, className = '' }) => (
  <div className={`flex items-start ${className}`}>
    <div className="flex items-center h-5">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${
          error ? 'border-red-500' : ''
        }`}
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  </div>
);

export const TextArea = ({ label, name, value, onChange, rows = 3, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export const Alert = ({ type = 'info', children, onDismiss, className = '' }) => {
  const alertStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  return (
    <div className={`border-l-4 p-4 ${alertStyles[type]} rounded-md flex justify-between items-center ${className}`} role="alert">
      <div className="text-sm">{children}</div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
      )}
    </div>
  );
};

export const Select = ({ label, name, value, onChange, children, error, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      {children}
    </select>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export const DatePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="date"
        value={startDate ? startDate.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange({ startDate: new Date(e.target.value), endDate })}
        className="border rounded p-2"
      />
      <span>to</span>
      <input
        type="date"
        value={endDate ? endDate.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange({ startDate, endDate: new Date(e.target.value) })}
        className="border rounded p-2"
      />
    </div>
  );
};

export const Modal = ({ isOpen, onClose, children, size = 'md', className = '' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-xl',
    xl: 'sm:max-w-2xl',
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} ${className}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg className={`animate-spin ${sizeClasses[size]} ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const Tooltip = ({ children, content, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute ${positionClasses[position]} hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap`}>
        {content}
      </div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div className="sm:hidden">
        <select
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export const EnhancedPagination = ({ currentPage, totalPages, onPageChange, styles }) => {
  const MAX_VISIBLE_PAGES = 5;

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftOffset = Math.max(0, Math.min(totalPages - MAX_VISIBLE_PAGES, currentPage - Math.ceil(MAX_VISIBLE_PAGES / 2)));
    return Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) => i + 1 + leftOffset);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      <div className="hidden sm:block">
        <p className="text-sm" style={styles.text}>
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          style={styles.text}
        >
          Previous
        </button>
        <div className="hidden sm:flex">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
              } ${number === pageNumbers[0] ? 'rounded-l-md' : ''} ${
                number === pageNumbers[pageNumbers.length - 1] ? 'rounded-r-md' : ''
              }`}
              style={currentPage === number ? styles.primary : styles.text}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={styles.text}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-md">
          <button
            className="flex justify-between items-center w-full px-4 py-2 text-left"
            onClick={() => toggleItem(index)}
          >
            <span className="font-medium">{item.title}</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-4 py-2 bg-gray-50">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export const Table = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export const Popover = ({ children, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <div className="absolute z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          {content}
        </div>
      )}
    </div>
  );
};

export const PopoverTrigger = ({ children, onClick }) => (
  <div onClick={onClick}>
    {children}
  </div>
);

export const PopoverContent = ({ children, className = '' }) => (
  <div className={`py-1 ${className}`} role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
    {children}
  </div>
);