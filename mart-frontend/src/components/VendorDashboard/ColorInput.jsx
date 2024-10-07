import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { HelpCircle, AlertCircle } from 'lucide-react';

const ColorInput = ({ label, name, value, onChange, error, helpText }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const colorPickerRef = useRef(null);
  const helpTextTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (color) => {
    onChange({ target: { name, value: color.hex } });
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const showHelpTextWithDelay = () => {
    helpTextTimer.current = setTimeout(() => {
      setShowHelpText(true);
    }, 1000);
  };

  const hideHelpText = () => {
    clearTimeout(helpTextTimer.current);
    setShowHelpText(false);
  };

  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-center space-x-2">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <HelpCircle
            className="w-4 h-4 text-gray-400 cursor-help"
            onMouseEnter={showHelpTextWithDelay}
            onMouseLeave={hideHelpText}
          />
          {showHelpText && (
            <div className="absolute z-10 p-2 bg-gray-100 rounded shadow-md text-sm text-gray-700 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
              {helpText}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={toggleColorPicker}
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
        />
      </div>
      {showColorPicker && (
        <div className="absolute z-20 mt-2" ref={colorPickerRef}>
          <SketchPicker
            color={value}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ColorInput;