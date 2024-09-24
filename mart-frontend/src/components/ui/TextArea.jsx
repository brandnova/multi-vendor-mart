import React from 'react';
const TextArea = ({ label, name, value, onChange }) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    );
  };
  
  export { TextArea };