// src/pages/EmailVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../config/api';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Modal } from '../components/VendorDashboard/UIComponents';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('initial');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else if (location.state && location.state.email) {
      setEmail(location.state.email);
      setStatus('waiting');
    } else {
      navigate('/auth');
    }
  }, [token, navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const verifyEmailToken = async () => {
    try {
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage(response.message);
      setShowModal(true);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred during verification');
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail(email);
      setStatus('resent');
      setMessage('Verification email sent successfully. Please check your inbox.');
      setCountdown(300); // 5 minutes cooldown
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to resend verification email');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
      case 'waiting':
        return (
          <>
            <Alert type="info">An activation link was sent to your email. Please check your inbox and click the link to activate your account.</Alert>
            <Button
              onClick={handleResendEmail}
              disabled={countdown > 0}
              className="mt-4 w-full"
            >
              {countdown > 0
                ? `Resend email (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
                : "Didn't get an email? Resend link"}
            </Button>
          </>
        );
      case 'resent':
        return (
          <>
            <Alert type="success">{message}</Alert>
            <p className="mt-4 text-center text-sm text-gray-600">
              You can request another verification email in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} minutes.
            </p>
          </>
        );
      case 'success':
        return (
          <>
            <Alert type="success">{message}</Alert>
            <Button onClick={() => navigate('/auth')} className="mt-4 w-full">
              Go to Login
            </Button>
          </>
        );
      case 'error':
        return (
          <>
            <Alert type="error">{message}</Alert>
            <Button onClick={handleResendEmail} className="mt-4 w-full">
              Resend verification email
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <CardTitle>Verification Successful</CardTitle>
        <p className="mt-2">Your email has been successfully verified. You can now log in to your account.</p>
        <Button onClick={() => navigate('/auth')} className="mt-4 w-full">
          Go to Login
        </Button>
      </Modal>
    </div>
  );
};

export default EmailVerificationPage;