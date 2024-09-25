import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
          navigate('/auth', { replace: true });
          setIsLoading(false);
          return;
        }

        try {
          // Make a request to the user profile endpoint to check if the token is valid
          const response = await api.get('/accounts/profile/');
          setIsAuthenticated(true);
          setUserData(response.data);
          navigate('/dashboard');
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('access_token');
          navigate('/auth', { replace: true });
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Redirecting...</div>;
    }

    return <WrappedComponent {...props} user={userData} />;
  };
};

export default withAuth;