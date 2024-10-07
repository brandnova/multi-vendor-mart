import React, { useState, useEffect } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, Button, Input, Alert } from './UIComponents';
import { AlertCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as api from '../../config/api';
import { SketchPicker } from 'react-color';

const ColorInput = ({ label, name, value, onChange, error, helpText }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);

  const handleColorChange = (color) => {
    onChange({ target: { name, value: color.hex } });
  };

  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-center space-x-2">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div 
          className="relative cursor-help"
          onMouseEnter={() => setShowHelpText(true)}
          onMouseLeave={() => setShowHelpText(false)}
        >
          <AlertCircle className="w-4 h-4 text-gray-400" />
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
          onClick={() => setShowColorPicker(!showColorPicker)}
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
        <div className="absolute z-20 mt-2">
          <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
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

const CreateStoreSection = () => {
  const { storeData, setStoreData } = useVendor();
  const [store, setStore] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    tag_line: '',
    primary_color: '#000000',
    secondary_color: '#e8e8e8',
    accent_color: '#FFFFFF',
    banner_image: null,
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
  
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
      setStore(prevState => ({
        ...prevState,
        ...response,
        banner_image: null
      }));
      setBannerPreview(response.banner_image || null);
      alert(storeData ? 'Store updated successfully!' : 'Store created successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error saving store:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to save store. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {storeData ? 'Update Your Store' : 'Create a New Store'}
      </h2>
      <Card>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
            </div>
            
            <div className="space-y-4">
              <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700">
                Banner Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            
            <Alert type="info" className="mt-6">
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
            
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : (storeData ? 'Update Store' : 'Create Store')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStoreSection;