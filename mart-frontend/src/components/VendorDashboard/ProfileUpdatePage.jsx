// src/components/VendorDashboard/ProfileUpdatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Input, Alert } from '../VendorDashboard/UIComponents';
import * as api from '../../config/api';

const ProfileUpdatePage = () => {
  const { user, setUser } = useVendor();
  const [profile, setProfile] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.first_name) newErrors.first_name = 'First name is required';
    if (!profile.last_name) newErrors.last_name = 'Last name is required';
    if (!profile.email) newErrors.email = 'Email is required';
    if (!profile.username) newErrors.username = 'Username is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
      const updatedUser = await api.updateProfile(profile);
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to update profile. Please try again.' });
    }
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Update Your Profile</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="first_name"
                value={profile.first_name}
                onChange={handleInputChange}
                error={errors.first_name}
                required
              />
              <Input
                label="Last Name"
                name="last_name"
                value={profile.last_name}
                onChange={handleInputChange}
                error={errors.last_name}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <Input
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                error={errors.username}
                required
              />
            </div>
            {errors.submit && (
              <Alert type="error">
                {errors.submit}
              </Alert>
            )}
            {successMessage && (
              <Alert type="success">
                {successMessage}
              </Alert>
            )}
            <Button onClick={handleUpdateProfile} className="w-full">
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileUpdatePage;