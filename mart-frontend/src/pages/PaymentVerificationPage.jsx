import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../config/api';

const PaymentVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('Verifying payment...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const reference = searchParams.get('reference');

      if (!reference) {
        setVerificationStatus('Invalid payment reference.');
        return;
      }

      try {
        await api.get(`/ads/verify-payment/?reference=${reference}`);
        setVerificationStatus('Payment successful! Your ads-free subscription is now active.');
        setTimeout(() => navigate('/vendor-dashboard'), 3000);
      } catch (error) {
        setVerificationStatus('Payment verification failed. Please contact support.');
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Payment Verification</h2>
        <p>{verificationStatus}</p>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;