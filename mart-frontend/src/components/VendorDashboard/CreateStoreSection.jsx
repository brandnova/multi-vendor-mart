import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from './UIComponents';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

const CreateStoreSection = ({ storeData, setStoreData, setActiveSection }) => {
  const [store, setStore] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    tag_line: '',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    accent_color: '#808080',
  });
  const [errors, setErrors] = useState({});

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
      });
    }
  }, [storeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStore((prevState) => ({ ...prevState, [name]: value }));
    
    // Clear error for the field being edited
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

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      let response;

      if (storeData) {
        // Update existing store
        response = await axios.put(`${API_URL}/stores/store/detail/`, store, { headers });
      } else {
        // Create new store
        response = await axios.post(`${API_URL}/stores/store/`, store, { headers });
      }

      setStoreData(response.data);
      setActiveSection('dashboard');
    } catch (error) {
      console.error('Error saving store:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to save store. Please try again.' });
    }
  };

  const ColorInput = ({ label, name, value, onChange, error }) => (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          id={`${name}-picker`}
          value={value}
          onChange={(e) => onChange({ target: { name, value: e.target.value } })}
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorInput
                label="Primary Color"
                name="primary_color"
                value={store.primary_color}
                onChange={handleInputChange}
                error={errors.primary_color}
              />
              <ColorInput
                label="Secondary Color"
                name="secondary_color"
                value={store.secondary_color}
                onChange={handleInputChange}
                error={errors.secondary_color}
              />
              <ColorInput
                label="Accent Color"
                name="accent_color"
                value={store.accent_color}
                onChange={handleInputChange}
                error={errors.accent_color}
              />
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm mt-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.submit}
              </p>
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