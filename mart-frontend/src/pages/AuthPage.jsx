import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../config/api';
import { Alert, Modal, Input, Button } from '../components/VendorDashboard/UIComponents';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.username) newErrors.username = 'Username is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    if (isLogin) {
      login(formData.email, formData.password)
        .then(data => {
          console.log('Login successful', data);
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Auth error:', error);
          setAlertInfo({ type: 'error', message: error.message || 'An error occurred. Please try again.' });
        })
        .finally(() => setIsLoading(false));
    } else {
      const { confirmPassword, ...registrationData } = formData;
      register(registrationData)
        .then(() => {
          setShowModal(true);
          setIsLogin(true);
        })
        .catch(error => {
          console.error('Auth error:', error);
          setAlertInfo({ type: 'error', message: error.message || 'An error occurred. Please try again.' });
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {alertInfo && (
        <Alert type={alertInfo.type} onDismiss={() => setAlertInfo(null)}>
          {alertInfo.message}
        </Alert>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <>
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  error={errors.first_name}
                  required
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={errors.last_name}
                  required
                />
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  required
                />
              </>
            )}
            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            {!isLogin && (
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
            )}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
            </Button>
          </form>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-bold mb-4">Registration Successful!</h2>
        <p>Please check your email to verify your account. Click the link in the email to complete the registration process.</p>
      </Modal>
    </div>
  );
};

export default AuthPage;