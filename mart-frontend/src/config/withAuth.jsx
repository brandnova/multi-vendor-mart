// src/config/WithAuth.jsx

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
        try {
          const response = await api.get('/accounts/profile/');
          setIsAuthenticated(true);
          setUserData(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            navigate('/auth', { replace: true });
          } else {
            console.error('Authentication check failed:', error);
            setIsAuthenticated(false);
          }
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} user={userData} />;
  };
};

export default withAuth;