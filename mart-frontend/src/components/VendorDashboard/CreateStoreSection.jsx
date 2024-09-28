import React, { useState, useEffect, useRef } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Input, Alert } from './UIComponents';
import { AlertCircle, HelpCircle, Upload } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { Link } from 'react-router-dom';
import * as api from '../../config/api';

const CreateStoreSection = () => {
  const { storeData, setStoreData } = useVendor();
  const [store, setStore] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    tag_line: '',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    accent_color: '#808080',
    banner_image: null,
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState({
    primary_color: false,
    secondary_color: false,
    accent_color: false,
  });
  const [showHelpText, setShowHelpText] = useState({
    primary_color: false,
    secondary_color: false,
    accent_color: false,
  });
  const colorPickerRefs = {
    primary_color: useRef(),
    secondary_color: useRef(),
    accent_color: useRef(),
  };
  const helpTextTimers = useRef({});

  useEffect(() => {
    if (storeData) {
      setStore({
        name: storeData.name || '',
        location: storeData.location || '',
        contact_email: storeData.contact_email || '',
        contact_phone: storeData.contact_phone || '',
        tag_line: storeData.tag_line || '',
        primary_color: storeData.primary_color || '#000000',
        secondary_color: storeData.secondary_color || '#FFFFFF',
        accent_color: storeData.accent_color || '#808080',
        banner_image: null,
      });
      setBannerPreview(storeData.banner_image || null);
    }

    const handleClickOutside = (event) => {
      Object.entries(colorPickerRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowColorPicker(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [storeData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setStore((prevState) => ({ ...prevState, [name]: files[0] }));
      setBannerPreview(URL.createObjectURL(files[0]));
    } else {
      setStore((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleColorChange = (color, name) => {
    setStore((prevState) => ({ ...prevState, [name]: color.hex }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const toggleColorPicker = (name) => {
    setShowColorPicker((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const showHelpTextWithDelay = (name) => {
    helpTextTimers.current[name] = setTimeout(() => {
      setShowHelpText((prev) => ({ ...prev, [name]: true }));
    }, 1000);
  };

  const hideHelpText = (name) => {
    clearTimeout(helpTextTimers.current[name]);
    setShowHelpText((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!store.name) newErrors.name = 'Store name is required';
    if (!store.location) newErrors.location = 'Location is required';
    if (!store.contact_email) newErrors.contact_email = 'Contact email is required';
    if (!store.contact_phone) newErrors.contact_phone = 'Contact phone is required';

    const colorFields = ['primary_color', 'secondary_color', 'accent_color'];
    colorFields.forEach(field => {
      if (!/^#[0-9A-F]{6}$/i.test(store[field])) {
        newErrors[field] = 'Please enter a valid 6-digit hex color code';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      const formData = new FormData();
      Object.keys(store).forEach(key => {
        if (store[key] !== null) {
          formData.append(key, store[key]);
        }
      });
  
      let response;
      if (storeData) {
        response = await api.updateStore(formData);
      } else {
        response = await api.createStore(formData);
      }
  
      setStoreData(response);
    } catch (error) {
      console.error('Error saving store:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to save store. Please try again.' });
    }
  };

  const ColorInput = ({ label, name, value, onChange, error, helpText }) => (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-center space-x-2">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <HelpCircle
            className="w-4 h-4 text-gray-400 cursor-help"
            onMouseEnter={() => showHelpTextWithDelay(name)}
            onMouseLeave={() => hideHelpText(name)}
          />
          {showHelpText[name] && (
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
          onClick={() => toggleColorPicker(name)}
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
      {showColorPicker[name] && (
        <div className="absolute z-20 mt-2" ref={colorPickerRefs[name]}>
          <ChromePicker
            color={value}
            onChange={(color) => handleColorChange(color, name)}
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {storeData ? 'Update Your Store' : 'Create a New Store'}
      </h2>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Store Name"
                name="name"
                value={store.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />
              <Input
                label="Location"
                name="location"
                value={store.location}
                onChange={handleInputChange}
                error={errors.location}
                required
              />
              <Input
                label="Contact Email"
                name="contact_email"
                type="email"
                value={store.contact_email}
                onChange={handleInputChange}
                error={errors.contact_email}
                required
              />
              <Input
                label="Contact Phone"
                name="contact_phone"
                value={store.contact_phone}
                onChange={handleInputChange}
                error={errors.contact_phone}
                required
              />
              <Input
                label="Tag Line"
                name="tag_line"
                value={store.tag_line}
                onChange={handleInputChange}
              />
              <div className="col-span-2">
                <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="banner_image"
                    name="banner_image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner_image"
                    className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Upload className="w-5 h-5 inline-block mr-2" />
                    Upload Banner
                  </label>
                  {bannerPreview && (
                    <img src={bannerPreview} alt="Banner preview" className="h-20 object-cover rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorInput
                label="Primary Color"
                name="primary_color"
                value={store.primary_color}
                onChange={handleInputChange}
                error={errors.primary_color}
                helpText="Used for navbar, modals, buttons, text color, and badges"
              />
              <ColorInput
                label="Secondary Color"
                name="secondary_color"
                value={store.secondary_color}
                onChange={handleInputChange}
                error={errors.secondary_color}
                helpText="Used for main page background"
              />
              <ColorInput
                label="Accent Color"
                name="accent_color"
                value={store.accent_color}
                onChange={handleInputChange}
                error={errors.accent_color}
                helpText="Used for cards and other page components"
              />
            </div>
            <Alert type="info">
              <p className="font-medium mb-2">Need help choosing colors?</p>
              <p className="mb-4">Use our color palette generator to find the perfect combination for your store.</p>
              <Link to="/cpgenerator" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Color Palette Generator
              </Link>
            </Alert>
            {errors.submit && (
              <Alert type="error">
                {errors.submit}
              </Alert>
            )}
            <Button onClick={handleSubmit} className="w-full">
              {storeData ? 'Update Store' : 'Create Store'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStoreSection;