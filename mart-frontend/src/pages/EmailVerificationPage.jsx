import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail, getSiteSettings } from '../config/api';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/VendorDashboard/UIComponents';
import { CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();

    if (token) {
      verifyEmailToken();
    } else {
      setStatus('resend');
    }
  }, [token]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const verifyEmailToken = async () => {
    try {
      const response = await verifyEmail(token);
      setStatus('success');
      setMessage(response.message);
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
      setResendCooldown(300); // 5 minutes cooldown
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to resend verification email');
    }
  };

  const handleContactSupport = () => {
    if (siteSettings && siteSettings.contact_email) {
      window.location.href = `mailto:${siteSettings.contact_email}?subject=Email Verification Support`;
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center" aria-live="polite">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto" role="status">
              <span className="sr-only">Verifying...</span>
            </div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        );
      case 'success':
        return (
          <Alert type="success">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              <h2 className="text-2xl font-bold">Email Verified</h2>
            </div>
            <p className="mt-2 mb-4">{message}</p>
            <Button onClick={() => navigate('/auth')} className="w-full">Go to Login</Button>
          </Alert>
        );
      case 'error':
        return (
          <Alert type="error">
            <div className="flex items-center">
              <XCircle className="w-6 h-6 mr-2 text-red-500" />
              <h2 className="text-2xl font-bold">Verification Failed</h2>
            </div>
            <p className="mt-2 mb-4">{message}</p>
            <div className="space-y-4">
              <Button onClick={() => setStatus('resend')} className="w-full">Resend Verification Email</Button>
              <Button onClick={handleContactSupport} className="w-full bg-gray-500 hover:bg-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Alert>
        );
      case 'resend':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Resend Verification Email</h2>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0}
              className="w-full mb-4"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
            </Button>
            <Button onClick={handleContactSupport} className="w-full bg-gray-500 hover:bg-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        );
      case 'resent':
        return (
          <Alert type="success">
            <div className="flex items-center">
              <RefreshCw className="w-6 h-6 mr-2 text-green-500" />
              <h2 className="text-2xl font-bold">Email Sent</h2>
            </div>
            <p className="mt-2 mb-4">{message}</p>
            <p className="text-sm text-gray-600 mb-4">
              You can request another verification email in {resendCooldown} seconds.
            </p>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;