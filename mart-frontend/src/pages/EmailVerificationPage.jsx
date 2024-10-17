import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail, getVerificationSettings } from '../config/api';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Modal, Input } from '../components/VendorDashboard/UIComponents';
import { FaSpinner } from 'react-icons/fa';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('initial');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeVerification = async () => {
      if (token) {
        await verifyEmailToken();
        const settings = await getVerificationSettings();
        setCountdown(settings.resend_cooldown || 300);
      } else if (location.state && location.state.email) {
        setEmail(location.state.email);
        setStatus('waiting');
      } else {
        setStatus('input');
      }
    };

    initializeVerification();
  }, [token, navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const verifyEmailToken = async () => {
    setIsLoading(true);
    try {
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage(response.message);
      setShowModal(true);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resendVerificationEmail(email);
      setStatus('resent');
      setMessage(response.message || 'Verification email sent successfully. Please check your inbox.');
      const settings = await getVerificationSettings();
      setCountdown(settings.resend_cooldown || 300);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
      case 'waiting':
      case 'input':
        return (
          <>
            <Alert type="info">Enter your email address to resend the verification email.</Alert>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4"
            />
            <Button
              onClick={handleResendEmail}
              disabled={countdown > 0 || isLoading}
              className="mt-4 w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend email (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
              ) : (
                "Resend verification email"
              )}
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
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4"
            />
            <Button
              onClick={handleResendEmail}
              disabled={countdown > 0 || isLoading}
              className="mt-4 w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend email (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
              ) : (
                "Resend verification email"
              )}
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