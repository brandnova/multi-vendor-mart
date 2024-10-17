import React, { useState, useEffect } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, Button, Input, Alert } from './UIComponents';
import { HelpCircle } from 'lucide-react';
import * as api from '../../config/api';
import BannerImageUpload from './BannerImageUpload';
import StoreSlugNotification from './StoreSlugNotification';
import ColorInput from './ColorInput';
import Tooltip from './Tooltip';

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
    <div className="px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {storeData ? 'Update Your Store' : 'Create a New Store'}
      </h2>

      <StoreSlugNotification storeName={store.name} />

      <Card>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input
                label="Store Name"
                name="name"
                value={store.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                helpText="Enter the name of your store as you want it to appear to customers"
                className="w-full"
              />
              <Input
                label="Location"
                name="location"
                value={store.location}
                onChange={handleInputChange}
                error={errors.location}
                required
                helpText="Enter the physical location or area your store serves"
                className="w-full"
              />
              <Input
                label="Contact Email"
                name="contact_email"
                type="email"
                value={store.contact_email}
                onChange={handleInputChange}
                error={errors.contact_email}
                required
                helpText="Enter an email address where customers can reach you"
                className="w-full"
              />
              <Input
                label="Contact Phone Number"
                name="contact_phone"
                value={store.contact_phone}
                onChange={handleInputChange}
                error={errors.contact_phone}
                required
                helpText="Enter a phone number where customers can reach you"
                className="w-full"
              />
              <div className="col-span-full">
                <div className="flex items-center mb-2">
                  <label htmlFor="tag_line" className="block text-sm font-medium text-gray-700 mr-2">
                    Tag Line/Store Description
                  </label>
                  <Tooltip content="This brief description will appear prominently on your store page, helping customers understand what makes your store unique.">
                    <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  name="tag_line"
                  value={store.tag_line}
                  onChange={handleInputChange}
                  helpText="Enter a short phrase or description to highlight your store (e.g., 'Fresh produce daily' or 'Handmade crafts with love')"
                  className="w-full"
                />
              </div>
            </div>
            
            <BannerImageUpload
              bannerPreview={bannerPreview}
              setBannerPreview={setBannerPreview}
              handleInputChange={handleInputChange}
            />

            <Alert type="info" className="mt-6">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                <p className="font-medium">Color Selection Tips</p>
              </div>
              <p className="mt-2">
                We recommend focusing on the Primary Color, which sets the main theme for your store. 
                The Secondary and Accent colors will be automatically adjusted to complement your Primary Color choice. 
                Only adjust these if you have specific design requirements.
              </p>
              <p className="mt-2">
                Need inspiration? Try our color palette generator to find the perfect combination for your store.
              </p>
              <a href="/cpgenerator" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Color Palette Generator
              </a>
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <ColorInput
                label="Primary Color"
                name="primary_color"
                value={store.primary_color}
                onChange={handleInputChange}
                error={errors.primary_color}
                helpText="Main theme color for your store's webpage"
                className="w-full"
              />
              <ColorInput
                label="Secondary Color"
                name="secondary_color"
                value={store.secondary_color}
                onChange={handleInputChange}
                error={errors.secondary_color}
                helpText="Used for page background (automatically adjusted)"
                className="w-full"
              />
              <ColorInput
                label="Accent Color"
                name="accent_color"
                value={store.accent_color}
                onChange={handleInputChange}
                error={errors.accent_color}
                helpText="Used for cards and other components (automatically adjusted)"
                className="w-full"
              />
            </div>
            
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