// ColorInput.jsx

import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

const ColorInput = ({ label, name, value, onChange, error, helpText }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    onChange({ target: { name, value: color.hex } });
  };

  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-center space-x-2">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <Tooltip content={helpText}>
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
        </Tooltip>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          role="button"
          aria-label={`Open color picker for ${label}`}
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowColorPicker(!showColorPicker);
            }
          }}
        />
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`flex-grow px-3 py-2 border rounded-md text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="#000000"
          aria-describedby={`${name}-help`}
        />
      </div>
      {showColorPicker && (
        <div className="absolute z-20 mt-2">
          <div
            className="fixed inset-0"
            onClick={() => setShowColorPicker(false)}
          />
          <SketchPicker
            color={value}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1" id={`${name}-error`}>
          {error}
        </p>
      )}
      <p className="text-gray-500 text-xs mt-1" id={`${name}-help`}>
        {helpText}
      </p>
    </div>
  );
};

export default ColorInput;