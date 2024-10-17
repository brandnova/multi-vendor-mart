import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, checkEmailVerification } from '../config/api';
import { Alert, Modal, Input, Button, Checkbox } from '../components/VendorDashboard/UIComponents';
import { Eye, EyeOff, Check, X, Info } from 'lucide-react';
import { FaSpinner } from "react-icons/fa";

// Password strength component
const PasswordStrengthIndicator = ({ password, setPasswordValid }) => {
  const requirements = [
    { re: /.{8,}/, label: 'At least 8 characters' },
    { re: /[0-9]/, label: 'At least 1 number' },
    { re: /[a-z]/, label: 'At least 1 lowercase letter' },
    { re: /[A-Z]/, label: 'At least 1 uppercase letter' },
    { re: /[!@#$%^&*(),.?":{}|<>]/, label: 'At least 1 special character' },
  ];

  useEffect(() => {
    const isValid = requirements.every(req => req.re.test(password));
    setPasswordValid(isValid);
  }, [password, setPasswordValid]);

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
      {requirements.map((requirement, index) => (
        <p key={index} className={`text-sm flex items-center ${requirement.re.test(password) ? 'text-green-600' : 'text-red-600'}`}>
          {requirement.re.test(password) ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
          {requirement.label}
        </p>
      ))}
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSubmit(event);
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === 'username') {
      newValue = value.replace(/\s/g, ''); // Remove spaces from username
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : newValue,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!passwordValid) newErrors.password = 'Password does not meet requirements';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.username) newErrors.username = 'Username is required';
      if (formData.username.includes(' ')) newErrors.username = 'Username cannot contain spaces';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the Terms and Conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        const verificationStatus = await checkEmailVerification(formData.email);
        if (!verificationStatus.is_verified) {
          navigate('/verify-email', { state: { email: formData.email } });
        } else {
          await login(formData.email, formData.password);
          navigate('/dashboard');
        }
      } else {
        await register(formData);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAlertInfo({ type: 'error', message: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
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
                  aria-required="true"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={errors.last_name}
                  required
                  aria-required="true"
                />
                <div>
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors.username}
                    required
                    aria-required="true"
                    aria-describedby="username-description"
                  />
                  <p id="username-description" className="mt-1 flex text-sm text-gray-500">
                    <Info className="h-4 w-4 mr-1" /> Username cannot contain spaces.
                  </p>
                </div>
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
              aria-required="true"
            />
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute inset-y-0 right-0 pr-3 mt-5 flex items-center text-sm leading-5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {!isLogin && <PasswordStrengthIndicator password={formData.password} setPasswordValid={setPasswordValid} />}
            {!isLogin && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 pr-3 mt-5 flex items-center text-sm leading-5"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            )}
            {!isLogin && (
              <div className="flex items-center">
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  id="accept-terms"
                  aria-required="true"
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                  I accept the{' '}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            )}
            {errors.acceptTerms && <p className="mt-2 text-sm text-red-600" role="alert">{errors.acceptTerms}</p>}
            
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!isLogin && (!passwordValid || !formData.acceptTerms))}
              className="w-full flex items-center justify-center"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  Processing <FaSpinner className="ml-2 animate-spin" aria-hidden="true" />
                </>
              ) : (
                isLogin ? 'Sign in' : 'Register'
              )}
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